/**
 * Script riêng để seed project media - download ảnh từ Unsplash và upload lên backend
 * Chạy: node run-projects-media-seed.mjs
 */

import { seedProjectsMedia } from './src/seed/projectsMedia.ts'

async function runProjectsMediaSeed() {
  try {
    console.log('🚀 Starting Projects Media Seed...')
    console.log('📥 This will download images from Unsplash and upload to backend...')

    // Import payload
    const payload = (await import('./src/payload.config.ts')).default

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
