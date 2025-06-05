// Services API Client for VRC Frontend
// Tích hợp với backend Services API

// Lexical content types
interface LexicalTextNode {
  type: 'text';
  text: string;
  format?: number;
  style?: string;
}

interface LexicalElementNode {
  type: string;
  children?: LexicalNode[];
  direction?: string;
  format?: string;
  indent?: number;
}

type LexicalNode = LexicalTextNode | LexicalElementNode;

interface LexicalContent {
  root: {
    children: LexicalNode[];
  };
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  type: 'consulting' | 'installation' | 'maintenance' | 'repair' | 'upgrade' | 'support';
  summary: string;
  featuredImage?: {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  content: LexicalContent;
  features: Array<{
    title: string;
    description?: string;
    icon?: string;
  }>;
  benefits: Array<{
    title: string;
    description?: string;
  }>;
  pricing: {
    showPricing: boolean;
    priceType: 'fixed' | 'range' | 'custom' | 'contact';
    customPrice?: string;
    currency?: string;
  };
  faq: Array<{
    question: string;
    answer: string;
  }>;
  order: number;
  featured: boolean;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  success: boolean;
  message: string;
  data: {
    services: Service[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
      hasNext: boolean;
      hasPrev: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
}

export interface ServiceResponse {
  success: boolean;
  message: string;
  data: Service;
}

class ServicesApi {
  private baseUrl = `${import.meta.env.VITE_API_URL}/api`;

  // Lấy tất cả dịch vụ với filters
  async getAll(params?: {
    type?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }): Promise<ServicesResponse> {
    const searchParams = new URLSearchParams();
    
    if (params?.type) searchParams.append('type', params.type);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.page) searchParams.append('page', params.page.toString());

    const url = `${this.baseUrl}/services${searchParams.toString() ? '?' + searchParams.toString() : ''}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  // Lấy dịch vụ theo slug
  async getBySlug(slug: string): Promise<ServiceResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/services?slug=${slug}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching service by slug:', error);
      throw error;
    }
  }

  // Lấy dịch vụ theo type/category
  async getByType(type: string, limit?: number): Promise<ServicesResponse> {
    return this.getAll({ type, limit });
  }

  // Lấy dịch vụ nổi bật
  async getFeatured(limit?: number): Promise<ServicesResponse> {
    return this.getAll({ featured: true, limit });
  }
  // Utility: Convert Lexical content to plain text
  extractTextFromContent(content: LexicalContent): string {
    if (!content?.root?.children) return '';
    
    const extractText = (node: LexicalNode): string => {
      if (node.type === 'text') {
        return (node as LexicalTextNode).text || '';
      }
      if ('children' in node && node.children) {
        return node.children.map(extractText).join('');
      }
      return '';
    };

    return content.root.children.map(extractText).join(' ').trim();
  }
  // Utility: Get service image URL
  getImageUrl(service: Service): string {
    if (service.featuredImage?.url) {
      // Nếu URL đã là absolute, return as is
      if (service.featuredImage.url.startsWith('http')) {
        return service.featuredImage.url;
      }
      // Nếu là relative path, append base URL
      return `${import.meta.env.VITE_API_URL}${service.featuredImage.url}`;
    }
    return '/placeholder.svg'; // Fallback image
  }
}

// Export singleton instance
export const servicesApi = new ServicesApi();

// Export default
export default servicesApi;
