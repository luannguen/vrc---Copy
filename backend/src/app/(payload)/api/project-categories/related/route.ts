import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders, checkAuth } from '../../_shared/cors';

/**
 * GET /api/project-categories/related
 * 
 * Retrieves related project categories based on various criteria
 * Supports filtering by parent category, similar categories, etc.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('GET /api/project-categories/related called');
    
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Authentication check (optional for public related categories)
    const authResult = await checkAuth(req, false); // false = optional auth
    
    // Parse URL and query parameters
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Get query parameters
    const categoryId = searchParams.get('categoryId');
    const parentId = searchParams.get('parentId');
    const limit = parseInt(searchParams.get('limit') || '5');
    const excludeId = searchParams.get('exclude');
    const showInMenu = searchParams.get('showInMenu');
    
    console.log(`Related categories request - categoryId: ${categoryId}, parentId: ${parentId}, limit: ${limit}`);
    
    let relatedCategories: any[] = [];
    
    if (categoryId) {
      // Find related categories based on the provided category
      const sourceCategory = await payload.findByID({
        collection: 'categories',
        id: categoryId,
        depth: 1,
      });
      
      if (sourceCategory) {
        const where: any = {
          // Filter by project_category type
          type: { equals: 'project_category' }
        };
        
        // Exclude the source category itself
        where.id = { not_equals: categoryId };
        
        // Exclude specific category if requested
        if (excludeId) {
          where.and = [
            { id: { not_equals: excludeId } }
          ];
        }
        
        // If source category has a parent, find siblings
        if (sourceCategory.parent && typeof sourceCategory.parent === 'object') {
          where.parent = { equals: sourceCategory.parent.id };
        } else if (!sourceCategory.parent) {
          // If source category has no parent, find other root categories
          where.parent = { exists: false };
        }
        
        // Apply menu filter if specified
        if (showInMenu !== null && showInMenu !== undefined) {
          where.showInMenu = { equals: showInMenu === 'true' };
        }
        
        const result = await payload.find({
          collection: 'categories',
          where,
          limit,
          sort: 'orderNumber',
          depth: 1,
        });
        
        relatedCategories = result.docs;
      }
    } else if (parentId) {
      // Find child categories of the specified parent
      const where: any = {
        parent: { equals: parentId },
        // Filter by project_category type
        type: { equals: 'project_category' }
      };
      
      // Exclude specific category if requested
      if (excludeId) {
        where.id = { not_equals: excludeId };
      }
      
      // Apply menu filter if specified
      if (showInMenu !== null && showInMenu !== undefined) {
        where.showInMenu = { equals: showInMenu === 'true' };
      }
      
      const result = await payload.find({
        collection: 'categories',
        where,
        limit,
        sort: 'orderNumber',
        depth: 1,
      });
      
      relatedCategories = result.docs;
    } else {
      // Find popular/featured categories (categories with most projects)
      const where: any = {
        // Filter by project_category type
        type: { equals: 'project_category' }
      };
      
      // Exclude specific category if requested
      if (excludeId) {
        where.id = { not_equals: excludeId };
      }
      
      // Apply menu filter if specified
      if (showInMenu !== null && showInMenu !== undefined) {
        where.showInMenu = { equals: showInMenu === 'true' };
      }
      
      const result = await payload.find({
        collection: 'categories',
        where,
        limit,
        sort: '-orderNumber', // Higher order numbers first (assuming featured categories have higher numbers)
        depth: 1,
      });
      
      relatedCategories = result.docs;
    }
    
    console.log(`Found ${relatedCategories.length} related project categories`);
    
    return NextResponse.json({
      success: true,
      data: relatedCategories,
      count: relatedCategories.length,
      criteria: {
        categoryId,
        parentId,
        limit,
        excludeId,
        showInMenu,
      },
    }, {
      status: 200,
      headers: createCORSHeaders(),
    });
    
  } catch (error) {
    console.error('Error in GET /api/project-categories/related:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, {
      status: 500,
      headers: createCORSHeaders(),
    });
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  const headers = createCORSHeaders();
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}
