// Common types for multilingual content
export interface MediaItem {
  id: string;
  url: string;
  alt?: string;
  filename: string;
}

export interface LocalizedText {
  vi?: string;
  en?: string;
  tr?: string;
}

export interface RichTextContent {
  root: {
    children: Array<{
      children: Array<{
        text: string;
      }>;
    }>;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  excerpt?: string;
  description?: RichTextContent;
  mainImage?: MediaItem;
  gallery?: Array<{
    image: MediaItem;
    caption?: string;
  }>;
  category?: {
    id: string;
    name: string;
  };
  featured?: boolean;
  status?: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFeature {
  title: string;
  description?: string;
}

export interface ServiceBenefit {
  title: string;
  description?: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string;
  content?: RichTextContent;
  features?: ServiceFeature[];
  benefits?: ServiceBenefit[];
  icon?: MediaItem;
  category?: {
    id: string;
    name: string;
  };
  status?: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface ContactSection {
  address?: string;
  phone?: string;
  email?: string;
  hotline?: string;
  workingHours?: string;
  fax?: string;
}

export interface CompanyInfo {
  id: string;
  companyName: string;
  companyShortName?: string;
  companyDescription?: string;
  contactSection?: ContactSection;
  additionalInfo?: RichTextContent;
  logo?: MediaItem;
  updatedAt: string;
}

export interface APIResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface GlobalAPIResponse<T> {
  data: T;
  updatedAt: string;
}

// Hook return types
export interface UseMultilingualAPIReturn<T> {
  data: T | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export type UseMultilingualProductsReturn = UseMultilingualAPIReturn<APIResponse<Product>>;
export type UseMultilingualServicesReturn = UseMultilingualAPIReturn<APIResponse<Service>>;
export type UseMultilingualGlobalReturn<T> = UseMultilingualAPIReturn<T>;
