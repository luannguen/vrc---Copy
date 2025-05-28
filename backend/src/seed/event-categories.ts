import { Payload } from 'payload';
import { progressManager } from './utils/progressUtils';

export const seedEventCategories = async (payload: Payload): Promise<void> => {
  try {
    // Danh sách các danh mục sự kiện mẫu
    const categories = [
      {
        name: 'Triển lãm',
        description: 'Các sự kiện triển lãm về sản phẩm, công nghệ và giải pháp lĩnh vực điện lạnh',
        icon: '🏛️',
        featured: true,
        order: 1,
      },
      {
        name: 'Hội thảo',
        description: 'Hội thảo chuyên đề về kỹ thuật, công nghệ mới và giải pháp trong ngành',
        icon: '📊',
        featured: true,
        order: 2,
      },
      {
        name: 'Đào tạo',
        description: 'Các khóa đào tạo, tập huấn kỹ thuật và chuyên môn',
        icon: '🎓',
        featured: true,
        order: 3,
      },
      {
        name: 'Hội nghị',
        description: 'Hội nghị, họp mặt giữa các đối tác, khách hàng trong lĩnh vực',
        icon: '🤝',
        featured: false,
        order: 4,
      },
      {
        name: 'Ra mắt sản phẩm',
        description: 'Sự kiện ra mắt sản phẩm, dịch vụ mới',
        icon: '🚀',
        featured: true,
        order: 5,
      },
      {
        name: 'Diễn đàn',
        description: 'Diễn đàn trao đổi, thảo luận và chia sẻ kinh nghiệm',
        icon: '💬',
        featured: false,
        order: 6,
      },
    ];    console.log('Đang thêm dữ liệu mẫu cho danh mục sự kiện...');

    // Khởi tạo progress bar cho việc tạo danh mục sự kiện
    progressManager.initProgressBar(categories.length, 'Creating event categories');

    // Thêm từng danh mục
    for (const category of categories) {
      const exists = await payload.find({
        collection: 'event-categories',
        where: {
          name: {
            equals: category.name,
          },
        },
      });

      if (exists.docs.length === 0) {
        await payload.create({
          collection: 'event-categories',
          data: {
            ...category,
            slug: category.name
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w\-]+/g, '')
              .replace(/\-\-+/g, '-')
              .replace(/^-+/, '')
              .replace(/-+$/, ''),
          },
        });
        console.log(`✅ Đã thêm danh mục sự kiện: ${category.name}`);
      } else {
        console.log(`⏩ Danh mục sự kiện ${category.name} đã tồn tại, bỏ qua`);
      }
      
      // Cập nhật tiến trình
      progressManager.increment();
    }
    
    // Hoàn thành progress bar
    progressManager.complete();

    console.log('✅ Hoàn thành thêm dữ liệu mẫu cho danh mục sự kiện!');
  } catch (error) {
    console.error('❌ Lỗi khi thêm dữ liệu mẫu cho danh mục sự kiện:', error);
  }
};
