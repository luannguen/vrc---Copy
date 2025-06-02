import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(_request: NextRequest) {
  try {
    const payload = await getPayload({ config });

    console.log('🔄 Starting events tags cleanup and re-assignment...');

    // 1. Get all events
    const eventsResult = await payload.find({
      collection: 'events',
      limit: 100,
      depth: 0
    });

    console.log(`📋 Found ${eventsResult.docs.length} events to update`);

    // 2. Get available tag categories
    const tagsResult = await payload.find({
      collection: 'categories',
      where: {
        type: {
          equals: 'tag'
        }
      },
      limit: 100
    });

    console.log(`🏷️ Found ${tagsResult.docs.length} available tags`);

    const availableTags = tagsResult.docs;

    if (availableTags.length === 0) {
      return NextResponse.json({
        error: 'No tags found in categories collection',
        success: false
      }, { status: 400 });
    }

    // 3. Update each event with valid tag relationships
    let updatedCount = 0;

    for (const event of eventsResult.docs) {
      try {
        // Randomly assign 2-4 tags to each event
        const numberOfTags = Math.floor(Math.random() * 3) + 2; // 2-4 tags
        const shuffledTags = [...availableTags].sort(() => 0.5 - Math.random());
        const selectedTags = shuffledTags.slice(0, numberOfTags).map(tag => tag.id);

        await payload.update({
          collection: 'events',
          id: event.id,
          data: {
            tags: selectedTags
          }
        });

        console.log(`✅ Updated event "${event.title}" with ${selectedTags.length} tags`);
        updatedCount++;

      } catch (error) {
        console.error(`❌ Failed to update event ${event.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedCount} events with valid tag relationships`,
      details: {
        totalEvents: eventsResult.docs.length,
        updatedEvents: updatedCount,
        availableTags: availableTags.length
      }
    });

  } catch (error) {
    console.error('Error updating events tags:', error);
    return NextResponse.json(
      {
        error: 'Failed to update events tags',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
