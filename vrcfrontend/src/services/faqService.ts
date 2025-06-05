/**
 * FAQ Service
 * Handles all API calls related to FAQs
 */

import { apiService, ApiResponse } from './api';
import { ApiFAQ, FAQ, FAQApiResponse, FAQError, FAQQueryParams, RichText, RichTextNode } from '../types/FAQ';

/**
 * FAQ API Endpoints
 */
const ENDPOINTS = {
  FAQS: '/api/faqs',
  FAQ_BY_ID: (id: string) => `/api/faqs/${id}`,
  FAQS_BY_CATEGORY: (category: string) => `/api/faqs?where[category][equals]=${category}`,
} as const;

/**
 * Extract plain text from RichText structure
 */
const extractTextFromRichText = (richText: RichText | string): string => {
  if (typeof richText === 'string') {
    return richText;
  }

  const extractFromNode = (node: RichTextNode): string => {
    if (node.text) {
      return node.text;
    }
    if (node.children) {
      return node.children.map(extractFromNode).join('');
    }
    return '';
  };

  return extractFromNode(richText.root);
};

/**
 * Transform API FAQ to frontend FAQ
 */
const transformApiFAQToFAQ = (apiFAQ: ApiFAQ): FAQ => ({
  id: apiFAQ.id,
  question: apiFAQ.question,
  answer: extractTextFromRichText(apiFAQ.answer),
  category: apiFAQ.category,
  order: apiFAQ.order,
  status: apiFAQ.status,
});

/**
 * Transform API FAQs to frontend FAQs
 */
const transformApiFAQsToFAQs = (apiFAQs: ApiFAQ[]): FAQ[] => {
  return apiFAQs.map(transformApiFAQToFAQ);
};

/**
 * FAQ Service Class
 */
export class FAQService {  /**
   * Get all FAQs with optional filtering and pagination
   */
  async getFAQs(params: FAQQueryParams = {}, signal?: AbortSignal): Promise<FAQ[]> {
    try {
      const queryString = this.buildQueryString(params);
      const endpoint = `${ENDPOINTS.FAQS}${queryString}`;
      const response: ApiResponse<FAQApiResponse> = await apiService.get(endpoint, signal);
      
      // The backend returns FAQs directly in this format:
      // { docs: [...], totalDocs: 5, limit: 10, ... }
      if (!response.data || !Array.isArray(response.data.docs)) {
        throw new Error('Invalid FAQs response format');
      }

      // Transform API FAQs to frontend FAQs
      return transformApiFAQsToFAQs(response.data.docs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw this.createFAQError(error, 'Không thể tải danh sách FAQ');
    }
  }

  /**
   * Get FAQ by ID
   */
  async getFAQById(id: string, signal?: AbortSignal): Promise<FAQ> {
    try {
      const response: ApiResponse<{ success: boolean; data: ApiFAQ }> = 
        await apiService.get(ENDPOINTS.FAQ_BY_ID(id), signal);
      
      if (!response.data || !response.data.success || !response.data.data) {
        throw new Error('FAQ not found');
      }

      return transformApiFAQToFAQ(response.data.data);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      throw this.createFAQError(error, 'Không thể tải FAQ');
    }
  }  /**
   * Get FAQs by category
   */
  async getFAQsByCategory(category: string, signal?: AbortSignal): Promise<FAQ[]> {
    try {
      const response: ApiResponse<FAQApiResponse> = 
        await apiService.get(ENDPOINTS.FAQS_BY_CATEGORY(category), signal);
      
      if (!response.data || !Array.isArray(response.data.docs)) {
        throw new Error('Invalid FAQs response format');
      }

      return transformApiFAQsToFAQs(response.data.docs);
    } catch (error) {
      console.error('Error fetching FAQs by category:', error);
      throw this.createFAQError(error, 'Không thể tải FAQ theo danh mục');
    }
  }

  /**
   * Build query string from parameters
   */
  private buildQueryString(params: FAQQueryParams): string {
    const query = new URLSearchParams();
    
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.category) query.set('where[category][equals]', params.category);
    if (params.isActive !== undefined) {
      // Convert isActive boolean to status value for Payload CMS
      const status = params.isActive ? 'published' : 'draft';
      query.set('where[status][equals]', status);
    }
    if (params.sort) query.set('sort', params.sort);
    
    return query.toString() ? `?${query.toString()}` : '';
  }

  /**
   * Create FAQ error with proper typing
   */
  private createFAQError(error: unknown, defaultMessage: string): FAQError {
    // If it's already an FAQError, return it
    if (this.isFAQError(error)) {
      return error;
    }

    // If it's an API error with response
    if (error && typeof error === 'object' && 'response' in error) {
      const apiError = error as { response: { status: number; data?: { message?: string } } };
      return {
        message: apiError.response.data?.message || defaultMessage,
        status: apiError.response.status,
        details: { originalError: apiError.response.data },
      };
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

  /**
   * Type guard for FAQ error
   */
  private isFAQError(error: unknown): error is FAQError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      'status' in error &&
      typeof (error as FAQError).message === 'string' &&
      typeof (error as FAQError).status === 'number'
    );
  }
}

/**
 * Default service instance
 */
export const faqService = new FAQService();
export default faqService;
