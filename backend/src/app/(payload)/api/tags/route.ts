import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    const tags = await payload.find({
      collection: 'categories',
      where: {
        type: {
          equals: 'tag',
        },
      },
      sort: 'title',
      limit: 100, // Get all tags
    });

    return NextResponse.json(
      {
        tags: tags.docs.map((tag) => ({
          id: tag.id,
          title: tag.title,
          slug: tag.slug,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
        })),
        total: tags.totalDocs,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );
  } catch (error) {
    console.error('❌ Error fetching tags:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch tags',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
