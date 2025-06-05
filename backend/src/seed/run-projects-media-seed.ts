#!/usr/bin/env tsx

/**
 * Script riêng để seed project media, không cần chạy toàn bộ seed
 * Sử dụng: npm run seed:projects-media
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import { seedProjectsMedia } from './projectsMedia'

const runProjectsMediaSeed = async () => {
  try {
    console.log('🚀 Starting Projects Media Seed...')

    // Initialize Payload
    const payload = await getPayload({ config })

    // Chạy seed projects media
    await seedProjectsMedia(payload)

    console.log('🎉 Projects Media Seed completed successfully!')

  } catch (error) {
    console.error('❌ Error during Projects Media Seed:', error)
    process.exit(1)
  }

  process.exit(0)
}

runProjectsMediaSeed()
