import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { formatApiResponse, formatApiErrorResponse, formatAdminResponse, formatAdminErrorResponse } from '../utils/responses';
import { isAdminRequest, extractToolId } from '../utils/requests';

/**
 * Handle PATCH requests to update tools (partial updates)
 * This is commonly used by PayloadCMS admin panel for saving edits
 */
export async function handlePatch(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('PATCH /api/tools: Request received');

    // Initialize Payload
    const payload = await getPayload({ config });

    // Extract tool ID from request
    const toolId = await extractToolId(req);
    console.log('PATCH /api/tools: Tool ID:', toolId);

    if (!toolId) {
      console.error('PATCH /api/tools: No tool ID provided');
      return formatApiErrorResponse('ID công cụ không được cung cấp', null, 400);
    }

    // Check if this is an admin request
    const adminRequest = isAdminRequest(req);
    console.log('PATCH /api/tools: Admin request detected:', adminRequest);

    // Parse request body
    let toolData: Record<string, unknown> = {};

    try {
      const contentType = req.headers.get('content-type') || '';

      if (contentType.includes('multipart/form-data')) {
        // Handle form data (from admin panel)
        const formData = await req.formData();
        console.log('PATCH /api/tools: Processing form data');

        for (const [key, value] of formData.entries()) {
          if (key === '_payload' && typeof value === 'string') {
            // Parse the _payload field which contains the actual form data from admin panel
            try {
              const payloadData = JSON.parse(value);
              console.log('PATCH /api/tools: Parsed _payload data:', Object.keys(payloadData));
              // Merge payload data into toolData
              Object.assign(toolData, payloadData);
            } catch (payloadError) {
              console.error('PATCH /api/tools: Failed to parse _payload field:', payloadError);
            }
          } else if (['relatedTools', 'tags', 'features', 'examples', 'inputs', 'outputs'].includes(key) && typeof value === 'string') {
            try {
              toolData[key] = value ? JSON.parse(value) : [];
            } catch {
              toolData[key] = [];
            }
          } else {
            toolData[key] = value.toString();
          }
        }
      } else {
        // Handle JSON data (from API clients)
        toolData = await req.json();
        console.log('PATCH /api/tools: Processing JSON data');
      }

      console.log('PATCH /api/tools: Final parsed tool data keys:', Object.keys(toolData));

    } catch (parseError) {
      console.error('PATCH /api/tools: Error parsing request data:', parseError);
      return formatApiErrorResponse('Dữ liệu yêu cầu không hợp lệ', null, 400);
    }

    // Clean empty values for PATCH (only update non-empty fields)
    const cleanedData = Object.entries(toolData).reduce((acc, [key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);

    console.log('PATCH /api/tools: Cleaned data keys:', Object.keys(cleanedData));

    // Update the tool with partial data
    try {
      console.log('PATCH /api/tools: About to call payload.update with:', {
        collection: 'tools',
        id: toolId,
        dataKeys: Object.keys(cleanedData),
        data: cleanedData
      });

      const updatedTool = await payload.update({
        collection: 'tools',
        id: toolId,
        data: cleanedData,
      });

      console.log('✅ Tool updated successfully via PATCH:', updatedTool.id);
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
      console.error('PATCH /api/tools: Payload update error:', payloadError);
      const err = payloadError as Error & { name?: string };

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
    console.error('PATCH /api/tools: Unexpected error:', error);
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
