import { getPayload } from 'payload';
import config from '@payload-config';

export const seedProjectCategories = async () => {
  try {
    const payload = await getPayload({ config });    // Sample project categories data - sử dụng collection Categories với type project_category
    const categories = [
      {
        title: 'Điều hòa thương mại',
        type: 'project_category' as const,
        slug: 'dieu-hoa-thuong-mai'
      },
      {
        title: 'Điều hòa công nghiệp', 
        type: 'project_category' as const,
        slug: 'dieu-hoa-cong-nghiep'
      },
      {
        title: 'Hệ thống đặc biệt',
        type: 'project_category' as const,
        slug: 'he-thong-dac-biet'
      },
      {
        title: 'Kho lạnh',
        type: 'project_category' as const,
        slug: 'kho-lanh'
      },
      {
        title: 'Điều hòa dân dụng',
        type: 'project_category' as const,
        slug: 'dieu-hoa-dan-dung'
      },
      {
        title: 'Bảo trì & Sửa chữa',
        type: 'project_category' as const,
        slug: 'bao-tri-sua-chua'
      },
    ];

    console.log('Đang thêm dữ liệu mẫu cho danh mục dự án...');

    // Thêm từng danh mục vào collection Categories với type project_category
    for (const category of categories) {
      const exists = await payload.find({
        collection: 'categories',
        where: {
          and: [
            { title: { equals: category.title } },
            { type: { equals: 'project_category' } }
          ]
        },
      });

      if (exists.docs.length === 0) {
        const newCategory = await payload.create({
          collection: 'categories',
          data: category,
        });
        console.log(`✅ Đã tạo danh mục dự án: ${newCategory.title}`);
      } else {
        console.log(`⏭️  Danh mục dự án đã tồn tại: ${category.title}`);
      }
    }    console.log('🎉 Hoàn thành thêm dữ liệu mẫu cho danh mục dự án!');

  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu mẫu danh mục dự án:', error);
    throw error;
  }
};
