/**
 * Test script để kiểm tra payload connection
 */
import type { Payload } from 'payload'

export default async function run({ payload }: { payload: Payload }) {
  try {
    console.log('🧪 Testing Payload connection...')

    // Test basic query
    const mediaCount = await payload.count({
      collection: 'media',
    })

    console.log(`✅ Connected successfully! Found ${mediaCount.totalDocs} media items`)

    const projectsCount = await payload.count({
      collection: 'projects',
    })

    console.log(`✅ Found ${projectsCount.totalDocs} projects`)

  } catch (error) {
    console.error('❌ Connection test failed:', error)
    throw error
  }
}
