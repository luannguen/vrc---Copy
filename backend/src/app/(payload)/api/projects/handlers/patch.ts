import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';
import { 
  formatAdminResponse, 
  formatAdminErrorResponse, 
  formatApiResponse,
  isAdminRequest,
  preprocessRelationshipField 
} from '../utils/responses';

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    const isAdmin = isAdminRequest(req);
    
    // Extract project ID from URL
    const url = new URL(req.url);
    const projectId = url.searchParams.get('id');
    
    if (!projectId) {
      return formatAdminErrorResponse('Project ID is required', 400);
    }

    // Parse request body
    const body = await req.json();
    
    // Preprocess related projects field if present
    if (body.relatedProjects) {
      body.relatedProjects = preprocessRelationshipField(body.relatedProjects);
    }

    // Partially update project in Payload
    const result = await payload.update({
      collection: 'projects',
      id: projectId,
      data: body,
    });

    // Format response
    if (isAdmin) {
      return formatAdminResponse({
        message: null,
        doc: result,
        errors: []
      });
    } else {
      return formatApiResponse(result, 'Cập nhật dự án thành công');
    }

  } catch (error: any) {
    console.error('Error in projects PATCH handler:', error);
    
    const errorMessage = error.message || 'Có lỗi xảy ra khi cập nhật dự án';
    return formatAdminErrorResponse(errorMessage, 500);
  }
}
