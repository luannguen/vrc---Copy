import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  createCORSHeaders,
  handleApiError,
  handleOptionsRequest
} from '../_shared/cors'

/**
 * Handle CORS preflight requests
 */
export function OPTIONS(req: NextRequest) {
  console.log('OPTIONS /api/related-products: Handling preflight request')
  return handleOptionsRequest(req, ['GET', 'OPTIONS'])
}

/**
 * Get related products for the product form
 * This endpoint is specifically designed for the admin panel to fetch related products options
 * 
 * GET /api/related-products?excludeId=123 - Get all products except the one with specified ID
 * GET /api/related-products?search=keyword - Search products by name
 * GET /api/related-products?limit=20 - Limit results
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('GET /api/related-products: Request received')
    
    // Initialize Payload
    const payload = await getPayload({
      config,
    })

    const url = new URL(req.url)
    
    // Parse query parameters
    const excludeId = url.searchParams.get('excludeId')
    const search = url.searchParams.get('search')
    const limit = Number(url.searchParams.get('limit')) || 50
    const page = Number(url.searchParams.get('page')) || 1

    // Build where clause
    const where: any = {}
    
    // Exclude current product if ID is provided
    if (excludeId) {
      where.id = {
        not_equals: excludeId
      }
    }
    
    // Add search filter if provided
    if (search) {
      where.name = {
        contains: search
      }
    }
    
    console.log('GET /api/related-products: Query params:', JSON.stringify({
      excludeId,
      search,
      limit,
      page,
      where
    }))

    // Get related products
    const relatedProducts = await payload.find({
      collection: 'products',
      where,
      limit,
      page,
      sort: 'name',
      depth: 0
    })

    const headers = createCORSHeaders()
    
    return NextResponse.json(relatedProducts, {
      status: 200,
      headers
    })
  } catch (error) {
    console.error('Related Products API Error:', error)
    return handleApiError(error, 'Lỗi khi lấy danh sách sản phẩm liên quan')
  }
}
