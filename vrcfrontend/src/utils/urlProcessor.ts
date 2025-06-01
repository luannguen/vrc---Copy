/**
 * Utility functions for processing URLs from API responses
 */

// Type definitions for API responses
interface MediaItem {
  url: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

interface SocialMediaPlatform {
  url?: string;
  enabled?: boolean;
}

interface ApiResponseWithMedia {
  logo?: MediaItem;
  backgroundImage?: MediaItem;
  socialMedia?: Record<string, string | SocialMediaPlatform> | SocialMediaItem[];
  socialMediaLinks?: Record<string, string | SocialMediaPlatform>;
  [key: string]: unknown;
}

interface SocialMediaItem {
  icon?: MediaItem;
  [key: string]: unknown;
}

interface HomepageSettings {
  activeBanners?: BannerItem[];
  featuredProductsData?: ProductItem[];
  latestPosts?: PostItem[];
  selectedPostsData?: PostItem[];
  seo?: {
    ogImage?: MediaItem;
  };
  [key: string]: unknown;
}

interface BannerItem {
  image?: MediaItem;
  imageUrl?: string;
  [key: string]: unknown;
}

interface ProductItem {
  image?: MediaItem;
  [key: string]: unknown;
}

interface PostItem {
  featuredImage?: MediaItem;
  [key: string]: unknown;
}

/**
 * Fix URL to use correct port for media files
 * Converts port 8081 URLs to port 3000 (backend port)
 */
export const fixMediaUrl = (url: string): string => {
  if (!url) return url;
  
  // If URL contains port 8081, replace with port 3000
  if (url.includes(':8081')) {
    return url.replace(':8081', ':3000');
  }
  
  // If URL is relative and starts with /api/media or /media, prepend backend URL
  if (url.startsWith('/api/media') || url.startsWith('/media')) {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    return `${baseUrl}${url}`;
  }
  
  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return url;
};

/**
 * Process header info response to fix media URLs
 */
export const processHeaderInfo = (headerInfo: ApiResponseWithMedia | null): ApiResponseWithMedia | null => {
  if (!headerInfo) return headerInfo;
  
  return {
    ...headerInfo,
    logo: headerInfo.logo ? {
      ...headerInfo.logo,
      url: fixMediaUrl(headerInfo.logo.url)
    } : headerInfo.logo,    // Map socialMedia to socialMediaLinks for frontend compatibility
    socialMediaLinks: (typeof headerInfo.socialMedia === 'object' && !Array.isArray(headerInfo.socialMedia)) 
      ? headerInfo.socialMedia 
      : headerInfo.socialMediaLinks || {},
    // Process other fields that might contain media URLs
    backgroundImage: headerInfo.backgroundImage ? {
      ...headerInfo.backgroundImage,
      url: fixMediaUrl(headerInfo.backgroundImage.url)
    } : headerInfo.backgroundImage
  };
};

/**
 * Process company info response to fix media URLs
 */
export const processCompanyInfo = (companyInfo: ApiResponseWithMedia | null): ApiResponseWithMedia | null => {
  if (!companyInfo) return companyInfo;
  
  return {
    ...companyInfo,
    logo: companyInfo.logo ? {
      ...companyInfo.logo,
      url: fixMediaUrl(companyInfo.logo.url)
    } : companyInfo.logo,
    // Map socialMedia to socialMediaLinks for frontend compatibility
    socialMediaLinks: (typeof companyInfo.socialMedia === 'object' && !Array.isArray(companyInfo.socialMedia)) 
      ? companyInfo.socialMedia 
      : companyInfo.socialMediaLinks || {},
    // Process social media icons - check if it's an array first
    socialMedia: (companyInfo.socialMedia && Array.isArray(companyInfo.socialMedia)) ? 
      companyInfo.socialMedia.map((item: SocialMediaItem) => ({
        ...item,
        icon: item.icon ? {
          ...item.icon,
          url: fixMediaUrl(item.icon.url)
        } : item.icon
      })) : companyInfo.socialMedia
  };
};

/**
 * Process homepage settings to fix media URLs
 */
export const processHomepageSettings = (settings: HomepageSettings | null): HomepageSettings | null => {
  if (!settings) return settings;
  
  const processedSettings = { ...settings };
    // Process hero section banners
  if (processedSettings.activeBanners) {
    processedSettings.activeBanners = processedSettings.activeBanners.map((banner: BannerItem) => ({
      ...banner,
      imageUrl: banner.image?.url ? fixMediaUrl(banner.image.url) : banner.imageUrl ? fixMediaUrl(banner.imageUrl) : '',
      image: banner.image ? {
        ...banner.image,
        url: fixMediaUrl(banner.image.url)
      } : banner.image
    }));
  }
  
  // Process featured products
  if (processedSettings.featuredProductsData) {
    processedSettings.featuredProductsData = processedSettings.featuredProductsData.map((product: ProductItem) => ({
      ...product,
      image: product.image ? {
        ...product.image,
        url: fixMediaUrl(product.image.url)
      } : product.image
    }));
  }
  
  // Process latest posts
  if (processedSettings.latestPosts) {
    processedSettings.latestPosts = processedSettings.latestPosts.map((post: PostItem) => ({
      ...post,
      featuredImage: post.featuredImage ? {
        ...post.featuredImage,
        url: fixMediaUrl(post.featuredImage.url)
      } : post.featuredImage
    }));
  }
  
  // Process selected posts
  if (processedSettings.selectedPostsData) {
    processedSettings.selectedPostsData = processedSettings.selectedPostsData.map((post: PostItem) => ({
      ...post,
      featuredImage: post.featuredImage ? {
        ...post.featuredImage,
        url: fixMediaUrl(post.featuredImage.url)
      } : post.featuredImage
    }));
  }
  
  // Process SEO og image
  if (processedSettings.seo?.ogImage) {
    processedSettings.seo.ogImage = {
      ...processedSettings.seo.ogImage,
      url: fixMediaUrl(processedSettings.seo.ogImage.url)
    };
  }
  
  return processedSettings;
};
