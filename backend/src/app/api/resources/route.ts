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
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const resourceType = searchParams.get('resourceType');
    const difficulty = searchParams.get('difficulty');
    const language = searchParams.get('language');
    const sort = searchParams.get('sort') || '-publishedAt';

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: Record<string, any> = {
      status: { equals: 'published' }
    };

    if (category) {
      where.category = { equals: category };
    }

    if (featured === 'true') {
      where.featured = { equals: true };
    }

    if (resourceType) {
      where.resourceType = { equals: resourceType };
    }

    if (difficulty) {
      where.difficulty = { equals: difficulty };
    }

    if (language) {
      where.language = { equals: language };
    }

    if (search) {
      where.or = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { 'tags.tag': { contains: search } },
      ];
    }

    // Fetch resources
    const resources = await payload.find({
      collection: 'resources',
      where,
      page,
      limit,
      sort: sort as string,
    });

    return NextResponse.json({
      success: true,
      data: resources.docs,
      pagination: {
        page: resources.page,
        limit: resources.limit,
        totalPages: resources.totalPages,
        totalDocs: resources.totalDocs,
        hasNextPage: resources.hasNextPage,
        hasPrevPage: resources.hasPrevPage,
      },
    });

  } catch (error) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching resources',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Initialize payload
    const payload = await getPayload({ config });

    const data = await request.json();

    const resource = await payload.create({
      collection: 'resources',
      data,
    });

    return NextResponse.json({
      success: true,
      data: resource,
      message: 'Resource created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating resource',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
