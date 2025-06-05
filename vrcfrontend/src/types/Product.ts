// Base types for Lexical editor content
export interface LexicalNode {
  type: string;
  text?: string;
  children?: LexicalNode[];
  direction?: string;
  format?: string;
  indent?: number;
  version?: number;
}

// Media file interface for images and documents
export interface MediaFile {
  id: string;
  alt?: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  focalX?: number;
  focalY?: number;
  sizes?: {
    thumbnail?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
    square?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
    small?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
    medium?: {
      url: string | null;
      width: number | null;
      height: number | null;
      mimeType: string | null;
      filesize: number | null;
      filename: string | null;
    };
    large?: {
      url: string | null;
      width: number | null;
      height: number | null;
      mimeType: string | null;
      filesize: number | null;
      filename: string | null;
    };
    xlarge?: {
      url: string | null;
      width: number | null;
      height: number | null;
      mimeType: string | null;
      filesize: number | null;
      filename: string | null;
    };
    og?: {
      url: string | null;
      width: number | null;
      height: number | null;
      mimeType: string | null;
      filesize: number | null;
      filename: string | null;
    };
  };
  url: string;
  thumbnailURL?: string;
}

// API Product interface - matches backend Payload CMS structure
export interface ApiProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  slug: string;
  slugLock: boolean;
  excerpt: string;
  description: {
    root: {
      type: string;
      children: LexicalNode[];
      direction?: string;
      format?: string;
      indent?: number;
      version?: number;
    };
  };
  mainImage: {
    id: string;
    alt: string;
    filename: string;
    mimeType: string;
    filesize: number;
    width: number;
    height: number;
    focalX: number;
    focalY: number;
    sizes: {
      thumbnail?: {
        url: string;
        width: number;
        height: number;
        mimeType: string;
        filesize: number;
        filename: string;
      };
      square?: {
        url: string;
        width: number;
        height: number;
        mimeType: string;
        filesize: number;
        filename: string;
      };
      small?: {
        url: string;
        width: number;
        height: number;
        mimeType: string;
        filesize: number;
        filename: string;
      };
      medium?: {
        url: string | null;
        width: number | null;
        height: number | null;
        mimeType: string | null;
        filesize: number | null;
        filename: string | null;
      };
      large?: {
        url: string | null;
        width: number | null;
        height: number | null;
        mimeType: string | null;
        filesize: number | null;
        filename: string | null;
      };
      xlarge?: {
        url: string | null;
        width: number | null;
        height: number | null;
        mimeType: string | null;
        filesize: number | null;
        filename: string | null;
      };
      og?: {
        url: string | null;
        width: number | null;
        height: number | null;
        mimeType: string | null;
        filesize: number | null;
        filename: string | null;
      };
    };
    url: string;
    thumbnailURL: string;
  };
  gallery: MediaFile[]; // Array of media objects, similar to mainImage
  category: {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    description: string;
    showInMenu: boolean;
    orderNumber: number;
    slug: string;
    slugLock: boolean;
  };
  featured: boolean;
  relatedProducts: ApiProduct[];
  specifications: Array<{
    name: string;
    value: string;
    id: string;
  }>;  documents: MediaFile[]; // Array of document references
  status: string;
  sortOrder: number;
  meta: Record<string, unknown>;
  tags?: Array<{
    id: string;
    title: string;
    type: string;
    slug: string;
    slugLock: boolean;
    parent?: string;
    breadcrumbs?: Array<{
      doc: string;
      url: string;
      label: string;
      id: string;
    }>;
  }>;
}

// Frontend Product interface - simplified for UI consumption
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryTitle: string;
  imageUrl: string;
  thumbnailUrl: string;
  features: string[];
  specifications?: Record<string, string>;
  price?: string;
  isNew?: boolean;
  isBestseller?: boolean;
  slug: string;
  relatedProducts?: Product[];
}

// Product Category interface
export interface ProductCategory {
  id: string;
  title: string;
  description: string;
  slug: string;
  showInMenu: boolean;
  orderNumber: number;
}

// API Response wrapper
export interface ProductsApiResponse {
  success: boolean;
  message: string;
  data: {
    docs: ApiProduct[];
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
}

// Product Categories API Response
export interface ProductCategoriesApiResponse {
  success: boolean;
  message: string;
  data: {
    docs: ProductCategory[];
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

// Product specification interface for better type safety
export interface ProductSpecification {
  name: string;
  value: string;
  id: string;
}

// Filter and pagination options
export interface ProductFilters {
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

// Error types for API calls
export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}
