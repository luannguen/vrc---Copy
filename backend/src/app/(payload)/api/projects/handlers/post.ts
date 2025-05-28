import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { checkAuth } from '../../_shared/cors';
import { isAdminRequest } from '../../products/utils/requests';
import { formatAdminResponse, formatApiResponse, formatAdminErrorResponse, formatApiErrorResponse } from '../../products/utils/responses';

/**
 * Handle POST requests to create new projects
 * Following the successful Related Services pattern
 */
export async function handlePOST(req: NextRequest): Promise<NextResponse> {
  console.log('POST /api/projects: Request received');
  try {
    // Check for HTTP method override (admin interface uses this for GET requests via POST)
    const methodOverride = req.headers.get('x-http-method-override');
    console.log('POST /api/projects: Method override header:', methodOverride);
    
    // If this is actually a GET request disguised as POST, delegate to GET handler
    if (methodOverride === 'GET') {
      console.log('POST /api/projects: Delegating to GET handler due to method override');
      
      // Check if this is an admin request before delegating
      const adminRequest = isAdminRequest(req);
      console.log('POST /api/projects: Method override from admin request:', adminRequest);
      
      const { handleGET } = await import('./get');
      return handleGET(req);
    }
    
    // Log request details for debugging
    console.log('POST /api/projects: Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('POST /api/projects: Is Payload Admin request:', adminRequest);
    
    // Check if this is a save operation from the admin panel
    const url = new URL(req.url);
    const isAdminSaveOperation = adminRequest && url.searchParams.has('depth');
    console.log('POST /api/projects: Is admin save operation:', isAdminSaveOperation, 'URL:', req.url);

    // Authentication - skip for admin UI requests which handle auth differently
    // Non-admin requests require auth token
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
    
    // Parse the request body with special handling for content types
    let projectData: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        // Parse JSON body
        projectData = await req.json();
        console.log('POST /api/projects: Parsed JSON data:', JSON.stringify(projectData));
      } else if (contentType.includes('multipart/form-data')) {
        // Handle multipart/form-data, used in admin forms
        const formData = await req.formData();
        
        // Log all form fields for debugging
        console.log('POST /api/projects: FormData fields:', Array.from(formData.keys()));
        
        // Special handling for _payload field which contains the actual data as JSON string
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            try {
              const payloadString = payloadValue.toString();
              console.log('POST /api/projects: _payload content:', payloadString);
              
              const payloadData = JSON.parse(payloadString);
              // Use the parsed payload as the primary data source
              projectData = { ...payloadData };
              console.log('POST /api/projects: Successfully parsed _payload field:', JSON.stringify(projectData));
            } catch (jsonError) {
              console.error('POST /api/projects: Error parsing _payload field:', jsonError);
            }
          }
        }
        
        // Add any other fields from the form (files or fields not in _payload)
        for (const [key, value] of formData.entries()) {
          // Skip _payload since we already processed it
          if (key === '_payload') continue;
          
          // Special handling for file uploads
          if (value instanceof File) {
            projectData[key] = value;
          } else if (key === 'relatedProjects') {
            try {
              // Parse JSON strings for relationship fields
              projectData[key] = JSON.parse(value.toString());
            } catch (_e) {
              // If it's not JSON, treat as string/ID
              projectData[key] = value.toString();
            }
          } else {
            // Regular form field
            projectData[key] = value.toString();
          }
        }
        
        console.log('POST /api/projects: Final parsed FormData:', JSON.stringify(projectData));
        
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle URL-encoded data
        const text = await req.text();
        const urlParams = new URLSearchParams(text);
        
        for (const [key, value] of urlParams.entries()) {
          if (key === 'relatedProjects') {
            try {
              projectData[key] = JSON.parse(value);
            } catch (_e) {
              projectData[key] = value;
            }
          } else {
            projectData[key] = value;
          }
        }
        
        console.log('POST /api/projects: Parsed URL-encoded data:', JSON.stringify(projectData));
      } else {
        // Default to JSON parsing
        projectData = await req.json();
      }
    } catch (parseError) {
      console.error('POST /api/projects: Error parsing request body:', parseError);
      projectData = {};
    }

    // Log debug information about the data being processed
    console.log('POST /api/projects: Processing project data:', {
      title: projectData.title,
      client: projectData.client,
      hasRelatedProjects: !!projectData.relatedProjects,
      relatedProjectsType: typeof projectData.relatedProjects,
      relatedProjectsValue: projectData.relatedProjects
    });

    // Validate and normalize relatedProjects field
    if (projectData.relatedProjects !== undefined) {
      if (projectData.relatedProjects === null || projectData.relatedProjects === 0 || projectData.relatedProjects === '0') {
        // Empty or null values should be empty array
        projectData.relatedProjects = [];
        console.log('POST /api/projects: Set relatedProjects to empty array');
      } else if (!Array.isArray(projectData.relatedProjects)) {
        // Convert single values or objects to arrays
        try {
          if (typeof projectData.relatedProjects === 'string') {
            // Try to parse as JSON first
            if (projectData.relatedProjects.trim() === '') {
              projectData.relatedProjects = [];
            } else if (projectData.relatedProjects.startsWith('[')) {
              projectData.relatedProjects = JSON.parse(projectData.relatedProjects);
            } else {
              // Single ID as string
              projectData.relatedProjects = [projectData.relatedProjects];
            }
          } else if (typeof projectData.relatedProjects === 'object') {
            // Single object
            projectData.relatedProjects = [projectData.relatedProjects];
          } else {
            // Other types, make empty array
            projectData.relatedProjects = [];
          }
        } catch (error) {
          console.error('POST /api/projects: Error normalizing relatedProjects:', error);
          projectData.relatedProjects = [];
        }
      }
      console.log('POST /api/projects: Final relatedProjects:', projectData.relatedProjects);
    }

    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    // Create the project through Payload
    const newProject = await payload.create({
      collection: 'projects',
      data: projectData as any,
    });

    console.log('POST /api/projects: Project created successfully:', newProject.id);

    if (adminRequest) {
      return formatAdminResponse(newProject, 201);
    } else {
      return formatApiResponse(
        newProject,
        'Tạo dự án thành công',
        201
      );
    }

  } catch (error: any) {
    console.error('POST /api/projects: Error creating project:', error);
    
    const errorMessage = error.message || 'Có lỗi xảy ra khi tạo dự án';
    
    if (isAdminRequest(req)) {
      return formatAdminErrorResponse(errorMessage, 500);
    } else {
      return formatApiErrorResponse(errorMessage, null, 500);
    }
  }
}

// Export for both direct calls and re-export
export { handlePOST as POST };
