/**
 * Homepage Settings Service
 * Service for fetching homepage configuration and settings from the backend
 */

import { apiService } from '@/lib/api';
import { processHomepageSettings } from '@/utils/urlProcessor';

// Types for Homepage Settings
export interface HeroSectionSettings {
  enabled: boolean;
  autoplay: boolean;
  autoplayDelay: number;
  maxBanners: number;
}

export interface FeaturedTopicsSettings {
  enabled: boolean;
  maxProducts: number;
  sectionTitle: string;
  sectionSubtitle: string;
}

export interface LatestPublicationsSettings {
  enabled: boolean;
  maxPosts: number;
  sectionTitle: string;
  showDate: boolean;
  showExcerpt: boolean;
}

export interface DataResourcesSettings {
  enabled: boolean;
  leftPanel: {
    title: string;
    linkUrl: string;
  };
  rightPanel: {
    title: string;
    linkUrl: string;
  };
}

export interface ContactFormSettings {
  enabled: boolean;
  sectionTitle: string;
  sectionSubtitle: string;
  successMessage: string;
  enableNotifications: boolean;
}

export interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  ogImage?: {
    url: string;
    alt: string;
  };
}

export interface BannerData {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductData {
  id: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alt: string;
  };
  slug: string;
  featured: boolean;
}

export interface PostData {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  slug: string;
  featuredImage?: {
    url: string;
    alt: string;
  };
  author?: {
    name: string;
  };
}

export interface HomepageSettings {
  heroSection: HeroSectionSettings;
  featuredTopics: FeaturedTopicsSettings;
  latestPublications: LatestPublicationsSettings;
  dataResources: DataResourcesSettings;
  contactForm: ContactFormSettings;
  seo: SEOSettings;
  // Auto-populated data from API
  activeBanners?: BannerData[];
  featuredProductsData?: ProductData[];
  latestPosts?: PostData[];
  selectedPostsData?: PostData[];
}

export interface HomepageSettingsResponse {
  success: boolean;
  data: HomepageSettings;
  message?: string;
  error?: string;
}

class HomepageSettingsService {  /**
   * Transform API response to match our interface
   */
  private transformApiResponse(apiData: any): HomepageSettings {
    // Transform activeBanners to match BannerData interface
    const activeBanners: BannerData[] = (apiData.activeBanners || []).map((banner: any) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.image?.url || '',
      link: banner.link || '#',
      sortOrder: banner.sortOrder || 0,
      isActive: banner.isActive ?? true
    }));

    // Transform latest posts to match PostData interface  
    const latestPosts: PostData[] = (apiData.latestPosts || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      excerpt: post.meta?.description || '',
      publishedAt: post.publishedAt,
      slug: post.slug,
      featuredImage: post.heroImage
    }));    // Transform featured products to match ProductData interface
    const featuredProductsData: ProductData[] = (apiData.featuredProductsData || []).map((product: any) => ({
      id: product.id,
      title: product.name,
      description: product.excerpt || '',
      image: {
        url: product.mainImage?.url || product.mainImage?.thumbnailURL || '',
        alt: product.mainImage?.alt || product.name
      },
      slug: product.slug,
      featured: product.featured ?? false
    }));return {
      ...apiData,
      activeBanners,
      latestPosts,
      featuredProductsData,
      heroSection: {
        enabled: apiData.heroSection?.enableCarousel ?? true,
        autoplay: apiData.heroSection?.enableCarousel ?? true,
        autoplayDelay: apiData.heroSection?.autoSlideInterval || 6000,
        maxBanners: 10
      },      featuredTopics: {
        enabled: apiData.featuredSection?.isEnabled ?? true,
        maxProducts: 6,
        sectionTitle: apiData.featuredSection?.title || 'Sản phẩm nổi bật',
        sectionSubtitle: apiData.featuredSection?.description || ''
      },
      latestPublications: {
        enabled: apiData.publicationsSection?.isEnabled ?? true,
        maxPosts: apiData.publicationsSection?.numberOfPosts || 4,
        sectionTitle: apiData.publicationsSection?.title || 'Bài viết mới nhất',
        showDate: true,
        showExcerpt: true      },
      dataResources: {
        enabled: apiData.resourcesSection?.isEnabled ?? true,
        leftPanel: {
          title: apiData.resourcesSection?.leftPanel?.title || '',
          linkUrl: apiData.resourcesSection?.leftPanel?.linkUrl || ''
        },
        rightPanel: {
          title: apiData.resourcesSection?.rightPanel?.title || '',
          linkUrl: apiData.resourcesSection?.rightPanel?.linkUrl || ''
        }
      },
      contactForm: {
        enabled: apiData.contactSection?.isEnabled ?? true,
        sectionTitle: 'Liên hệ với chúng tôi',
        sectionSubtitle: 'Để được tư vấn miễn phí',
        successMessage: 'Cảm ơn bạn đã gửi thông tin. Chúng tôi sẽ liên hệ lại sớm nhất.',
        enableNotifications: true
      },      seo: {
        metaTitle: apiData.seoSettings?.metaTitle || '',
        metaDescription: apiData.seoSettings?.metaDescription || '',
        ogImage: apiData.seoSettings?.ogImage || null
      }
    };
  }  /**
   * Get homepage settings with all populated data
   */
  async getHomepageSettings(): Promise<HomepageSettings> {
    try {
      // Fetch only homepage settings, featured products are already populated by backend
      const response = await apiService.get<HomepageSettingsResponse>('/homepage-settings');
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch homepage settings');
      }

      // Transform API response to match our interface
      const transformedData = this.transformApiResponse(response.data);
      
      // Process URLs to fix media paths
      return processHomepageSettings(transformedData);
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
      throw error;
    }
  }

  /**
   * Update homepage settings (Admin only)
   */
  async updateHomepageSettings(settings: Partial<HomepageSettings>): Promise<HomepageSettings> {
    try {
      const response = await apiService.put<HomepageSettingsResponse>('/homepage-settings', settings);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update homepage settings');
      }

      return response.data;
    } catch (error) {
      console.error('Error updating homepage settings:', error);
      throw error;
    }
  }

  /**
   * Get active banners only
   */
  async getActiveBanners(): Promise<BannerData[]> {
    try {
      const settings = await this.getHomepageSettings();
      return settings.activeBanners || [];
    } catch (error) {
      console.error('Error fetching active banners:', error);
      return [];
    }
  }

  /**
   * Get featured products only
   */
  async getFeaturedProducts(): Promise<ProductData[]> {
    try {
      const settings = await this.getHomepageSettings();
      return settings.featuredProductsData || [];
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Get latest posts only
   */
  async getLatestPosts(): Promise<PostData[]> {
    try {
      const settings = await this.getHomepageSettings();
      return settings.latestPosts || settings.selectedPostsData || [];
    } catch (error) {
      console.error('Error fetching latest posts:', error);
      return [];
    }
  }
}

// Export singleton instance
export const homepageSettingsService = new HomepageSettingsService();

// Export individual functions for convenience
export const {
  getHomepageSettings,
  updateHomepageSettings,
  getActiveBanners,
  getFeaturedProducts,
  getLatestPosts,
} = homepageSettingsService;
