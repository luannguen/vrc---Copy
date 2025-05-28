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
  const adminResponse = {
    message: null,  // No message = no error
    doc: data,      // The created document
    errors: [],     // Empty errors array = success
  };
  
  return NextResponse.json(adminResponse, {
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

function formatApiResponse(data: any, message: string = 'Success', status: number = 200): NextResponse {
  return NextResponse.json({
    success: true,
    data: data,
    message: message,
  }, {
    status,
    headers: createCORSHeaders(),
  });
}

function formatApiErrorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({
    success: false,
    error: 'Validation error',
    message: message,
  }, {
    status,
    headers: createCORSHeaders(),
  });
}

/**
 * POST /api/project-categories
 * 
 * Creates a new project category
 * Supports both JSON and form-data submissions
 */
export async function handlePOST(req: NextRequest): Promise<NextResponse> {
  console.log('POST /api/project-categories: Request received');
  try {
    // Check for HTTP method override (admin interface uses this for GET requests via POST)
    const methodOverride = req.headers.get('x-http-method-override');
    console.log('POST /api/project-categories: Method override header:', methodOverride);
    
    // If this is actually a GET request disguised as POST, delegate to GET handler
    if (methodOverride === 'GET') {
      console.log('POST /api/project-categories: Delegating to GET handler due to method override');
      const { handleGET } = await import('./get');
      return handleGET(req);
    }
    
    console.log('POST /api/project-categories: Processing actual POST request');
    
    // Initialize Payload
    const payload = await getPayload({ config });    // Check if this is an admin panel request
    const referer = req.headers.get('referer') || '';
    const isAdminReq = referer.includes('/admin');
    console.log('POST /api/project-categories: Is admin request:', isAdminReq);
    console.log('POST /api/project-categories: Request URL:', req.url);
    console.log('POST /api/project-categories: Content-Type:', req.headers.get('content-type'));
    
    // Authentication check - admin requests handle auth differently
    if (!isAdminReq) {
      const authResult = await checkAuth(req, true); // true = required auth
      if (!authResult) {
        console.log('Authentication failed for project categories creation');
        return NextResponse.json(
          { error: 'Authentication required' },
          { 
            status: 401,
            headers: createCORSHeaders(),
          }
        );
      }
    }
      // Parse request body with comprehensive logging
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';
    console.log('POST /api/project-categories: Content-Type:', contentType);
    
    try {
      if (contentType.includes('application/json')) {
        body = await req.json();
        console.log('POST /api/project-categories: Parsed JSON data:', JSON.stringify(body, null, 2));
      } else if (contentType.includes('multipart/form-data')) {
        // Handle multipart/form-data, used in admin forms
        const formData = await req.formData();
        console.log('POST /api/project-categories: FormData fields:', Array.from(formData.keys()));
        
        // Special handling for _payload field which contains the actual data as JSON string
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            try {
              const payloadString = payloadValue.toString();
              console.log('POST /api/project-categories: _payload content:', payloadString);
              
              const payloadData = JSON.parse(payloadString);
              // Use the parsed payload as the primary data source
              body = { ...payloadData };
              console.log('POST /api/project-categories: Successfully parsed _payload field');
            } catch (jsonError) {
              console.error('POST /api/project-categories: Error parsing _payload field:', jsonError);
            }
          }
        }
        
        // Add any other fields from the form (files or fields not in _payload)
        for (const [key, value] of formData.entries()) {
          // Skip _payload since we already processed it
          if (key === '_payload') continue;
          
          // Special handling for file uploads
          if (value instanceof File) {
            body[key] = value;
          } else {
            body[key] = value.toString();
          }
        }
        
        console.log('POST /api/project-categories: Final FormData parsed:', JSON.stringify(body));
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle URL-encoded data
        const formData = await req.formData();
        for (const [key, value] of formData.entries()) {
          body[key] = value.toString();
        }
        console.log('POST /api/project-categories: Parsed URL-encoded data:', JSON.stringify(body));
      } else {
        // Default to JSON parsing
        body = await req.json();
        console.log('POST /api/project-categories: Default JSON parse:', JSON.stringify(body));
      }
    } catch (parseError) {
      console.error('POST /api/project-categories: Error parsing request body:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Invalid request format',
        message: 'Could not parse request body',
      }, {
        status: 400,
        headers: createCORSHeaders(),
      });
    }
      console.log('POST /api/project-categories: Final data to be created:', JSON.stringify(body, null, 2));
      // Validate required fields
    if (!body.title) {
      console.log('POST /api/project-categories: Missing required title field');
      
      if (isAdminReq) {
        return formatAdminErrorResponse('Title is required', 400);
      } else {
        return formatApiErrorResponse('Title is required', 400);
      }
    }
    
    // Process parent relationship if provided
    if (body.parent && typeof body.parent === 'object') {
      if (body.parent.value) {
        body.parent = body.parent.value;
      } else if (body.parent.relationTo && body.parent.value) {
        body.parent = body.parent.value;
      }
    }
    
    // Process featured image if provided
    if (body.featuredImage && typeof body.featuredImage === 'object') {
      if (body.featuredImage.value) {
        body.featuredImage = body.featuredImage.value;
      }
    }    // Create the category  
    const result = await payload.create({
      collection: 'project-categories',
      data: body,
      depth: 2,
    });    console.log(`Successfully created project category with ID: ${result.id}`);
    
    // Return appropriate response format based on request source
    if (isAdminReq) {
      return formatAdminResponse(result, 201);
    } else {
      return formatApiResponse(result, 'Project category created successfully', 201);
    }
    
  } catch (error) {
    console.error('Error in POST /api/project-categories:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const isAdminReq = req.headers.get('referer')?.includes('/admin') || false;
    
    if (isAdminReq) {
      return formatAdminErrorResponse(errorMessage, 500);
    } else {
      return formatApiErrorResponse(errorMessage, 500);
    }
  }
}
