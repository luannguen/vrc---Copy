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

export interface FormSubmissionsStats {
  total: number;
  thisMonth: number;
  pending: number;
  lastSubmission?: {
    id: string;
    createdAt: string;
    submissionData?: Array<{ field: string; value: string }>;
  };
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
  [key: string]: unknown;
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
  [key: string]: unknown;
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
  [key: string]: unknown;
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
  formSubmissionsStats?: FormSubmissionsStats;
  [key: string]: unknown;
}

export interface HomepageSettingsResponse {
  success: boolean;
  data: ApiHomepageSettingsResponse;
  message?: string;
  error?: string;
}

// Types for API Response
interface ApiImage {
  url: string;
  alt?: string;
  filename?: string;
  mimeType?: string;
  filesize?: number;
  width?: number;
  height?: number;
}

interface ApiBannerData {
  id: string;
  title: string;
  subtitle: string;
  image?: ApiImage;
  link?: string;
  sortOrder?: number;
  isActive?: boolean;
}

interface ApiPostData {
  id: string;
  title: string;
  meta?: {
    description?: string;
  };
  publishedAt: string;
  slug: string;
  heroImage?: ApiImage;
}

interface ApiProductData {
  id: string;
  name: string;
  excerpt?: string;
  mainImage?: ApiImage & {
    thumbnailURL?: string;
  };
  slug: string;
  featured?: boolean;
}

interface ApiHomepageSettingsResponse {
  activeBanners?: ApiBannerData[];
  latestPosts?: ApiPostData[];
  featuredProductsData?: ApiProductData[];
  heroSection?: {
    enableCarousel?: boolean;
    autoSlideInterval?: number;
  };
  featuredSection?: {
    isEnabled?: boolean;
    title?: string;
    description?: string;
  };
  publicationsSection?: {
    isEnabled?: boolean;
    numberOfPosts?: number;
    title?: string;
  };
  resourcesSection?: {
    isEnabled?: boolean;
    leftPanel?: {
      title?: string;
      linkUrl?: string;
    };
    rightPanel?: {
      title?: string;
      linkUrl?: string;
    };
  };
  contactSection?: {
    isEnabled?: boolean;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: ApiImage;
  };
  formSubmissionsStats?: {
    total?: number;
    thisMonth?: number;
    pending?: number;
    lastSubmission?: {
      id: string;
      createdAt: string;
      submissionData?: Array<{ field: string; value: string }>;
    };
  };
  [key: string]: unknown;
}

class HomepageSettingsService {
  /**
   * Convert our HomepageSettings to urlProcessor compatible format
   */
  private toUrlProcessorFormat(settings: HomepageSettings): Parameters<typeof processHomepageSettings>[0] {
    return settings as Parameters<typeof processHomepageSettings>[0];
  }

  /**
   * Convert from urlProcessor format back to our HomepageSettings
   */
  private fromUrlProcessorFormat(settings: ReturnType<typeof processHomepageSettings>): HomepageSettings {
    return settings as HomepageSettings;
  }  /**
   * Transform API response to match our interface
   */
  private transformApiResponse(apiData: ApiHomepageSettingsResponse): HomepageSettings {
    // Transform activeBanners to match BannerData interface
    const activeBanners: BannerData[] = (apiData.activeBanners || []).map((banner: ApiBannerData) => ({
      id: banner.id,
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.image?.url || '',
      link: banner.link || '#',
      sortOrder: banner.sortOrder || 0,
      isActive: banner.isActive ?? true
    }));    // Transform latest posts to match PostData interface  
    const latestPosts: PostData[] = (apiData.latestPosts || []).map((post: ApiPostData) => ({
      id: post.id,
      title: post.title,
      excerpt: post.meta?.description || '',
      publishedAt: post.publishedAt,
      slug: post.slug,
      featuredImage: post.heroImage ? {
        url: post.heroImage.url,
        alt: post.heroImage.alt || post.title
      } : undefined
    }));

    // Transform featured products to match ProductData interface
    const featuredProductsData: ProductData[] = (apiData.featuredProductsData || []).map((product: ApiProductData) => ({
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
        ogImage: apiData.seoSettings?.ogImage ? {
          url: apiData.seoSettings.ogImage.url,
          alt: apiData.seoSettings.ogImage.alt || ''
        } : undefined
      },
      formSubmissionsStats: {
        total: apiData.formSubmissionsStats?.total || 0,
        thisMonth: apiData.formSubmissionsStats?.thisMonth || 0,
        pending: apiData.formSubmissionsStats?.pending || 0,
        lastSubmission: apiData.formSubmissionsStats?.lastSubmission || undefined
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
      }      // Transform API response to match our interface
      const transformedData = this.transformApiResponse(response.data);
      
      // Process URLs to fix media paths
      const urlProcessorData = this.toUrlProcessorFormat(transformedData);
      const processedData = processHomepageSettings(urlProcessorData);
      
      // Handle null case (though it shouldn't happen with valid data)
      if (!processedData) {
        throw new Error('Failed to process homepage settings data');
      }
      
      return this.fromUrlProcessorFormat(processedData);
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
      }      // Transform and process the updated data
      const transformedData = this.transformApiResponse(response.data);
      const urlProcessorData = this.toUrlProcessorFormat(transformedData);
      const processedData = processHomepageSettings(urlProcessorData);
      
      if (!processedData) {
        throw new Error('Failed to process updated homepage settings data');
      }
      
      return this.fromUrlProcessorFormat(processedData);
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
