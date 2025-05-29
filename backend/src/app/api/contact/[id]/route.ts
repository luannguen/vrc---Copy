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
 * Get single contact submission by ID
 * GET /api/contact/[id]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string = '';
  try {
    const payload = await getPayload({ config });
    const resolvedParams = await params;
    id = resolvedParams.id;

    const submission = await payload.findByID({
      collection: 'contact-submissions',
      id,
      depth: 1,
    });

    return NextResponse.json(
      {
        success: true,
        data: submission,
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error(`Error fetching contact submission ${id}:`, error);

    return NextResponse.json(
      {
        success: false,
        message: 'Không tìm thấy yêu cầu liên hệ.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 404,
        headers: CORS_HEADERS,
      }
    );
  }
}

/**
 * Update contact submission (admin only)
 * PUT /api/contact/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string = '';
  try {
    const payload = await getPayload({ config });
    const resolvedParams = await params;
    id = resolvedParams.id;
    const body = await req.json();

    console.log(`Updating contact submission ${id}:`, body);

    // Only allow updating certain fields
    const allowedFields = ['status', 'notes'];
    const updateData: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Không có dữ liệu để cập nhật.',
        },
        {
          status: 400,
          headers: CORS_HEADERS,
        }
      );
    }

    const updatedSubmission = await payload.update({
      collection: 'contact-submissions',
      id,
      data: updateData,
    });

    console.log(`Contact submission ${id} updated successfully`);

    return NextResponse.json(
      {
        success: true,
        message: 'Cập nhật thành công.',
        data: updatedSubmission,
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error(`Error updating contact submission ${id}:`, error);

    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi cập nhật.',
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
 * Delete contact submission (admin only)
 * DELETE /api/contact/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string = '';
  try {
    const payload = await getPayload({ config });
    const resolvedParams = await params;
    id = resolvedParams.id;

    await payload.delete({
      collection: 'contact-submissions',
      id,
    });

    console.log(`Contact submission ${id} deleted successfully`);

    return NextResponse.json(
      {
        success: true,
        message: 'Xóa thành công.',
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error(`Error deleting contact submission ${id}:`, error);

    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi xóa.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
