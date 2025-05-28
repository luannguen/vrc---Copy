import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { checkAuth, createCORSHeaders } from '../../_shared/cors';

// Direct utility functions to avoid import issues
function isAdminRequest(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes('/admin');
}

function formatAdminResponse(data: any, message: string | null = null): NextResponse {
  const headers = createCORSHeaders();
  headers.append('X-Payload-Admin', 'true');
  headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.append('Pragma', 'no-cache');
  headers.append('Expires', '0');
  
  return NextResponse.json({
    message,
    doc: data,
    errors: []
  }, {
    status: 200,
    headers
  });
}

function formatApiResponse(data: any, message: string = 'Thành công', status: number = 200): NextResponse {
  const headers = createCORSHeaders();
  
  return NextResponse.json({
    success: true,
    message,
    data
  }, {
    status,
    headers
  });
}

function formatAdminErrorResponse(message: string, errors: any[] = [], status: number = 400): NextResponse {
  const headers = createCORSHeaders();
  headers.append('X-Payload-Admin', 'true');
  
  return NextResponse.json({
    message,
    errors
  }, {
    status,
    headers
  });
}

function formatApiErrorResponse(message: string, data: any = null, status: number = 400): NextResponse {
  const headers = createCORSHeaders();
  
  return NextResponse.json({
    success: false,
    message,
    data
  }, {
    status,
    headers
  });
}

/**
 * Handle GET requests to retrieve events
 */
export async function handleGET(req: NextRequest): Promise<NextResponse> {
  console.log('GET /api/events: Request received');
  try {
    // Parse query parameters - handle both URL params and form data (for method override requests)
    const url = new URL(req.url);
    const queryParams = new URLSearchParams(url.search);
    
    // If this is a POST request with form data (method override), parse the form data as query params
    const contentType = req.headers.get('content-type') || '';
    if (req.method === 'POST' && contentType.includes('application/x-www-form-urlencoded')) {
      console.log('GET /api/events: Parsing form data as query parameters');
      const formData = await req.formData();
      
      // Convert FormData to URLSearchParams
      for (const [key, value] of formData.entries()) {
        queryParams.set(key, value.toString());
      }
    }
    
    console.log('GET /api/events: Query parameters:', Array.from(queryParams.entries()));
    
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('GET /api/events: Is Payload Admin request:', adminRequest);
    
    // Authentication - skip for admin UI requests which handle auth differently
    if (!adminRequest) {
      const isAuthenticated = await checkAuth(req);
      if (!isAuthenticated) {
        return formatApiErrorResponse(
          'Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.',
          null,
          401
        );
      }
    }
    
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Build query options
    const queryOptions: any = {
      collection: 'events',
      depth: 2,
      limit: 10,
      page: 1,
    };
    
    // Handle pagination
    const limitParam = queryParams.get('limit');
    const pageParam = queryParams.get('page');
    
    if (limitParam) {
      const limit = parseInt(limitParam);
      if (!isNaN(limit) && limit > 0) {
        queryOptions.limit = Math.min(limit, 100); // Cap at 100
      }
    }
    
    if (pageParam) {
      const page = parseInt(pageParam);
      if (!isNaN(page) && page > 0) {
        queryOptions.page = page;
      }
    }
    
    // Handle admin-specific query parameters
    if (adminRequest) {
      console.log('GET /api/events: Processing admin query parameters');
      
      // Handle field selection - admin uses "select[fieldName]" format
      const selectFields: string[] = [];
      for (const [key, value] of queryParams.entries()) {
        if (key.startsWith('select[') && key.endsWith(']')) {
          const field = key.slice(7, -1); // Remove "select[" and "]"
          if (value === 'true' || value === '1') {
            selectFields.push(field);
          }
        }
      }
      
      if (selectFields.length > 0) {
        console.log('GET /api/events: Admin field selection:', selectFields);
        queryOptions.select = selectFields.reduce((acc: any, field) => {
          acc[field] = true;
          return acc;
        }, {});
      }
      
      // Handle complex where conditions - admin uses nested bracket notation
      const whereConditions: any = {};
      
      for (const [key, value] of queryParams.entries()) {
        if (key.startsWith('where[')) {
          console.log('GET /api/events: Processing where condition:', key, '=', value);
          
          // Parse admin query format: where[and][0][field][operator][value]
          // or where[field][operator][value]
          const matches = key.match(/where\[([^\]]+)\]/g);
          if (matches) {
            let current = whereConditions;
            const path: string[] = [];
            
            for (const match of matches) {
              const segment = match.slice(6, -1); // Remove "where[" and "]"
              path.push(segment);
            }
              // Navigate/create the nested structure
            for (let i = 0; i < path.length - 1; i++) {
              const segment = path[i];
              if (segment && !current[segment]) {
                current[segment] = {};
              }
              if (segment) {
                current = current[segment];
              }
            }
            
            // Set the final value
            const lastSegment = path[path.length - 1];
            if (lastSegment) {
              if (Array.isArray(current[lastSegment])) {
                current[lastSegment].push(value);
              } else if (current[lastSegment] !== undefined) {
                current[lastSegment] = [current[lastSegment], value];
              } else {
                current[lastSegment] = value;
              }
            }
          }
        }
      }
      
      if (Object.keys(whereConditions).length > 0) {
        console.log('GET /api/events: Admin where conditions:', JSON.stringify(whereConditions, null, 2));
        queryOptions.where = whereConditions;
      }
      
      // Handle sorting
      const sortParam = queryParams.get('sort');
      if (sortParam) {
        console.log('GET /api/events: Admin sort parameter:', sortParam);
        queryOptions.sort = sortParam;
      }
    } else {
      // Handle API query parameters (simpler format)
      const searchParam = queryParams.get('search');
      if (searchParam) {
        queryOptions.where = {
          or: [
            { title: { contains: searchParam } },
            { description: { contains: searchParam } }
          ]
        };
      }
      
      const sortParam = queryParams.get('sort');
      if (sortParam) {
        queryOptions.sort = sortParam;
      }
    }
    
    console.log('GET /api/events: Final query options:', JSON.stringify(queryOptions, null, 2));
    
    // Execute the query
    const events = await payload.find(queryOptions);
    
    console.log('GET /api/events: Found', events.docs.length, 'events out of', events.totalDocs, 'total');
    
    // Return appropriate response format
    if (adminRequest) {
      // Admin panel expects Payload CMS format
      return formatAdminResponse({
        docs: events.docs,
        totalDocs: events.totalDocs,
        limit: events.limit,
        totalPages: events.totalPages,
        page: events.page,
        pagingCounter: events.pagingCounter,
        hasPrevPage: events.hasPrevPage,
        hasNextPage: events.hasNextPage,
        prevPage: events.prevPage,
        nextPage: events.nextPage
      });
    } else {
      // API clients expect custom format
      return formatApiResponse({
        events: events.docs,
        pagination: {
          total: events.totalDocs,
          page: events.page,
          pages: events.totalPages,
          limit: events.limit
        }
      }, 'Lấy danh sách sự kiện thành công');
    }
    
  } catch (error) {
    console.error('GET /api/events Error:', error);
    
    const adminRequest = isAdminRequest(req);
    
    if (adminRequest) {      return formatAdminErrorResponse(
        error instanceof Error ? error.message : 'Lỗi khi lấy danh sách sự kiện',
        [],
        500
      );
    } else {
      return formatApiErrorResponse(
        'Lỗi khi lấy danh sách sự kiện. Vui lòng thử lại.',
        error,
        500
      );
    }
  }
}
