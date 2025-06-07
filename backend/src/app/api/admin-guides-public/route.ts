import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'

export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload({ config })

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const locale = searchParams.get('locale') || 'vi'
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const category = searchParams.get('category')
    const search = searchParams.get('search')    // Build query filters
    const where: Where = {
      status: {
        equals: 'published'
      }
    }

    if (category && category !== 'all') {
      where.category = {
        equals: category
      }
    }

    if (search) {
      where.or = [
        {
          title: {
            contains: search
          }
        },
        {
          summary: {
            contains: search
          }
        },
        {
          content: {
            contains: search
          }
        }
      ]
    }

    // Fetch admin guides from collection
    const guides = await payload.find({
      collection: 'admin-guides',
      where,
      limit,
      page,
      locale: locale as 'vi' | 'en' | 'tr',
      sort: '-publishedAt'
    })

    return NextResponse.json({
      success: true,
      ...guides
    })

  } catch (error) {
    console.error('Error fetching admin guides:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch admin guides',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await req.json()

    // Create new admin guide
    const guide = await payload.create({
      collection: 'admin-guides',
      data: {
        ...body,
        status: 'draft' // Always create as draft first
      }
    })

    return NextResponse.json({
      success: true,
      data: guide
    })

  } catch (error) {
    console.error('Error creating admin guide:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create admin guide',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    )
  }
}
