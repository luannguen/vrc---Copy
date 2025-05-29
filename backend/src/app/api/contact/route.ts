import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

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

/**
 * Submit contact form
 * POST /api/contact
 */
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });

    const body = await req.json();
    console.log('Contact form submission:', body);

    // Validate required fields
    const { name, email, message, subject, phone } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng điền đầy đủ họ tên, email và nội dung.',
        },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email không hợp lệ.',
        },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    // Create contact submission
    const contactSubmission = await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone: phone || '',
        subject: subject || 'general',
        message,
        status: 'new',
      },
    });

    console.log('Contact submission created:', contactSubmission.id);

    // TODO: Send email notification to admin
    // TODO: Send auto-reply email to customer

    return NextResponse.json(
      {
        success: true,
        message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.',
        data: {
          id: contactSubmission.id,
          submittedAt: contactSubmission.createdAt,
        },
      },
      {
        status: 201,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error('Error submitting contact form:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

/**
 * Get contact submissions (admin only)
 * GET /api/contact
 */
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config });

    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const limit = Number(url.searchParams.get('limit')) || 20;
    const status = url.searchParams.get('status');
    const sort = url.searchParams.get('sort') || 'createdAt';
    const order = url.searchParams.get('order') || 'desc';    // Build query
    let query = {};

    if (status && status !== 'all') {
      query = { status: { equals: status } };
    }

    // Build sort
    const sortField = `${order === 'desc' ? '-' : ''}${sort}`;

    const result = await payload.find({
      collection: 'contact-submissions',
      where: query,
      page,
      limit,
      sort: sortField,
      depth: 0,
    });

    return NextResponse.json(
      {
        success: true,
        data: result.docs,
        pagination: {
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
          totalDocs: result.totalDocs,
          hasNextPage: result.hasNextPage,
          hasPrevPage: result.hasPrevPage,
        },
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error('Error fetching contact submissions:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi lấy danh sách liên hệ.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
