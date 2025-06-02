import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

const eventTagsData = [
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
    title: 'Đào tạo',
    slug: 'dao-tao',
    type: 'tag' as const,
  },
  {
    title: 'Điều hòa',
    slug: 'dieu-hoa',
    type: 'tag' as const,
  },
  {
    title: 'Công nghệ làm lạnh',
    slug: 'cong-nghe-lam-lanh',
    type: 'tag' as const,
  },
  {
    title: 'Tiết kiệm năng lượng',
    slug: 'tiet-kiem-nang-luong',
    type: 'tag' as const,
  },
  {
    title: 'Công nghệ mới',
    slug: 'cong-nghe-moi',
    type: 'tag' as const,
  },
  {
    title: 'Hệ thống lạnh',
    slug: 'he-thong-lanh',
    type: 'tag' as const,
  },
  {
    title: 'Bảo trì',
    slug: 'bao-tri',
    type: 'tag' as const,
  },
  {
    title: 'Kỹ thuật viên',
    slug: 'ky-thuat-vien',
    type: 'tag' as const,
  },
  {
    title: 'Inverter',
    slug: 'inverter',
    type: 'tag' as const,
  },
  {
    title: 'Công nghiệp',
    slug: 'cong-nghiep',
    type: 'tag' as const,
  },
  {
    title: 'Thương mại',
    slug: 'thuong-mai',
    type: 'tag' as const,
  },
  {
    title: 'HVAC',
    slug: 'hvac',
    type: 'tag' as const,
  },
  {
    title: 'Chất làm lạnh',
    slug: 'chat-lam-lanh',
    type: 'tag' as const,
  }
];

export async function POST(_request: NextRequest) {
  try {
    console.log('🌱 Starting event tags seeding process...');

    const payload = await getPayload({ config: configPromise });

    // Check existing tags
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

    for (const tagData of eventTagsData) {
      // Check if tag already exists
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
        console.error(`❌ Error creating tag "${tagData.title}":`, error);
      }
    }

    console.log(`🎉 Event tags seeding completed! Created ${createdTags.length} tags.`);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdTags.length} event tags`,
      createdTags: createdTags.map(tag => ({
        id: tag.id,
        title: tag.title,
        slug: tag.slug,
      })),
    });
  } catch (error) {
    console.error('❌ Error seeding event tags:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to seed event tags',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
