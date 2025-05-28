import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  handleOptionsRequest,
  createCORSHeaders,
  handleApiError
} from '../_shared/cors';

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    })

    const url = new URL(req.url)
    
    // Parse query parameters
    const page = Number(url.searchParams.get('page')) || 1
    const limit = Number(url.searchParams.get('limit')) || 20
    const featured = url.searchParams.get('featured') === 'true'
    const slug = url.searchParams.get('slug')
    const search = url.searchParams.get('search')

    // Build the query with supplier type filter
    const query: any = {
      status: {
        equals: 'published',
      },
      type: {
        equals: 'supplier', // Filter specifically for suppliers
      }
    }

    // Add filters if they exist
    if (featured) {
      query.featured = {
        equals: true,
      }
    }

    if (slug) {
      query.slug = {
        equals: slug,
      }
    }

    if (search) {
      query.name = {
        like: search,
      }
    }
    
    // If fetching a single supplier by slug
    if (slug) {      const supplier = await payload.find({
        collection: 'technologies' as 'pages',
        where: {
          slug: { equals: slug },
          status: { equals: 'published' },
          type: { equals: 'supplier' },
        },
        depth: 2, // Populate relationships 2 levels deep
      })
      
      if (supplier.docs.length === 0) {
        return handleApiError(new Error('Not found'), 'Không tìm thấy nhà cung cấp.', 404)
      }

      const headers = createCORSHeaders()
      return NextResponse.json(
        {
          success: true,
          data: supplier.docs[0],
        },
        {
          status: 200,
          headers,
        }
      )
    }
    
    // Otherwise fetch a list of suppliers
    const suppliers = await payload.find({
      collection: 'technologies' as 'pages',
      where: query,
      sort: 'order', // Sort by order field
      page,
      limit,
      depth: 1, // Populate relationships 1 level deep
    })

    const headers = createCORSHeaders()
    return NextResponse.json(
      {
        success: true,
        data: suppliers.docs,
        totalDocs: suppliers.totalDocs,
        totalPages: suppliers.totalPages,
        page: suppliers.page,
        hasNextPage: suppliers.hasNextPage,
        hasPrevPage: suppliers.hasPrevPage,
      },
      {
        status: 200,
        headers,
      }
    )
  } catch (error) {    console.error('Suppliers API Error:', error)
    const _headers = createCORSHeaders()
    return handleApiError(error, 'Có lỗi xảy ra khi lấy dữ liệu nhà cung cấp.', 500)
  }
}
