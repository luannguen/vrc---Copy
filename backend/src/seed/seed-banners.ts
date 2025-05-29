import type { Payload } from 'payload';
import { bannersData } from './banners';
import { uploadBannerImageFromUrl, bannerImageConfigs } from './utils/bannerMediaUtils';

export const seedBanners = async (payload: Payload): Promise<void> => {
  try {
    console.log('🎨 Seeding Banners...');

    // Clear existing banners (optional)
    const existingBanners = await payload.find({
      collection: 'banners',
      limit: 1000,
    });

    if (existingBanners.docs.length > 0) {
      console.log(`Found ${existingBanners.docs.length} existing banners. Clearing them...`);
      for (const banner of existingBanners.docs) {
        await payload.delete({
          collection: 'banners',
          id: banner.id,
        });
      }
    }

    // Create new banners
    let createdCount = 0;
    for (let i = 0; i < Math.min(bannersData.length, bannerImageConfigs.length); i++) {
      const bannerData = bannersData[i];
      const imageConfig = bannerImageConfigs[i];

      if (!bannerData || !imageConfig) {
        console.warn(`   Skipping index ${i} - missing data or image config`);
        continue;
      }

      try {
        console.log(`🎨 Attempting to create banner: ${bannerData.title}`);

        // Upload banner image from URL using matching config
        console.log(`   Using image: ${imageConfig.filename} from ${imageConfig.url}`);
        const imageId = await uploadBannerImageFromUrl(
          payload,
          imageConfig.url,
          imageConfig.alt,
          imageConfig.title
        );

        // Skip if no image could be uploaded (for now, we'll make image required)
        if (!imageId) {
          console.warn(`   Skipping banner ${bannerData.title} - no image available`);
          continue;
        }

        // Prepare banner data (remove imageUrl as it's not part of the collection schema)
        const { imageUrl: _imageUrl, ...bannerDataClean } = bannerData;
        const finalBannerData = {
          ...bannerDataClean,
          image: imageId, // Always include image ID
        };

        console.log(`   Creating banner with image ID: ${imageId}`);

        const banner = await payload.create({
          collection: 'banners',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: finalBannerData as any,
        });

        console.log(`✅ Created banner: ${banner.title} (ID: ${banner.id})`);
        createdCount++;
      } catch (error) {
        console.error(`❌ Error creating banner ${bannerData.title}:`, error);
        if (error instanceof Error) {
          console.error(`   Error message: ${error.message}`);
          console.error(`   Error stack: ${error.stack}`);
        }
      }
    }

    console.log(`✅ Banners seeded successfully! Created ${createdCount}/${bannersData.length} banners.`);
  } catch (error) {
    console.error('❌ Error seeding Banners:', error);
    throw error;
  }
};
