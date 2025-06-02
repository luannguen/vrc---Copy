import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const { searchParams } = new URL(request.url);

    // Get query parameters
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const categoryId = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Add category filter
    if (categoryId) {
      where.categories = {
        contains: categoryId,
      };
    }

    // Add status filter
    if (status) {
      where.status = {
        equals: status,
      };
    }

    // Add featured filter
    if (featured !== null && featured !== undefined) {
      where.featured = {
        equals: featured === 'true',
      };
    }

    // Fetch events with filters
    const eventsResponse = await payload.find({
      collection: 'events',
      where,
      limit,
      page,
      sort: '-createdAt',
      depth: 2, // To populate categories and featuredImage
    });

    return NextResponse.json({
      success: true,
      data: {
        events: eventsResponse.docs,
        pagination: {
          total: eventsResponse.totalDocs,
          page: eventsResponse.page || 1,
          pages: eventsResponse.totalPages,
          limit: eventsResponse.limit,
          hasNextPage: eventsResponse.hasNextPage,
          hasPrevPage: eventsResponse.hasPrevPage,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch events',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
