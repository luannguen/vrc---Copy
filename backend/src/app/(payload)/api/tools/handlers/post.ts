import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { checkAuth } from '../../_shared/cors';
import { isAdminRequest } from '../utils/requests';
import { formatAdminResponse, formatApiResponse, formatAdminErrorResponse, formatApiErrorResponse } from '../utils/responses';

/**
 * Handle POST requests to create new tools
 */
export async function handlePOST(req: NextRequest): Promise<NextResponse> {
  console.log('POST /api/tools: Request received');
  try {
    // Check for HTTP method override (admin interface uses this for GET requests via POST)
    const methodOverride = req.headers.get('x-http-method-override');
    console.log('POST /api/tools: Method override header:', methodOverride);

    // If this is actually a GET request disguised as POST, delegate to GET handler
    if (methodOverride === 'GET') {
      console.log('POST /api/tools: Delegating to GET handler due to method override');

      // Check if this is an admin request before delegating
      const adminRequest = isAdminRequest(req);
      console.log('POST /api/tools: Method override from admin request:', adminRequest);

      const { handleGET } = await import('./get');
      return handleGET(req);
    }

    // Log request details for debugging
    console.log('POST /api/tools: Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));

    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('POST /api/tools: Is Payload Admin request:', adminRequest);

    // Check if this is a save operation from the admin panel
    const url = new URL(req.url);
    const isAdminSaveOperation = adminRequest && url.searchParams.has('depth');
    console.log('POST /api/tools: Is admin save operation:', isAdminSaveOperation, 'URL:', req.url);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let toolData: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';

    try {
      if (contentType.includes('application/json')) {
        // Parse JSON body
        toolData = await req.json();
        console.log('POST /api/tools: Parsed JSON data:', JSON.stringify(toolData));
      } else if (contentType.includes('multipart/form-data')) {
        // Handle multipart/form-data, used in admin forms
        const formData = await req.formData();

        // Log all form fields for debugging
        console.log('POST /api/tools: FormData fields:', Array.from(formData.keys()));

        // Special handling for _payload field which contains the actual data as JSON string
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            try {
              const payloadString = payloadValue.toString();
              console.log('POST /api/tools: _payload content:', payloadString);

              const payloadData = JSON.parse(payloadString);
              // Use the parsed payload as the primary data source
              toolData = { ...payloadData };
              console.log('POST /api/tools: Successfully parsed _payload field:', JSON.stringify(toolData));
            } catch (jsonError) {
              console.error('POST /api/tools: Error parsing _payload field:', jsonError);
            }
          }
        }

        // Add any other fields from the form (files or fields not in _payload)
        for (const [key, value] of formData.entries()) {
          // Skip _payload since we already processed it
          if (key === '_payload') continue;

          // Special handling for file uploads
          if (value instanceof File) {
            toolData[key] = value;
          } else if (key === 'categories' || key === 'relatedTools' || key === 'related_tools') {
            try {
              // Parse JSON strings for relationship fields
              toolData[key] = JSON.parse(value.toString());
            } catch (_e) {
              // If not JSON, treat as string
              toolData[key] = value.toString();
            }
          } else {
            toolData[key] = value.toString();
          }
        }

        console.log('POST /api/tools: Final parsed FormData:', JSON.stringify(toolData));
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle URL encoded form data
        const formData = await req.formData();
        for (const [key, value] of formData.entries()) {
          toolData[key] = value.toString();
        }
        console.log('POST /api/tools: Parsed URL encoded data:', JSON.stringify(toolData));
      } else {
        // Fallback - try to parse as JSON
        try {
          toolData = await req.json();
          console.log('POST /api/tools: Fallback parsed JSON data:', JSON.stringify(toolData));
        } catch (e) {
          console.error('POST /api/tools: Error parsing request body:', e);
          return formatApiErrorResponse(
            'Dữ liệu yêu cầu không hợp lệ',
            null,
            400
          );
        }
      }
    } catch (error) {
      console.error('POST /api/tools: Error parsing request body:', error);
      return formatApiErrorResponse(
        'Lỗi phân tích dữ liệu yêu cầu',
        null,
        400
      );
    }

    console.log('POST /api/tools: Final tool data to create:', JSON.stringify(toolData, null, 2));

    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    // Validate required fields based on Tools collection schema
    const requiredFields = ['name', 'excerpt', 'description', 'toolType', 'category'];
    const missingFields = requiredFields.filter(field => !toolData[field]);

    if (missingFields.length > 0) {
      console.error('POST /api/tools: Missing required fields:', missingFields);
      const errorMessage = `Thiếu các trường bắt buộc: ${missingFields.join(', ')}`;

      if (adminRequest) {
        return formatAdminErrorResponse([{
          message: errorMessage,
          field: missingFields[0] || 'unknown'
        }], 400);
      } else {
        return formatApiErrorResponse(errorMessage, null, 400);
      }
    }

    // Create the tool
    try {
      const tool = await payload.create({
        collection: 'tools',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: toolData as any, // Type assertion to bypass payload type checking
      });

      console.log('POST /api/tools: Tool created successfully:', tool.id);

      // Format response based on request type
      if (adminRequest) {
        return formatAdminResponse(tool, 201);
      } else {
        return formatApiResponse(tool, 'Công cụ đã được tạo thành công', 201);
      }

    } catch (payloadError: unknown) {
      console.error('POST /api/tools: Payload creation error:', payloadError);

      // Cast to any for error handling
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const err = payloadError as any;

      // Handle Payload validation errors
      if (err.name === 'ValidationError' || err.message?.includes('validation')) {
        const errorMessage = err.message || 'Dữ liệu không hợp lệ';

        if (adminRequest) {
          return formatAdminErrorResponse([{
            message: errorMessage,
            field: 'general'
          }], 400);
        } else {
          return formatApiErrorResponse(errorMessage, null, 400);
        }
      }

      // Handle duplicate slug/name errors
      if (err.message?.includes('duplicate') || err.message?.includes('unique')) {
        const errorMessage = 'Tên hoặc slug công cụ đã tồn tại. Vui lòng chọn tên khác.';

        if (adminRequest) {
          return formatAdminErrorResponse([{
            message: errorMessage,
            field: 'name'
          }], 409);
        } else {
          return formatApiErrorResponse(errorMessage, null, 409);
        }
      }

      // Generic error response
      const errorMessage = 'Lỗi khi tạo công cụ';

      if (adminRequest) {
        return formatAdminErrorResponse([{
          message: errorMessage,
          field: 'general'
        }], 500);
      } else {
        return formatApiErrorResponse(errorMessage, err.message, 500);
      }
    }

  } catch (error: unknown) {
    console.error('POST /api/tools: Unexpected error:', error);

    const errorMessage = 'Lỗi server không mong muốn';
    const adminRequest = isAdminRequest(req);

    // Cast to any for error handling
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;

    if (adminRequest) {
      return formatAdminErrorResponse([{
        message: errorMessage,
        field: 'general'
      }], 500);
    } else {
      return formatApiErrorResponse(errorMessage, err.message, 500);
    }
  }
}
