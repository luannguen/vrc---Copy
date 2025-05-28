import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders, checkAuth } from '../../_shared/cors';
import { isAdminRequest, buildCategoryWhereClause } from '../utils/requests';
import { formatPaginatedResponse, formatErrorResponse } from '../utils/responses';

/**
 * GET /api/project-categories
 * 
 * Retrieves project categories with filtering, sorting, and pagination
 * Supports both frontend requests and admin panel requests
 */
export async function handleGET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('GET /api/project-categories called');
    
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Parse URL and query parameters
    const url = new URL(req.url);
    const searchParams = url.searchParams;
      // Check if this is from admin panel
    const isFromAdmin = isAdminRequest(req);
    
    // Handle method override for admin panel (POST requests treated as GET)
    const methodOverride = req.headers.get('x-http-method-override');
    const isMethodOverrideGet = methodOverride === 'GET';
    
    if (isFromAdmin || isMethodOverrideGet) {
      console.log('Admin panel request detected for project categories');
      
      // Admin panel specific query handling
      const limit = parseInt(searchParams.get('limit') || '10');
      const page = parseInt(searchParams.get('page') || '1');
      const sort = searchParams.get('sort') || 'title';        const queryResult = await payload.find({
        collection: 'project-categories',
        limit: limit,
        page: page,
        sort: sort,
        depth: 1,
      });
      
      return NextResponse.json(queryResult, {
        status: 200,
        headers: createCORSHeaders(),
      });
    }
    
    // Authentication check for regular API requests
    const authResult = await checkAuth(req, false); // false = optional auth
    if (!authResult) {
      console.log('Authentication failed for project categories API');
      return NextResponse.json(
        { error: 'Authentication required' },
        { 
          status: 401,
          headers: createCORSHeaders(),
        }
      );
    }
      // Parse query parameters for filtering
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const sort = searchParams.get('sort') || 'orderNumber';
      // Build where clause using utility function
    const where = buildCategoryWhereClause(searchParams);
      // Execute query
    const result = await payload.find({
      collection: 'project-categories',
      where,
      limit,
      page,
      sort,
      depth: 2, // Include parent and related data
    });
      console.log(`Found ${result.docs.length} project categories`);
    
    return formatPaginatedResponse(result.docs, result);
      } catch (error) {
    console.error('Error in GET /api/project-categories:', error);
    return formatErrorResponse(
      error instanceof Error ? error : new Error('Unknown error occurred')
    );
  }
}
