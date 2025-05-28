import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  handleOptionsRequest,
  createCORSResponse,
  handleApiError
} from '../_shared/cors';

// Type definition for header info
interface _HeaderInfo {
  companyName: string;
  companyShortName?: string;
  contactSection: {
    phone?: string;
    hotline?: string;
    email?: string;
    address?: string;
    workingHours?: string;
  };
  socialMedia: {
    facebook?: string;
    zalo?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
    linkedin?: string;
    telegram?: string;
  };
  logo?: {
    id: string;
    url: string;
    alt?: string;
  };
  navigation?: {
    mainLinks: Array<{title: string, routeKey: string}>;
    moreLinks: Array<{title: string, routeKey: string}>;
  };
}

/**
 * GET handler for header information endpoint
 * Returns only the necessary information for the website header
 */
export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    })

    // Fetch company information
    const companyInfo = await payload.findGlobal({
      slug: 'company-info',
      depth: 1, // Only need depth 1 for header information
    })

    // Fetch header navigation information
    const headerData = await payload.findGlobal({
      slug: 'header',
      depth: 1,
    })
    
    // Extract only the information needed for the header
    const headerInfo = {
      companyName: companyInfo.companyName,
      companyShortName: companyInfo.companyShortName,
      contactSection: {
        phone: companyInfo.contactSection?.phone,
        hotline: companyInfo.contactSection?.hotline,
        email: companyInfo.contactSection?.email,
        address: companyInfo.contactSection?.address,
        workingHours: companyInfo.contactSection?.workingHours,
      },
      socialMedia: {
        facebook: companyInfo.socialMedia?.facebook,
        zalo: companyInfo.socialMedia?.zalo,
        twitter: companyInfo.socialMedia?.twitter,
        instagram: companyInfo.socialMedia?.instagram,
        youtube: companyInfo.socialMedia?.youtube,
        linkedin: companyInfo.socialMedia?.linkedin,
        telegram: companyInfo.socialMedia?.telegram,
      },
      logo: companyInfo.logo,
      navigation: {
        // Chuyển đổi từ định dạng navItems của header sang định dạng mainLinks/moreLinks
        mainLinks: headerData?.navItems?.map(item => ({
          title: item.link?.label,
          routeKey: item.link?.url?.replace(/^\//, '').toUpperCase() || 'HOME',
        })) || [],
        moreLinks: [] // Có thể thêm logic xác định moreLinks nếu cần
      }
    }    // Return success response using createCORSResponse (which handles both data and headers)
    return createCORSResponse(headerInfo, 200)
  } catch (error) {
    console.error('Error fetching header information:', error)
    
    return handleApiError(error, 'Đã xảy ra lỗi khi lấy thông tin header. Vui lòng thử lại sau.', 500)
  }
}

// Handle CORS preflight requests
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}
