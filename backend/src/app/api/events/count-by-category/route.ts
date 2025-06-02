import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(_request: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get all events with their categories
    const events = await payload.find({
      collection: 'events',
      limit: 0, // Get all events
      depth: 1, // Include category data
    })

    // Get all categories
    const categories = await payload.find({
      collection: 'event-categories',
      limit: 0,
    })

    // Count events per category
    const categoryCountMap = new Map<string, number>()

    // Initialize all categories with 0 count
    categories.docs.forEach(category => {
      categoryCountMap.set(category.id, 0)
    })

    // Count events per category
    events.docs.forEach((event) => {
      const eventData = event as unknown as Record<string, unknown>
      if (eventData.categories && Array.isArray(eventData.categories)) {
        eventData.categories.forEach((category: unknown) => {
          const categoryObj = category as Record<string, unknown>
          const categoryId = typeof category === 'string' ? category : categoryObj.id as string
          if (categoryId) {
            const currentCount = categoryCountMap.get(categoryId) || 0
            categoryCountMap.set(categoryId, currentCount + 1)
          }
        })
      }
    })

    // Format response
    const result = categories.docs.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: categoryCountMap.get(category.id) || 0
    }))

    return NextResponse.json({
      success: true,
      data: result,
      totalEvents: events.totalDocs
    })
  } catch (error) {
    console.error('Error counting events by category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to count events by category',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
