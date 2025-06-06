import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import type { Where } from 'payload';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Common CORS headers
function getCommonHeaders(req: NextRequest) {
  const headers = new Headers();

  // Get origin from request
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

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  const headers = getCommonHeaders(req);
  headers.set('Access-Control-Max-Age', '86400');

  return new Response(null, {
    status: 204,
    headers,
  });
}

// GET /api/faqs - Lấy danh sách FAQs với filter
export async function GET(req: NextRequest) {
  const headers = getCommonHeaders(req);

  try {
    const payload = await getPayload({ config: configPromise });
    const { searchParams } = new URL(req.url);

    // Lấy query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const popular = searchParams.get('popular');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags');
    const locale = searchParams.get('locale') || 'vi';
    const sort = searchParams.get('sort') || 'order';

    // Validate locale
    const validLocales = ['vi', 'en', 'tr'];
    const currentLocale = validLocales.includes(locale) ? (locale as 'vi' | 'en' | 'tr') : 'vi';

    // Build where clause
    const where: Where = {
      status: { equals: 'published' },
    };

    if (category) {
      where.category = { equals: category };
    }

    if (featured === 'true') {
      where.featured = { equals: true };
    }

    if (popular === 'true') {
      where.isPopular = { equals: true };
    }

    if (search) {
      where.or = [
        { question: { contains: search } },
        { searchKeywords: { contains: search } },
      ];
    }

    if (tags) {
      where['tags.tag'] = { in: Array.isArray(tags) ? tags : [tags] };
    }

    // Thực hiện query
    const result = await payload.find({
      collection: 'faqs',
      where,
      page,
      limit,
      sort: sort as string,
      locale: currentLocale,
    });

    return NextResponse.json({
      success: true,
      message: 'FAQs retrieved successfully',
      data: result,
    }, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error getting FAQs:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to get FAQs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers
    });
  }
}
