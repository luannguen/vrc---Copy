/**
 * Product Categories Service
 * Handles all API calls related to product categories
 */

import { apiService, ApiResponse } from './api';
import { ProductCategory, ApiError } from '../types/Product';

/**
 * Product Categories API Endpoints
 */
const ENDPOINTS = {
  PRODUCT_CATEGORIES: '/api/product-categories',
  CATEGORY_BY_ID: (id: string) => `/api/product-categories/${id}`,
} as const;

/**
 * Product Categories Service Class
 */
export class ProductCategoriesService {
  /**
   * Get all product categories
   */
  async getCategories(signal?: AbortSignal): Promise<ProductCategory[]> {
    try {
      const response: ApiResponse<{ docs: ProductCategory[] }> = await apiService.get(
        ENDPOINTS.PRODUCT_CATEGORIES,
        signal
      );

      if (!response.data || !Array.isArray(response.data.docs)) {
        throw new Error('Invalid categories response format');
      }

      return response.data.docs;
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch product categories');
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string, signal?: AbortSignal): Promise<ProductCategory> {
    try {
      if (!id) {
        throw new Error('Category ID is required');
      }

      const response: ApiResponse<ProductCategory> = await apiService.get(
        ENDPOINTS.CATEGORY_BY_ID(id),
        signal
      );

      if (!response.data) {
        throw new Error('Category not found');
      }

      return response.data;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch category with ID: ${id}`);
    }
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
export const productCategoriesService = new ProductCategoriesService();
export default productCategoriesService;
