/**
 * Script riêng để seed project media, không cần chạy toàn bộ seed
 * Chạy: npx tsx src/seed/run-projects-media-only.ts
 */

import { seedProjectsMedia } from './projectsMedia'

async function runProjectsMediaSeed() {
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

// Chạy script
runProjectsMediaSeed()
