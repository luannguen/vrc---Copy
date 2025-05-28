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

async function extractEventId(req: NextRequest): Promise<string | null> {
  const url = new URL(req.url);
  let eventId = url.searchParams.get('id');
  
  // Handle admin panel complex query format: where[id][in][0]=123456
  if (!eventId) {
    for (const [key, value] of url.searchParams.entries()) {
      console.log(`PATCH extracting ID from param: ${key} = ${value}`);
      
      // Check for where[id][in][0] format
      if (key.includes('where') && key.includes('id') && key.includes('in')) {
        eventId = value;
        console.log(`Extracted event ID from admin query: ${eventId}`);
        break;
      }
      
      // Check for direct id patterns in key names
      if (key.includes('id') && key.includes('in')) {
        eventId = value;
        console.log(`Extracted event ID from pattern: ${eventId}`);
        break;
      }
    }
  }
  
  console.log(`Final extracted event ID for PATCH: ${eventId}`);
  return eventId;
}

/**
 * Handle PATCH requests to update events
 * 
 * PATCH /api/events?id=123456
 * 
 * Requires authentication
 */
export async function handlePATCH(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('PATCH /api/events: Request received');
    
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('PATCH /api/events: Is admin request:', adminRequest);

    // Require authentication
    const isAuthenticated = await checkAuth(req, true);
    if (!isAuthenticated) {
      console.log('PATCH /api/events: Authentication failed');
      return formatApiErrorResponse(
        "Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.",
        null,
        401
      );
    }

    // Extract event ID
    const eventId = await extractEventId(req);
    if (!eventId) {
      return formatApiErrorResponse("ID sự kiện không hợp lệ", null, 400);
    }

    // Parse request body
    let eventData: any = {};
    try {
      const contentType = req.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        eventData = await req.json();
      } else if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
        // Handle form data (from admin panel)
        const formData = await req.formData();
        const payloadField = formData.get('_payload');
        
        if (payloadField && typeof payloadField === 'string') {
          try {
            eventData = JSON.parse(payloadField);
            console.log('PATCH /api/events: Parsed form data from _payload field');
          } catch (e) {
            console.error('PATCH /api/events: Could not parse _payload field as JSON');
            return formatApiErrorResponse('Định dạng dữ liệu không hợp lệ', null, 400);
          }
        } else {
          // Parse regular form fields
          for (const [key, value] of formData.entries()) {
            if (key !== '_payload') {
              eventData[key] = value;
            }
          }
        }
      } else {
        const body = await req.text();
        if (body) {
          try {
            eventData = JSON.parse(body);
          } catch (e) {
            console.error('PATCH /api/events: Could not parse request body as JSON');
            return formatApiErrorResponse('Định dạng dữ liệu không hợp lệ', null, 400);
          }
        }
      }
    } catch (parseError) {
      console.error('PATCH /api/events: Error parsing request body:', parseError);
      return formatApiErrorResponse('Lỗi phân tích dữ liệu yêu cầu', parseError, 400);
    }

    console.log('PATCH /api/events: Event data to update:', JSON.stringify(eventData, null, 2));

    // Handle content field conversion if needed
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

    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    // Update the event
    try {
      const result = await payload.update({
        collection: 'events',
        id: eventId,
        data: eventData,
      });

      console.log('PATCH /api/events: Event updated successfully:', result.id);

      // Return appropriate format based on request type
      if (adminRequest) {
        // Admin panel expects this specific format
        return formatAdminResponse(result, null);
      } else {
        // API clients get this format
        return formatApiResponse(
          result,
          `Đã cập nhật sự kiện thành công: ${result.title}`
        );
      }
    } catch (updateError: any) {
      console.error('PATCH /api/events: Update error:', updateError);
      
      if (adminRequest) {
        // Return error in admin format
        const headers = createCORSHeaders();
        headers.append('X-Payload-Admin', 'true');
        
        return NextResponse.json({
          message: `Không thể cập nhật sự kiện: ${updateError.message || 'Lỗi không xác định'}`,
          errors: [
            {
              message: updateError.message || 'Lỗi không xác định',
              field: 'general'
            }
          ]
        }, {
          status: 400,
          headers
        });
      }
      
      return formatApiErrorResponse(
        `Không thể cập nhật sự kiện: ${updateError.message || 'Lỗi không xác định'}`,
        updateError,
        400
      );
    }
  } catch (error) {
    console.error("Events API PATCH Error:", error);
    
    // Check if this is an admin request
    const adminRequest = isAdminRequest(req);
    if (adminRequest) {
      // Format error for admin UI
      const headers = createCORSHeaders();
      headers.append('X-Payload-Admin', 'true');
      
      return NextResponse.json({
        message: `Lỗi khi cập nhật sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        errors: [{
          message: error instanceof Error ? error.message : 'Lỗi không xác định',
          field: 'general'
        }]
      }, {
        status: 500,
        headers
      });
    }
    
    return formatApiErrorResponse(
      'Lỗi khi cập nhật sự kiện. Vui lòng thử lại.',
      error instanceof Error ? error.message : 'Lỗi không xác định',
      500
    );
  }
}
