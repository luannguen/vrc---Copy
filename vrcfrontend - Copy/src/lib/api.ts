/**
 * API Configuration and Base Service
 * Centralized API configuration for the VRC Frontend
 */

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add API test header for development
    if (import.meta.env.DEV) {
      config.headers['X-API-Test'] = 'true';
    }
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error(`❌ API Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);
    
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login or refresh token
      localStorage.removeItem('auth_token');
      // You might want to redirect to login page here
    }
    
    return Promise.reject(error);
  }
);

// Generic API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage?: number;
  prevPage?: number;
}

// API Service class
export class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = apiClient;
  }

  // Generic GET method
  async get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  // Generic POST method
  async post<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  // Generic PUT method
  async put<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  // Generic PATCH method
  async patch<T = any>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  // Generic DELETE method
  async delete<T = any>(url: string): Promise<T> {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; server: string }> {
    return this.get('/health');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the axios instance for direct use if needed
export { apiClient };
