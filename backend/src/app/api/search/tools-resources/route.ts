import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // 'tools', 'resources', 'all'
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Search query is required'
      }, { status: 400 });
    }

    const results: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tools: any[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      resources: any[];
      totalCount: number;
    } = {
      tools: [],
      resources: [],
      totalCount: 0,
    };

    // Search tools
    if (type === 'all' || type === 'tools') {
      const toolsResult = await payload.find({
        collection: 'tools',
        where: {
          and: [
            { status: { equals: 'published' } },
            {
              or: [
                { name: { contains: query } },
                { excerpt: { contains: query } },
                { 'tags.tag': { contains: query } },
                { 'features.feature': { contains: query } },
              ]
            }
          ]
        },
        limit: type === 'tools' ? limit : Math.ceil(limit / 2),
        sort: '-featured,-publishedAt',
      });
      results.tools = toolsResult.docs;
      results.totalCount += toolsResult.totalDocs;
    }

    // Search resources
    if (type === 'all' || type === 'resources') {
      const resourcesResult = await payload.find({
        collection: 'resources',
        where: {
          and: [
            { status: { equals: 'published' } },
            {
              or: [
                { title: { contains: query } },
                { excerpt: { contains: query } },
                { 'tags.tag': { contains: query } },
                { 'targetAudience.audience': { contains: query } },
              ]
            }
          ]
        },
        limit: type === 'resources' ? limit : Math.ceil(limit / 2),
        sort: '-featured,-publishedAt',
      });
      results.resources = resourcesResult.docs;
      results.totalCount += resourcesResult.totalDocs;
    }

    return NextResponse.json({
      success: true,
      data: results,
      query,
      type,
    });

  } catch (error) {
    console.error('Error searching tools and resources:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error searching tools and resources',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
