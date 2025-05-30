import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

// Extend the homepage settings type with additional data
interface ExtendedHomepageSettings {
  [key: string]: unknown;
  activeBanners?: unknown[];
  featuredProductsData?: unknown[];
  latestPosts?: unknown[];
  selectedPostsData?: unknown[];
}

// Extend NextRequest to include user
interface AuthenticatedRequest extends NextRequest {
  user?: unknown;
}

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
 * Get homepage settings
 * GET /api/homepage-settings
 */
export async function GET() {
  try {
    const payload = await getPayload({ config });

    const homepageSettings = await payload.findGlobal({
      slug: 'homepage-settings',
    });

    const extendedSettings: ExtendedHomepageSettings = { ...homepageSettings };

    // Get active banners if banners are referenced
    if (homepageSettings.heroSection?.banners?.length) {
      const bannerIds = homepageSettings.heroSection.banners.map(banner =>
        typeof banner === 'object' ? banner.id : banner
      );

      const banners = await payload.find({
        collection: 'banners',
        where: {
          and: [
            { id: { in: bannerIds } },
            { isActive: { equals: true } },
            { status: { equals: 'published' } },
            {
              or: [
                { 'scheduleSettings.startDate': { exists: false } },
                { 'scheduleSettings.startDate': { less_than_equal: new Date() } },
              ],
            },
            {
              or: [
                { 'scheduleSettings.endDate': { exists: false } },
                { 'scheduleSettings.endDate': { greater_than_equal: new Date() } },
              ],
            },
          ],
        },
        sort: 'sortOrder',
        depth: 2, // Include media relations
      });

      extendedSettings.activeBanners = banners.docs;
    }

    // Get featured products if products are referenced
    if (homepageSettings.featuredSection?.featuredProducts?.length) {
      const productIds = homepageSettings.featuredSection.featuredProducts.map(product =>
        typeof product === 'object' ? product.id : product
      );

      const products = await payload.find({
        collection: 'products',
        where: {
          and: [
            { id: { in: productIds } },
            { _status: { equals: 'published' } },
          ],
        },
        depth: 2,
      });

      extendedSettings.featuredProductsData = products.docs;
    }

    // Get latest posts for publications section if auto mode
    if (homepageSettings.publicationsSection?.isEnabled &&
        homepageSettings.publicationsSection?.displayMode === 'auto') {
      const posts = await payload.find({
        collection: 'posts',
        where: {
          _status: { equals: 'published' },
        },
        limit: homepageSettings.publicationsSection.numberOfPosts || 4,
        sort: '-publishedAt',
        depth: 2,
      });

      extendedSettings.latestPosts = posts.docs;
    }    // Get selected posts if manual mode
    if (homepageSettings.publicationsSection?.isEnabled &&
        homepageSettings.publicationsSection?.displayMode === 'manual' &&
        homepageSettings.publicationsSection?.selectedPosts?.length) {
      const postIds = homepageSettings.publicationsSection.selectedPosts.map(post =>
        typeof post === 'object' ? post.id : post
      );

      const posts = await payload.find({
        collection: 'posts',
        where: {
          and: [
            { id: { in: postIds } },
            { _status: { equals: 'published' } },
          ],
        },
        depth: 2,
      });

      extendedSettings.selectedPostsData = posts.docs;
    }

    return NextResponse.json(
      {
        success: true,
        data: extendedSettings,
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error('Error fetching homepage settings:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      {
        success: false,
        message: 'Không thể tải cài đặt trang chủ',
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

/**
 * Update homepage settings
 * PUT /api/homepage-settings
 */
export async function PUT(req: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const body = await req.json();

    // Only allow authenticated users to update
    const authenticatedReq = req as AuthenticatedRequest;
    if (!authenticatedReq.user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized - Cần đăng nhập để cập nhật cài đặt',
        },
        {
          status: 401,
          headers: CORS_HEADERS,
        }
      );
    }

    const updatedSettings = await payload.updateGlobal({
      slug: 'homepage-settings',
      data: body,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Cài đặt trang chủ đã được cập nhật',
        data: updatedSettings,
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error('Error updating homepage settings:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      {
        success: false,
        message: 'Không thể cập nhật cài đặt trang chủ',
        error: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

/**
 * Create/Update homepage settings (Alternative POST method)
 * POST /api/homepage-settings
 */
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

    return NextResponse.json(
      {
        success: true,
        data: updatedSettings,
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );

  } catch (error) {
    console.error('Error updating homepage settings via POST:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update homepage settings',
        details: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
