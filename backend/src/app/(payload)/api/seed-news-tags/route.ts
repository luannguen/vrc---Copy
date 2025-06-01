import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function POST(_request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });
      // Vietnamese news tags data
    const tagsData = [
      {
        title: 'Điện lạnh',
        slug: 'dien-lanh',
        type: 'tag' as const,
      },
      {
        title: 'Triển lãm',
        slug: 'trien-lam',
        type: 'tag' as const,
      },
      {
        title: 'Hội thảo',
        slug: 'hoi-thao',
        type: 'tag' as const,
      },
      {
        title: 'Công nghệ',
        slug: 'cong-nghe',
        type: 'tag' as const,
      },
      {
        title: 'Tiết kiệm năng lượng',
        slug: 'tiet-kiem-nang-luong',
        type: 'tag' as const,
      },
      {
        title: 'Bảo trì',
        slug: 'bao-tri',
        type: 'tag' as const,
      },
      {
        title: 'Inverter',
        slug: 'inverter',
        type: 'tag' as const,
      },
      {
        title: 'Hợp tác quốc tế',
        slug: 'hop-tac-quoc-te',
        type: 'tag' as const,
      },
      {
        title: 'Nghiên cứu',
        slug: 'nghien-cuu',
        type: 'tag' as const,
      },
      {
        title: 'Phát triển bền vững',
        slug: 'phat-trien-ben-vung',
        type: 'tag' as const,
      },
    ];

    console.log('🏷️ Starting news tags seeding...');

    // Check existing tags to avoid duplicates
    const existingTags = await payload.find({
      collection: 'categories',
      where: {
        type: {
          equals: 'tag',
        },
      },
    });

    console.log(`📊 Found ${existingTags.docs.length} existing tags`);

    const createdTags = [];

    for (const tagData of tagsData) {      // Check if tag already exists
      const existing = existingTags.docs.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (tag: any) => tag.slug === tagData.slug
      );

      if (existing) {
        console.log(`⚠️ Tag "${tagData.title}" already exists, skipping...`);
        createdTags.push(existing);
        continue;
      }

      try {
        const tag = await payload.create({
          collection: 'categories',
          data: tagData,
        });

        console.log(`✅ Created tag: ${tagData.title}`);
        createdTags.push(tag);
      } catch (error) {
        console.error(`❌ Failed to create tag "${tagData.title}":`, error);
      }
    }

    console.log(`🎉 Successfully processed ${createdTags.length} tags`);

    return NextResponse.json(
      {
        message: 'News tags seeded successfully',
        created: createdTags.length,
        total: tagsData.length,
        tags: createdTags.map((tag) => ({
          id: tag.id,
          title: tag.title,
          slug: tag.slug,
          type: tag.type,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error seeding news tags:', error);
    return NextResponse.json(
      {
        error: 'Failed to seed news tags',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    const tags = await payload.find({
      collection: 'categories',
      where: {
        type: {
          equals: 'tag',
        },
      },
      sort: 'title',
    });

    return NextResponse.json(
      {
        message: 'News tags retrieved successfully',
        count: tags.docs.length,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tags: tags.docs.map((tag: any) => ({
          id: tag.id,
          title: tag.title,
          slug: tag.slug,
          type: tag.type,
          createdAt: tag.createdAt,
          updatedAt: tag.updatedAt,
        })),
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    );
  } catch (error) {
    console.error('❌ Error fetching news tags:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch news tags',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
