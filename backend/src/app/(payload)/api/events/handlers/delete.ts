import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { createCORSHeaders, handleApiError, checkAuth } from "../../_shared/cors";

// Direct utility functions to avoid import issues
function isAdminRequest(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes('/admin');
}

async function extractEventId(req: NextRequest): Promise<string | null> {
  const url = new URL(req.url);
  let eventId = url.searchParams.get('id');
  
  // Handle admin panel complex query format: where[id][in][0]=123456
  if (!eventId) {
    for (const [key, value] of url.searchParams.entries()) {
      console.log(`Checking param: ${key} = ${value}`);
      
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
  
  // Try to extract from request body for POST/PUT requests
  if (!eventId) {
    try {
      const contentType = req.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const body = await req.text();
        if (body) {
          const parsedBody = JSON.parse(body);
          if (parsedBody.id) {
            eventId = parsedBody.id;
            console.log(`Extracted event ID from request body: ${eventId}`);
          }
        }
      }
    } catch (e) {
      console.log('Could not extract ID from request body:', e);
    }
  }
  
  console.log(`Final extracted event ID: ${eventId}`);
  return eventId;
}

function extractEventIds(req: NextRequest): string[] | null {
  const url = new URL(req.url);
  const ids = new Set<string>();
  
  // Method 1: Check comma-separated IDs param (?ids=id1,id2,id3)
  const idsParam = url.searchParams.get('ids');
  if (idsParam) {
    idsParam.split(',').map(id => id.trim()).filter(Boolean).forEach(id => ids.add(id));
  }
  
  // Method 2: Check admin panel bulk delete format (where[id][in][0]=id1&where[id][in][1]=id2)
  for (const [key, value] of url.searchParams.entries()) {
    if (key.match(/where\[id\]\[in\]\[\d+\]/) && value) {
      console.log(`Found bulk delete ID: ${key}=${value}`);
      ids.add(value);
    }
  }
  
  // Method 3: Check alternative admin panel format (where[and][0][id][in][0]=id1)
  for (const [key, value] of url.searchParams.entries()) {
    if (key.match(/where\[\w+\]\[\d+\]\[id\]\[in\]\[\d+\]/) && value) {
      console.log(`Found complex bulk delete ID: ${key}=${value}`);
      ids.add(value);
    }
  }
  
  const extractedIds = Array.from(ids);
  console.log(`Extracted ${extractedIds.length} IDs for bulk delete:`, extractedIds);
  
  return extractedIds.length > 0 ? extractedIds : null;
}

function formatApiResponse(
  data: any, 
  message: string = 'Thành công', 
  status: number = 200,
  success: boolean = true
): NextResponse {
  const headers = createCORSHeaders();
  
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    {
      status,
      headers,
    }
  );
}

function formatApiErrorResponse(
  message: string,
  data: any = null,
  status: number = 400
): NextResponse {
  const headers = createCORSHeaders();
  
  return NextResponse.json(
    {
      success: false,
      message,
      data,
    },
    {
      status,
      headers,
    }
  );
}

function formatBulkResponse(results: any[], errors: any[], message: string): NextResponse {
  const headers = createCORSHeaders();
  
  return NextResponse.json(
    {
      success: errors.length === 0,
      message,
      data: {
        results,
        errors,
        total: results.length + errors.length,
        successful: results.length,
        failed: errors.length,
      },
    },
    {
      status: errors.length === 0 ? 200 : 207, // 207 = Multi-Status
      headers,
    }
  );
}

/**
 * Delete an event or multiple events
 * 
 * DELETE /api/events?id=123456
 * DELETE /api/events?ids=123456,789012
 * 
 * Requires authentication
 */
export async function handleDELETE(req: NextRequest): Promise<NextResponse> {
  try {
    // Check if this is an admin panel request
    const adminReq = isAdminRequest(req);
    console.log("DELETE /api/events: Is admin request:", adminReq);

    // Require authentication
    const isAuthenticated = await checkAuth(req, true);
    if (!isAuthenticated) {
      return formatApiErrorResponse(
        "Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.",
        null,
        401
      );
    }    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    // Extract event IDs - Check bulk delete FIRST
    const eventIds = extractEventIds(req);
    const eventId = await extractEventId(req);
    
    const _headers = createCORSHeaders();
    
    // Handle bulk delete with multiple IDs (priority over single delete)
    if (eventIds && eventIds.length > 0) {
      console.log(`Processing bulk delete for ${eventIds.length} events:`, eventIds);
      
      // Delete multiple events
      const results = [];
      const errors = [];
      
      for (const id of eventIds) {
        try {
          const event = await payload.delete({
            collection: 'events',
            id: id,
          });
          results.push(event);
          console.log(`Successfully deleted event: ${id}`);
        } catch (err: any) {
          console.error(`Failed to delete event ${id}:`, err.message);
          errors.push({
            id,
            error: err.message
          });
        }
      }
      
      console.log(`Bulk delete completed: ${results.length} successful, ${errors.length} failed`);
      
      // Check if this is from admin panel
      if (isAdminRequest(req)) {
        const headers = createCORSHeaders();
        headers.append('X-Payload-Admin', 'true');
        headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.append('X-Payload-Refresh', 'events');
        
        // Admin panel expects specific format for bulk operations
        const adminResponse = {
          docs: results.map(event => ({ id: event.id })),
          errors: errors.map(err => ({
            message: err.error,
            field: 'id'
          })),
          message: errors.length === 0 ? null : `Đã xóa ${results.length}/${eventIds.length} sự kiện`
        };
        
        return NextResponse.json(adminResponse, { 
          status: errors.length === 0 ? 200 : 207,
          headers: headers
        });
      }
      
      return formatBulkResponse(results, errors, `Đã xóa ${results.length}/${eventIds.length} sự kiện`);
    }
    
    // Handle single delete
    if (!eventId) {
      return formatApiErrorResponse("ID sự kiện không hợp lệ", null, 400);
    }

    try {
      // Delete the event
      const event = await payload.delete({
        collection: 'events',
        id: eventId,
      });
      
      console.log(`Successfully deleted event: ${eventId}`);

      // Check if this is from admin panel
      if (adminReq) {
        // Payload CMS Admin Panel format
        const headers = createCORSHeaders();
        headers.append('X-Payload-Admin', 'true');
        headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.append('Pragma', 'no-cache');
        headers.append('Expires', '0');
        
        // Header đặc biệt để kích hoạt việc làm mới danh sách
        headers.append('X-Payload-Refresh', 'events');
        
        // Trả về CHÍNH XÁC định dạng Payload CMS mong đợi
        // Phát hiện referer để xem request đến từ list view hay edit view
        const referer = req.headers.get('referer') || '';
        const isFromListView = referer.includes('/admin/collections/events') && !referer.includes('/edit');
        
        console.log('Request referer:', referer);
        console.log('Is request from list view:', isFromListView);
        
        if (isFromListView) {
          // Format dành riêng cho list view (khác với edit view)
          const listResponse = {
            docs: [{ id: eventId }],
            errors: [],
            message: null,
          };
          console.log('Response for list view:', listResponse);
          return NextResponse.json(listResponse, { 
            status: 200,
            headers: headers
          });
        } else {
          // Format dành cho edit view (chi tiết sự kiện)
          const detailResponse = {
            message: null,
            doc: {
              id: eventId,
              status: 'deleted'
            },
            errors: [],
          };
          console.log('Response for detail view:', detailResponse);
          return NextResponse.json(detailResponse, { 
            status: 200,
            headers: headers
          });
        }
      }

      // For API clients
      return formatApiResponse(
        null,
        `Đã xóa sự kiện thành công: ${event?.title || eventId}`
      );
    } catch (err: any) {
      console.error("Delete event error:", err);
      
      if (adminReq) {
        // Trả về lỗi cho admin UI đúng định dạng
        const headers = createCORSHeaders();
        headers.append('X-Payload-Admin', 'true');
        
        return NextResponse.json({
          message: `Không thể xóa sự kiện: ${err.message || 'Lỗi không xác định'}`,
          errors: [{
            message: err.message || 'Lỗi không xác định',
            field: 'id'
          }]
        }, {
          status: 404,
          headers
        });
      }
      
      return formatApiErrorResponse(`Không thể xóa sự kiện: ${err.message || 'Lỗi không xác định'}`, null, 404);
    }
  } catch (error) {
    console.error("Events API DELETE Error:", error);
    
    // Kiểm tra nếu là admin request
    const adminReq = isAdminRequest(req);
    if (adminReq) {
      // Định dạng lỗi cho admin UI
      const headers = createCORSHeaders();
      headers.append('X-Payload-Admin', 'true');
      
      return NextResponse.json({
        message: `Lỗi khi xóa sự kiện: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        errors: [{
          message: error instanceof Error ? error.message : 'Lỗi không xác định',
          field: 'general'
        }]
      }, {
        status: 500,
        headers
      });
    }
    
    return handleApiError(error, "Lỗi khi xóa sự kiện");
  }
}
