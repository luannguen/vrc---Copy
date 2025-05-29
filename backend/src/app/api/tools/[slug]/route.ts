import { NextRequest, NextResponse } from 'next/server';
import payload from 'payload';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const tools = await payload.find({
      collection: 'tools',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' }
      },
      limit: 1,
    });

    if (tools.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tool not found' },
        { status: 404 }
      );
    }

    const tool = tools.docs[0];
    if (!tool) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tool not found'
        },
        { status: 404 }
      );
    }

    // Increment view count
    try {
      await payload.update({
        collection: 'tools',
        id: tool.id,
        data: {
          viewCount: (tool.viewCount || 0) + 1,
        },
      });
    } catch (updateError) {
      console.warn('Failed to update view count:', updateError);
    }

    // Fetch related tools if any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let relatedTools: any[] = [];
    if (tool.relatedTools && tool.relatedTools.length > 0) {
      const relatedToolsResult = await payload.find({
        collection: 'tools',
        where: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          id: { in: tool.relatedTools.map((rt: any) => typeof rt === 'object' && rt.id ? rt.id : rt) },
          status: { equals: 'published' }
        },
        limit: 5,
      });
      relatedTools = relatedToolsResult.docs;
    }

    return NextResponse.json({
      success: true,
      data: {
        ...tool,
        relatedTools,
      },
    });

  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching tool',
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

    // Find tool by slug first
    const tools = await payload.find({
      collection: 'tools',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (tools.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tool not found' },
        { status: 404 }
      );
    }

    const foundTool = tools.docs[0];
    if (!foundTool) {
      return NextResponse.json(
        {
          success: false,
          error: 'Tool not found'
        },
        { status: 404 }
      );
    }

    const tool = await payload.update({
      collection: 'tools',
      id: foundTool.id,
      data,
    });

    return NextResponse.json({
      success: true,
      data: tool,
      message: 'Tool updated successfully'
    });

  } catch (error) {
    console.error('Error updating tool:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating tool',
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

    // Find tool by slug first
    const tools = await payload.find({
      collection: 'tools',
      where: { slug: { equals: slug } },
      limit: 1,
    });

    if (tools.docs.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Tool not found' },
        { status: 404 }
      );
    }

    const foundTool = tools.docs[0];
    if (!foundTool) {
      return NextResponse.json(
        { success: false, message: 'Tool not found' },
        { status: 404 }
      );
    }

    await payload.delete({
      collection: 'tools',
      id: foundTool.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Tool deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting tool:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error deleting tool',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
