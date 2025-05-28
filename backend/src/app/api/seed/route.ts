import { NextResponse } from 'next/server';
import payload from 'payload';
import { seed } from '@/seed';
// Import các hàm seed riêng lẻ
import { seedProducts } from '@/seed/products';
import { seedServices } from '@/seed/services';
import { seedProjects } from '@/seed/projects';
import { seedTechnologies } from '@/seed/technologies';
import { seedNavigation } from '@/seed/navigation';
import { seedCompanyInfo } from '@/seed/company-info';
import { seedHeaderFooter } from '@/seed/header-footer';
import { seedPosts } from '@/seed/posts';
import { seedEventCategories } from '@/seed/event-categories';
import { seedEvents } from '@/seed/events';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Chỉ cho phép chạy trong môi trường development
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ 
        success: false, 
        message: 'Seeding is not allowed in production environment' 
      }, { status: 403 });
    }    // Lấy các tham số truy vấn (nếu có)
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // Loại dữ liệu cần seed
    const _forceOption = searchParams.has('force'); // Force seed (xóa dữ liệu cũ nếu cần)

    // Hiển thị thông báo bắt đầu
    console.log(`🌱 Seeding database through API endpoint...${type ? ` (type: ${type})` : ''}`);
    
    const result = { 
      success: true,
      message: 'Database seeded successfully!',
      details: {}
    };
    
    // Seed dữ liệu theo loại được chỉ định hoặc tất cả
    if (!type || type === 'all') {
      // Seed tất cả dữ liệu
      await seed(payload);
      result.message = 'Full database seed completed successfully!';
    } else {
      // Seed từng loại dữ liệu riêng biệt
      switch(type) {
        case 'products':
          await seedProducts(payload);
          result.details = { type: 'products', completed: true };
          break;
        case 'services':
          await seedServices(payload);
          result.details = { type: 'services', completed: true };
          break;
        case 'projects':
          await seedProjects(payload);
          result.details = { type: 'projects', completed: true };
          break;
        case 'technologies':
          await seedTechnologies(payload);
          result.details = { type: 'technologies', completed: true };
          break;
        case 'navigation':
          await seedNavigation(payload);
          result.details = { type: 'navigation', completed: true };
          break;
        case 'company-info':
          await seedCompanyInfo(payload);
          result.details = { type: 'company-info', completed: true };
          break;
        case 'header-footer':
          await seedHeaderFooter(payload);
          result.details = { type: 'header-footer', completed: true };
          break;
        case 'posts':
          await seedPosts(payload);
          result.details = { type: 'posts', completed: true };
          break;
        case 'events':
          // Seed categories trước, rồi mới seed events
          await seedEventCategories(payload);
          await seedEvents(payload);
          result.details = { type: 'events', completed: true };
          break;
        default:
          result.success = false;
          result.message = `Unknown seed type: ${type}`;
          return NextResponse.json(result, { status: 400 });
      }
      result.message = `Successfully seeded ${type} data`;
    }
    
    // Trả về kết quả thành công
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // Xử lý lỗi
    console.error('❌ Error during seed process:', error);
    return NextResponse.json({
      success: false,
      message: 'Error during seed process',
      error: error instanceof Error ? error.message : String(error),
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
    }, { status: 500 });
  }
}