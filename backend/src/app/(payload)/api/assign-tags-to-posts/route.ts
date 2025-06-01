import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';

export async function POST(_request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    console.log('🏷️ Starting to assign tags to existing posts...');

    // Get all tags first
    const tagsResponse = await payload.find({
      collection: 'categories',
      where: {
        type: { equals: 'tag' },
      },
      limit: 100,
    });

    const tags = tagsResponse.docs;
    console.log(`📊 Found ${tags.length} tags`);

    // Get all published posts
    const postsResponse = await payload.find({
      collection: 'posts',
      where: {
        _status: { equals: 'published' },
      },
      limit: 20,
    });

    const posts = postsResponse.docs;
    console.log(`📊 Found ${posts.length} posts`);

    if (posts.length === 0 || tags.length === 0) {
      return NextResponse.json({
        message: 'No posts or tags found to assign',
        posts: posts.length,
        tags: tags.length,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tagMap: { [key: string]: any } = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tags.forEach((tag: any) => {
      tagMap[tag.slug] = tag;
    });

    // Define tag assignments based on post titles/content
    const tagAssignments = [
      {
        keywords: ['điện lạnh', 'refrigeration', 'cold', 'lạnh'],
        tagSlugs: ['dien-lanh', 'cong-nghe'],
      },
      {
        keywords: ['triển lãm', 'exhibition', 'expo'],
        tagSlugs: ['trien-lam', 'hop-tac-quoc-te'],
      },
      {
        keywords: ['hội thảo', 'seminar', 'conference'],
        tagSlugs: ['hoi-thao', 'nghien-cuu'],
      },
      {
        keywords: ['công nghệ', 'technology', 'tech'],
        tagSlugs: ['cong-nghe', 'nghien-cuu'],
      },
      {
        keywords: ['tiết kiệm', 'energy', 'efficiency', 'năng lượng'],
        tagSlugs: ['tiet-kiem-nang-luong', 'phat-trien-ben-vung'],
      },
      {
        keywords: ['bảo trì', 'maintenance', 'service'],
        tagSlugs: ['bao-tri'],
      },
      {
        keywords: ['inverter'],
        tagSlugs: ['inverter', 'cong-nghe'],
      },
      {
        keywords: ['quốc tế', 'international', 'global'],
        tagSlugs: ['hop-tac-quoc-te'],
      },
      {
        keywords: ['nghiên cứu', 'research', 'study'],
        tagSlugs: ['nghien-cuu', 'phat-trien-ben-vung'],
      },
    ];

    let updatedCount = 0;

    for (const post of posts) {
      try {
        const postTitle = (post.title || '').toLowerCase();
        const assignedTagIds: string[] = [];

        // Check which tags should be assigned based on title content
        for (const assignment of tagAssignments) {
          const hasKeyword = assignment.keywords.some((keyword) =>
            postTitle.includes(keyword.toLowerCase())
          );

          if (hasKeyword) {
            assignment.tagSlugs.forEach((tagSlug) => {
              const tag = tagMap[tagSlug];
              if (tag && !assignedTagIds.includes(tag.id)) {
                assignedTagIds.push(tag.id);
              }
            });
          }
        }

        // If no specific tags found, assign some default ones
        if (assignedTagIds.length === 0) {
          // Assign 2-3 random relevant tags
          const defaultTags = ['cong-nghe', 'dien-lanh', 'nghien-cuu'];
          defaultTags.slice(0, 2).forEach((tagSlug) => {
            const tag = tagMap[tagSlug];
            if (tag) {
              assignedTagIds.push(tag.id);
            }
          });
        }

        // Update the post with tags
        if (assignedTagIds.length > 0) {
          await payload.update({
            collection: 'posts',
            id: post.id,
            data: {
              tags: assignedTagIds,
            },
          });

          console.log(
            `✅ Updated post "${post.title}" with ${assignedTagIds.length} tags`
          );
          updatedCount++;
        }
      } catch (error) {
        console.error(`❌ Failed to update post "${post.title}":`, error);
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} posts with tags`);

    return NextResponse.json(
      {
        message: 'Posts updated with tags successfully',
        totalPosts: posts.length,
        updatedPosts: updatedCount,
        availableTags: tags.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error assigning tags to posts:', error);
    return NextResponse.json(
      {
        error: 'Failed to assign tags to posts',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
