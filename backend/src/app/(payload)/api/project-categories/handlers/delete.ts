import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders, checkAuth } from '../../_shared/cors';

// Local utility functions for proper admin format
function formatAdminResponse(data: any, status: number = 200): NextResponse {
  const headers = createCORSHeaders();
  headers.append('X-Payload-Admin', 'true');
  headers.append('X-Payload-Refresh', 'project-categories');
  headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.append('Pragma', 'no-cache');
  headers.append('Expires', '0');
  
  // Format response like products API
  return NextResponse.json(data, {
    status,
    headers
  });
}

function formatAdminErrorResponse(message: string, status: number = 400): NextResponse {
  const headers = createCORSHeaders();
  headers.append('X-Payload-Admin', 'true');
  
  return NextResponse.json({
    message,
    errors: [{ message, field: 'general' }]
  }, {
    status,
    headers
  });
}

/**
 * DELETE /api/project-categories
 * 
 * Deletes one or multiple project categories
 * Supports both single and bulk delete operations
 * Compatible with Payload CMS admin panel delete operations
 */
export async function handleDELETE(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('DELETE /api/project-categories called');
    
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Authentication check
    const authResult = await checkAuth(req, true); // true = required auth
    if (!authResult) {
      console.log('Authentication failed for project categories deletion');
      return formatAdminErrorResponse('Authentication required', 401);
    }
    
    // Parse URL and request body
    const url = new URL(req.url);
    let body: any = {};
    
    try {
      const requestText = await req.text();
      if (requestText) {
        body = JSON.parse(requestText);
      }
    } catch (parseError) {
      // If body parsing fails, continue with URL parameters
      console.log('No valid JSON body found, using URL parameters');
    }
    
    // Extract category IDs to delete
    const categoryIds: string[] = [];
    
    // Method 1: Single ID from query parameters (list view)
    const singleId = url.searchParams.get('where[id][in][0]');
    if (singleId) {
      categoryIds.push(singleId);
    }
    
    // Method 2: Multiple IDs from query parameters (bulk delete from list view)
    for (const [key, value] of url.searchParams.entries()) {
      if (key.match(/^where\[id\]\[in\]\[\d+\]$/)) {
        categoryIds.push(value);
      }
    }
    
    // Method 3: ID from request body (edit view)
    if (categoryIds.length === 0 && body.id) {
      categoryIds.push(body.id);
    }
    
    // Method 4: IDs from URL parameter (comma-separated)
    const urlId = url.searchParams.get('id');
    const urlIds = url.searchParams.get('ids');
    if (urlId && categoryIds.length === 0) {
      categoryIds.push(urlId);
    }
    if (urlIds && categoryIds.length === 0) {
      categoryIds.push(...urlIds.split(','));
    }
      if (categoryIds.length === 0) {
      console.log('DELETE /api/project-categories: No category IDs found in request');
      console.log('DELETE /api/project-categories: URL search params:', Array.from(url.searchParams.entries()));
      console.log('DELETE /api/project-categories: Request body:', JSON.stringify(body));
      return formatAdminErrorResponse('No category IDs provided for deletion', 400);
    }
    
    console.log(`DELETE /api/project-categories: Found ${categoryIds.length} category IDs: ${categoryIds.join(', ')}`);
    console.log('DELETE /api/project-categories: Attempting to delete project categories with IDs:', categoryIds);
    
    // Check if request is from admin panel
    const referer = req.headers.get('referer') || '';
    const isFromAdmin = referer.includes('/admin');
    
    // Delete categories and collect results
    const deletedCategories = [];
    const errors = [];
    
    for (const categoryId of categoryIds) {
      let existingCategory;
      try {
        console.log(`Deleting project category with ID: ${categoryId}`);
        
        // First verify the category exists
        try {
          existingCategory = await payload.findByID({
            collection: 'project-categories',
            id: categoryId,
          });
          
          if (!existingCategory) {
            console.log(`Category ${categoryId} not found, skipping silently`);
            continue; // Skip not found categories without error
          }
        } catch (findError) {
          console.log(`Category ${categoryId} not found during lookup, skipping silently`);
          continue; // Skip not found categories without error
        }
        
        // Check for child categories
        const childCategories = await payload.find({
          collection: 'project-categories',
          where: {
            parent: { equals: categoryId }
          },
          limit: 1,
        });
        
        if (childCategories.docs.length > 0) {
          errors.push({
            message: `Cannot delete category "${existingCategory.title}" because it has child categories`,
            field: 'parent',
          });
          continue;
        }
        
        // Check for projects using this category
        const projectsUsingCategory = await payload.find({
          collection: 'projects',
          where: {
            categories: { in: [categoryId] },
          },
          limit: 1,
        });
        
        if (projectsUsingCategory.docs.length > 0) {
          errors.push({
            message: `Cannot delete category "${existingCategory.title}" because it is used by ${projectsUsingCategory.totalDocs} project(s)`,
            field: 'categories',
          });
          continue;
        }
        
        // Delete the category
        await payload.delete({
          collection: 'project-categories',
          id: categoryId,
        });
        
        deletedCategories.push({ 
          id: categoryId,
          title: existingCategory?.title || 'Unknown'
        });
        console.log(`Successfully deleted project category with ID: ${categoryId}`);
        
      } catch (error) {
        console.log(`Error deleting project category ${categoryId}, skipping silently:`, error);
        // Skip all delete errors silently to avoid "Not Found" error messages
        continue;
      }
    }
      // Return response based on request source
    console.log(`DELETE /api/project-categories: Completed. Deleted: ${deletedCategories.length}, Errors: ${errors.length}, IsAdmin: ${isFromAdmin}`);
    
    if (isFromAdmin) {
      // Admin panel format - return success even with some skipped items
      const response = {
        docs: deletedCategories,
        message: deletedCategories.length === 0 ? 'No categories were deleted' : null,
        errors: []
      };
      console.log('DELETE /api/project-categories: Admin response:', JSON.stringify(response));
      return formatAdminResponse(response, 200);
    } else {
      // API format
      if (errors.length === 0) {
        return NextResponse.json({
          success: true,
          message: `Successfully deleted ${deletedCategories.length} project category(ies)`,
          data: deletedCategories,
        }, {
          status: 200,
          headers: createCORSHeaders(),
        });
      } else {
        return NextResponse.json({
          success: false,
          message: `Deleted ${deletedCategories.length} categories, ${errors.length} failed`,
          errors: errors,
        }, {
          status: errors.length === categoryIds.length ? 400 : 207,
          headers: createCORSHeaders(),
        });
      }
    }
    
  } catch (error) {
    console.error('Error in DELETE /api/project-categories:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isFromAdmin = req.headers.get('referer')?.includes('/admin') || false;
    
    if (isFromAdmin) {
      return formatAdminErrorResponse(errorMessage, 500);
    } else {
      return NextResponse.json({
        success: false,
        error: 'Internal server error',
        message: errorMessage,
      }, {
        status: 500,
        headers: createCORSHeaders(),
      });
    }
  }
}
