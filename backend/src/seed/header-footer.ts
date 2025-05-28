// filepath: e:\Download\vrc\backend\src\seed\header-footer.ts
import { Payload } from 'payload';
import { progressManager } from './utils/progressUtils';

export const seedHeaderFooter = async (payload: Payload) => {
  console.log('🔖 Seeding header and footer...');
  
  // Initialize progress bar for header and footer (2 items)
  progressManager.initProgressBar(2, 'Creating header and footer');

  try {
    // Check if header already exists
    const existingHeader = await payload.findGlobal({
      slug: 'header',
    }).catch(() => null);

    if (!existingHeader) {
      // Create header
      await payload.updateGlobal({
        slug: 'header',
        data: {
          navItems: [
            {
              link: {
                type: 'custom',
                label: 'Trang chủ',
                url: '/',
                newTab: false,
              }
            },
            {
              link: {
                type: 'custom',
                label: 'Sản phẩm',
                url: '/products',
                newTab: false,
              }
            },
            {
              link: {
                type: 'custom',
                label: 'Dịch vụ',
                url: '/services',
                newTab: false,
              }
            },
            {
              link: {
                type: 'custom',
                label: 'Dự án',
                url: '/projects',
                newTab: false,
              }
            },
            {
              link: {
                type: 'custom',
                label: 'Liên hệ',
                url: '/contact',
                newTab: false,
              }
            }
          ]
        },
      });      console.log('✅ Successfully seeded header');
    } else {
      console.log('Header already exists, skipping seed.');
    }
    
    // Increment progress bar for header
    progressManager.increment();

    // Check if footer already exists
    const existingFooter = await payload.findGlobal({
      slug: 'footer',
    }).catch(() => null);

    if (!existingFooter) {
      // Create footer
      await payload.updateGlobal({
        slug: 'footer',
        data: {
          navItems: [
            {
              link: {
                type: 'custom',
                label: 'Điều khoản sử dụng',
                url: '/terms',
                newTab: false,
              }
            },
            {
              link: {
                type: 'custom',
                label: 'Chính sách bảo mật',
                url: '/privacy',
                newTab: false,
              }
            },
            {
              link: {
                type: 'custom',
                label: 'Sitemap',
                url: '/sitemap.xml',
                newTab: false,
              }
            }
          ]
        },
      });      console.log('✅ Successfully seeded footer');
    } else {
      console.log('Footer already exists, skipping seed.');
    }
    
    // Increment progress bar for footer and complete
    progressManager.increment();
    progressManager.complete();
  } catch (error) {
    console.error('Error seeding header/footer:', error);
    if (progressManager) progressManager.complete();
  }
};
