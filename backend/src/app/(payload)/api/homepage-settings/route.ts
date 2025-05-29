import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// GET /api/homepage-settings
export async function GET(_req: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // Fetch Global homepage settings
    const homepageSettings = await payload.findGlobal({
      slug: 'homepage-settings',
    });

    if (!homepageSettings) {
      return NextResponse.json(
        {
          success: false,
          error: 'Homepage settings not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: homepageSettings,
    });

  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch homepage settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// POST /api/homepage-settings - Update Global settings (Admin only)
export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config });

    // TODO: Add auth check for admin
    // const { user } = await payload.auth({ headers: req.headers });
    // if (!user || user.role !== 'admin') {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await req.json();

    const updatedSettings = await payload.updateGlobal({
      slug: 'homepage-settings',
      data: body,
    });

    return NextResponse.json({
      success: true,
      data: updatedSettings,
    });

  } catch (error) {
    console.error('Error updating homepage settings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update homepage settings',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Enable CORS for all methods
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
