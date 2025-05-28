import { Payload } from 'payload';

// Import our improved media management utilities
import { 
  getImageForCollectionItem,
  getOrCreateDefaultMediaId 
} from './utils/seedMediaManagement';

// Import RichText utils with advanced formatting
import { createRichText } from './utils/richTextUtils';

// Import progress bar manager
import { progressManager } from './utils/progressUtils';

export const seedServices = async (payload: Payload) => {
  console.log('🛠️ Seeding services...');

  try {
    // Fetch existing services to avoid duplicates
    const existingServices = await payload.find({
      collection: 'services',
      limit: 100,
    });

    // If we already have services, skip
    if (existingServices.docs.length > 0) {
      console.log(`Found ${existingServices.docs.length} existing services, skipping seed.`);
      return;
    }    // Get or create a default media ID for fallback
    const defaultMediaId = await getOrCreateDefaultMediaId(payload);
    console.log('Default media ID for services fallback:', defaultMediaId);    // Sample services based on the frontend data - with rich markdown content
    const services = [
      {
        title: "Dịch vụ bảo trì chuyên nghiệp",
        summary: "Đội ngũ kỹ thuật hàng đầu, phục vụ 24/7 cho các hệ thống điện lạnh công nghiệp và thương mại",
        type: "maintenance", // Required field
        featured: true,
        status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText(`# Dịch vụ bảo trì chuyên nghiệp

## Dịch vụ của chúng tôi bao gồm:

1. Bảo trì định kỳ các hệ thống điều hòa
2. Kiểm tra và làm sạch thiết bị
3. Thay thế phụ tùng theo định kỳ
4. Cập nhật phần mềm điều khiển
5. Báo cáo tình trạng và đề xuất cải tiến

## Đội ngũ kỹ thuật
- **Kỹ sư lạnh** với hơn 10 năm kinh nghiệm
- **Nhân viên kỹ thuật** được đào tạo bài bản
- **Tư vấn viên** am hiểu sản phẩm và nhu cầu khách hàng

Liên hệ ngay để được tư vấn gói bảo trì phù hợp!`, 'markdown'),
        price: "Theo hợp đồng",
      },
      {
        title: "Tư vấn giải pháp tiết kiệm năng lượng",
        summary: "Giải pháp xanh cho tương lai bền vững, giúp doanh nghiệp tiết kiệm chi phí",
        type: "consulting", // Required field
        featured: true,
        status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText(`# Tư vấn giải pháp tiết kiệm năng lượng

## Lợi ích khi sử dụng dịch vụ
- Giảm chi phí điện năng lên đến 30%
- Kéo dài tuổi thọ thiết bị
- Giảm phát thải carbon
- Cải thiện hình ảnh doanh nghiệp

## Quy trình tư vấn
1. Đánh giá hiện trạng sử dụng năng lượng
2. Xác định cơ hội tiết kiệm
3. Đề xuất giải pháp cụ thể
4. Phân tích chi phí - lợi ích
5. Hỗ trợ triển khai
6. Đánh giá hiệu quả

### Công nghệ xanh
Chúng tôi áp dụng các **công nghệ tiên tiến** nhằm tối ưu hóa việc sử dụng năng lượng trong mọi công trình.`, 'markdown'),
        price: "Theo dự án",
      },
      {
        title: "Dịch vụ sửa chữa khẩn cấp",
        summary: "Khắc phục sự cố nhanh chóng, hỗ trợ 24/7 cho mọi hệ thống điện lạnh",
        type: "repair", // Required field
        featured: true,
        status: "published",
        featuredImage: defaultMediaId, // Required field
        content: createRichText(`# Dịch vụ sửa chữa khẩn cấp

## Thời gian phản hồi
- **Trong giờ hành chính:** 30 phút
- **Ngoài giờ hành chính:** 60 phút
- **Ngày lễ, Tết:** 90 phút

## Các sự cố chúng tôi xử lý
- Hệ thống ngừng hoạt động
- Rò rỉ gas lạnh
- Tiếng ồn bất thường
- Nhiệt độ không ổn định
- Lỗi điện điều khiển

## Cam kết dịch vụ
1. **Nhanh chóng** - Có mặt sớm nhất có thể
2. **Chuyên nghiệp** - Kỹ thuật viên được đào tạo bài bản
3. **Hiệu quả** - Phát hiện và xử lý tận gốc vấn đề
4. **Minh bạch** - Báo giá trước khi sửa chữa

Hotline hỗ trợ: 1900-xxxx`, 'markdown'),
        price: "Theo giờ",
      },
    ];    // Create services
    // Khởi tạo progress bar cho việc tạo dịch vụ
    progressManager.initProgressBar(services.length, 'Uploading service images');
    
    for (const service of services) {
      try {
        // Get appropriate image for this service
        const mediaId = await getImageForCollectionItem(
          payload, 
          'service', 
          service.title
        );
        
        // Create service with the appropriate image
        const data = {
          ...service,
          featuredImage: mediaId || defaultMediaId
        };
        
        const createdService = await payload.create({
          collection: 'services',
          data: data as any, // Using type assertion as a temporary solution
        });
        console.log(`Created service: ${createdService.title} with media ID: ${data.featuredImage}`);
        
        // Cập nhật tiến trình
        progressManager.increment();
      } catch (error) {
        console.error(`Error creating service ${service.title}:`, error);
        progressManager.increment(); // Vẫn cập nhật nếu có lỗi
      }
    }
    
    // Hoàn thành progress bar
    progressManager.complete();

    console.log(`✅ Successfully seeded services`);
  } catch (error) {
    console.error('Error seeding services:', error);
  }
}
