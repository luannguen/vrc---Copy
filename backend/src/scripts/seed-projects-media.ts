/**
 * Script để seed project media sử dụng payload runner
 * Chạy: npm run seed:projects-media
 */

import { seedProjectsMedia } from '../seed/projectsMediaSimple'
import type { Payload } from 'payload'

// Payload runner automatically provides the payload instance
export default async function run({ payload }: { payload: Payload }) {
  try {
    console.log('🚀 Starting Projects Media Seed via Payload Runner...')

    // Gọi hàm seedProjectsMedia với payload instance
    await seedProjectsMedia(payload)

    console.log('🎉 Projects Media Seed completed successfully!')
  } catch (error) {
    console.error('❌ Error during Projects Media Seed:', error)
    throw error
  }
}
