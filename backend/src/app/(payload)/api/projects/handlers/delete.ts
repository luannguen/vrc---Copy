import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { 
  formatAdminResponse, 
  formatAdminErrorResponse, 
  formatApiResponse,
  isAdminRequest,
  isListViewRequest 
} from '../utils/responses';

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config });
    const isAdmin = isAdminRequest(req);
    
    // Extract project IDs from URL parameters
    const url = new URL(req.url);
    let projectIds: string[] = [];
    
    // Single ID from direct parameter
    const singleId = url.searchParams.get('id');
    if (singleId) {
      projectIds = [singleId];
    }
    
    // Multiple IDs from admin panel where[id][in][0], where[id][in][1], etc.
    if (projectIds.length === 0) {
      const allParams = Array.from(url.searchParams.entries());
      const whereIdParams = allParams.filter(([key]) => key.match(/where\[id\]\[in\]\[\d+\]/));
      
      if (whereIdParams.length > 0) {
        projectIds = whereIdParams.map(([_, value]) => value).filter(Boolean);
        console.log(`Extracted ${projectIds.length} project IDs from admin bulk delete:`, projectIds);
      }
    }
    
    // If no IDs in URL, try to get from request body (edit view)
    if (projectIds.length === 0) {
      try {
        const body = await req.json();
        if (body.id) {
          projectIds = [body.id];
        } else if (body.ids && Array.isArray(body.ids)) {
          projectIds = body.ids;
        }
      } catch (e) {
        // No body or invalid JSON, continue without
      }
    }
    
    if (projectIds.length === 0) {
      return formatAdminErrorResponse('Project ID is required', 400);
    }

    console.log(`Deleting ${projectIds.length} project(s):`, projectIds);

    // Delete projects (handle both single and bulk deletion)
    const deletedProjects = [];
    const errors = [];
    
    for (const projectId of projectIds) {
      try {
        await payload.delete({
          collection: 'projects',
          id: projectId,
        });
        deletedProjects.push({ id: projectId });
        console.log(`Successfully deleted project: ${projectId}`);      } catch (error: any) {
        console.error(`Failed to delete project ${projectId}:`, error);
        errors.push({
          id: projectId,
          message: `Failed to delete project: ${error?.message || 'Unknown error'}`
        });
      }
    }    // Format response based on context and number of deleted projects
    if (isAdmin) {
      const isFromListView = isListViewRequest(req, 'projects');
      
      if (isFromListView) {
        // Format for list view - return all deleted projects
        return formatAdminResponse({
          docs: deletedProjects,
          errors: errors,
          message: errors.length > 0 ? `Deleted ${deletedProjects.length} projects with ${errors.length} errors` : null,
        });
      } else {
        // Format for edit view - return single project (first one if multiple)
        const firstDeleted = deletedProjects[0];
        return formatAdminResponse({
          message: errors.length > 0 ? `Deleted with ${errors.length} errors` : null,
          doc: firstDeleted ? {
            id: firstDeleted.id,
            status: 'deleted'
          } : null,
          errors: errors,
        });
      }
    } else {
      // API format for external requests
      return formatApiResponse({ 
        deletedProjects, 
        errors,
        count: deletedProjects.length 
      }, `Xóa thành công ${deletedProjects.length} dự án`);
    }

  } catch (error: any) {
    console.error('Error in projects DELETE handler:', error);
    
    const errorMessage = error.message || 'Có lỗi xảy ra khi xóa dự án';
    return formatAdminErrorResponse(errorMessage, 500);
  }
}
