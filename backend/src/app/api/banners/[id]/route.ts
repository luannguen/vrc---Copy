import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string = '';
  try {
    // Initialize payload
    const payload = await getPayload({ config });
    const resolvedParams = await params;
    id = resolvedParams.id;

    const banner = await payload.findByID({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'banners' as any,
      id: id,
      depth: 2, // Include related media
    });

    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: banner,
    });

  } catch (error) {
    console.error('Error fetching banner:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching banner', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string = '';
  try {
    // Initialize payload
    const payload = await getPayload({ config });
    const resolvedParams = await params;
    id = resolvedParams.id;

    const body = await request.json();

    const banner = await payload.update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'banners' as any,
      id: id,
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: banner,
      message: 'Banner updated successfully',
    });

  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating banner', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string = '';
  try {
    // Initialize payload
    const payload = await getPayload({ config });
    const resolvedParams = await params;
    id = resolvedParams.id;

    await payload.delete({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'banners' as any,
      id: id,
    });

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, message: 'Error deleting banner', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
