import type { Payload } from 'payload'
import { uploadMediaFromFrontend } from './utils/uploadMedia'
import { downloadAllProjectImages } from './utils/downloadUnsplashImages'
import path from 'path'
import fs from 'fs'

/**
 * Projects-specific image mappings và upload utilities
 */

// Mapping URLs từ frontend hardcode sang tên file local
export const projectImageMappings = {
  // Industrial Projects Images
  industrial: {
    hero: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    gallery: [
      'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96'
    ]
  },

  // Commercial Projects Images
  commercial: {
    hero: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
    gallery: [
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e',
      'https://images.unsplash.com/photo-1515263487990-61b07816b324',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
    ]
  },

  // Specialized Projects Images
  specialized: {
    hero: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
    gallery: [
      'https://images.unsplash.com/photo-1611091248112-ebe885c3c192',
      'https://images.unsplash.com/photo-1516549655169-df83a0774514',
      'https://images.unsplash.com/photo-1627745193246-1fa1c9404b21'
    ]
  }
}

// Fallback local images có sẵn
export const projectFallbackImages = {
  hero: 'projects-overview.jpg',
  gallery: [
    'service-overview.jpg',
    'projects-overview.jpg',
    'logo.svg' // As last resort
  ]
}

/**
 * Upload hero image cho project từ ảnh đã download
 */
export async function uploadProjectHeroImage(
  payload: Payload,
  projectType: 'industrial' | 'commercial' | 'specialized',
  alt: string
): Promise<string | null> {
  try {
    console.log(`Uploading hero image for ${projectType} project...`)

    // Tìm file hero đã download trong thư mục projects
    const projectsImagesPath = path.join(process.cwd(), '../vrcfrontend/public/assets/images/projects')
    const frontendAssetsPath = path.join(process.cwd(), '../vrcfrontend/public/assets/images')

    const possibleHeroImages = [
      // Ảnh đã download từ Unsplash
      path.join(projectsImagesPath, `${projectType}-hero.jpg`),
      // Ảnh fallback có sẵn
      path.join(frontendAssetsPath, `${projectType}-project.jpg`),
      path.join(frontendAssetsPath, projectFallbackImages.hero),
      path.join(frontendAssetsPath, 'service-overview.jpg'),
    ]

    // Upload first available image
    for (const imagePath of possibleHeroImages) {
      if (fs.existsSync(imagePath)) {
        console.log(`Found hero image: ${imagePath}`)
        return await uploadMediaFromFrontend(payload, imagePath, alt)
      }
    }

    console.warn(`No hero image found for ${projectType}, using fallback`)
    return null
  } catch (error) {
    console.error(`Error uploading hero image for ${projectType}:`, error)
    return null
  }
}

/**
 * Upload gallery images cho project từ ảnh đã download
 */
export async function uploadProjectGalleryImages(
  payload: Payload,
  projectType: 'industrial' | 'commercial' | 'specialized',
  count: number = 4
): Promise<string[]> {
  try {
    console.log(`Uploading ${count} gallery images for ${projectType} project...`)

    const projectsImagesPath = path.join(process.cwd(), '../vrcfrontend/public/assets/images/projects')
    const frontendAssetsPath = path.join(process.cwd(), '../vrcfrontend/public/assets/images')
    const uploadedIds: string[] = []

    // Tìm các ảnh gallery đã download
    const galleryImages = []
    for (let i = 1; i <= 8; i++) {
      const galleryPath = path.join(projectsImagesPath, `${projectType}-gallery-${i}.jpg`)
      if (fs.existsSync(galleryPath)) {
        galleryImages.push(galleryPath)
      }
    }

    // Nếu không có đủ ảnh, dùng ảnh fallback
    if (galleryImages.length < count) {
      const fallbackImages = [
        path.join(frontendAssetsPath, 'projects-overview.jpg'),
        path.join(frontendAssetsPath, 'service-overview.jpg'),
      ]

      for (const fallback of fallbackImages) {
        if (fs.existsSync(fallback) && galleryImages.length < count) {
          galleryImages.push(fallback)
        }
      }
    }

    // Upload tối đa count images
    for (let i = 0; i < Math.min(count, galleryImages.length); i++) {
      const imagePath = galleryImages[i]
      if (imagePath) {
        const alt = `${projectType} project gallery image ${i + 1}`
        const mediaId = await uploadMediaFromFrontend(payload, imagePath, alt)

        if (mediaId) {
          uploadedIds.push(mediaId)
          console.log(`Uploaded gallery image ${i + 1}: ${mediaId}`)
        }
      }
    }

    console.log(`Successfully uploaded ${uploadedIds.length} gallery images for ${projectType}`)
    return uploadedIds
  } catch (error) {
    console.error(`Error uploading gallery images for ${projectType}:`, error)
    return []
  }
}

/**
 * Upload background image cho ProjectsPageSettings hero section
 */
export async function uploadProjectsPageHeroBackground(payload: Payload): Promise<string | null> {
  try {
    console.log('Uploading projects page hero background...')

    const projectsImagesPath = path.join(process.cwd(), '../vrcfrontend/public/assets/images/projects')
    const frontendAssetsPath = path.join(process.cwd(), '../vrcfrontend/public/assets/images')

    const possibleBackgrounds = [
      // Ảnh background đã download từ Unsplash
      path.join(projectsImagesPath, 'projects-hero-bg.jpg'),
      // Ảnh fallback có sẵn
      path.join(frontendAssetsPath, 'projects-hero-bg.jpg'),
      path.join(frontendAssetsPath, 'projects-overview.jpg'),
      path.join(frontendAssetsPath, 'hero-bg.jpg'),
      path.join(frontendAssetsPath, 'service-overview.jpg'),
    ]

    for (const backgroundPath of possibleBackgrounds) {
      if (fs.existsSync(backgroundPath)) {
        console.log(`Found background image: ${backgroundPath}`)
        return await uploadMediaFromFrontend(
          payload,
          backgroundPath,
          'Background image for projects page hero section'
        )
      }
    }

    console.warn('No suitable background image found for projects page hero')
    return null
  } catch (error) {
    console.error('Error uploading projects page hero background:', error)
    return null
  }
}

/**
 * Seed toàn bộ project media - download từ Unsplash và upload lên backend
 */
export const seedProjectsMedia = async (payload: Payload) => {
  try {
    console.log('🖼️ Seeding projects media...')

    // Step 1: Download all Unsplash images
    console.log('📥 Step 1: Downloading images from Unsplash...')
    await downloadAllProjectImages()

    const results = {
      heroBackground: null as string | null,
      projectImages: {} as Record<string, { hero: string | null; gallery: string[] }>
    }

    // Step 2: Upload hero background cho projects page
    console.log('🎨 Step 2: Uploading projects page hero background...')
    results.heroBackground = await uploadProjectsPageHeroBackground(payload)
    if (results.heroBackground) {
      console.log('✅ Projects page hero background uploaded:', results.heroBackground)
    }

    // Step 3: Upload images cho từng loại project
    console.log('📸 Step 3: Uploading project images...')
    const projectTypes: Array<'industrial' | 'commercial' | 'specialized'> = [
      'industrial',
      'commercial',
      'specialized'
    ]

    for (const projectType of projectTypes) {
      console.log(`📸 Processing ${projectType} project images...`)

      // Upload hero image
      const heroImage = await uploadProjectHeroImage(
        payload,
        projectType,
        `Hero image for ${projectType} projects`
      )

      // Upload gallery images
      const galleryImages = await uploadProjectGalleryImages(payload, projectType, 4)

      results.projectImages[projectType] = {
        hero: heroImage,
        gallery: galleryImages
      }

      console.log(`✅ ${projectType} project media: hero=${heroImage ? 'uploaded' : 'failed'}, gallery=${galleryImages.length} images`)
    }

    console.log('🎉 Projects media seeding completed!')
    console.log('📊 Results:', JSON.stringify(results, null, 2))

    return results
  } catch (error) {
    console.error('❌ Error seeding projects media:', error)
    throw error
  }
}
