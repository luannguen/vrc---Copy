import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { formatApiResponse, formatApiErrorResponse, formatAdminResponse, formatAdminErrorResponse } from '../utils/responses';
import { isAdminRequest, extractToolId } from '../utils/requests';

/**
 * Handle PUT requests to update tools (full updates)
 * PayloadCMS admin panel typically uses PUT for saving edits
 */
export async function handlePUT(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('PUT /api/tools: Request received');

    // Initialize Payload
    const payload = await getPayload({ config });

    // Extract tool ID from request
    const toolId = await extractToolId(req);
    console.log('PUT /api/tools: Tool ID:', toolId);

    if (!toolId) {
      console.error('PUT /api/tools: No tool ID provided');
      return formatApiErrorResponse('ID công cụ không được cung cấp', null, 400);
    }

    // Check if this is an admin request
    const adminRequest = isAdminRequest(req);
    console.log('PUT /api/tools: Admin request detected:', adminRequest);

    // Parse request body
    let toolData: Record<string, unknown> = {};

    try {
      const contentType = req.headers.get('content-type') || '';
      console.log('PUT /api/tools: Content-Type:', contentType);

      if (contentType.includes('multipart/form-data')) {
        // Handle form data (from admin panel)
        const formData = await req.formData();
        console.log('PUT /api/tools: Processing form data, entries:', formData.keys());

        for (const [key, value] of formData.entries()) {
          console.log(`PUT /api/tools: Processing field ${key}:`, typeof value, value);

          if (key === '_payload' && typeof value === 'string') {
            // Parse the _payload field which contains the actual form data from admin panel
            try {
              const payloadData = JSON.parse(value);
              console.log('PUT /api/tools: Parsed _payload data:', Object.keys(payloadData));
              // Merge payload data into toolData
              Object.assign(toolData, payloadData);
            } catch (payloadError) {
              console.error('PUT /api/tools: Failed to parse _payload field:', payloadError);
            }
          } else if (['relatedTools', 'tags', 'features', 'examples', 'inputs', 'outputs'].includes(key) && typeof value === 'string') {
            try {
              toolData[key] = value ? JSON.parse(value) : [];
            } catch (_jsonError) {
              console.warn(`PUT /api/tools: Failed to parse JSON for ${key}:`, value);
              toolData[key] = [];
            }
          } else if (typeof value === 'string') {
            toolData[key] = value;
          } else {
            // Handle File objects or other types
            toolData[key] = value;
          }
        }
      } else {
        // Handle JSON data (from API clients)
        toolData = await req.json();
        console.log('PUT /api/tools: Processing JSON data');
      }

      console.log('PUT /api/tools: Final parsed tool data keys:', Object.keys(toolData));
      console.log('PUT /api/tools: Tool data values:', toolData);

    } catch (parseError) {
      console.error('PUT /api/tools: Error parsing request data:', parseError);
      return formatApiErrorResponse('Dữ liệu yêu cầu không hợp lệ', parseError instanceof Error ? parseError.message : String(parseError), 400);
    }

    // For PUT, we don't clean empty values (it's a full replacement)
    console.log('PUT /api/tools: Data to update:', Object.keys(toolData));

    // Update the tool
    try {
      console.log('PUT /api/tools: About to call payload.update with:', {
        collection: 'tools',
        id: toolId,
        dataKeys: Object.keys(toolData),
        data: toolData
      });

      const updatedTool = await payload.update({
        collection: 'tools',
        id: toolId,
        data: toolData,
      });

      console.log('✅ Tool updated successfully via PUT:', updatedTool.id);
      console.log('✅ Updated tool data:', JSON.stringify(updatedTool, null, 2));

      // Verify the update by reading it back
      try {
        const verifyTool = await payload.findByID({
          collection: 'tools',
          id: toolId,
        });
        console.log('🔍 Verification - Tool from database:', JSON.stringify(verifyTool, null, 2));
      } catch (verifyError) {
        console.error('🚨 Failed to verify tool update:', verifyError);
      }

      // Return appropriate response format
      if (adminRequest) {
        return formatAdminResponse(updatedTool);
      } else {
        return formatApiResponse(updatedTool, 'Công cụ đã được cập nhật thành công');
      }

    } catch (payloadError: unknown) {
      console.error('PUT /api/tools: Payload update error:', payloadError);
      const err = payloadError as Error & { name?: string };

      // Log the full error for debugging
      console.error('PUT /api/tools: Full error details:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });

      // Handle validation errors
      if (err.name === 'ValidationError' || err.message?.includes('validation')) {
        const errorMessage = err.message || 'Dữ liệu không hợp lệ';
        if (adminRequest) {
          return formatAdminErrorResponse([{ message: errorMessage, field: 'general' }], 400);
        } else {
          return formatApiErrorResponse(errorMessage, null, 400);
        }
      }

      // Handle duplicate errors
      if (err.message?.includes('duplicate') || err.message?.includes('unique')) {
        const errorMessage = 'Tên hoặc slug công cụ đã tồn tại. Vui lòng chọn tên khác.';
        if (adminRequest) {
          return formatAdminErrorResponse([{ message: errorMessage, field: 'name' }], 409);
        } else {
          return formatApiErrorResponse(errorMessage, null, 409);
        }
      }

      // Generic error handling
      const errorMessage = 'Lỗi khi cập nhật công cụ';
      if (adminRequest) {
        return formatAdminErrorResponse([{ message: errorMessage, field: 'general' }], 500);
      } else {
        return formatApiErrorResponse(errorMessage, err.message, 500);
      }
    }

  } catch (error: unknown) {
    console.error('PUT /api/tools: Unexpected error:', error);
    const errorMessage = 'Lỗi server không mong muốn';
    const adminRequest = isAdminRequest(req);
    const err = error as Error;

    if (adminRequest) {
      return formatAdminErrorResponse([{ message: errorMessage, field: 'general' }], 500);
    } else {
      return formatApiErrorResponse(errorMessage, err.message, 500);
    }
  }
}
