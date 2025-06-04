import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function GET(_req: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })

    const result = await payload.findGlobal({
      slug: 'projects-page-settings',
      depth: 2,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching projects page settings:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch projects page settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = await getPayloadHMR({ config: configPromise })
    const data = await req.json()

    const result = await payload.updateGlobal({
      slug: 'projects-page-settings',
      data,
      depth: 2,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating projects page settings:', error)
    return NextResponse.json(
      {
        error: 'Failed to update projects page settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
