/**
 * Product Utilities
 * Functions to transform and process product data from API to frontend format
 */

import { ApiProduct, Product, ProductCategory, MediaFile } from '../types/Product';

/**
 * Transform media URL to full URL
 */
export const getMediaUrl = (media: MediaFile | null | undefined): string => {
  if (!media) return '';
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  // Return the full URL if already absolute, otherwise prefix with base URL
  if (media.filename.startsWith('http')) {
    return media.filename;
  }
  
  return `${baseUrl}/media/${media.filename}`;
};

/**
 * Get thumbnail URL from media sizes
 */
export const getThumbnailUrl = (media: MediaFile | null | undefined): string => {
  if (!media) return '';
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  
  // Try to get thumbnail size first
  if (media.sizes?.thumbnail?.url) {
    return media.sizes.thumbnail.url.startsWith('http') 
      ? media.sizes.thumbnail.url 
      : `${baseUrl}${media.sizes.thumbnail.url}`;
  }
  
  // Fall back to square size
  if (media.sizes?.square?.url) {
    return media.sizes.square.url.startsWith('http') 
      ? media.sizes.square.url 
      : `${baseUrl}${media.sizes.square.url}`;
  }
  
  // Fall back to main image
  return getMediaUrl(media);
};

/**
 * Extract text from Lexical rich text content
 */
export const extractTextFromLexical = (content: unknown): string => {
  if (!content || typeof content !== 'object') {
    return '';
  }

  const lexicalContent = content as {
    root?: {
      children?: Array<{
        type?: string;
        text?: string;
        children?: unknown[];
      }>;
    };
  };

  if (!lexicalContent.root?.children) {
    return '';
  }

  const extractText = (nodes: unknown[]): string => {
    return nodes.map(node => {
      if (typeof node === 'object' && node !== null) {
        const nodeObj = node as {
          type?: string;
          text?: string;
          children?: unknown[];
        };
        
        if (nodeObj.text) {
          return nodeObj.text;
        }
        if (nodeObj.children) {
          return extractText(nodeObj.children);
        }
      }
      return '';
    }).join(' ');
  };

  return extractText(lexicalContent.root.children).trim();
};

/**
 * Transform API product to frontend product format
 */
export const transformApiProductToProduct = (apiProduct: ApiProduct): Product => {
  const categoryTitle = apiProduct.category?.title || '';
  const categorySlug = apiProduct.category?.slug || '';

  const imageUrl = getMediaUrl(apiProduct.mainImage);
  const thumbnailUrl = getThumbnailUrl(apiProduct.mainImage);

  // Extract features from specifications
  const features: string[] = [];
  const specifications: Record<string, string> = {};
  
  if (apiProduct.specifications && Array.isArray(apiProduct.specifications)) {
    apiProduct.specifications.forEach(spec => {
      features.push(`${spec.name}: ${spec.value}`);
      specifications[spec.name] = spec.value;
    });
  }

  // Extract description text from Lexical content
  const description = extractTextFromLexical(apiProduct.description);

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: apiProduct.slug,
    description,
    category: categorySlug,
    categoryTitle,
    imageUrl,
    thumbnailUrl,
    features,
    specifications,
    price: 'Liên hệ', // Price not available in API, default to contact
    isNew: false, // Not available in API
    isBestseller: apiProduct.featured || false,
  };
};

/**
 * Transform multiple API products to frontend products
 */
export const transformApiProductsToProducts = (apiProducts: ApiProduct[]): Product[] => {
  return apiProducts.map(transformApiProductToProduct);
};
