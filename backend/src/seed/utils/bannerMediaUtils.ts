import { Payload } from 'payload';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

/**
 * Download image from URL and save to temp directory
 */
async function downloadImageFromUrl(url: string, filename: string): Promise<string | null> {
  try {
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, filename);
    const file = fs.createWriteStream(tempFilePath);

    return new Promise((resolve, reject) => {
      const request = url.startsWith('https') ? https : http;

      request.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve(tempFilePath);
        });

        file.on('error', (err) => {
          fs.unlink(tempFilePath, () => {}); // Delete file on error
          reject(err);
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return null;
  }
}

/**
 * Upload banner image from URL to Payload media collection
 */
export async function uploadBannerImageFromUrl(
  payload: Payload,
  imageUrl: string,
  altText: string,
  bannerTitle: string
): Promise<string | null> {
  try {
    console.log(`🖼️ Downloading banner image: ${bannerTitle}`);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `banner-${timestamp}.jpg`;

    // Download image from URL
    const tempFilePath = await downloadImageFromUrl(imageUrl, filename);
    if (!tempFilePath) {
      console.error(`Failed to download image for ${bannerTitle}`);
      return null;
    }

    // Create media record in Payload
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
      },
      filePath: tempFilePath,
    });

    // Clean up temp file
    try {
      fs.unlinkSync(tempFilePath);
    } catch (cleanupError) {
      console.warn(`Could not delete temp file ${tempFilePath}:`, cleanupError);
    }

    if (mediaDoc?.id) {
      console.log(`✅ Uploaded banner image: ${bannerTitle} (ID: ${mediaDoc.id})`);
      return mediaDoc.id;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error uploading banner image for ${bannerTitle}:`, error);
    return null;
  }
}

/**
 * Upload banner image from local file path
 */
export async function uploadBannerImageFromFile(
  payload: Payload,
  imagePath: string,
  altText: string,
  bannerTitle: string
): Promise<string | null> {
  try {
    if (!fs.existsSync(imagePath)) {
      console.error(`Image file not found: ${imagePath}`);
      return null;
    }

    console.log(`🖼️ Uploading banner image from file: ${bannerTitle}`);

    // Create media record in Payload
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: altText,
      },
      filePath: imagePath,
    });

    if (mediaDoc?.id) {
      console.log(`✅ Uploaded banner image: ${bannerTitle} (ID: ${mediaDoc.id})`);
      return mediaDoc.id;
    }

    return null;
  } catch (error) {
    console.error(`❌ Error uploading banner image for ${bannerTitle}:`, error);
    return null;
  }
}

/**
 * Get or create default banner image
 */
export async function getDefaultBannerImage(payload: Payload): Promise<string | null> {
  try {
    // Try to find existing media that could work as banner
    const existingMedia = await payload.find({
      collection: 'media',
      where: {
        alt: {
          contains: 'banner',
        },
      },
      limit: 1,
    });

    if (existingMedia.docs.length > 0 && existingMedia.docs[0]) {
      return existingMedia.docs[0].id;
    }

    // If no banner images found, use any existing media
    const anyMedia = await payload.find({
      collection: 'media',
      limit: 1,
    });

    if (anyMedia.docs.length > 0 && anyMedia.docs[0]) {
      return anyMedia.docs[0].id;
    }

    // If no media at all, create a placeholder
    const placeholderMedia = await payload.create({
      collection: 'media',
      data: {
        alt: 'Default banner placeholder',
        filename: 'banner-placeholder.jpg',
      },
    });

    return placeholderMedia?.id || null;
  } catch (error) {
    console.error('Error getting default banner image:', error);
    return null;
  }
}

// Banner image URLs from frontend HeroSection
export const bannerImageConfigs = [
  {
    filename: 'banner-industrial.jpg',
    url: 'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Hệ thống điện lạnh công nghiệp hiện đại',
    title: 'Hệ thống điện lạnh công nghiệp',
  },
  {
    filename: 'banner-energy.jpg',
    url: 'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Công nghệ tiết kiệm năng lượng xanh',
    title: 'Công nghệ tiết kiệm năng lượng',
  },
  {
    filename: 'banner-maintenance.jpg',
    url: 'https://images.unsplash.com/photo-1551038247-3d9af20df552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    alt: 'Dịch vụ bảo trì chuyên nghiệp 24/7',
    title: 'Dịch vụ bảo trì chuyên nghiệp',
  }
];
