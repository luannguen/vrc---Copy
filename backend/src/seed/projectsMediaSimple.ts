import type { Payload } from 'payload'
import { getImageForCollectionItem, getOrCreateDefaultMediaId } from './utils/seedMediaManagement'
import { progressManager } from './utils/progressUtils'

/**
 * Seed projects media - Upload ảnh cho projects từ frontend theo pattern của seed posts
 * Sử dụng utility functions có sẵn trong seedMediaManagement.ts
 */
export const seedProjectsMedia = async (payload: Payload) => {
  try {
    console.log('🖼️ Seeding projects media...')

    // Get default media for fallback
    const defaultMediaId = await getOrCreateDefaultMediaId(payload)
    console.log('Default media ID for projects fallback:', defaultMediaId)

    // Define project types and sample project names
    const projectTypes = [
      { type: 'industrial', samples: ['Nhà máy sản xuất ABC', 'Nhà máy chế biến XYZ', 'Khu công nghiệp DEF'] },
      { type: 'commercial', samples: ['Trung tâm thương mại ABC', 'Tòa nhà văn phòng XYZ', 'Khách sạn DEF'] },
      { type: 'specialized', samples: ['Phòng sạch GMP', 'Kho lạnh đông', 'Phòng máy chủ'] }
    ]

    const results = {
      heroImages: {} as Record<string, string | null>,
      galleryImages: {} as Record<string, string[]>,
      backgroundImage: null as string | null
    }

    // Upload hero background for projects page
    console.log('📸 Uploading projects page hero background...')
    results.backgroundImage = await getImageForCollectionItem(
      payload,
      'project',
      'Projects Hero Background'
    ) || defaultMediaId

    // Upload images for each project type
    progressManager.initProgressBar(projectTypes.length * 4, 'Uploading project images')

    for (const projectType of projectTypes) {
      console.log(`📸 Processing ${projectType.type} project images...`)

      // Upload hero image for this project type
      const heroImage = await getImageForCollectionItem(
        payload,
        'project',
        `${projectType.type} hero`
      )
      results.heroImages[projectType.type] = heroImage || defaultMediaId
      progressManager.increment()

      // Upload gallery images (multiple per type)
      const galleryImages: string[] = []
      for (let i = 0; i < 3; i++) {
        const galleryImage = await getImageForCollectionItem(
          payload,
          'project',
          `${projectType.type} gallery ${i + 1}`
        )
        if (galleryImage) {
          galleryImages.push(galleryImage)
        }
        progressManager.increment()
      }
      results.galleryImages[projectType.type] = galleryImages

      console.log(`✅ ${projectType.type} project media: hero=${results.heroImages[projectType.type] ? 'uploaded' : 'fallback'}, gallery=${galleryImages.length} images`)
    }

    progressManager.complete()

    console.log('🎉 Projects media seeding completed!')
    console.log('📊 Results:', JSON.stringify(results, null, 2))

    return results
  } catch (error) {
    console.error('❌ Error seeding projects media:', error)
    throw error
  }
}
