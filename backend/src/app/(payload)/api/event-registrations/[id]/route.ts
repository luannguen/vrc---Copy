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

    return NextResponse.json({
      success: true,
      registration,
    });

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

    const body = await request.json();

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

    // Update registration
    const updatedRegistration = await payload.update({
      collection: 'event-registrations',
      id: id,
      data: body,
    });

    console.log(`✅ Updated event registration: ${updatedRegistration.fullName} - Status: ${updatedRegistration.status}`);

    return NextResponse.json({
      success: true,
      message: 'Cập nhật thông tin đăng ký thành công',
      registration: updatedRegistration,
    });

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
