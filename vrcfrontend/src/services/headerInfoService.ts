/**
 * Header Info API Service
 * Handles API calls related to header information and company data
 */

import { apiService } from '../lib/api';

// Header Info Types
export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  hotline?: string;
  workingHours?: string;
}

export interface SocialLinks {
  facebook?: {
    url?: string;
    enabled?: boolean;
  } | string;  zalo?: {
    url?: string;
    oaId?: string;
    enabled?: boolean;
  } | string;
  linkedin?: {
    url?: string;
    enabled?: boolean;
  } | string;
  youtube?: {
    url?: string;
    enabled?: boolean;
  } | string;
  twitter?: {
    url?: string;
    enabled?: boolean;
  } | string;
  instagram?: {
    url?: string;
    enabled?: boolean;
  } | string;
  telegram?: {
    url?: string;
    enabled?: boolean;
  } | string;
}

export interface HeaderInfo {
  companyName: string;
  companyDescription?: string;
  logo?: {
    url: string;
    alt?: string;
  };
  contactSection: ContactInfo;
  socialMediaLinks: SocialLinks;
  socialMedia?: SocialLinks; // Add the new socialMedia field for backend compatibility
  // Add other header-related fields as needed
}

export interface CompanyInfo {
  companyName: string;
  companyDescription: string;
  logo?: {
    url: string;
    alt?: string;
  };
  contactSection: ContactInfo;
  socialMediaLinks: SocialLinks;
  socialMedia?: SocialLinks; // Add the new socialMedia field for backend compatibility
  mapSection?: {
    embedUrl?: string;
    latitude?: number;
    longitude?: number;
  };
  // Add other company info fields
}

// Header Info API Service
export class HeaderInfoService {  /**
   * Get header information for the website header
   */  
  async getHeaderInfo(): Promise<HeaderInfo> {
    try {
      const response = await apiService.get<HeaderInfo>('/header-info');
      
      // Debug log
      console.log('HeaderInfo API Response:', response);
      
      // API trả về trực tiếp dữ liệu, không có wrapper { success, data }
      if (response && typeof response === 'object') {
        return response;
      }
      
      throw new Error('Invalid header info response format');
    } catch (error) {
      console.error('Failed to fetch header info:', error);
      // Return fallback data
      return this.getFallbackHeaderInfo();
    }
  }
  /**
   * Get company information for footer and other components
   */
  async getCompanyInfo(): Promise<CompanyInfo> {
    try {
      const response = await apiService.get<CompanyInfo>('/company-info');
      
      // API trả về trực tiếp dữ liệu, không có wrapper { success, data }
      if (response && typeof response === 'object') {
        return response;
      }
      
      throw new Error('Invalid company info response format');
    } catch (error) {
      console.error('Failed to fetch company info:', error);
      // Return fallback data
      return this.getFallbackCompanyInfo();
    }
  }

  /**
   * Fallback header info when API fails
   */
  private getFallbackHeaderInfo(): HeaderInfo {
    return {
      companyName: 'VRC - Tổng công ty Kỹ thuật lạnh Việt Nam',
      companyDescription: 'Cung cấp giải pháp điện lạnh toàn diện cho mọi doanh nghiệp và công trình.',
      contactSection: {
        address: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh, Việt Nam',
        phone: '+84 (28) 1234 5678',
        email: 'info@vrc.com.vn',
        hotline: '1800 1234',
        workingHours: '8:00 - 17:30, Thứ 2 - Thứ 6'
      },
      socialMediaLinks: {
        facebook: 'https://facebook.com/your_profile',
        zalo: 'https://zalo.me/your_zalo_id',
      }
    };
  }

  /**
   * Fallback company info when API fails
   */
  private getFallbackCompanyInfo(): CompanyInfo {
    return {
      companyName: 'VRC - Tổng công ty Kỹ thuật lạnh Việt Nam',
      companyDescription: 'Cung cấp giải pháp điện lạnh toàn diện cho mọi doanh nghiệp và công trình.',
      contactSection: {
        address: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh, Việt Nam',
        phone: '+84 (28) 1234 5678',
        email: 'info@vrc.com.vn',
        hotline: '1800 1234',
        workingHours: '8:00 - 17:30, Thứ 2 - Thứ 6'
      },
      socialMediaLinks: {
        facebook: 'https://facebook.com/your_profile',
        zalo: 'https://zalo.me/your_zalo_id',
        linkedin: 'https://linkedin.com/company/your_company',
        youtube: 'https://youtube.com/your_channel'
      }
    };
  }
}

// Export singleton instance
export const headerInfoService = new HeaderInfoService();
