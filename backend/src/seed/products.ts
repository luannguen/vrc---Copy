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

export const seedProducts = async (payload: Payload) => {
  console.log('📦 Seeding products...');

  try {
    // Fetch existing products to avoid duplicates
    const existingProducts = await payload.find({
      collection: 'products',
      limit: 100,
    });

    // If we already have products, skip
    if (existingProducts.docs.length > 0) {
      console.log(`Found ${existingProducts.docs.length} existing products, skipping seed.`);
      return;
    }// Get or create a default media ID for fallback
    const defaultMediaId = await getOrCreateDefaultMediaId(payload);
    console.log('Default media ID for products fallback:', defaultMediaId);    // Sample products based on the frontend data - with enhanced markdown descriptions
    const products = [
      {
        name: "Điều hòa công nghiệp VRC-5000",
        excerpt: "Hệ thống điều hòa công nghiệp công suất lớn, phù hợp cho nhà xưởng, nhà máy sản xuất",
        description: createRichText(`# Điều hòa công nghiệp VRC-5000

## Tính năng nổi bật
- Công suất lớn, phù hợp không gian rộng
- Tiết kiệm điện với công nghệ Inverter
- Hoạt động êm ái, bền bỉ
- Bảo hành 5 năm

## Thông số kỹ thuật
1. Công suất: 50.000 BTU
2. Điện áp: 380V
3. Khả năng làm mát: 150m²`, 'markdown'),
        category: "industrial",
        featured: true,
        status: "published",
        mainImage: defaultMediaId,
        price: "Liên hệ",
      },
      {
        name: "Kho lạnh bảo quản VRC-KL500",
        excerpt: "Kho lạnh công nghiệp lắp đặt nhanh chóng, bảo quản thực phẩm, dược phẩm với nhiệt độ ổn định",
        description: createRichText(`# Kho lạnh bảo quản VRC-KL500

## Đặc điểm sản phẩm
- Dung tích lớn, phù hợp cho nhà máy, cơ sở sản xuất
- Nhiệt độ ổn định từ -20°C đến +10°C
- Cấu trúc panel cách nhiệt hiệu quả
- Hệ thống kiểm soát độ ẩm thông minh

## Ứng dụng
- Bảo quản thực phẩm
- Bảo quản dược phẩm
- Bảo quản mẫu sinh học
- Lưu trữ vật liệu đặc biệt`, 'markdown'),
        category: "cold-storage",
        featured: true,
        status: "published",
        mainImage: defaultMediaId,
        price: "Liên hệ",
      },
      {
        name: "Hệ thống lạnh thương mại VRC-CS200",
        excerpt: "Thiết bị làm lạnh cho siêu thị, nhà hàng và cửa hàng bán lẻ",
        description: createRichText(`# Hệ thống lạnh thương mại VRC-CS200

## Ưu điểm sản phẩm
- Thiết kế hiện đại, phù hợp không gian thương mại
- Điều chỉnh nhiệt độ linh hoạt
- Tiết kiệm điện năng
- Bảo hành dài hạn

## Phù hợp với
1. Siêu thị mini
2. Nhà hàng
3. Cửa hàng tiện lợi
4. Quầy bar

## Công nghệ
**Công nghệ Inverter** giúp tiết kiệm điện năng hiệu quả.`, 'markdown'),
        category: "commercial",
        featured: true,
        status: "published",
        mainImage: defaultMediaId,
        price: "Liên hệ",
      },
    ];    // Create products
    // Khởi tạo progress bar cho việc upload hình ảnh sản phẩm
    progressManager.initProgressBar(products.length, 'Uploading product images');
    
    for (const product of products) {
      try {
        // Get appropriate image for this product
        const mediaId = await getImageForCollectionItem(
          payload, 
          'product', 
          product.name
        );
        
        // Create product with the appropriate image
        const data = {
          ...product,
          mainImage: mediaId || defaultMediaId
        };
        
        const createdProduct = await payload.create({
          collection: 'products',
          data: data as any, // Using type assertion as a temporary solution
        });
        console.log(`Created product: ${createdProduct.name} with media ID: ${data.mainImage}`);
        
        // Cập nhật tiến trình
        progressManager.increment();
      } catch (error) {
        console.error(`Error creating product ${product.name}:`, error);
        progressManager.increment(); // Vẫn cập nhật nếu có lỗi
      }
    }
    
    // Hoàn thành progress bar
    progressManager.complete();

    console.log(`✅ Successfully seeded products`);
  } catch (error) {
    console.error('Error seeding products:', error);
  }
}
