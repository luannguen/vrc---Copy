// filepath: src/seed/events.ts
import { Payload } from 'payload';

// Import progress bar manager
import { progressManager } from './utils/progressUtils';

export const seedEvents = async (payload: Payload): Promise<void> => {
  console.log('🗓️ Seeding events...');

  try {
    // Fetch existing events to avoid duplicates
    const existingEvents = await payload.find({
      collection: 'events',
      limit: 100,
    });

    // If we already have events, skip
    if (existingEvents.docs.length > 0) {
      console.log(`Found ${existingEvents.docs.length} existing events, skipping seed.`);
      return;
    }

    // Lấy danh mục sự kiện đã tạo trước đó
    const eventCategories = await payload.find({
      collection: 'event-categories' as any,
      limit: 100,
    });

    // Tạo map danh mục để dễ dàng tìm kiếm
    const categoryMap: Record<string, string> = {};
    if (eventCategories?.docs) {
      eventCategories.docs.forEach((cat: any) => {
        if (cat && typeof cat === 'object' && cat.name && cat.id) {
          categoryMap[cat.name] = cat.id;
        }
      });
    }

    // Lấy media mẫu cho hình ảnh sự kiện
    let defaultMediaId: string | null = null;
    try {
      const media = await payload.find({
        collection: 'media',
        limit: 1,
      });
      
      if (media?.docs && media.docs.length > 0 && media.docs[0]?.id) {
        defaultMediaId = media.docs[0].id;
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    }

    if (!defaultMediaId) {
      console.log('⚠️ Warning: No media found for event images. Creating sample media for events...');
      try {
        // Create a placeholder media entry if possible
        const placeholderMedia = await payload.create({
          collection: 'media',
          data: {
            alt: 'Placeholder Event Image',
          },
          filePath: './public/placeholder.svg', // Use a placeholder from the public directory
        });
        
        if (placeholderMedia?.id) {
          defaultMediaId = placeholderMedia.id;
        }
      } catch (mediaError) {
        console.error('Failed to create placeholder media:', mediaError);
        console.log('⚠️ Events may fail to create due to missing required featuredImage!');
      }
    }

    // Helper to convert markdown to richText format
    const markdownToRichText = (markdown: string) => {
      return {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  text: markdown,
                  type: 'text',
                  version: 1
                }
              ],
              direction: null as any,
              format: '' as any,
              indent: 0,
              version: 1
            }
          ],
          direction: 'ltr' as 'ltr' | 'rtl' | null,
          format: '' as any,
          indent: 0,
          version: 1
        }
      };
    };

    // Sample events based on the frontend data
    const events = [
      {
        title: "Triển lãm Quốc tế về Hệ thống Lạnh và Điều hòa Không khí",
        summary: "Sự kiện triển lãm quốc tế lớn nhất trong năm về các giải pháp và sản phẩm mới trong lĩnh vực hệ thống làm lạnh và điều hòa không khí.",
        content: `
# Triển lãm Quốc tế về Hệ thống Lạnh và Điều hòa Không khí

Sự kiện triển lãm quốc tế lớn nhất trong năm 2025 về các giải pháp và sản phẩm mới trong lĩnh vực hệ thống làm lạnh và điều hòa không khí.

## Thông tin sự kiện

- **Thời gian**: 15/05/2025 - 18/05/2025
- **Địa điểm**: Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC), Quận 7, TP.HCM
- **Đơn vị tổ chức**: Hiệp hội Điện lạnh Việt Nam
- **Quy mô dự kiến**: 2500 người tham dự

## Nội dung chính

- Trưng bày các sản phẩm và giải pháp mới nhất trong ngành điện lạnh
- Hội thảo chuyên đề về công nghệ tiết kiệm năng lượng
- Giao lưu kết nối doanh nghiệp
- Chương trình tư vấn kỹ thuật trực tiếp

## Đối tượng tham dự

- Các doanh nghiệp trong ngành điện lạnh
- Chuyên gia, kỹ sư, nhà thiết kế
- Khách hàng doanh nghiệp và cá nhân quan tâm

VRC sẽ tham gia triển lãm với gian hàng trưng bày các giải pháp tiên tiến mới nhất. Hãy ghé thăm gian hàng của chúng tôi tại vị trí A12-15!
        `,
        featuredImage: defaultMediaId,
        startDate: new Date("2025-05-15"),
        endDate: new Date("2025-05-18"),
        location: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC), Quận 7, TP.HCM",
        organizer: "Hiệp hội Điện lạnh Việt Nam",
        eventType: "exhibition",
        categories: categoryMap['Triển lãm'] ? [
          { relationTo: 'event-categories' as any, value: categoryMap['Triển lãm'] }
        ] : undefined,
        participants: 2500,
        tags: [
          { tag: "Triển lãm" },
          { tag: "Điều hòa" },
          { tag: "Công nghệ làm lạnh" }
        ],
        status: "upcoming",
        featured: true,
        publishStatus: "published",
      },
      {
        title: "Hội thảo Công nghệ Tiết kiệm Năng lượng trong Hệ thống Lạnh",
        summary: "Hội thảo chuyên sâu về các công nghệ tiết kiệm năng lượng mới nhất áp dụng trong hệ thống lạnh công nghiệp và thương mại.",
        content: `
# Hội thảo Công nghệ Tiết kiệm Năng lượng trong Hệ thống Lạnh

Hội thảo chuyên sâu về các công nghệ tiết kiệm năng lượng mới nhất áp dụng trong hệ thống lạnh công nghiệp và thương mại.

## Thông tin sự kiện

- **Thời gian**: 20/04/2025, 08:30 - 16:30
- **Địa điểm**: Khách sạn Melia, 44 Lý Thường Kiệt, Hà Nội
- **Đơn vị tổ chức**: VRC
- **Quy mô dự kiến**: 350 người tham dự

## Các chủ đề chính

1. **Công nghệ biến tần tiết kiệm năng lượng thế hệ mới**
   - Tiết kiệm năng lượng lên đến 40%
   - Hệ thống điều khiển thông minh

2. **Hệ thống thu hồi nhiệt**
   - Các giải pháp thu hồi nhiệt tiên tiến
   - Ứng dụng thực tế và hiệu quả kinh tế

3. **Môi chất lạnh thân thiện với môi trường**
   - Xu hướng sử dụng môi chất lạnh tự nhiên
   - Đáp ứng các quy định mới về môi trường

4. **Tối ưu hóa hệ thống HVAC**
   - Thiết kế hiệu quả
   - Giải pháp vận hành tối ưu

## Diễn giả

- PGS.TS. Nguyễn Văn A - Đại học Bách Khoa Hà Nội
- KS. Trần Văn B - Giám đốc Kỹ thuật VRC
- ThS. Lê Thị C - Chuyên gia tư vấn năng lượng

Đăng ký tham dự miễn phí trước ngày 15/04/2025 qua website hoặc hotline của VRC.
        `,
        featuredImage: defaultMediaId,
        startDate: new Date("2025-04-20T08:30:00"),
        endDate: new Date("2025-04-20T16:30:00"),
        location: "Khách sạn Melia, 44 Lý Thường Kiệt, Hà Nội",
        organizer: "VRC",
        eventType: "workshop",
        categories: categoryMap['Hội thảo'] ? [
          { relationTo: 'event-categories' as any, value: categoryMap['Hội thảo'] }
        ] : undefined,
        participants: 350,
        tags: [
          { tag: "Tiết kiệm năng lượng" },
          { tag: "Công nghệ mới" },
          { tag: "Hệ thống lạnh" }
        ],
        status: "upcoming",
        featured: true,
        publishStatus: "published",
      },
      {
        title: "Khóa đào tạo Kỹ thuật viên Bảo trì Hệ thống Lạnh Công nghiệp",
        summary: "Khóa đào tạo chuyên sâu dành cho kỹ thuật viên về quy trình bảo trì, sửa chữa và nâng cấp các hệ thống lạnh công nghiệp quy mô lớn.",
        content: `
# Khóa đào tạo Kỹ thuật viên Bảo trì Hệ thống Lạnh Công nghiệp

Khóa đào tạo chuyên sâu dành cho kỹ thuật viên về quy trình bảo trì, sửa chữa và nâng cấp các hệ thống lạnh công nghiệp quy mô lớn.

## Thông tin khóa học

- **Thời gian**: 10/04/2025 - 12/04/2025
- **Địa điểm**: Trung tâm Đào tạo VRC, Biên Hòa, Đồng Nai
- **Đơn vị tổ chức**: VRC Academy
- **Số lượng học viên**: 180

## Nội dung đào tạo

### Ngày 1: Lý thuyết cơ bản
- Nguyên lý hoạt động của hệ thống lạnh công nghiệp
- Các thành phần chính và chức năng
- Quy trình vận hành tiêu chuẩn

### Ngày 2: Kỹ thuật bảo trì
- Lịch trình bảo trì định kỳ
- Kỹ thuật phát hiện và xử lý sự cố
- Thực hành bảo dưỡng các thiết bị

### Ngày 3: Thực hành và đánh giá
- Thực hành trên mô hình thực tế
- Sử dụng công cụ chẩn đoán và sửa chữa
- Đánh giá kỹ năng và cấp chứng chỉ

## Lợi ích

- Chứng chỉ được công nhận trong ngành
- Tài liệu đào tạo chuyên nghiệp
- Thực hành trên thiết bị hiện đại
- Hỗ trợ tư vấn kỹ thuật sau khóa học

Đăng ký ngay để nhận ưu đãi giảm 15% học phí cho nhóm từ 3 học viên trở lên.
        `,
        featuredImage: defaultMediaId,
        startDate: new Date("2025-04-10"),
        endDate: new Date("2025-04-12"),
        location: "Trung tâm Đào tạo VRC, Biên Hòa, Đồng Nai",
        organizer: "VRC Academy",
        eventType: "training",
        categories: categoryMap['Đào tạo'] ? [
          { relationTo: 'event-categories' as any, value: categoryMap['Đào tạo'] }
        ] : undefined,
        participants: 180,
        tags: [
          { tag: "Đào tạo kỹ thuật" },
          { tag: "Bảo trì" },
          { tag: "Hệ thống lạnh công nghiệp" }
        ],
        status: "upcoming",
        featured: false,
        publishStatus: "published",
      }
    ];    // Create events
    // Khởi tạo progress bar cho việc tạo sự kiện
    progressManager.initProgressBar(events.length, 'Creating events');
    
    for (const event of events) {
      try {
        // Convert the string content to richText format
        const eventData: any = {
          ...event,
          content: markdownToRichText(event.content),
        };

        // Remove categories if it's undefined to prevent validation errors
        if (!eventData.categories || eventData.categories.length === 0) {
          delete eventData.categories;
        }

        await payload.create({
          collection: 'events' as any,
          data: eventData,
        });
        console.log(`✅ Created event: ${event.title}`);
        
        // Cập nhật tiến trình
        progressManager.increment();
      } catch (eventError) {
        console.error(`❌ Error creating event "${event.title}":`, eventError);
        progressManager.increment(); // Vẫn cập nhật nếu có lỗi
      }
    }
    
    // Hoàn thành progress bar
    progressManager.complete();

    console.log(`✅ Successfully seeded ${events.length} events`);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
  }
};
