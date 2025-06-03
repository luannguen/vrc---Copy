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
  try {
    const { id } = await params;
    const payload = await getPayload({
      config: configPromise,
    });

    // Parse request body - handle different content types from Payload admin
    let body;
    const contentType = request.headers.get('content-type') || '';

    console.log('🔍 PATCH request content type:', contentType);

    try {
      if (contentType.includes('multipart/form-data')) {
        // Handle multipart form data from Payload admin interface
        const formData = await request.formData();
        const payloadData = formData.get('_payload');

        if (payloadData) {
          body = JSON.parse(payloadData.toString());
          console.log('📝 Parsed multipart form data successfully');
        } else {
          throw new Error('No _payload field in form data');
        }
      } else {
        // Handle JSON or text data
        const rawBody = await request.text();
        console.log('📝 Raw body received:', rawBody.substring(0, 200));

        if (!rawBody || rawBody.trim() === '') {
          throw new Error('Empty request body');
        }

        body = JSON.parse(rawBody);
        console.log('📝 Parsed JSON data successfully');
      }
    } catch (parseError) {
      console.error('❌ Body parsing error:', parseError);
      return NextResponse.json(
        {
          message: 'Invalid request body format.',
          errors: [{ message: 'Unable to parse request data' }]
        },
        { status: 400 }
      );
    }

    console.log('📝 Update data received:', Object.keys(body || {}));

    // Use Payload's standard update method - this is the key!
    // Let Payload handle all the validation, hooks, etc.
    const updatedRegistration = await payload.update({
      collection: 'event-registrations',
      id: id,
      data: body,
      depth: 2, // Standard depth for admin interface
    });

    console.log('✅ Successfully updated registration:', updatedRegistration.fullName);

    // Return in the exact format that Payload admin UI expects
    // This format is crucial for proper form state refresh
    return NextResponse.json({
      message: 'Updated successfully.',
      doc: updatedRegistration,
    });

  } catch (error) {
    console.error('❌ Error updating event registration:', error);

    return NextResponse.json(
      {
        message: 'Error updating registration.',
        errors: [
          {
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          }
        ]
      },
      { status: 400 }
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
