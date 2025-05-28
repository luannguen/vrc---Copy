import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders } from '../../_shared/cors';

// Direct utility functions to avoid import issues
function isAdminRequest(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes('/admin');
}

// Enhanced ID extraction to support both regular and admin panel bulk delete formats
function extractTechnologyIds(req: NextRequest): string[] {
  const url = new URL(req.url);
  const ids = new Set<string>();
  
  // Method 1: Simple comma-separated ?ids=id1,id2,id3
  const idsParam = url.searchParams.get('ids');
  if (idsParam) {
    idsParam.split(',').forEach(id => ids.add(id.trim()));
  }
  
  // Method 2: Admin panel bulk delete format where[id][in][0]=id1&where[id][in][1]=id2
  for (const [key, value] of url.searchParams.entries()) {
    if (key.match(/where\[id\]\[in\]\[\d+\]/) && value) {
      ids.add(value);
    }
  }
  
  return Array.from(ids);
}

// Extract single technology ID for single delete operations
async function extractTechnologyId(req: NextRequest): Promise<string | null> {
  const url = new URL(req.url);
  
  // Method 1: Extract from URL path (for individual delete from detail page)
  const pathParts = url.pathname.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart && lastPart !== 'technologies' && lastPart.length === 24) {
    return lastPart;
  }
  
  // Method 2: Check query parameter
  const idParam = url.searchParams.get('id');
  if (idParam) return idParam;
  
  // Method 3: Check for JSON body with id
  try {
    const body = await req.clone().json();
    if (body?.id) return body.id;
  } catch {
    // Not JSON or no body
  }
  
  return null;
}

/**
 * Handle DELETE requests to remove technologies
 * Supports both single and bulk deletion operations
 */
export async function handleDELETE(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('DELETE /api/technologies: Processing delete request');
    console.log('DELETE /api/technologies: URL:', req.url);
    console.log('DELETE /api/technologies: Method:', req.method);
    
    const headers = createCORSHeaders();
    const referer = req.headers.get('referer') || '';
    const adminRequest = isAdminRequest(req);
    
    console.log('DELETE /api/technologies: Admin request:', adminRequest);
    console.log('DELETE /api/technologies: Referer:', referer);
    
    // Get Payload instance using the new import pattern
    const payload = await getPayload({ config });
    
    // Extract technology IDs for deletion
    const bulkIds = extractTechnologyIds(req);
    const singleId = await extractTechnologyId(req);
    
    console.log('DELETE /api/technologies: Bulk IDs:', bulkIds);
    console.log('DELETE /api/technologies: Single ID:', singleId);
    
    // Combine all IDs
    const technologyIds = [...bulkIds];
    if (singleId && !technologyIds.includes(singleId)) {
      technologyIds.push(singleId);
    }
    
    console.log('DELETE /api/technologies: Final IDs to delete:', technologyIds);
    
    if (technologyIds.length === 0) {
      console.log('DELETE /api/technologies: No valid IDs provided');
      return NextResponse.json({
        message: 'No technology IDs provided for deletion',
        errors: ['No valid technology IDs found in request']
      }, { 
        status: 400,
        headers: headers
      });
    }
    
    // Process deletions
    const deletedTechnologies = [];
    const errors = [];
    
    for (const technologyId of technologyIds) {
      try {
        console.log(`DELETE /api/technologies: Deleting technology ${technologyId}`);
        
        await payload.delete({
          collection: 'technologies',
          id: technologyId,
        });
        
        deletedTechnologies.push({ id: technologyId });
        console.log(`DELETE /api/technologies: Successfully deleted technology ${technologyId}`);
        
      } catch (error: any) {
        console.error(`DELETE /api/technologies: Failed to delete technology ${technologyId}:`, error);
        errors.push({
          message: `Failed to delete technology ${technologyId}: ${error.message}`,
          field: 'id',
        });
      }
    }
    
    // Detect if this is from list view vs edit view for proper response format
    const isFromListView = referer.includes('/admin/collections/technologies') && !referer.includes('/edit');
    
    console.log('DELETE /api/technologies: Is from list view:', isFromListView);
    console.log('DELETE /api/technologies: Deleted technologies:', deletedTechnologies.length);
    console.log('DELETE /api/technologies: Errors:', errors.length);
    
    // Return appropriate response format based on request source
    if (isFromListView) {
      // List view expects this format for bulk operations
      return NextResponse.json({
        docs: deletedTechnologies,
        errors: errors,
        message: null,
      }, { 
        status: 200,
        headers: headers
      });
    } else {
      // Edit view expects this format for single operations
      return NextResponse.json({
        message: null,
        doc: {
          id: technologyIds[0],
          status: 'deleted'
        },
        errors: errors,
      }, { 
        status: 200,
        headers: headers
      });
    }
    
  } catch (error: any) {
    console.error('DELETE /api/technologies: Unexpected error:', error);
    
    const headers = createCORSHeaders();
    return NextResponse.json({
      message: 'Failed to delete technology',
      errors: [error.message || 'Unknown error occurred'],
    }, { 
      status: 500,
      headers: headers
    });
  }
}
