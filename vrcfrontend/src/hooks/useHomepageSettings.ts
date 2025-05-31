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

// Query Keys
export const HOMEPAGE_QUERY_KEYS = {
  HOMEPAGE_SETTINGS: ['homepage-settings'],
  ACTIVE_BANNERS: ['homepage-settings', 'banners'],
  FEATURED_PRODUCTS: ['homepage-settings', 'featured-products'],
  LATEST_POSTS: ['homepage-settings', 'latest-posts'],
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
 */
export const useHomepageSettings = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.HOMEPAGE_SETTINGS,
    queryFn: () => homepageSettingsService.getHomepageSettings(),
    ...defaultHomepageConfig,
  });
};

/**
 * Hook to get only active banners for hero section
 */
export const useActiveBanners = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.ACTIVE_BANNERS,
    queryFn: () => homepageSettingsService.getActiveBanners(),
    ...defaultHomepageConfig,
  });
};

/**
 * Hook to get only featured products
 */
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.FEATURED_PRODUCTS,
    queryFn: () => homepageSettingsService.getFeaturedProducts(),
    ...defaultHomepageConfig,
  });
};

/**
 * Hook to get only latest posts
 */
export const useLatestPosts = () => {
  return useQuery({
    queryKey: HOMEPAGE_QUERY_KEYS.LATEST_POSTS,
    queryFn: () => homepageSettingsService.getLatestPosts(),
    ...defaultHomepageConfig,
  });
};

/**
 * Mutation hook for updating homepage settings (Admin only)
 */
export const useUpdateHomepageSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (settings: Partial<HomepageSettings>) => 
      homepageSettingsService.updateHomepageSettings(settings),
    onSuccess: () => {
      // Invalidate all homepage-related queries
      queryClient.invalidateQueries({ 
        queryKey: HOMEPAGE_QUERY_KEYS.HOMEPAGE_SETTINGS 
      });
      queryClient.invalidateQueries({ 
        queryKey: HOMEPAGE_QUERY_KEYS.ACTIVE_BANNERS 
      });
      queryClient.invalidateQueries({ 
        queryKey: HOMEPAGE_QUERY_KEYS.FEATURED_PRODUCTS 
      });
      queryClient.invalidateQueries({ 
        queryKey: HOMEPAGE_QUERY_KEYS.LATEST_POSTS 
      });
    },
    onError: (error) => {
      console.error('Failed to update homepage settings:', error);
    },
  });
};

/**
 * Helper hook to get hero section settings and banners
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
 */
export const useHomepageSEO = () => {
  const { data: settings, isLoading, error } = useHomepageSettings();
  
  return {
    seo: settings?.seo,
    isLoading,
    error,
  };
};
