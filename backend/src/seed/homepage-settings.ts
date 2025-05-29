import { Payload } from 'payload';

export const seedHomepageSettings = async (payload: Payload) => {
  console.log('🏠 Seeding homepage settings...');

  try {
    await payload.updateGlobal({
      slug: 'homepage-settings',
      data: {
        heroSection: {
          enableCarousel: true,
          autoSlideInterval: 6,
          // Will use banners from existing collection
        },
        featuredSection: {
          isEnabled: true,
          title: 'Sản phẩm nổi bật',
          description: 'Khám phá các giải pháp điện lạnh hàng đầu của chúng tôi',
          // Will use products from existing collection
          viewAllLink: '/products',
        },
        publicationsSection: {
          isEnabled: true,
          title: 'Bài viết mới nhất',
          description: 'Tham khảo các báo cáo, nghiên cứu và hướng dẫn mới nhất',
          displayMode: 'auto',
          numberOfPosts: 4,
          viewAllLink: '/publications',
        },
        resourcesSection: {
          isEnabled: true,
          title: 'Công cụ & Tài nguyên',
          description: 'Truy cập các công cụ tính toán, dữ liệu phân tích và tài nguyên hỗ trợ',
          leftPanel: {
            title: 'Dữ liệu & Thống kê năng lượng',
            description: 'Truy cập cơ sở dữ liệu toàn diện về hiệu suất năng lượng, thống kê tiêu thụ và xu hướng thị trường mới nhất.',
            features: [
              { text: 'Thống kê tiêu thụ điện quốc gia' },
              { text: 'Dữ liệu hiệu suất thiết bị' },
              { text: 'Xu hướng công nghệ xanh' },
              { text: 'Báo cáo phân tích thị trường' },
            ],
            linkText: 'Xem thống kê',
            linkUrl: '/data/statistics',
          },
          rightPanel: {
            title: 'Công cụ tính toán & Thiết kế',
            description: 'Bộ công cụ chuyên nghiệp hỗ trợ tính toán tải nhiệt, thiết kế hệ thống và lựa chọn thiết bị phù hợp.',
            features: [
              { text: 'Tính toán tải nhiệt phòng' },
              { text: 'Thiết kế hệ thống điều hòa' },
              { text: 'Chọn thiết bị phù hợp' },
              { text: 'Ước tính chi phí lắp đặt' },
            ],
            linkText: 'Khám phá công cụ',
            linkUrl: '/data/tools',
          },
        },
        contactSection: {
          isEnabled: true,
          backgroundColor: 'gray',
        },
        seoSettings: {
          metaTitle: 'VRC - Giải pháp điện lạnh công nghiệp hàng đầu Việt Nam',
          metaDescription: 'VRC cung cấp giải pháp điện lạnh công nghiệp toàn diện với công nghệ tiên tiến, dịch vụ chuyên nghiệp và hỗ trợ kỹ thuật 24/7.',
          metaKeywords: 'điện lạnh công nghiệp, máy lạnh công nghiệp, hệ thống làm lạnh, thiết bị điều hòa, VRC Vietnam',
        },
      },
    });

    console.log('✅ Homepage settings seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding homepage settings:', error);
    throw error;
  }
};
