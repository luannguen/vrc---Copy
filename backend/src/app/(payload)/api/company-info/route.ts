import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  createCORSResponse,
  handleOptionsRequest,
  handleApiError,
  checkAuth
} from '../_shared/cors'

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  console.log('OPTIONS /api/company-info: Handling preflight request')
  return handleOptionsRequest(req, ['GET', 'OPTIONS'])
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    })

    // Fetch company information
    const companyInfo = await payload.findGlobal({
      slug: 'company-info',
      depth: 2, // Populate relations like logo
    })

    // Check if authentication is required
    if (companyInfo?.requireAuth) {
      const isAuthenticated = await checkAuth(req, true)
      
      if (!isAuthenticated) {
        return createCORSResponse(
          {
            success: false,
            message: 'Xác thực thất bại. Vui lòng đăng nhập để truy cập thông tin.',
          },
          401
        )
      }
    }    // Return success response
    return createCORSResponse(companyInfo, 200)
  } catch (error) {
    console.error('Error fetching company information:', error)
    return handleApiError(error, 'Đã xảy ra lỗi khi lấy thông tin công ty. Vui lòng thử lại sau.')
  }
}
