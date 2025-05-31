/**
 * Utility functions for processing URLs from API responses
 */

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
export const processHeaderInfo = (headerInfo: any) => {
  if (!headerInfo) return headerInfo;
  
  return {
    ...headerInfo,
    logo: headerInfo.logo ? {
      ...headerInfo.logo,
      url: fixMediaUrl(headerInfo.logo.url)
    } : headerInfo.logo,
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
export const processCompanyInfo = (companyInfo: any) => {
  if (!companyInfo) return companyInfo;
  
  return {
    ...companyInfo,
    logo: companyInfo.logo ? {
      ...companyInfo.logo,
      url: fixMediaUrl(companyInfo.logo.url)
    } : companyInfo.logo,
    // Process social media icons - check if it's an array first
    socialMedia: (companyInfo.socialMedia && Array.isArray(companyInfo.socialMedia)) ? 
      companyInfo.socialMedia.map((item: any) => ({
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
export const processHomepageSettings = (settings: any) => {
  if (!settings) return settings;
  
  const processedSettings = { ...settings };
    // Process hero section banners
  if (processedSettings.activeBanners) {
    processedSettings.activeBanners = processedSettings.activeBanners.map((banner: any) => ({
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
    processedSettings.featuredProductsData = processedSettings.featuredProductsData.map((product: any) => ({
      ...product,
      image: product.image ? {
        ...product.image,
        url: fixMediaUrl(product.image.url)
      } : product.image
    }));
  }
  
  // Process latest posts
  if (processedSettings.latestPosts) {
    processedSettings.latestPosts = processedSettings.latestPosts.map((post: any) => ({
      ...post,
      featuredImage: post.featuredImage ? {
        ...post.featuredImage,
        url: fixMediaUrl(post.featuredImage.url)
      } : post.featuredImage
    }));
  }
  
  // Process selected posts
  if (processedSettings.selectedPostsData) {
    processedSettings.selectedPostsData = processedSettings.selectedPostsData.map((post: any) => ({
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
