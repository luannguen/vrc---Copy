import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { seedTools } from '../../../seed/seed-tools'

export const dynamic = 'force-dynamic'

export async function GET(_request: NextRequest) {
  try {
    // Check if we're in production environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding is not allowed in production' },
        { status: 403 }
      )
    }

    console.log('Starting tools seeding...')

    // Initialize payload
    const payload = await getPayload({ config })

    await seedTools(payload)
    console.log('Tools seeding completed successfully')

    return NextResponse.json(
      { message: 'Tools seeding completed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Tools seeding failed:', error)
    return NextResponse.json(
      { error: 'Tools seeding failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(_request: NextRequest) {
  try {
    // Check if we're in production environment
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Seeding is not allowed in production' },
        { status: 403 }
      )
    }

    console.log('Starting tools seeding via POST...')

    // Initialize payload
    const payload = await getPayload({ config })

    await seedTools(payload)
    console.log('Tools seeding completed successfully')

    return NextResponse.json(
      { message: 'Tools seeding completed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Tools seeding failed:', error)
    return NextResponse.json(
      { error: 'Tools seeding failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
