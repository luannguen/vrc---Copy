/**
 * Products Service
 * Handles all API calls related to products
 */

import { apiService, ApiResponse } from './api';
import { ApiProduct, Product, ProductsApiResponse, ApiError } from '../types/Product';
import { transformApiProductsToProducts, transformApiProductToProduct } from '../utils/productUtils';

/**
 * Products API Endpoints
 */
const ENDPOINTS = {
  PRODUCTS: '/api/products',
  PRODUCT_BY_ID: (id: string) => `/api/products/${id}`,
  PRODUCTS_BY_CATEGORY: (categoryId: string) => `/api/products?where[category][equals]=${categoryId}`,
} as const;

/**
 * Query parameters for products list
 */
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  featured?: boolean;
  search?: string;
}

/**
 * Products Service Class
 */
export class ProductsService {
  /**
   * Retry a function with exponential backoff
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
          // Check if it's a timeout or network error that we should retry
        const shouldRetry = error && typeof error === 'object' && error !== null && (
          ('status' in error && (error as { status: unknown }).status === 408) ||
          ('message' in error && typeof (error as { message: unknown }).message === 'string' && 
           ((error as { message: string }).message.includes('timeout') || 
            (error as { message: string }).message.includes('Network error')))
        );
          
        if (!shouldRetry) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        console.log(`Retrying request in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  /**
   * Get all products with optional filtering and pagination
   */
  async getProducts(params: ProductsQueryParams = {}, signal?: AbortSignal): Promise<Product[]> {
    try {
      return await this.retryWithBackoff(async () => {
        const queryString = this.buildQueryString(params);
        const endpoint = `${ENDPOINTS.PRODUCTS}${queryString}`;
        const response: ApiResponse<ProductsApiResponse> = await apiService.get(endpoint, signal);
        
        if (!response.data || !response.data.success || !Array.isArray(response.data.data.docs)) {
          throw new Error('Invalid products response format');
        }

        // Transform API products to frontend products
        return transformApiProductsToProducts(response.data.data.docs);
      });
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch products');
    }
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: string, signal?: AbortSignal): Promise<Product> {
    try {
      if (!id) {
        throw new Error('Product ID is required');
      }

      const response: ApiResponse<ApiProduct> = await apiService.get(
        ENDPOINTS.PRODUCT_BY_ID(id),
        signal
      );

      if (!response.data) {
        throw new Error('Product not found');
      }

      // Transform API product to frontend product
      return transformApiProductToProduct(response.data);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch product with ID: ${id}`);
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    categoryId: string, 
    params: Omit<ProductsQueryParams, 'category'> = {},
    signal?: AbortSignal
  ): Promise<Product[]> {
    try {
      if (!categoryId) {
        throw new Error('Category ID is required');
      }

      const queryParams = { ...params, category: categoryId };
      const queryString = this.buildQueryString(queryParams);
      const endpoint = `${ENDPOINTS.PRODUCTS}${queryString}`;
      const response: ApiResponse<ProductsApiResponse> = await apiService.get(endpoint, signal);
      
      if (!response.data || !response.data.success || !Array.isArray(response.data.data.docs)) {
        throw new Error('Invalid products response format');
      }

      // Transform API products to frontend products
      return transformApiProductsToProducts(response.data.data.docs);
    } catch (error) {
      throw this.handleError(error, `Failed to fetch products for category: ${categoryId}`);
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 10, signal?: AbortSignal): Promise<Product[]> {
    try {
      const params: ProductsQueryParams = {
        featured: true,
        limit,
        sort: '-createdAt',
      };

      return await this.getProducts(params, signal);
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch featured products');
    }
  }

  /**
   * Search products
   */
  async searchProducts(
    searchTerm: string, 
    params: Omit<ProductsQueryParams, 'search'> = {},
    signal?: AbortSignal
  ): Promise<Product[]> {
    try {
      if (!searchTerm.trim()) {
        throw new Error('Search term is required');
      }

      const queryParams = { ...params, search: searchTerm.trim() };
      return await this.getProducts(queryParams, signal);
    } catch (error) {
      throw this.handleError(error, `Failed to search products with term: ${searchTerm}`);
    }
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: ProductsQueryParams): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'featured' && typeof value === 'boolean') {
          searchParams.append(`where[${key}][equals]`, value.toString());
        } else if (key === 'category' && typeof value === 'string') {
          searchParams.append('where[category][equals]', value);
        } else if (key === 'search' && typeof value === 'string') {
          searchParams.append('where[or][0][title][contains]', value);
          searchParams.append('where[or][1][description][contains]', value);
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  /**
   * Handle and transform errors
   */
  private handleError(error: unknown, defaultMessage: string): ApiError {
    // If it's already an ApiError, return it
    if (typeof error === 'object' && error !== null && 'message' in error && 'status' in error) {
      return error as ApiError;
    }

    // If it's a regular Error, wrap it
    if (error instanceof Error) {
      return {
        message: error.message || defaultMessage,
        status: 500,
        details: { originalError: error.message },
      };
    }

    // For unknown errors
    return {
      message: defaultMessage,
      status: 500,
      details: { originalError: String(error) },
    };
  }
}

/**
 * Default service instance
 */
export const productsService = new ProductsService();
export default productsService;
