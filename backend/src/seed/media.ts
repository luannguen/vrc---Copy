import { Payload } from 'payload';
import fs from 'fs';
import path from 'path';

export const seedMedia = async (payload: Payload) => {
  console.log('📸 Đang tạo seed dữ liệu Media...');

  try {
    // Đường dẫn tới thư mục ảnh trong frontend
    const frontendAssetsPath = path.join(process.cwd(), '..', 'vrcfrontend', 'public', 'assets', 'images');

    // Các ảnh cần upload
    const imagesToUpload = [
      {
        filename: 'projects-overview.jpg',
        alt: 'Tổng quan dự án VRC',
        description: 'Hình ảnh tổng quan về các dự án và sản phẩm của VRC'
      },
      {
        filename: 'service-overview.jpg',
        alt: 'Tổng quan dịch vụ VRC',
        description: 'Hình ảnh tổng quan về các dịch vụ kỹ thuật lạnh của VRC'
      }
    ];

    const uploadedMedia = [];

    for (const imageInfo of imagesToUpload) {
      const imagePath = path.join(frontendAssetsPath, imageInfo.filename);

      // Kiểm tra file tồn tại
      if (!fs.existsSync(imagePath)) {
        console.warn(`⚠️ Không tìm thấy file: ${imagePath}`);
        continue;
      }

      // Kiểm tra xem media đã tồn tại chưa
      const existingMedia = await payload.find({
        collection: 'media',
        where: {
          filename: { equals: imageInfo.filename }
        }
      });

      if (existingMedia.docs.length > 0) {
        console.log(`📷 Media ${imageInfo.filename} đã tồn tại, bỏ qua...`);
        uploadedMedia.push(existingMedia.docs[0]);
        continue;
      }

      try {
        // Đọc file
        const fileBuffer = fs.readFileSync(imagePath);
          // Upload media
        const result = await payload.create({
          collection: 'media',
          data: {
            alt: imageInfo.alt,
          },
          file: {
            data: fileBuffer,
            mimetype: 'image/jpeg',
            name: imageInfo.filename,
            size: fileBuffer.length,
          },
        });

        uploadedMedia.push(result);
        console.log(`✅ Đã upload: ${imageInfo.filename} (ID: ${result.id})`);
      } catch (uploadError) {
        console.error(`❌ Lỗi upload ${imageInfo.filename}:`, uploadError);
      }
    }

    console.log(`📸 Hoàn thành seed Media: ${uploadedMedia.length} ảnh`);
    return uploadedMedia;

  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed Media:', error);
    throw error;
  }
};
