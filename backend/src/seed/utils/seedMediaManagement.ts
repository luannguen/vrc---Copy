import { Payload } from 'payload';
import * as fs from 'fs';
import * as path from 'path';
import { uploadMediaFromFrontend } from './uploadMedia';
import { progressManager } from './progressUtils';

/**
 * Creates a media record without directly uploading a file
 * to avoid TypeScript compatibility issues
 */
export async function createMediaRecord(
  payload: Payload, 
  filename: string, 
  alt: string
): Promise<string | null> {
  try {
    // Initialize progress bar for creating media record
    progressManager.initProgressBar(1, `Creating media record for ${filename}`);
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: alt,
        // In production, we would include more fields as needed
      },
    });
      if (mediaDoc?.id) {
      console.log(`Created media record for ${filename} with ID: ${mediaDoc.id}`);
      progressManager.increment();
      progressManager.complete();
      return mediaDoc.id;
    }
    progressManager.complete(); // Complete progress bar even if failed
    return null;
  } catch (error) {
    console.error(`Error creating media record for ${filename}:`, error);
    progressManager.complete(); // Complete progress bar on error
    return null;
  }
}

/**
 * Type definitions for image mappings
 */
type ImageMapping = {
  default: string;
  images?: Record<string, string>;
};

type CollectionImageMap = {
  [key: string]: ImageMapping;
};

// Map of predefined images for various collections
const imageMap: CollectionImageMap = {
  // Technology image mapping (reuse existing images)
  technology: {
    default: 'service-overview.jpg',
    images: {
      'Inverter DC': 'service-overview.jpg',
      'Smart Control System': 'projects-overview.jpg',
      'Green Refrigerant': 'service-overview.jpg',
    }
  },

  // Partner image mapping
  partner: {
    default: 'logo.svg',
    images: {
      'Daikin': 'logo.svg',
      'Carrier': 'logo.svg', 
      'Mitsubishi Electric': 'logo.svg',
      'Trane': 'logo.svg',
      'LG Electronics': 'logo.svg',
      'York': 'logo.svg',
    }
  },

  // Supplier image mapping
  supplier: {
    default: 'logo.svg',
    images: {
      'Danfoss': 'logo.svg',
      'Emerson': 'logo.svg',
    }
  },

  // Product image mapping
  product: {
    default: 'service-overview.jpg',
  },

  // Service image mapping
  service: {
    default: 'service-overview.jpg',
  },

  // Project image mapping
  project: {
    default: 'projects-overview.jpg',
  },

  // Post image mapping
  post: {
    default: 'service-overview.jpg',
  },
};

import { getImageSearchPaths } from './pathConfig';

/**
 * Directories to search for images in order of preference
 * Sử dụng đường dẫn tuyệt đối từ cấu hình
 */
const imageDirPaths = getImageSearchPaths();

// Cache for already uploaded images to avoid duplicates
const uploadedMediaCache: Record<string, string> = {};

/**
 * Find an image file in the frontend directories
 * 
 * @param fileName Name of the file to find
 * @returns Full path to the found file or null
 */
function findImageInFrontend(fileName: string): string | null {
  for (const dirPath of imageDirPaths) {
    // Đường dẫn đã là tuyệt đối từ pathConfig.ts
    const filePath = path.join(dirPath, fileName);
    
    if (fs.existsSync(filePath)) {
      console.log(`Found image: ${filePath}`);
      return filePath;
    }
  }
  
  console.log(`Could not find image: ${fileName}`);
  return null;
}

/**
 * Get an appropriate image for a collection item
 * 
 * @param payload Payload instance
 * @param collectionType Type of collection (technology, partner, product, etc.)
 * @param itemName Name of the item
 * @returns ID of the uploaded media or null
 */
export async function getImageForCollectionItem(
  payload: Payload,
  collectionType: string,
  itemName: string,
): Promise<string | null> {
  // Normalize collection type for matching
  const normalizedType = collectionType.toLowerCase();
  
  try {
    let imagePath: string | null = null;
    
    // Find specific image for this item
    if (imageMap[normalizedType]?.images?.[itemName]) {
      // Try specific image mapping first
      const fileName = imageMap[normalizedType].images[itemName];
      imagePath = findImageInFrontend(fileName);
    }
    
    // If no specific image found, try collection default
    if (!imagePath && imageMap[normalizedType]?.default) {
      const defaultFileName = imageMap[normalizedType].default;
      imagePath = findImageInFrontend(defaultFileName);
    }
    
    // If still not found, try using any commonly available image
    if (!imagePath) {
      // Try common images that should be available
      const commonOptions = ['logo.svg', 'service-overview.jpg', 'projects-overview.jpg'];
      
      for (const option of commonOptions) {
        const fallbackPath = findImageInFrontend(option);
        if (fallbackPath) {
          imagePath = fallbackPath;
          break;
        }
      }
    }
    
    // If we found an image, upload it
    if (imagePath) {
      // Cache key is combination of collection type and item name
      const cacheKey = `${normalizedType}:${itemName}`;
      
      // Check if we've already uploaded this
      if (uploadedMediaCache[cacheKey]) {
        return uploadedMediaCache[cacheKey];
      }
      
      // Upload the image
      const mediaId = await uploadMediaFromFrontend(
        payload,
        imagePath,
        `Image for ${itemName} (${collectionType})`
      );
      
      if (mediaId) {
        // Cache the result
        uploadedMediaCache[cacheKey] = mediaId;
        return mediaId;
      }
    }
    
    console.warn(`No image found for ${collectionType} - ${itemName}`);
    return null;
  } catch (error) {
    console.error(`Error getting image for ${collectionType} - ${itemName}:`, error);
    return null;
  }
}

/**
 * Get a default media ID or create one if none exists
 */
export async function getOrCreateDefaultMediaId(payload: Payload): Promise<string | null> {
  try {
    // Try to use an existing media item first
    const media = await payload.find({
      collection: 'media',
      limit: 1,
    });
    
    if (media?.docs && media.docs.length > 0 && media.docs[0]?.id) {
      return media.docs[0].id;
    }
    
    // If no media exists, upload the default logo
    const logoPath = findImageInFrontend('logo.svg');
    if (logoPath) {
      return await uploadMediaFromFrontend(payload, logoPath, 'Default logo');
    }
    
    return null;
  } catch (error) {
    console.error('Error getting default media ID:', error);
    return null;
  }
}
