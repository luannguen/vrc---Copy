import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  handleOptionsRequest,
  createCORSResponse,
  handleApiError
} from '../_shared/cors'

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  console.log('OPTIONS /api/navigation: Handling preflight request')
  return handleOptionsRequest(req, ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    })

    // Get the navigation type from the query parameter (default to 'main')
    const url = new URL(req.url)
    const type = url.searchParams.get('type') || 'main'
    
    // Query the navigation collection
    const result = await payload.find({
      collection: 'navigation' as 'pages',
      where: {
        type: { equals: type },
        status: { equals: 'published' },
      },
      sort: 'order',
      depth: 1, // 1 level of relationship population
    })

    // Return the result using the standardized CORS response
    return createCORSResponse(
      {
        success: true,
        data: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
      },
      200
    )
  } catch (error) {
    console.error('Navigation API Error:', error)
    return handleApiError(error, 'Có lỗi xảy ra khi lấy dữ liệu menu.')
  }
}
