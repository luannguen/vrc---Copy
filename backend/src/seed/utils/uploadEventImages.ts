import { Payload } from 'payload';
import fs from 'fs';
import { uploadFileWithCache } from './fileUtils';
import { progressManager } from './progressUtils';

/**
 * Upload event images used in frontend to backend media collection
 */

interface EventImageMapping {
  filename: string;
  frontendPath: string;
  alt: string;
  description: string;
}

// Mapping của các ảnh được sử dụng trong frontend Events
export const eventImageMappings: EventImageMapping[] = [
  {
    filename: '0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png',
    frontendPath: 'E:\\Download\\vrc - Copy\\vrcfrontend\\public\\lovable-uploads\\0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png',
    alt: 'Triển lãm sự kiện VRC',
    description: 'Hình ảnh cho triển lãm quốc tế và hội nghị khách hàng VRC'
  },
  {
    filename: 'projects-overview.jpg',
    frontendPath: 'E:\\Download\\vrc - Copy\\vrcfrontend\\public\\assets\\images\\projects-overview.jpg',
    alt: 'Hội thảo và dự án VRC',
    description: 'Hình ảnh cho hội thảo và ra mắt sản phẩm'
  },
  {
    filename: 'service-overview.jpg',
    frontendPath: 'E:\\Download\\vrc - Copy\\vrcfrontend\\public\\assets\\images\\service-overview.jpg',
    alt: 'Đào tạo và dịch vụ VRC',
    description: 'Hình ảnh cho khóa đào tạo và diễn đàn'
  },
  // Thêm các ảnh sự kiện cụ thể từ frontend
  {
    filename: 'vrc-post-trien-lam-quoc-te-he-thong-lanh-dieu-hoa-2025.jpeg',
    frontendPath: 'E:\\Download\\vrc - Copy\\vrcfrontend\\public\\assets\\images\\vrc-post-trien-lam-quoc-te-he-thong-lanh-dieu-hoa-2025.jpeg',
    alt: 'Triển lãm Quốc tế Hệ thống Lạnh 2025',
    description: 'Hình ảnh chuyên dụng cho triển lãm quốc tế về hệ thống lạnh và điều hòa không khí'
  },
  {
    filename: 'vrc-post-hoi-thao-cong-nghe-tiet-kiem-nang-luong.jpeg',
    frontendPath: 'E:\\Download\\vrc - Copy\\vrcfrontend\\public\\assets\\images\\vrc-post-hoi-thao-cong-nghe-tiet-kiem-nang-luong.jpeg',
    alt: 'Hội thảo Công nghệ Tiết kiệm Năng lượng',
    description: 'Hình ảnh cho hội thảo về công nghệ tiết kiệm năng lượng'
  },
  {
    filename: 'vrc-post-khoa-dao-tao-ky-thuat-vien-bao-tri.jpeg',
    frontendPath: 'E:\\Download\\vrc - Copy\\vrcfrontend\\public\\assets\\images\\vrc-post-khoa-dao-tao-ky-thuat-vien-bao-tri.jpeg',
    alt: 'Khóa đào tạo Kỹ thuật viên',
    description: 'Hình ảnh cho khóa đào tạo kỹ thuật viên bảo trì'
  },
  {
    filename: 'vrc-post-le-ra-mat-dong-san-pham-dieu-hoa-inverter.jpeg',
    frontendPath: 'E:\\Download\\vrc - Copy\\vrcfrontend\\public\\assets\\images\\vrc-post-le-ra-mat-dong-san-pham-dieu-hoa-inverter.jpeg',
    alt: 'Ra mắt sản phẩm Điều hòa Inverter',
    description: 'Hình ảnh cho lễ ra mắt sản phẩm điều hòa Inverter'
  },
  {
    filename: 'vrc-post-dien-dan-doanh-nghiep-dien-lanh-viet-eu.jpeg',
    frontendPath: 'E:\\Download\\vrc - Copy\\vrcfrontend\\public\\assets\\images\\vrc-post-dien-dan-doanh-nghiep-dien-lanh-viet-eu.jpeg',
    alt: 'Diễn đàn Doanh nghiệp Việt-EU',
    description: 'Hình ảnh cho diễn đàn doanh nghiệp điện lạnh Việt Nam - EU'
  }
];

/**
 * Upload all event images to media collection
 * @param payload Payload instance
 * @returns Object mapping image names to their media IDs
 */
export async function uploadEventImages(payload: Payload): Promise<Record<string, string>> {
  console.log('🖼️ Đang upload ảnh sự kiện...');

  const mediaIds: Record<string, string> = {};
  const totalImages = eventImageMappings.length;

  progressManager.initProgressBar(totalImages, 'Uploading Event Images');
    for (const mapping of eventImageMappings) {
    try {
      // Check if file exists
      if (!fs.existsSync(mapping.frontendPath)) {
        console.warn(`⚠️ File không tồn tại: ${mapping.frontendPath}`);
        progressManager.increment();
        continue;
      }

      // Check if image already uploaded
      const existingMedia = await payload.find({
        collection: 'media',
        where: {
          filename: { equals: mapping.filename }
        },
        limit: 1
      });

      if (existingMedia.docs.length > 0) {
        const existingDoc = existingMedia.docs[0];
        if (existingDoc?.id) {
          mediaIds[mapping.filename] = existingDoc.id;
          console.log(`✅ Ảnh "${mapping.filename}" đã tồn tại (ID: ${existingDoc.id})`);
        }
        progressManager.increment();
        continue;
      }

      // Upload the image
      const mediaId = await uploadFileWithCache(
        payload,
        mapping.frontendPath,
        mapping.alt
      );

      if (mediaId) {
        mediaIds[mapping.filename] = mediaId;
        console.log(`✅ Upload thành công: ${mapping.filename} (ID: ${mediaId})`);
      } else {
        console.error(`❌ Upload thất bại: ${mapping.filename}`);
      }

    } catch (error) {
      console.error(`❌ Lỗi upload ${mapping.filename}:`, error);
    }

    progressManager.increment();
  }

  progressManager.complete();

  console.log(`✅ Hoàn thành upload ${Object.keys(mediaIds).length}/${totalImages} ảnh sự kiện`);
  return mediaIds;
}

/**
 * Get media ID for specific event image
 * @param imageKey Key to identify the image (filename or event type)
 * @param mediaIds Media IDs mapping from uploadEventImages
 * @returns Media ID or fallback ID
 */
export function getEventImageId(imageKey: string, mediaIds: Record<string, string>): string | null {
  // Direct filename lookup
  if (mediaIds[imageKey]) {
    return mediaIds[imageKey];
  }

  // Fallback mappings
  const fallbackMappings: Record<string, string> = {
    'exhibition': 'vrc-post-trien-lam-quoc-te-he-thong-lanh-dieu-hoa-2025.jpeg',
    'workshop': 'vrc-post-hoi-thao-cong-nghe-tiet-kiem-nang-luong.jpeg',
    'training': 'vrc-post-khoa-dao-tao-ky-thuat-vien-bao-tri.jpeg',
    'product-launch': 'vrc-post-le-ra-mat-dong-san-pham-dieu-hoa-inverter.jpeg',
    'forum': 'vrc-post-dien-dan-doanh-nghiep-dien-lanh-viet-eu.jpeg',
    'conference': '0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png',
    'default': 'projects-overview.jpg'
  };
    const fallbackFilename = fallbackMappings[imageKey] || fallbackMappings['default'];
  if (fallbackFilename && mediaIds[fallbackFilename]) {
    return mediaIds[fallbackFilename];
  }

  return Object.values(mediaIds)[0] || null;
}
