import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  createCORSResponse,
  handleOptionsRequest,
  handleApiError
} from '../_shared/cors'
import { validateApiKey, createApiKeyErrorResponse } from '../_shared/apiKey'

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  console.log('OPTIONS /api/company-info: Handling preflight request')
  return handleOptionsRequest(req, ['GET', 'OPTIONS'])
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate API key to prevent spam
    if (!validateApiKey(req)) {
      const errorResponse = createApiKeyErrorResponse()
      return createCORSResponse(errorResponse, 401)
    }

    // Initialize Payload
    const payload = await getPayload({
      config,
    })

    // Fetch company information
    const companyInfo = await payload.findGlobal({
      slug: 'company-info',
      depth: 2, // Populate relations like logo
    })

    // Company info is public data, but requires API key to prevent spam
    // The requireAuth field is kept for admin control but not enforced in API

    // Return success response
    return createCORSResponse(companyInfo, 200)
  } catch (error) {
    console.error('Error fetching company information:', error)
    return handleApiError(error, 'Đã xảy ra lỗi khi lấy thông tin công ty. Vui lòng thử lại sau.')
  }
}
