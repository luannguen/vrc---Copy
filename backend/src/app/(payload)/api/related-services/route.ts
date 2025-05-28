import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders, handleApiError, handleOptionsRequest } from '../_shared/cors';

/**
 * Get related services for the service form
 * This endpoint is specifically designed for the admin panel to fetch related services options
 * 
 * GET /api/related-services?excludeId=123 - Get all services except the one with specified ID
 * GET /api/related-services?search=keyword - Search services by title
 * GET /api/related-services?limit=20 - Limit results
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Create CORS headers
    const corsHeaders = createCORSHeaders();

    // Get query parameters
    const url = new URL(req.url);
    const excludeId = url.searchParams.get('excludeId');
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const page = parseInt(url.searchParams.get('page') || '1');
    const depth = parseInt(url.searchParams.get('depth') || '0');

    console.log('GET /api/related-services: Request received');

    // Initialize payload
    const payload = await getPayload({ config });

    // Build query where conditions
    const where: any = {
      status: {
        equals: 'published'
      }
    };

    // Exclude current service if ID is provided
    if (excludeId) {
      where.id = {
        not_equals: excludeId
      }
    }

    // Add search filter if provided
    if (search) {
      where.title = {
        contains: search
      }
    }

    console.log('GET /api/related-services: Query params:', JSON.stringify({
      excludeId,
      search,
      limit,
      page,
      where
    }))

    // Get related services
    const relatedServices = await payload.find({
      collection: 'services',
      where,
      limit,
      page,
      depth,
      sort: '-createdAt', // Most recent first
    });

    console.log('GET /api/related-services: Found', relatedServices.docs.length, 'services');

    // Return successful response
    return NextResponse.json({
      success: true,
      data: relatedServices.docs,
      meta: {
        totalDocs: relatedServices.totalDocs,
        totalPages: relatedServices.totalPages,
        page: relatedServices.page,
        limit: relatedServices.limit,
        hasPrevPage: relatedServices.hasPrevPage,
        hasNextPage: relatedServices.hasNextPage,
        prevPage: relatedServices.prevPage,
        nextPage: relatedServices.nextPage,
      }
    }, { headers: corsHeaders });

  } catch (error) {
    console.error('GET /api/related-services: Error:', error);
    
    const corsHeaders = createCORSHeaders();
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch related services',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}

// Handle preflight requests
export async function OPTIONS(req: NextRequest): Promise<NextResponse> {
  return handleOptionsRequest(req);
}
