import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/**
 * Get about page settings
 * GET /api/about-page
 */
export async function GET() {
  try {
    const payload = await getPayload({ config });

    const aboutPageSettings = await payload.findGlobal({
      slug: 'about-page-settings',
    });

    return NextResponse.json(aboutPageSettings, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('Error fetching about page settings:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch about page settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
