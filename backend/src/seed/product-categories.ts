import { Payload } from 'payload';

export const seedProductCategories = async (payload: Payload) => {
  console.log('📂 Đang tạo seed dữ liệu Product Categories...');

  try {
    // Các danh mục sản phẩm từ FEvrc data
    const categories = [
      {
        title: 'Điều hòa công nghiệp',
        slug: 'dieu-hoa-cong-nghiep',
        description: 'Hệ thống điều hòa công suất lớn cho nhà xưởng, nhà máy'
      },
      {
        title: 'Kho lạnh',
        slug: 'kho-lanh',
        description: 'Hệ thống kho lạnh bảo quản thực phẩm, dược phẩm'
      },
      {
        title: 'Chiller',
        slug: 'chiller',
        description: 'Máy làm lạnh nước công nghiệp'
      },
      {
        title: 'Điều hòa dân dụng',
        slug: 'dieu-hoa-dan-dung',
        description: 'Điều hòa cho gia đình và văn phòng nhỏ'
      },
      {
        title: 'Thiết bị phụ trợ',
        slug: 'thiet-bi-phu-tro',
        description: 'Các thiết bị hỗ trợ như tháp giải nhiệt, hệ thống thông gió'
      },
      {
        title: 'Điều hòa thương mại',
        slug: 'dieu-hoa-thuong-mai',
        description: 'Hệ thống VRV/VRF cho tòa nhà, khách sạn, trung tâm thương mại'
      }
    ];

    const createdCategories = [];

    for (const categoryData of categories) {
      // Kiểm tra danh mục đã tồn tại
      const existing = await payload.find({
        collection: 'product-categories',
        where: {
          slug: { equals: categoryData.slug }
        }
      });

      if (existing.docs.length > 0) {
        console.log(`📂 Category ${categoryData.title} đã tồn tại, bỏ qua...`);
        createdCategories.push(existing.docs[0]);
        continue;
      }

      try {
        const category = await payload.create({
          collection: 'product-categories',
          data: categoryData
        });

        createdCategories.push(category);
        console.log(`✅ Đã tạo category: ${categoryData.title} (ID: ${category.id})`);
      } catch (createError) {
        console.error(`❌ Lỗi tạo category ${categoryData.title}:`, createError);
      }
    }

    console.log(`📂 Hoàn thành seed Product Categories: ${createdCategories.length} danh mục`);
    return createdCategories;

  } catch (error) {
    console.error('❌ Lỗi trong quá trình seed Product Categories:', error);
    throw error;
  }
};
