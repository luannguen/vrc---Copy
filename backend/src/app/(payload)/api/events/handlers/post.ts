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
 * Handle POST requests to create new events
 */
export async function handlePOST(req: NextRequest): Promise<NextResponse> {
  console.log('POST /api/events: Request received');
  try {
    // Check for HTTP method override (admin interface uses this for GET requests via POST)
    const methodOverride = req.headers.get('x-http-method-override');
    console.log('POST /api/events: Method override header:', methodOverride);
    
    // If this is actually a GET request disguised as POST, delegate to GET handler
    if (methodOverride === 'GET') {
      console.log('POST /api/events: Delegating to GET handler due to method override');
      
      // Check if this is an admin request before delegating
      const adminRequest = isAdminRequest(req);
      console.log('POST /api/events: Method override from admin request:', adminRequest);
      
      const { handleGET } = await import('./get');
      return handleGET(req);
    }
    
    // Log request details for debugging
    console.log('POST /api/events: Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('POST /api/events: Is Payload Admin request:', adminRequest);
    
    // Check if this is a save operation from the admin panel
    const url = new URL(req.url);
    const isAdminSaveOperation = adminRequest && url.searchParams.has('depth');
    console.log('POST /api/events: Is admin save operation:', isAdminSaveOperation, 'URL:', req.url);

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
    let eventData: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        // Parse JSON body
        eventData = await req.json();
        console.log('POST /api/events: Parsed JSON data:', JSON.stringify(eventData));
      } else if (contentType.includes('multipart/form-data')) {
        // Handle multipart/form-data, used in admin forms
        const formData = await req.formData();
        
        // Log all form fields for debugging
        console.log('POST /api/events: FormData fields:', Array.from(formData.keys()));
        
        // Special handling for _payload field which contains the actual data as JSON string
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            try {
              const payloadString = payloadValue.toString();
              console.log('POST /api/events: _payload content:', payloadString);
              
              const payloadData = JSON.parse(payloadString);
              // Use the parsed payload as the primary data source
              eventData = { ...payloadData };
              console.log('POST /api/events: Successfully parsed _payload field:', JSON.stringify(eventData));
            } catch (jsonError) {
              console.error('POST /api/events: Error parsing _payload field:', jsonError);
            }
          }
        }
        
        // Add any other fields from the form (files or fields not in _payload)
        for (const [key, value] of formData.entries()) {
          // Skip _payload since we already processed it
          if (key === '_payload') continue;
          
          // Special handling for file uploads
          if (value instanceof File) {
            eventData[key] = value;
          } else if (key === 'categories') {
            try {
              // Parse JSON strings for relationship fields
              eventData[key] = JSON.parse(value.toString());
            } catch (_e) {
              // If not JSON, treat as simple value
              eventData[key] = value.toString();
            }
          } else {
            eventData[key] = value.toString();
          }
        }
        
        console.log('POST /api/events: Final FormData parsed:', JSON.stringify(eventData));
      } else {
        // Fallback for other content types
        const text = await req.text();
        if (text) {
          try {
            eventData = JSON.parse(text);
          } catch (_e) {
            console.error('POST /api/events: Could not parse request body as JSON');
            return formatApiErrorResponse('Định dạng dữ liệu không hợp lệ', null, 400);
          }
        }
      }
    } catch (parseError) {
      console.error('POST /api/events: Error parsing request body:', parseError);
      return formatApiErrorResponse('Lỗi phân tích dữ liệu yêu cầu', parseError, 400);
    }

    // Validate required fields based on Events collection schema
    const requiredFields = ['title', 'summary', 'content', 'startDate', 'endDate', 'location', 'organizer'];
    const missingFields: string[] = [];
    
    for (const field of requiredFields) {
      if (!eventData[field]) {
        missingFields.push(field);
      }
    }
    
    // Special validation for content field (richText)
    if (eventData.content && typeof eventData.content === 'string') {
      // Convert simple string to Lexical richText format
      eventData.content = {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: eventData.content,
                  type: "text",
                  version: 1
                }
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1
            }
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1
        }
      };
    }

    if (missingFields.length > 0) {
      console.log('POST /api/events: Missing required fields:', missingFields);
      
      if (adminRequest) {
        return NextResponse.json({
          message: 'Thiếu thông tin bắt buộc',
          errors: missingFields.map(field => ({
            message: `Field '${field}' is required`,
            field: field
          }))
        }, { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          }
        });
      }
      
      return formatApiErrorResponse(
        `Thiếu thông tin bắt buộc: ${missingFields.join(', ')}.`,
        { missingFields },
        400
      );
    }

    // Initialize Payload
    const payload = await getPayload({ config });
      try {
      // Create the event (cast to bypass strict typing since we validated required fields)
      const result = await payload.create({
        collection: 'events',
        data: eventData as any,
      });

      console.log('POST /api/events: Event created successfully:', result.id);

      // Return appropriate format based on request type
      if (adminRequest) {
        // Admin panel expects this specific format
        return formatAdminResponse(result, null);
      } else {
        // API clients get this format
        return formatApiResponse(
          result,
          'Sự kiện đã được tạo thành công',
          201
        );
      }
    } catch (createError: any) {
      console.error('POST /api/events: Database creation error:', createError);
      
      const errorMessage = createError.message || 'Lỗi khi tạo sự kiện';
      
      if (adminRequest) {
        return NextResponse.json({
          message: errorMessage,
          errors: [{ message: errorMessage, field: 'general' }]
        }, { 
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          }
        });
      }
      
      return formatApiErrorResponse(errorMessage, createError, 400);
    }
  } catch (error) {
    console.error('POST /api/events: Unexpected error:', error);
    
    const adminRequest = isAdminRequest(req);
    if (adminRequest) {
      return NextResponse.json({
        message: 'Lỗi không mong đợi khi tạo sự kiện',
        errors: [{ message: error instanceof Error ? error.message : 'Lỗi không xác định', field: 'general' }]
      }, { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': '*',
        }
      });
    }
    
    return formatApiErrorResponse(
      'Lỗi không mong đợi khi tạo sự kiện',
      error,
      500
    );
  }
}
