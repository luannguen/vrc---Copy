import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize payload
    const payload = await getPayload({ config });

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action'); // 'view' or 'click'

    if (!action || !['view', 'click'].includes(action)) {
      return NextResponse.json(
        { success: false, message: 'Invalid action. Must be "view" or "click"' },
        { status: 400 }
      );
    }

    // Get current banner
    const banner = await payload.findByID({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'banners' as any,
      id: params.id,
    });

    if (!banner) {
      return NextResponse.json(
        { success: false, message: 'Banner not found' },
        { status: 404 }
      );
    }

    // Update analytics
    const currentViewCount = banner.analytics?.viewCount || 0;
    const currentClickCount = banner.analytics?.clickCount || 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData: any = {};

    if (action === 'view') {
      updateData = {
        analytics: {
          ...banner.analytics,
          viewCount: currentViewCount + 1,
          clickCount: currentClickCount,
        }
      };
    } else if (action === 'click') {
      updateData = {
        analytics: {
          ...banner.analytics,
          viewCount: currentViewCount,
          clickCount: currentClickCount + 1,
        }
      };
    }

    // Calculate click-through rate
    const newViewCount = updateData.analytics.viewCount;
    const newClickCount = updateData.analytics.clickCount;
    if (newViewCount > 0) {
      updateData.analytics.clickThroughRate =
        Math.round((newClickCount / newViewCount) * 100 * 100) / 100;
    }

    const updatedBanner = await payload.update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: 'banners' as any,
      id: params.id,
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedBanner,
      message: `Banner ${action} tracked successfully`,
    });

  } catch (error) {
    console.error('Error tracking banner analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Error tracking banner analytics', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
