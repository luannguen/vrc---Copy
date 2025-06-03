import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'eventTitle', 'participationType'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Thiếu thông tin bắt buộc: ${field}` },
          {
            status: 400,
            headers: CORS_HEADERS,
          }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    // Check if event exists (optional validation)
    // Skip event validation for external event IDs or testing
    // if (body.eventId) {
    //   try {
    //     const event = await payload.findByID({
    //       collection: 'events',
    //       id: body.eventId,
    //     });
    //   } catch (error) {
    //     // Event not found in local database, but we'll allow external event IDs
    //     console.log(`Event ${body.eventId} not found in local database, proceeding with external ID`);
    //   }
    // }

    // Check for duplicate registration
    const existingRegistration = await payload.find({
      collection: 'event-registrations',
      where: {
        and: [
          {
            email: {
              equals: body.email,
            },
          },
          {
            eventTitle: {
              equals: body.eventTitle,
            },
          },
        ],
      },
    });

    if (existingRegistration.docs.length > 0) {
      const registration = existingRegistration.docs[0];
      if (registration) {
        return NextResponse.json(
          {
            error: 'Bạn đã đăng ký tham gia sự kiện này rồi',
            message: `Bạn đã đăng ký sự kiện "${body.eventTitle}" với email ${body.email} vào ${new Date(registration.createdAt).toLocaleDateString('vi-VN')}. Vui lòng kiểm tra email để xem thông tin xác nhận.`,
            existingRegistration: {
              id: registration.id,
              status: registration.status,
              createdAt: registration.createdAt,
            }
          },
          {
            status: 409,
            headers: CORS_HEADERS,
          }
        );
      }
    }

    // Create registration
    const registration = await payload.create({
      collection: 'event-registrations',
      data: {
        ...body,
        status: 'pending',
        confirmationSent: false,
        reminderSent: false,
      },
    });

    // Log successful registration
    console.log(`✅ New event registration: ${registration.fullName} for ${registration.eventTitle}`);

    return NextResponse.json({
      success: true,
      message: 'Đăng ký thành công! Chúng tôi sẽ gửi email xác nhận trong thời gian sớm nhất.',
      registration: {
        id: registration.id,
        fullName: registration.fullName,
        email: registration.email,
        eventTitle: registration.eventTitle,
        status: registration.status,
      },
    }, {
      status: 201,
      headers: CORS_HEADERS,
    });

  } catch (error) {
    console.error('❌ Error creating event registration:', error);

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.' },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query conditions
    const whereConditions = [];

    if (eventId) {
      whereConditions.push({
        eventId: {
          equals: eventId,
        },
      });
    }

    if (status) {
      whereConditions.push({
        status: {
          equals: status,
        },
      });
    }

    const registrations = await payload.find({
      collection: 'event-registrations',
      where: whereConditions.length > 0 ? { and: whereConditions } : {},
      page,
      limit,
      sort: '-createdAt',
    });

    return NextResponse.json({
      success: true,
      registrations: registrations.docs,
      totalDocs: registrations.totalDocs,
      page: registrations.page,
      totalPages: registrations.totalPages,
      hasNextPage: registrations.hasNextPage,
      hasPrevPage: registrations.hasPrevPage,
    }, {
      headers: CORS_HEADERS,
    });

  } catch (error) {
    console.error('❌ Error fetching event registrations:', error);

    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi lấy danh sách đăng ký.' },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
