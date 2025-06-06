/**
 * React Query Hook for Homepage Settings
 * Provides cached and optimized data fetching for homepage settings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  homepageSettingsService, 
  type HomepageSettings,
  type BannerData,
  type ProductData,
  type PostData
} from '@/services/homepageSettingsService';

// Helper function to get current locale for cache keys
const getCurrentLocale = (): string => {
  if (typeof window !== 'undefined') {
    // Check URL params for locale
    const urlParams = new URLSearchParams(window.location.search);
    const localeFromUrl = urlParams.get('locale');
    if (localeFromUrl && ['vi', 'en', 'tr'].includes(localeFromUrl)) {
      return localeFromUrl;
    }
    
    // Check localStorage for saved preference
    const savedLocale = localStorage.getItem('preferred-locale');
    if (savedLocale && ['vi', 'en', 'tr'].includes(savedLocale)) {
      return savedLocale;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (['vi', 'en', 'tr'].includes(browserLang)) {
      return browserLang;
    }
  }
  
  // Default fallback
  return 'vi';
};

// Query Keys with locale-aware caching
export const HOMEPAGE_QUERY_KEYS = {
  HOMEPAGE_SETTINGS: (locale?: string) => ['homepage-settings', locale || getCurrentLocale()],
  ACTIVE_BANNERS: (locale?: string) => ['homepage-settings', 'banners', locale || getCurrentLocale()],
  FEATURED_PRODUCTS: (locale?: string) => ['homepage-settings', 'featured-products', locale || getCurrentLocale()],
  LATEST_POSTS: (locale?: string) => ['homepage-settings', 'latest-posts', locale || getCurrentLocale()],
} as const;

// Default configuration for homepage queries
const defaultHomepageConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 10 * 60 * 1000, // 10 minutes
  retry: 2,
  refetchOnWindowFocus: false,
};

/**
 * Hook to get complete homepage settings with all data
 * Automatically detects and uses current locale from URL/localStorage/browser
 */
export const useHomepageSettings = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.HOMEPAGE_SETTINGS(),
    queryFn: () => homepageSettingsService.getHomepageSettings(),
    ...defaultHomepageConfig,
  });
};

/**
 * Hook to get only active banners for hero section
 * Automatically uses current locale
 */
export const useActiveBanners = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.ACTIVE_BANNERS(),
    queryFn: () => homepageSettingsService.getActiveBanners(),
    ...defaultHomepageConfig,
  });
};

/**
 * Hook to get only featured products
 * Automatically uses current locale
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.FEATURED_PRODUCTS(),
    queryFn: () => homepageSettingsService.getFeaturedProducts(),
    ...defaultHomepageConfig,
  });
};

/**
 * Hook to get only latest posts
 * Automatically uses current locale
 */
export const useLatestPosts = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.LATEST_POSTS(),
    queryFn: () => homepageSettingsService.getLatestPosts(),
    ...defaultHomepageConfig,
  });
};

/**
 * Mutation hook for updating homepage settings (Admin only)
 * Automatically uses current locale for update operation
 */
export const useUpdateHomepageSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<HomepageSettings>) => 
      homepageSettingsService.updateHomepageSettings(settings),
    onSuccess: () => {
      // Invalidate all homepage-related queries to refresh with new data
      queryClient.invalidateQueries({ 
        queryKey: HOMEPAGE_QUERY_KEYS.HOMEPAGE_SETTINGS() 
      });
      queryClient.invalidateQueries({ 
        queryKey: HOMEPAGE_QUERY_KEYS.ACTIVE_BANNERS() 
      });
      queryClient.invalidateQueries({ 
        queryKey: HOMEPAGE_QUERY_KEYS.FEATURED_PRODUCTS() 
      });
      queryClient.invalidateQueries({ 
        queryKey: HOMEPAGE_QUERY_KEYS.LATEST_POSTS() 
      });
    },
    onError: (error) => {
      console.error('Failed to update homepage settings:', error);
    },
  });
};

/**
 * Helper hook to get hero section settings and banners
 * Automatically uses current locale for localized content
 */
export const useHeroSection = () => {
  const { data: settings, isLoading, error } = useHomepageSettings();
  
  return {
    settings: settings?.heroSection,
    banners: settings?.activeBanners || [],
    isLoading,
    error,
    isEnabled: settings?.heroSection?.enabled ?? true,
  };
};

/**
 * Helper hook to get featured topics section
 * Automatically uses current locale for localized titles and descriptions
 */
export const useFeaturedTopicsSection = () => {
  const { data: settings, isLoading, error } = useHomepageSettings();
  
  return {
    settings: settings?.featuredTopics,
    products: settings?.featuredProductsData || [],
    isLoading,
    error,
    isEnabled: settings?.featuredTopics?.enabled ?? true,
  };
};

/**
 * Helper hook to get latest publications section
 * Automatically uses current locale for localized content
 */
export const useLatestPublicationsSection = () => {
  const { data: settings, isLoading, error } = useHomepageSettings();
  
  return {
    settings: settings?.latestPublications,
    posts: settings?.latestPosts || settings?.selectedPostsData || [],
    isLoading,
    error,
    isEnabled: settings?.latestPublications?.enabled ?? true,
  };
};

/**
 * Helper hook to get data resources section
 * Automatically uses current locale for localized panel titles and descriptions
 */
export const useDataResourcesSection = () => {
  const { data: settings, isLoading, error } = useHomepageSettings();
  
  return {
    settings: settings?.dataResources,
    isLoading,
    error,
    isEnabled: settings?.dataResources?.enabled ?? true,
  };
};

/**
 * Helper hook to get contact form section
 * Automatically uses current locale for localized form labels and messages
 */
export const useContactFormSection = () => {
  const { data: settings, isLoading, error } = useHomepageSettings();
  
  return {
    settings: settings?.contactForm,
    formSubmissionsStats: settings?.formSubmissionsStats,
    isLoading,
    error,
    isEnabled: settings?.contactForm?.enabled ?? true,
  };
};

/**
 * Helper hook to get form submissions statistics
 * Stats are not localized but the hook maintains consistency with other hooks
 */
export const useFormSubmissionsStats = () => {
  const { data: settings, isLoading, error } = useHomepageSettings();
  
  return {
    stats: settings?.formSubmissionsStats,
    isLoading,
    error,
  };
};

/**
 * Helper hook to get SEO settings for homepage
 * Automatically uses current locale for localized meta tags
 */
export const useHomepageSEO = () => {
  const { data: settings, isLoading, error } = useHomepageSettings();
  
  return {
    seo: settings?.seo,
    isLoading,
    error,
  };
};
