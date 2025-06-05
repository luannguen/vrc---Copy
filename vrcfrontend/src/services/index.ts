/**
 * Services Index
 * Re-exports all services for easier importing
 */

// Import and re-export the main services we need
export { productsService } from './productsService';
export { productCategoriesService } from './productCategoriesService';
export { faqService } from './faqService';

// Re-export API utilities
export { apiService } from './api';
export type { ApiResponse } from './api';
