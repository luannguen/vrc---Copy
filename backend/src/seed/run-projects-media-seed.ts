#!/usr/bin/env tsx

/**
 * Script riêng để seed project media, không cần chạy toàn bộ seed
 * Sử dụng: npm run seed:projects-media
 */

import { seedProjectsMedia } from './projectsMedia'

const runProjectsMediaSeed = async () => {
  try {
    console.log('🚀 Starting Projects Media Seed...')

    // Chạy seed projects media (hàm tự tạo payload instance)
    await seedProjectsMedia()

    console.log('🎉 Projects Media Seed completed successfully!')

  } catch (error) {
    console.error('❌ Error during Projects Media Seed:', error)
    process.exit(1)
  }

  process.exit(0)
}

runProjectsMediaSeed()
