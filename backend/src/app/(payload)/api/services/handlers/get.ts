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
 * Fetch services with various filters, sorting, and pagination
 * 
 * GET /api/services - List all services with pagination and filters
 * GET /api/services?slug=example - Get single service by slug
 * GET /api/services?id=123456 - Get single service by ID
 * GET /api/services?type=abc - Filter services by type
 * GET /api/services?search=query - Search services
 * GET /api/services?page=1&limit=10 - Pagination
 * GET /api/services?sort=createdAt&sortDirection=desc - Sorting
 */
export async function handleGET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    const url = new URL(req.url);
    
    // Parse query parameters - handle both URL params and form data (for method override requests)
    let queryParams = new URLSearchParams();
    
    // First, get URL parameters
    url.searchParams.forEach((value, key) => {
      queryParams.set(key, value);
    });
    
    // If this is a POST request with form data (method override), parse form data as query params
    const contentType = req.headers.get('content-type') || '';
    if (req.method === 'POST' && contentType.includes('application/x-www-form-urlencoded')) {
      try {
        const formData = await req.formData();
        for (const [key, value] of formData.entries()) {
          queryParams.set(key, value.toString());
        }
        console.log('GET /api/services: Parsed form data as query params:', Object.fromEntries(queryParams.entries()));
      } catch (formError) {
        console.log('GET /api/services: Could not parse form data, using URL params only');
      }
    }
    
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('GET /api/services: Is admin request:', adminRequest);
    
    // Single service by ID
    const id = queryParams.get('id');
    if (id) {
      console.log('GET /api/services: Fetching single service by ID:', id);
      
      const service = await payload.findByID({
        collection: 'services',
        id: id,
        depth: Number(queryParams.get('depth') || 1),
      });      if (!service) {
        if (adminRequest) {
          return formatAdminErrorResponse('Dịch vụ không tồn tại', 404);
        }
        return formatApiErrorResponse('Dịch vụ không tồn tại', null, 404);
      }

      if (adminRequest) {
        return formatAdminResponse(service);
      }
      return formatApiResponse(service, 'Lấy thông tin dịch vụ thành công');
    }

    // Single service by slug
    const slug = queryParams.get('slug');
    if (slug) {
      console.log('GET /api/services: Fetching single service by slug:', slug);
      
      const services = await payload.find({
        collection: 'services',
        where: {
          slug: {
            equals: slug,
          },
        },
        depth: Number(queryParams.get('depth') || 1),
        limit: 1,
      });      if (!services.docs || services.docs.length === 0) {
        if (adminRequest) {
          return formatAdminErrorResponse('Dịch vụ không tồn tại', 404);
        }
        return formatApiErrorResponse('Dịch vụ không tồn tại', null, 404);
      }

      const service = services.docs[0];
      if (adminRequest) {
        return formatAdminResponse(service);
      }
      return formatApiResponse(service, 'Lấy thông tin dịch vụ thành công');
    }

    // List services with filters and pagination
    console.log('GET /api/services: Fetching services list with filters');
    
    // Build where conditions
    const where: any = {};
    
    // Filter by type
    const type = queryParams.get('type');
    if (type) {
      where.type = { equals: type };
    }
    
    // Search functionality
    const search = queryParams.get('search');
    if (search) {
      where.or = [
        {
          title: {
            contains: search,
          },
        },
        {
          description: {
            contains: search,
          },
        },
      ];
    }

    // Pagination
    const page = Number(queryParams.get('page')) || 1;
    const limit = Number(queryParams.get('limit')) || 10;
    
    // Sorting
    const sort = queryParams.get('sort') || 'createdAt';
    const sortDirection = queryParams.get('sortDirection') || 'desc';
    const sortValue = sortDirection === 'asc' ? sort : `-${sort}`;

    // Additional query parameters for admin interface
    const depth = Number(queryParams.get('depth') || 1);
    
    console.log('GET /api/services: Query conditions:', {
      where,
      page,
      limit,
      sort: sortValue,
      depth,
    });

    // Execute the query
    const services = await payload.find({
      collection: 'services',
      where,
      page,
      limit,
      sort: sortValue,
      depth,
    });

    console.log('GET /api/services: Found services:', {
      totalDocs: services.totalDocs,      totalPages: services.totalPages,
      page: services.page,
      limit: services.limit,
      docsCount: services.docs.length,
    });

    // Return admin format for admin requests
    if (adminRequest) {
      return formatAdminResponse({
        docs: services.docs,
        totalDocs: services.totalDocs,
        limit: services.limit,
        totalPages: services.totalPages,
        page: services.page,
        pagingCounter: services.pagingCounter,
        hasPrevPage: services.hasPrevPage,
        hasNextPage: services.hasNextPage,
        prevPage: services.prevPage,
        nextPage: services.nextPage
      });
    }

    // Return standard API format for direct API requests
    return formatApiResponse({
      services: services.docs,
      pagination: {
        total: services.totalDocs,
        page: services.page,
        pages: services.totalPages,
        limit: services.limit,
        hasNext: services.hasNextPage,
        hasPrev: services.hasPrevPage,
        nextPage: services.nextPage,
        prevPage: services.prevPage,
      }
    }, 'Lấy danh sách dịch vụ thành công');

  } catch (error) {
    console.error('GET /api/services: Error fetching services:', error);
    return handleApiError(error, 'Lỗi khi lấy danh sách dịch vụ');
  }
}
