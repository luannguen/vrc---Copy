import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { checkAuth } from '../../_shared/cors';
import { isAdminRequest } from '../../products/utils/requests';
import { formatAdminResponse, formatApiResponse, formatAdminErrorResponse, formatApiErrorResponse } from '../../products/utils/responses';

/**
 * Handle POST requests to create new technologies
 */
export async function handlePOST(req: NextRequest): Promise<NextResponse> {
  console.log('POST /api/technologies: Request received');
  try {
    // Check for HTTP method override (admin interface uses this for GET requests via POST)
    const methodOverride = req.headers.get('x-http-method-override');
    console.log('POST /api/technologies: Method override header:', methodOverride);
    
    // If this is actually a GET request disguised as POST, delegate to GET handler
    if (methodOverride === 'GET') {
      console.log('POST /api/technologies: Delegating to GET handler due to method override');
      
      // Check if this is an admin request before delegating
      const adminRequest = isAdminRequest(req);
      console.log('POST /api/technologies: Method override from admin request:', adminRequest);
      
      const { handleGET } = await import('./get');
      return handleGET(req);
    }
    
    // Log request details for debugging
    console.log('POST /api/technologies: Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('POST /api/technologies: Is Payload Admin request:', adminRequest);
    
    // Check if this is a save operation from the admin panel
    const url = new URL(req.url);
    const isAdminSaveOperation = adminRequest && url.searchParams.has('depth');
    console.log('POST /api/technologies: Is admin save operation:', isAdminSaveOperation, 'URL:', req.url);

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
    let technologyData: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        // Parse JSON body
        technologyData = await req.json();
        console.log('POST /api/technologies: Parsed JSON data:', JSON.stringify(technologyData));
      } else if (contentType.includes('multipart/form-data')) {
        // Handle multipart/form-data, used in admin forms
        const formData = await req.formData();
        
        // Log all form fields for debugging
        console.log('POST /api/technologies: FormData fields:', Array.from(formData.keys()));
        
        // Special handling for _payload field which contains the actual data as JSON string
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            try {
              const payloadString = payloadValue.toString();
              console.log('POST /api/technologies: _payload content:', payloadString);
              
              const payloadData = JSON.parse(payloadString);
              // Use the parsed payload as the primary data source
              technologyData = { ...payloadData };
              console.log('POST /api/technologies: Successfully parsed _payload field:', JSON.stringify(technologyData));
            } catch (jsonError) {
              console.error('POST /api/technologies: Error parsing _payload field:', jsonError);
            }
          }
        }
        
        // Add any other fields from the form (files or fields not in _payload)
        for (const [key, value] of formData.entries()) {
          // Skip _payload since we already processed it
          if (key === '_payload') continue;
          
          // Special handling for file uploads
          if (value instanceof File) {
            technologyData[key] = value;
          } else if (key === 'relatedProducts') {
            try {
              // Parse JSON strings for relationship fields
              technologyData[key] = JSON.parse(value.toString());
            } catch (parseError) {
              console.error(`POST /api/technologies: Error parsing ${key}:`, parseError);
              technologyData[key] = value.toString();
            }
          } else {
            technologyData[key] = value.toString();
          }
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle URL-encoded data
        const formData = await req.formData();
        for (const [key, value] of formData.entries()) {
          technologyData[key] = value.toString();
        }
        console.log('POST /api/technologies: Parsed URL-encoded data:', JSON.stringify(technologyData));
      }
    } catch (parseError) {
      console.error('POST /api/technologies: Error parsing request body:', parseError);
      return formatApiErrorResponse(
        'Invalid request body format',
        { body: parseError },
        400
      );
    }

    // Basic data validation
    if (!technologyData.name || typeof technologyData.name !== 'string' || technologyData.name.trim() === '') {
      console.error('POST /api/technologies: Name is required');
      return formatApiErrorResponse(
        'Name is required',
        { name: 'Name field is required and cannot be empty' },
        400
      );
    }

    if (!technologyData.type || typeof technologyData.type !== 'string' || technologyData.type.trim() === '') {
      console.error('POST /api/technologies: Type is required');
      return formatApiErrorResponse(
        'Type is required',
        { type: 'Type field is required' },
        400
      );
    }

    // Validate logo field (make sure it's a valid ObjectId if provided)
    if (technologyData.logo) {
      const logoValue = typeof technologyData.logo === 'string' ? technologyData.logo : technologyData.logo?.toString();
      if (logoValue && logoValue.length !== 24) {
        console.error('POST /api/technologies: Invalid logo ObjectId format');
        return formatApiErrorResponse(
          'Invalid logo format',
          { logo: 'Logo must be a valid ObjectId' },
          400
        );
      }
    }

    // Auto-generate slug if not provided
    if (!technologyData.slug) {
      technologyData.slug = technologyData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      console.log('POST /api/technologies: Auto-generated slug:', technologyData.slug);
    }

    // Get Payload instance
    const payload = await getPayload({ config });    // Create the technology
    console.log('POST /api/technologies: Creating technology with data:', JSON.stringify(technologyData));
    const newTechnology = await payload.create({
      collection: 'technologies',
      data: technologyData as any,
    });

    console.log('POST /api/technologies: Technology created successfully:', newTechnology.id);    // Return appropriate response format based on request source
    if (adminRequest || isAdminSaveOperation) {
      return formatAdminResponse(newTechnology, 201);
    } else {
      return formatApiResponse(newTechnology, 'Technology created successfully', 201);
    }

  } catch (error: any) {
    console.error('POST /api/technologies: Error creating technology:', error);
    
    // Handle Payload validation errors
    if (error.name === 'ValidationError' || error.errors) {
      return formatApiErrorResponse(
        'Validation failed',
        error.errors || error.message,
        400
      );
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return formatApiErrorResponse(
        'Technology with this name or slug already exists',
        { duplicate: error.keyValue },
        409
      );
    }

    // Handle other errors
    return formatApiErrorResponse(
      'Internal server error',
      process.env.NODE_ENV === 'development' ? error.stack : null,
      500
    );
  }
}
