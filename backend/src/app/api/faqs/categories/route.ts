import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Interface for category count
interface CategoryCount {
  value: string;
  count: number;
  label?: string;
}

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

// GET /api/faqs/categories - Lấy danh sách categories
export async function GET(req: NextRequest) {
  const headers = getCommonHeaders(req);

  try {
    const payload = await getPayload({ config: configPromise });
    const { searchParams } = new URL(req.url);

    const locale = searchParams.get('locale') || 'vi';

    // Validate locale
    const validLocales = ['vi', 'en', 'tr'];
    const currentLocale = validLocales.includes(locale) ? (locale as 'vi' | 'en' | 'tr') : 'vi';

    // Lấy unique categories từ FAQs đã publish
    const result = await payload.find({
      collection: 'faqs',
      where: {
        status: { equals: 'published' },
      },
      limit: 1000, // Lấy nhiều để đảm bảo có tất cả categories
      locale: currentLocale,
    });

    // Nhóm theo category và đếm số lượng
    const categoryCounts: Record<string, CategoryCount> = {};

    result.docs.forEach((faq: any) => {
      const category = faq.category;
      if (!categoryCounts[category]) {
        categoryCounts[category] = {
          value: category,
          count: 0,
        };
      }
      categoryCounts[category].count++;
    });

    // Convert to array và thêm label
    const categoryLabels: Record<string, string> = {
      general: 'Tổng quan',
      services: 'Dịch vụ',
      products: 'Sản phẩm',
      projects: 'Dự án',
      technology: 'Công nghệ',
      'technical-support': 'Hỗ trợ kỹ thuật',
      payment: 'Thanh toán',
      warranty: 'Bảo hành',
      other: 'Khác',
    };

    const categories = Object.values(categoryCounts).map((cat: CategoryCount) => ({
      ...cat,
      label: categoryLabels[cat.value] || cat.value,
    }));

    return NextResponse.json({
      success: true,
      message: 'FAQ categories retrieved successfully',
      data: categories,
    }, {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('Error getting FAQ categories:', error);

    return NextResponse.json({
      success: false,
      message: 'Failed to get FAQ categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, {
      status: 500,
      headers
    });
  }
}
