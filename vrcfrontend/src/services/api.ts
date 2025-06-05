/**
 * API Configuration and Base Service
 * Implements secure API communication with error handling and response transformation
 */

import { ApiError } from '../types/Product';

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '', // Use empty string to use relative paths (proxy)
  TIMEOUT: 30000, // Increased from 10000 to 30000 (30 seconds)
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
} as const;

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * API Response wrapper interface
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

/**
 * Request options interface
 */
export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  signal?: AbortSignal;
}

/**
 * Create an API error from response
 */
const createApiError = (status: number, message: string, details?: unknown): ApiError => ({
  message,
  status,
  details,
});

/**
 * Base API service class
 */
export class ApiService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_CONFIG.BASE_URL) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = { ...API_CONFIG.HEADERS };
  }

  /**
   * Set authorization header
   */
  setAuthToken(token: string): void {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  /**
   * Remove authorization header
   */
  clearAuthToken(): void {
    delete this.defaultHeaders.Authorization;
  }

  /**
   * Make HTTP request with error handling and timeout
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const requestOptions: RequestInit = {
        method: options.method || 'GET',
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: options.body,
        signal: options.signal || controller.signal,
      };

      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Use default error message if parsing fails
        }

        throw createApiError(response.status, errorMessage, { url, method: options.method });
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
        message: response.statusText,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw createApiError(408, 'Request timeout', { url, timeout: API_CONFIG.TIMEOUT });
        }
        
        if (error.message.includes('Failed to fetch')) {
          throw createApiError(0, 'Network error - please check your connection', { url });
        }
      }

      // Re-throw API errors
      if (typeof error === 'object' && error !== null && 'code' in error) {
        throw error;
      }

      // Handle unexpected errors
      throw createApiError(500, 'An unexpected error occurred', { 
        originalError: error instanceof Error ? error.message : String(error),
        url 
      });
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET', signal });
  }
  /**
   * POST request
   */
  async post<T>(endpoint: string, data: unknown, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      signal,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data: unknown, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      signal,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE', signal });
  }
}

/**
 * Default API service instance
 */
export const apiService = new ApiService();
