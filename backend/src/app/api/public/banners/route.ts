import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Initialize payload
    const payload = await getPayload({ config });

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const active = searchParams.get('active'); // Filter by active status
    const sort = searchParams.get('sort') || 'sortOrder'; // Default sort by order

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      status: { equals: 'published' }
    };

    // Filter by active status if specified
    if (active === 'true') {
      where.isActive = { equals: true };
    } else if (active === 'false') {
      where.isActive = { equals: false };
    }

    // Add date filtering for scheduled banners
    const now = new Date();
    where.or = [
      // No start date set OR start date has passed
      {
        and: [
          { 'scheduleSettings.startDate': { exists: false } },
        ]
      },
      {
        and: [
          { 'scheduleSettings.startDate': { less_than_equal: now } },
        ]
      },
      // No end date set OR end date hasn't passed
      {
        and: [
          { 'scheduleSettings.endDate': { exists: false } },
        ]
      },
      {
        and: [
          { 'scheduleSettings.endDate': { greater_than_equal: now } },
        ]
      }
    ];

    const result = await payload.find({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'banners' as any,
      where,
      page,
      limit,
      sort,
      depth: 2, // Include related media
    });

    return NextResponse.json({
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
    });

  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching banners', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize payload
    const payload = await getPayload({ config });

    const body = await request.json();

    // Create new banner
    const banner = await payload.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'banners' as any,
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: banner,
      message: 'Banner created successfully',
    });

  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating banner', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
