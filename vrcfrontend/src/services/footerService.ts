/**
 * Footer Service
 * Handles footer-specific data fetching and processing
 */

import { apiService } from '@/lib/api';

export interface FooterCompanyInfo {
  companyName: string;
  companyDescription: string;
  logoUrl: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    fax?: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
    zalo?: string;
    telegram?: string;
  };
}

export interface CompanyInfoResponse {
  companyName: string;
  companyDescription: string;
  contactSection: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    fax?: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
    zalo?: string;
    telegram?: string;
  };
  logo: {
    url: string;
    alt: string;
  };
}

class FooterService {
  /**
   * Get footer data with processed logo URL
   */
  async getFooterData(): Promise<FooterCompanyInfo> {
    try {
      const response = await apiService.get<CompanyInfoResponse>('/company-info');
      
      if (response && typeof response === 'object') {
        return this.processFooterData(response);
      }
      
      throw new Error('Invalid company info response format');
    } catch (error) {
      console.error('Failed to fetch footer data:', error);
      // Return fallback data
      return this.getFallbackFooterData();
    }
  }

  /**
   * Process raw API response to footer data
   */
  private processFooterData(data: CompanyInfoResponse): FooterCompanyInfo {
    // Fix logo URL - convert from API format to correct URL
    let logoUrl = data.logo?.url || '';
    
    // Convert /api/media/file/ to correct format
    if (logoUrl.startsWith('/api/media/file/')) {
      const filename = logoUrl.replace('/api/media/file/', '');
      logoUrl = `http://localhost:3000/media/${filename}`;
    } else if (logoUrl.startsWith('/media/')) {
      logoUrl = `http://localhost:3000${logoUrl}`;
    }

    return {
      companyName: data.companyName || 'VRC - Tổng công ty Kỹ thuật lạnh Việt Nam',
      companyDescription: data.companyDescription || 'Cung cấp giải pháp điện lạnh toàn diện cho mọi doanh nghiệp và công trình.',
      logoUrl: logoUrl,
      contactInfo: {
        address: data.contactSection?.address || '',
        phone: data.contactSection?.phone || '',
        email: data.contactSection?.email || '',
        workingHours: data.contactSection?.workingHours || '8:00 - 18:00',
        fax: data.contactSection?.fax || ''
      },
      socialLinks: {
        facebook: data.socialMedia?.facebook || '',
        twitter: data.socialMedia?.twitter || '',
        linkedin: data.socialMedia?.linkedin || '',
        youtube: data.socialMedia?.youtube || '',
        instagram: data.socialMedia?.instagram || '',
        zalo: data.socialMedia?.zalo || '',
        telegram: data.socialMedia?.telegram || ''
      }
    };
  }

  /**
   * Fallback footer data when API fails
   */
  private getFallbackFooterData(): FooterCompanyInfo {
    return {
      companyName: 'VRC - Tổng công ty Kỹ thuật lạnh Việt Nam',
      companyDescription: 'Cung cấp giải pháp điện lạnh toàn diện cho mọi doanh nghiệp và công trình.',
      logoUrl: '/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png',
      contactInfo: {
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: '(028) 1234 5678',
        email: 'info@vrc.com.vn',
        workingHours: '8:00 - 18:00',
        fax: '(028) 1234 5679'
      },
      socialLinks: {
        facebook: 'https://facebook.com/vrc',
        linkedin: 'https://linkedin.com/company/vrc',
        youtube: 'https://youtube.com/vrc'
      }
    };
  }

  /**
   * Get direct logo URL for quick access
   */
  async getLogoUrl(): Promise<string> {
    try {
      const footerData = await this.getFooterData();
      return footerData.logoUrl;
    } catch (error) {
      console.error('Failed to get logo URL:', error);
      return '/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png';
    }
  }
}

// Export singleton instance
export const footerService = new FooterService();
export default footerService;
