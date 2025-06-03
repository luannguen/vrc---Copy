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

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Check if this is an admin panel request
    const referer = request.headers.get('referer') || '';
    const isAdminRequest = referer.includes('/admin');

    console.log('🗑️ Bulk DELETE request received');
    console.log('Is Admin Request:', isAdminRequest);
    console.log('Referer:', referer);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    console.log('Full URL:', request.url);

    // Handle different parameter formats for bulk delete
    const ids: string[] = [];

    // Method 1: Check for where[id][in][] format (Payload default)
    for (const [key, value] of searchParams.entries()) {
      console.log(`Checking param: ${key} = ${value}`);
      if (key.startsWith('where[id][in]')) {
        ids.push(value);
        console.log(`Added ID from where[id][in]: ${value}`);
      }
    }

    // Method 2: Check for ids[] format
    const idsParam = searchParams.getAll('ids[]');
    if (idsParam.length > 0) {
      ids.push(...idsParam);
      console.log(`Added IDs from ids[]: ${idsParam.join(', ')}`);
    }

    // Method 3: Check for comma-separated ids
    const idsCommaSeparated = searchParams.get('ids');
    if (idsCommaSeparated) {
      const commaSeparatedIds = idsCommaSeparated.split(',').filter(id => id.trim());
      ids.push(...commaSeparatedIds);
      console.log(`Added IDs from comma-separated: ${commaSeparatedIds.join(', ')}`);
    }

    // Method 4: Single id parameter
    const singleId = searchParams.get('id');
    if (singleId) {
      ids.push(singleId);
      console.log(`Added single ID: ${singleId}`);
    }

    console.log(`🎯 Total IDs collected: ${ids.length} - [${ids.join(', ')}]`);

    if (ids.length === 0) {
      console.log('❌ No IDs found in request');

      if (isAdminRequest) {
        return NextResponse.json(
          {
            errors: [{
              message: 'No IDs provided for deletion',
              name: 'ValidationError',
            }],
          },
          {
            status: 400,
            headers: CORS_HEADERS,
          }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'No IDs provided for deletion',
            docs: [],
            totalDocs: 0,
          },
          {
            status: 400,
            headers: CORS_HEADERS,
          }
        );
      }
    }

    // Verify all records exist before deleting
    console.log('🔍 Verifying records exist...');
    const existingRecords = await payload.find({
      collection: 'event-registrations',
      where: {
        id: {
          in: ids,
        },
      },
      limit: ids.length,
    });

    console.log('📋 Found records to delete:', existingRecords.docs.length);
    console.log('📋 Record IDs found:', existingRecords.docs.map(doc => doc.id));

    if (existingRecords.docs.length === 0) {
      console.log('❌ No matching records found');

      if (isAdminRequest) {
        return NextResponse.json(
          {
            docs: [],
            errors: [],
            message: 'No records found to delete',
          },
          {
            status: 200,
            headers: CORS_HEADERS,
          }
        );
      } else {
        return NextResponse.json(
          {
            success: true,
            message: 'No records found to delete',
            docs: [],
            totalDocs: 0,
          },
          {
            status: 200,
            headers: CORS_HEADERS,
          }
        );
      }
    }

    // Only delete records that actually exist
    const existingIds = existingRecords.docs.map(doc => doc.id);
    console.log(`🎯 Will delete ${existingIds.length} existing records: [${existingIds.join(', ')}]`);

    // Perform bulk delete
    const deletePromises = existingIds.map(id =>
      payload.delete({
        collection: 'event-registrations',
        id,
      })
    );

    const deleteResults = await Promise.allSettled(deletePromises);

    // Count successful and failed deletions
    let successCount = 0;
    let failureCount = 0;
    const errors: string[] = [];

    deleteResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        successCount++;
        console.log(`✅ Deleted record ${existingIds[index]}`);
      } else {
        failureCount++;
        const error = `Failed to delete ${existingIds[index]}: ${result.reason?.message || 'Unknown error'}`;
        errors.push(error);
        console.error(`❌ ${error}`);
      }
    });

    console.log(`📊 Bulk delete completed: ${successCount} success, ${failureCount} failed`);

    // Return format specific to admin panel vs API requests
    if (isAdminRequest) {
      console.log('📋 Returning admin-compatible response format');

      if (failureCount === 0) {
        // Success format for Payload admin panel
        const response = {
          docs: existingIds.slice(0, successCount).map(id => ({ id })),
          errors: [],
          message: `Successfully deleted ${successCount} event registration${successCount !== 1 ? 's' : ''}`,
        };

        return NextResponse.json(response, {
          status: 200,
          headers: CORS_HEADERS,
        });
      } else {
        // Error format for Payload admin panel
        const response = {
          errors: errors.map(err => ({
            message: err,
            name: 'DeleteError',
          })),
        };

        return NextResponse.json(response, {
          status: 400,
          headers: CORS_HEADERS,
        });
      }
    } else {
      // Standard API response format for non-admin requests
      const response = {
        success: failureCount === 0,
        message: `Successfully deleted ${successCount} event registration${successCount !== 1 ? 's' : ''}${failureCount > 0 ? `. ${failureCount} failed.` : '.'}`,
        docs: existingIds.slice(0, successCount).map(id => ({ id })),
        totalDocs: successCount,
        errors: failureCount > 0 ? errors : undefined,
      };

      return NextResponse.json(response, {
        status: failureCount === 0 ? 200 : 207, // 207 Multi-Status for partial success
        headers: CORS_HEADERS,
      });
    }

  } catch (error) {
    console.error('❌ Error in bulk delete:', error);
    console.error('❌ Error details:', error instanceof Error ? error.message : String(error));
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    // Check if this is an admin panel request for error formatting
    const referer = request.headers.get('referer') || '';
    const isAdminRequest = referer.includes('/admin');

    if (isAdminRequest) {
      return NextResponse.json(
        {
          errors: [{
            message: error instanceof Error ? error.message : 'An error occurred while deleting registrations',
            name: 'ServerError',
          }],
        },
        {
          status: 500,
          headers: CORS_HEADERS,
        }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'An error occurred while deleting registrations',
          docs: [],
          totalDocs: 0,
          error: error instanceof Error ? error.message : String(error),
        },
        {
          status: 500,
          headers: CORS_HEADERS,
        }
      );
    }
  }
}
