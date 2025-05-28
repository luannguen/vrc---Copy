import { Payload } from 'payload';
import fs from 'fs';
import path from 'path';
import { PATHS } from './pathConfig';
import { uploadFileWithCache } from './fileUtils';
import { progressManager } from './progressUtils';

/**
 * Maps company names to their respective logo filenames
 * Sử dụng logo mặc định vì các logo riêng không có sẵn
 */
export const companyLogoMap: Record<string, string> = {
  'Daikin': 'logo.svg',
  'Carrier': 'logo.svg',
  'Mitsubishi Electric': 'logo.svg',
  'Trane': 'logo.svg',
  'LG Electronics': 'logo.svg',
  'York': 'logo.svg',
  'Danfoss': 'logo.svg',
  'Emerson': 'logo.svg',
  // Default logo for any missing mappings
  'default': 'logo.svg',
};

/**
 * Maps technology names to their respective image filenames
 * Sử dụng hình ảnh có sẵn thay vì các hình ảnh riêng
 */
export const technologyImageMap: Record<string, string> = {
  'Inverter DC': 'service-overview.jpg',
  'Smart Control System': 'projects-overview.jpg',
  'Green Refrigerant': 'service-overview.jpg',
  // Default technology image
  'default': 'service-overview.jpg',
};

/**
 * Cache of uploaded media IDs to prevent duplicate uploads
 */
const _mediaCache: Record<string, string> = {};

/**
 * Upload an image from the frontend to the backend media collection
 * Triển khai đầy đủ phương pháp upload file thực sự
 * 
 * @param payload Payload instance
 * @param imagePath Path to the image file in the frontend
 * @param alt Alt text for the image
 * @returns The ID of the uploaded media
 */
export async function uploadMediaFromFrontend(
  payload: Payload,
  imagePath: string,
  alt: string
): Promise<string | null> {
  try {
    // Sử dụng hàm tiện ích mới để upload file với cache
    return await uploadFileWithCache(payload, imagePath, alt);
  } catch (error) {
    console.error(`Error uploading media from ${imagePath}:`, error);
    return null;
  }
}

/**
 * Get MIME type for a file extension
 */
function _getMimeType(extension: string): string {
  const types: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'webp': 'image/webp',
  };
  
  return types[extension.toLowerCase()] || 'application/octet-stream';
}

/**
 * Upload company logo from frontend
 * 
 * @param payload Payload instance
 * @param companyName The company name to find the appropriate logo
 * @returns The ID of the uploaded logo
 */
export async function uploadCompanyLogo(
  payload: Payload,
  companyName: string
): Promise<string | null> {  
  // Initialize progress bar for logo upload
  progressManager.initProgressBar(1, `Uploading logo for ${companyName}`);
  
  // Get logo filename with null check, ensure it's always a string
  const logoFilename = companyLogoMap[companyName] ?? companyLogoMap['default'] ?? 'logo.svg';
  
  // Check frontend asset directories for the logo using absolute paths
  const possiblePaths = [
    // Common locations - using absolute paths
    path.join(PATHS.FRONTEND_ASSETS.SVG, logoFilename),
    path.join(PATHS.FRONTEND_ASSETS.IMAGES, logoFilename),
    path.join(PATHS.FRONTEND_ASSETS.UPLOADS, logoFilename),
    // Use default logo if specific logo not found
    path.join(PATHS.FRONTEND_ASSETS.SVG, 'logo.svg'),
  ];
  // Find the first path that exists
  for (const imagePath of possiblePaths) {
    if (fs.existsSync(imagePath)) {
      const mediaId = await uploadMediaFromFrontend(payload, imagePath, `Logo of ${companyName}`);
      progressManager.increment();
      progressManager.complete();
      return mediaId;
    }
  }

  // If no logo is found, use any available image
  const fallbackImage = path.join(process.cwd(), '../vrcfrontend/public/assets/svg/logo.svg');
  if (fs.existsSync(fallbackImage)) {
    const mediaId = await uploadMediaFromFrontend(payload, fallbackImage, `Generic logo for ${companyName}`);
    progressManager.increment();
    progressManager.complete();
    return mediaId;
  }
  
  console.error(`Could not find any suitable logo for ${companyName}`);
  progressManager.complete(); // Complete progress bar even if failed
  return null;
}

/**
 * Upload a technology image from frontend
 */
export async function uploadTechnologyImage(
  payload: Payload,
  technologyName: string
): Promise<string | null> {
  // Initialize progress bar for technology image upload
  progressManager.initProgressBar(1, `Uploading image for technology: ${technologyName}`);
  
  // Ensure we always have a string by providing a fallback
  const imageFilename = technologyImageMap[technologyName] ?? technologyImageMap['default'] ?? 'technology-default.jpg';
  
  // Check frontend asset directories with absolute paths
  const possiblePaths = [
    path.join(PATHS.FRONTEND_ASSETS.IMAGES, imageFilename),
    // Project and service images can be reused for technologies
    path.join(PATHS.FRONTEND_ASSETS.IMAGES, 'projects-overview.jpg'),
    path.join(PATHS.FRONTEND_ASSETS.IMAGES, 'service-overview.jpg'),
  ];
  for (const imagePath of possiblePaths) {
    if (fs.existsSync(imagePath)) {
      const mediaId = await uploadMediaFromFrontend(payload, imagePath, `Image for ${technologyName}`);
      progressManager.increment();
      progressManager.complete();
      return mediaId;
    }
  }

  console.error(`Could not find any suitable image for technology: ${technologyName}`);
  progressManager.complete(); // Complete progress bar even if failed
  return null;
}

/**
 * Get or create a default media item
 * This is a fallback if no suitable image can be found
 */
export async function getDefaultMediaId(payload: Payload): Promise<string | null> {
  try {
    // Initialize progress bar for getting default media
    progressManager.initProgressBar(1, 'Getting default media');
    
    // Try to use an existing media item first
    const media = await payload.find({
      collection: 'media',
      limit: 1,
    });
      if (media?.docs && media.docs.length > 0 && media.docs[0]?.id) {
      progressManager.increment();
      progressManager.complete();
      return media.docs[0].id;
    }
      // If no media exists, upload the default logo using absolute path
    const defaultLogoPath = path.join(PATHS.FRONTEND_ASSETS.SVG, 'logo.svg');
    if (fs.existsSync(defaultLogoPath)) {
      const mediaId = await uploadMediaFromFrontend(payload, defaultLogoPath, 'Default logo');
      progressManager.increment();
      progressManager.complete();
      return mediaId;
    }
    
    progressManager.complete(); // Complete progress bar even if failed
    return null;
  } catch (error) {
    console.error('Error fetching default media:', error);
    progressManager.complete(); // Complete progress bar on error
    return null;
  }
}
