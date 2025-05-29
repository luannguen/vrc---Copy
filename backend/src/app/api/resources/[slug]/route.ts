import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

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

    // Increment view count
    try {
      await payload.update({
        collection: 'resources',
        id: resource.id,
        data: {
          viewCount: (resource.viewCount || 0) + 1,
        },
      });
    } catch (updateError) {
      console.warn('Failed to update view count:', updateError);
    }

    // Fetch related resources if any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let relatedResources: any[] = [];
    if (resource.relatedResources && resource.relatedResources.length > 0) {
      const relatedResourcesResult = await payload.find({
        collection: 'resources',
        where: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: { in: resource.relatedResources.map((rr: any) => typeof rr === 'object' && rr.id ? rr.id : rr) },
          status: { equals: 'published' }
        },
        limit: 5,
      });
      relatedResources = relatedResourcesResult.docs;
    }

    // Fetch related tools if any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let relatedTools: any[] = [];
    if (resource.relatedTools && resource.relatedTools.length > 0) {
      const relatedToolsResult = await payload.find({
        collection: 'tools',
        where: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: { in: resource.relatedTools.map((rt: any) => typeof rt === 'object' && rt.id ? rt.id : rt) },
          status: { equals: 'published' }
        },
        limit: 5,
      });
      relatedTools = relatedToolsResult.docs;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...resource,
        relatedResources,
        relatedTools,
      },
    });

  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching resource',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const data = await request.json();

    // Find resource by slug first
    const resources = await payload.find({
      collection: 'resources',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (resources.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    const resource = await payload.update({
      collection: 'resources',
      id: resources.docs[0]!.id,
      data,
    });

    return NextResponse.json({
      success: true,
      data: resource,
      message: 'Resource updated successfully'
    });

  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating resource',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Find resource by slug first
    const resources = await payload.find({
      collection: 'resources',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (resources.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Resource not found' },
        { status: 404 }
      );
    }

    await payload.delete({
      collection: 'resources',
      id: resources.docs[0]!.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Resource deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting resource',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
