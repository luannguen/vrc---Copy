import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({
      config: configPromise,
    });

    const registration = await payload.findByID({
      collection: 'event-registrations',
      id: id,
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Không tìm thấy đăng ký' },
        { status: 404 }
      );
    }

    const response = NextResponse.json({
      success: true,
      registration,
    });

    // Add cache-control headers to ensure fresh data
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('❌ Error fetching event registration:', error);

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy thông tin đăng ký.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🔄 PATCH request received for event-registrations');

  // Check if this is from the admin panel for special handling
  const referer = request.headers.get('referer') || '';
  const isAdminRequest = referer.includes('/admin');
  console.log('📋 Admin request detected:', isAdminRequest);

  try {
    const { id } = await params;
    console.log(`🔄 PATCH request for event registration ID: ${id}`);

    const payload = await getPayload({
      config: configPromise,
    });

    // Get request body with comprehensive error handling for both JSON and FormData
    let body;
    try {
      const contentType = request.headers.get('content-type') || '';
      console.log('📋 Request Content-Type:', contentType);

      if (contentType.includes('multipart/form-data')) {
        // Handle multipart form data (from Payload CMS admin)
        console.log('📋 Processing multipart form data...');
        const formData = await request.formData();
        const payloadData = formData.get('_payload');

        if (!payloadData) {
          console.log('❌ No _payload field in form data');
          return NextResponse.json(
            { error: 'No payload data found in form' },
            { status: 400 }
          );
        }

        const payloadString = payloadData.toString();
        console.log('📋 Form payload string (first 200 chars):', payloadString.substring(0, 200));

        body = JSON.parse(payloadString);
        console.log('📝 Parsed form data successfully');
      } else {
        // Handle regular JSON
        console.log('📋 Processing JSON data...');
        const rawBody = await request.text();
        console.log('📋 Raw request body type:', typeof rawBody);
        console.log('📋 Raw request body length:', rawBody?.length || 0);
        console.log('📋 Raw request body (first 200 chars):', rawBody?.substring(0, 200));

        if (!rawBody || rawBody.trim() === '') {
          console.log('❌ Empty request body detected');
          return NextResponse.json(
            { error: 'Request body is empty' },
            { status: 400 }
          );
        }

        body = JSON.parse(rawBody);
      }

      console.log('📝 Parsed body type:', typeof body);
      console.log('📝 Parsed body keys:', Object.keys(body || {}));
      console.log('📝 Parsed update data:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('❌ Body parsing error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body format' },
        { status: 400 }
      );
    }

    // Validate body is an object
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      console.log('❌ Body is not a valid object:', typeof body, Array.isArray(body));
      return NextResponse.json(
        { error: 'Request body must be a JSON object' },
        { status: 400 }
      );
    }

    // Check if registration exists
    console.log('🔍 Checking if registration exists...');
    let existingRegistration;
    try {
      existingRegistration = await payload.findByID({
        collection: 'event-registrations',
        id: id,
      });
      console.log('✅ Found existing registration:', existingRegistration?.fullName);
    } catch (findError) {
      console.error('❌ Error finding registration:', findError);
      return NextResponse.json(
        { error: 'Không tìm thấy đăng ký hoặc ID không hợp lệ' },
        { status: 404 }
      );
    }

    if (!existingRegistration) {
      console.log('❌ Registration not found for ID:', id);
      return NextResponse.json(
        { error: 'Không tìm thấy đăng ký' },
        { status: 404 }
      );
    }    // Update registration with enhanced error handling
    let updatedRegistration;
    try {
      console.log('🔄 Starting update process...');

      // Validate and sanitize the update data
      const sanitizedData: Record<string, unknown> = {};

      // Only include valid fields from the request body
      const allowedFields = [
        'fullName', 'email', 'phone', 'organization', 'jobTitle',
        'eventTitle', 'eventId', 'participationType', 'dietaryRequirements',
        'dietaryNote', 'accessibilityNeeds', 'interests', 'experience',
        'heardAbout', 'status', 'confirmationSent', 'reminderSent', 'adminNotes'
      ];

      // Safely copy allowed fields with extra validation
      allowedFields.forEach(field => {
        if (body && field in body) {
          const value = body[field];
          console.log(`📝 Processing field ${field}:`, typeof value, value);

          // Skip undefined, null, or empty string values
          if (value !== undefined && value !== null && value !== '') {
            // Extra validation for specific field types
            if (field === 'email' && typeof value === 'string' && !value.includes('@')) {
              console.log(`⚠️ Skipping invalid email: ${value}`);
              return;
            }

            sanitizedData[field] = value;
          }
        }
      });

      console.log('🧹 Sanitized update data:', JSON.stringify(sanitizedData, null, 2));

      // Ensure we have some data to update
      if (Object.keys(sanitizedData).length === 0) {
        console.log('❌ No valid data to update');
        return NextResponse.json(
          { error: 'Không có dữ liệu hợp lệ để cập nhật.' },
          { status: 400 }
        );
      }

      console.log('🚀 Calling payload.update...');
      updatedRegistration = await payload.update({
        collection: 'event-registrations',
        id: id,
        data: sanitizedData,
        depth: 0, // Prevent deep population that might cause issues
      });

      console.log(`✅ Successfully updated event registration: ${updatedRegistration.fullName} - Status: ${updatedRegistration.status}`);

    } catch (updateError) {
      console.error('❌ Payload update error details:', {
        error: updateError,
        message: updateError instanceof Error ? updateError.message : String(updateError),
        stack: updateError instanceof Error ? updateError.stack : undefined,
      });

      // More specific error handling
      const errorMessage = updateError instanceof Error ? updateError.message : String(updateError);

      if (errorMessage.includes('validation')) {
        return NextResponse.json(
          {
            error: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.',
            details: errorMessage
          },
          { status: 400 }
        );
      }

      if (errorMessage.includes('Cast to ObjectId failed')) {
        return NextResponse.json(
          { error: 'ID không hợp lệ.' },
          { status: 400 }
        );
      }

      if (errorMessage.includes('nonIterableSpread') || errorMessage.includes('spread')) {
        console.error('🔥 NonIterableSpread error detected - this is likely a Payload CMS issue');
        return NextResponse.json(
          {
            error: 'Lỗi xử lý dữ liệu nội bộ. Vui lòng thử lại hoặc liên hệ quản trị viên.',
            technical: 'NonIterableSpread error - possibly related to Payload CMS data processing'
          },
          { status: 500 }
        );
      }

      // Log the raw error for debugging
      console.error('🔥 Unhandled update error:', updateError);

      return NextResponse.json(
        {
          error: 'Có lỗi xảy ra khi cập nhật đăng ký. Vui lòng thử lại.',
          technical: errorMessage
        },
        { status: 500 }
      );
    }

    console.log('📤 Sending success response with updated data...');

    // Return data in Payload CMS compatible format
    // For Payload CMS admin interface to properly update form state,
    // we need to return the document directly without additional wrapper
    const response = NextResponse.json(updatedRegistration);

    // Always add basic cache-control headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    // Add Payload CMS admin interface specific headers for form state refresh (for admin requests)
    if (isAdminRequest) {
      console.log('🎯 Adding admin refresh headers for form state update');
      response.headers.set('X-Payload-Admin-Refresh', 'true');
      response.headers.set('X-Payload-Collection-Invalidate', 'event-registrations');
      response.headers.set('X-Force-Refresh', 'true');
      response.headers.set('X-Timestamp', Date.now().toString());
    }

    return response;

  } catch (error) {
    console.error('❌ Error updating event registration:', error);

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi cập nhật đăng ký.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payload = await getPayload({
      config: configPromise,
    });

    // Check if registration exists
    const existingRegistration = await payload.findByID({
      collection: 'event-registrations',
      id: id,
    });

    if (!existingRegistration) {
      return NextResponse.json(
        { error: 'Không tìm thấy đăng ký' },
        { status: 404 }
      );
    }

    // Delete registration
    await payload.delete({
      collection: 'event-registrations',
      id: id,
    });

    console.log(`✅ Deleted event registration: ${existingRegistration.fullName} for ${existingRegistration.eventTitle}`);

    return NextResponse.json({
      success: true,
      message: 'Xóa đăng ký thành công',
    });

  } catch (error) {
    console.error('❌ Error deleting event registration:', error);

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi xóa đăng ký.' },
      { status: 500 }
    );
  }
}
