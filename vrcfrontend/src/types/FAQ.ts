/**
 * FAQ Types
 * Type definitions for Frequently Asked Questions
 */

/**
 * Rich Text Structure from Payload CMS
 */
export interface RichTextNode {
  type: string;
  version?: number;
  text?: string;
  children?: RichTextNode[];
  format?: string;
  indent?: number;
  direction?: string;
}

export interface RichText {
  root: RichTextNode;
}

/**
 * API FAQ Item structure from backend
 */
export interface ApiFAQ {
  id: string;
  question: string;
  answer: RichText | string; // Can be richText object or plain string
  category?: string;
  order?: number;
  status: 'draft' | 'published' | 'hidden';
  createdAt: string;
  updatedAt: string;
}

/**
 * Frontend FAQ Item structure
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
  status: 'draft' | 'published' | 'hidden';
}

/**
 * FAQ API Response structure from Payload CMS
 */
export interface FAQApiResponse {
  docs: ApiFAQ[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * FAQ Query parameters
 */
export interface FAQQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  isActive?: boolean;
  status?: 'draft' | 'published' | 'hidden';
  sort?: string;
}

/**
 * FAQ Error structure
 */
export interface FAQError {
  message: string;
  status: number;
  details?: Record<string, unknown>;
}