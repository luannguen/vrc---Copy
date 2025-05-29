import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload.config';
import { seedBanners } from '@/seed/seed-banners';
import { seedTools } from '@/seed/seed-tools';

export async function POST(req: NextRequest) {
  try {
    const { type } = await req.json();
    const payload = await getPayload({ config });

    let result;

    switch (type) {
      case 'banners':
        await seedBanners(payload);
        result = { message: 'Banner seeding completed successfully' };
        break;
      case 'tools':
        await seedTools(payload);
        result = { message: 'Tools seeding completed successfully' };
        break;
      case 'both':
        await seedBanners(payload);
        await seedTools(payload);
        result = { message: 'Both banner and tools seeding completed successfully' };
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid seed type. Use: banners, tools, or both' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Seed endpoint error:', error);
    return NextResponse.json(
      {
        error: 'Failed to run seed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Seed endpoint is working',
    usage: 'POST with {"type": "banners"}, {"type": "tools"}, or {"type": "both"}'
  });
}
