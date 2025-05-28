// filepath: e:\Download\vrc\backend\src\seed\navigation.ts
import { Payload } from 'payload';
import { progressManager } from './utils/progressUtils';

export const seedNavigation = async (payload: Payload) => {
  console.log('🧭 Seeding navigation...');

  try {
    // Fetch existing navigation to avoid duplicates
    const existingNav = await payload.find({
      collection: 'navigation',
      limit: 100,
    });

    // If we already have navigation items, skip
    if (existingNav.docs.length > 0) {
      console.log(`Found ${existingNav.docs.length} existing navigation items, skipping seed.`);
      return;
    }    // Create the navigation items with proper structure
    // Khởi tạo progress bar cho việc tạo menu
    progressManager.initProgressBar(2, 'Creating navigation menus');
    
    // Main menu navigation
    await payload.create({
      collection: 'navigation',
      data: {
        title: 'Menu chính',
        type: 'main',
        order: 0,
        status: 'published',
        items: [
          {
            label: 'Trang chủ',
            link: '/',
            target: '_self',
          },
          {
            label: 'Sản phẩm',
            link: '/products',
            target: '_self',
            childItems: [
              {
                label: 'Điều hòa công nghiệp',
                link: '/products/industrial',
                target: '_self',
              },
              {
                label: 'Hệ thống lạnh thương mại',
                link: '/products/commercial',
                target: '_self',
              },
              {
                label: 'Kho lạnh',
                link: '/products/cold-storage',
                target: '_self',
              }
            ]
          },
          {
            label: 'Dịch vụ',
            link: '/services',
            target: '_self',
            childItems: [
              {
                label: 'Bảo trì',
                link: '/maintenance',
                target: '_self',
              },
              {
                label: 'Sửa chữa',
                link: '/repair',
                target: '_self',
              },
              {
                label: 'Tư vấn',
                link: '/consulting',
                target: '_self',
              }
            ]
          },
          {
            label: 'Dự án',
            link: '/projects',
            target: '_self',
          },
          {
            label: 'Tin tức',
            link: '/news',
            target: '_self',
          },
          {
            label: 'Liên hệ',
            link: '/contact',
            target: '_self',
          }
        ]
      }
    });

    // Footer menu
    await payload.create({
      collection: 'navigation',
      data: {
        title: 'Menu footer',
        type: 'footer',
        order: 0,
        status: 'published',
        items: [
          {
            label: 'Sản phẩm',
            link: '/products',
            target: '_self',
            childItems: [
              {
                label: 'Điều hòa công nghiệp',
                link: '/products/industrial',
                target: '_self',
              },
              {
                label: 'Hệ thống lạnh thương mại',
                link: '/products/commercial',
                target: '_self',
              },
              {
                label: 'Kho lạnh',
                link: '/products/cold-storage',
                target: '_self',
              }
            ]
          },
          {
            label: 'Dịch vụ',
            link: '/services',
            target: '_self',
          },
          {
            label: 'Về chúng tôi',
            link: '/about',
            target: '_self',
          },
          {
            label: 'Tin tức',
            link: '/news',
            target: '_self',
          },
          {
            label: 'Liên hệ',
            link: '/contact',
            target: '_self',
          }
        ]
      }
    });    // Cập nhật tiến trình sau khi tạo menu footer
    progressManager.increment();
    
    // Hoàn thành progress bar
    progressManager.complete();
    
    console.log('✅ Successfully seeded navigation');
  } catch (error) {
    console.error('Error seeding navigation:', error);
    progressManager.complete();
  }
};
