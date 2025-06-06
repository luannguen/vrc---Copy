import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Common CORS headers
function getCommonHeaders(req: NextRequest) {
  const headers = new Headers();

  const origin = req.headers.get('origin');
  const allowedOrigins = [
    'http://localhost:3001',
    'http://localhost:3000',
    'https://vrctech.vn',
    'https://www.vrctech.vn'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
  } else {
    headers.set('Access-Control-Allow-Origin', 'http://localhost:3001');
  }

  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  headers.set('Access-Control-Allow-Credentials', 'true');
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

  return headers;
}

export async function OPTIONS(req: NextRequest) {
  const headers = getCommonHeaders(req);
  headers.set('Access-Control-Max-Age', '86400');

  return new Response(null, {
    status: 204,
    headers,
  });
}

// GET /api/faqs/popular - Lấy FAQs phổ biến
export async function GET(req: NextRequest) {
  const headers = getCommonHeaders(req);

  try {
    const payload = await getPayload({ config: configPromise });
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get('limit') || '5');
    const locale = searchParams.get('locale') || 'vi';

    // Validate locale
    const validLocales = ['vi', 'en', 'tr'];
    const currentLocale = validLocales.includes(locale) ? (locale as 'vi' | 'en' | 'tr') : 'vi';

    const result = await payload.find({
      collection: 'faqs',
      where: {
        status: { equals: 'published' },
        isPopular: { equals: true },
      },
      limit,
      sort: '-helpfulCount',
      locale: currentLocale,
    });

    return NextResponse.json({
      success: true,
      message: 'Popular FAQs retrieved successfully',
      data: result.docs,
    }, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error getting popular FAQs:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to get popular FAQs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers
    });
  }
}
