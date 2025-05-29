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
    const toolType = searchParams.get('toolType');
    const difficulty = searchParams.get('difficulty');
    const sort = searchParams.get('sort') || '-publishedAt';

    // Build where clause
    const where: Record<string, unknown> = {
      status: { equals: 'published' }
    };

    if (category) {
      where.category = { equals: category };
    }

    if (featured === 'true') {
      where.featured = { equals: true };
    }

    if (toolType) {
      where.toolType = { equals: toolType };
    }

    if (difficulty) {
      where.difficulty = { equals: difficulty };
    }

    if (search) {
      where.or = [
        { name: { contains: search } },
        { excerpt: { contains: search } },
        { 'tags.tag': { contains: search } },
      ];
    }

    // Fetch tools
    const tools = await payload.find({
      collection: 'tools',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      where: where as any,
      page,
      limit,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sort: sort as any,
    });

    return NextResponse.json({
      success: true,
      data: tools.docs,
      pagination: {
        page: tools.page,
        limit: tools.limit,
        totalPages: tools.totalPages,
        totalDocs: tools.totalDocs,
        hasNextPage: tools.hasNextPage,
        hasPrevPage: tools.hasPrevPage,
      },
    });

  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching tools',
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

    const tool = await payload.create({
      collection: 'tools',
      data,
    });

    return NextResponse.json({
      success: true,
      data: tool,
      message: 'Tool created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error creating tool',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
