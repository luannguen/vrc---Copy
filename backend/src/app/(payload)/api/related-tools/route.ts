import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders, handleApiError, handleOptionsRequest } from '../_shared/cors';

/**
 * Get related tools for the tool form
 * This endpoint is specifically designed for the admin panel to fetch related tools options
 *
 * GET /api/related-tools?excludeId=123 - Get all tools except the one with specified ID
 * GET /api/related-tools?search=keyword - Search tools by title
 * GET /api/related-tools?limit=20 - Limit results
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

    console.log('GET /api/related-tools: Request received');

    // Initialize payload
    const payload = await getPayload({ config });    // Build query where conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: {
        equals: 'published'
      }
    };

    // Exclude current tool if ID is provided
    if (excludeId) {
      where.id = {
        not_equals: excludeId
      }
    }    // Add search filter if provided
    if (search) {
      where.name = {
        contains: search
      }
    }

    // Query tools
    const result = await payload.find({
      collection: 'tools',
      where,
      limit,
      page,      depth,
      sort: 'name',
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        status: true
      }
    });

    console.log(`GET /api/related-tools: Found ${result.docs.length} tools`);    // Format response for admin interface
    const responseData = {
      docs: result.docs.map(tool => ({
        id: tool.id,
        title: tool.name,
        value: tool.id, // For compatibility with admin select component
        label: tool.name, // For display in admin select
        slug: tool.slug,
        description: tool.description
      })),
      totalDocs: result.totalDocs,
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      limit: result.limit
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Error in GET /api/related-tools:', error);
    return handleApiError(error);
  }
}

/**
 * Handle preflight OPTIONS requests for CORS
 */
export function OPTIONS(req: NextRequest): NextResponse {
  return handleOptionsRequest(req, ['GET', 'OPTIONS']);
}
