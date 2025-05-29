import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Find resource by slug
    const resources = await payload.find({
      collection: 'resources',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' }
      },
      limit: 1,
    });

    if (resources.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    const resource = resources.docs[0];
    if (!resource) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    // Increment download count
    try {
      await payload.update({
        collection: 'resources',
        id: resource.id,
        data: {
          downloadCount: (resource.downloadCount || 0) + 1,
        },
      });
    } catch (updateError) {
      console.warn('Failed to update download count:', updateError);
    }

    // Return download info
    return NextResponse.json({
      success: true,
      message: 'Download count updated',
      data: {
        id: resource.id,
        title: resource.title,
        downloadCount: (resource.downloadCount || 0) + 1,
        file: resource.file,
        externalUrl: resource.externalUrl,
      },
    });

  } catch (error) {
    console.error('Error processing download:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing download',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
