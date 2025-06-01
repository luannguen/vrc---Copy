import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });
    const { searchParams } = new URL(request.url);
    const tagSlug = searchParams.get('tag');

    if (!tagSlug) {
      return NextResponse.json(
        { error: 'Tag slug is required' },
        { status: 400 }
      );
    }

    // Find the tag first
    const tag = await payload.find({
      collection: 'categories',
      where: {
        and: [
          { slug: { equals: tagSlug } },
          { type: { equals: 'tag' } },
        ],
      },
      limit: 1,
    });    if (tag.docs.length === 0) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    const tagDoc = tag.docs[0];
    if (!tagDoc) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Find posts with this tag
    const posts = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { tags: { contains: tagDoc.id } },
        ],
      },
      sort: '-publishedAt',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    });

    return NextResponse.json(
      {
        tag: {
          id: tagDoc.id,
          title: tagDoc.title,
          slug: tagDoc.slug,
        },
        posts: posts.docs,
        pagination: {
          totalDocs: posts.totalDocs,
          limit: posts.limit,
          totalPages: posts.totalPages,
          page: posts.page,
          hasNextPage: posts.hasNextPage,
          hasPrevPage: posts.hasPrevPage,
        },
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
    console.error('❌ Error fetching posts by tag:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch posts by tag',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
