import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders, handleApiError } from '../../_shared/cors';
import { formatApiResponse, formatApiErrorResponse } from '../../products/utils/responses';
import { isAdminRequest } from '../../products/utils/requests';

// Local utility functions for proper admin format
function formatAdminResponse(data: any): NextResponse {
  const headers = createCORSHeaders();
  headers.append('X-Payload-Admin', 'true');
  headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.append('Pragma', 'no-cache');
  headers.append('Expires', '0');
  
  return NextResponse.json(data, {
    status: 200,
    headers
  });
}

function formatAdminErrorResponse(message: string, status: number = 404): NextResponse {
  const headers = createCORSHeaders();
  headers.append('X-Payload-Admin', 'true');
  
  return NextResponse.json({
    message,
    errors: []
  }, {
    status,
    headers
  });
}

/**
 * Fetch technologies with various filters, sorting, and pagination
 * 
 * GET /api/technologies - List all technologies with pagination and filters
 * GET /api/technologies?slug=example - Get single technology by slug
 * GET /api/technologies?id=123456 - Get single technology by ID
 * GET /api/technologies?type=abc - Filter technologies by type
 * GET /api/technologies?search=query - Search technologies
 * GET /api/technologies?page=1&limit=10 - Pagination
 * GET /api/technologies?sort=createdAt&sortDirection=desc - Sorting
 */
export async function handleGET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    });
    
    const url = new URL(req.url);
    const adminRequest = isAdminRequest(req);

    // Extract query parameters for filtering and pagination
    const id = url.searchParams.get('id');
    const slug = url.searchParams.get('slug');
    const type = url.searchParams.get('type');
    const featured = url.searchParams.get('featured');
    const search = url.searchParams.get('search');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const sort = url.searchParams.get('sort') || 'createdAt';
    const sortDirection = url.searchParams.get('sortDirection') || 'desc';

    console.log('GET /api/technologies: Query params:', {
      id, slug, type, featured, search, page, limit, sort, sortDirection, adminRequest
    });

    // Build where clause for filtering
    const where: any = {};

    // Single item lookup by ID
    if (id) {
      where.id = { equals: id };
    }

    // Single item lookup by slug
    if (slug) {
      where.slug = { equals: slug };
    }

    // Filter by type
    if (type) {
      where.type = { equals: type };
    }

    // Filter by featured status
    if (featured) {
      where.featured = { equals: featured === 'true' };
    }

    // Search functionality
    if (search) {
      where.or = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }    // For admin requests, include drafts; for public, only published
    if (!adminRequest) {
      where.status = { equals: 'published' };
    }

    // Build sort string for Payload (format: '-fieldName' for desc, 'fieldName' for asc)
    let sortString = 'createdAt'; // default
    if (sort) {
      if (sortDirection === 'asc') {
        sortString = sort;
      } else {
        sortString = `-${sort}`;
      }
    } else {
      sortString = '-createdAt'; // default desc
    }

    console.log('GET /api/technologies: Where clause:', JSON.stringify(where));
    console.log('GET /api/technologies: Sort string:', sortString);

    // Fetch data from Payload
    const result = await payload.find({
      collection: 'technologies',
      where,
      sort: sortString,
      page,
      limit,
      depth: 1,
    });

    console.log('GET /api/technologies: Found', result.docs.length, 'technologies');    // For single item requests (by ID or slug), return the item directly
    if ((id || slug) && result.docs.length > 0) {
      const technology = result.docs[0];
      if (!technology) {
        console.log('GET /api/technologies: Technology object is null/undefined');
        if (adminRequest) {
          return formatAdminErrorResponse('Technology not found', 404);
        } else {
          return formatApiErrorResponse('Technology not found', null, 404);
        }
      }
      
      console.log('GET /api/technologies: Returning single technology:', technology.id);
      
      if (adminRequest) {
        return formatAdminResponse(technology);
      } else {
        return formatApiResponse(technology, 'Technology retrieved successfully');
      }
    }

    // For single item requests that found nothing
    if ((id || slug) && result.docs.length === 0) {
      console.log('GET /api/technologies: No technology found for', id || slug);
      
      if (adminRequest) {
        return formatAdminErrorResponse('Technology not found', 404);
      } else {
        return formatApiErrorResponse('Technology not found', null, 404);
      }
    }

    // For list requests, return paginated results
    const responseData = {
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage,
    };

    console.log('GET /api/technologies: Returning list response with', result.docs.length, 'items');

    if (adminRequest) {
      return formatAdminResponse(responseData);
    } else {
      return formatApiResponse(responseData, 'Technologies retrieved successfully');
    }

  } catch (error: any) {
    console.error('GET /api/technologies: Error fetching technologies:', error);
    return handleApiError(error, 'Failed to fetch technologies');
  }
}
