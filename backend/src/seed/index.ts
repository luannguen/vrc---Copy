import { Payload } from 'payload';
import { seedProducts } from './products';
import { seedProductCategories } from './product-categories';
import { seedMedia } from './media';
import { seedServices } from './services';
import { seedProjects } from './projects';
import { seedTechnologies } from './technologies';
import { seedNavigation } from './navigation';
import { seedCompanyInfo } from './company-info';
import { seedHeaderFooter } from './header-footer';
import { seedPosts } from './posts';
import { seedEventCategories } from './event-categories';
import { seedEvents } from './events';
import { seedTools } from './seed-tools';
import { seedResources } from './seed-resources';
import { seedBanners } from './seed-banners';
import { seedHomepageSettings } from './homepage-settings';
import { progressManager } from './utils/progressUtils';

export const seed = async (payload: Payload) => {
  console.log('🌱 Starting seed process...');
  console.log('🖼️ Images will be automatically uploaded from the frontend directory during seeding');
  // Tổng số collection/global cần seed
  const totalSeedTasks = 17; // Increased for media, product categories and products
  progressManager.initProgressBar(totalSeedTasks, 'Seeding application data');

  try {
    // Seed data in a specific order - globals first
    await seedCompanyInfo(payload);
    progressManager.increment();

    await seedHeaderFooter(payload);
    progressManager.increment();

    // Then collections
    await seedNavigation(payload);
    progressManager.increment();

    // Seed Media trước
    await seedMedia(payload);
    progressManager.increment();

    // Seed Product Categories
    await seedProductCategories(payload);
    progressManager.increment();

    // Seed Products
    await seedProducts(payload);
    progressManager.increment();

    await seedServices(payload);
    progressManager.increment();

    await seedProjects(payload);
    progressManager.increment();

    await seedTechnologies(payload);
    progressManager.increment();

    await seedPosts(payload);
    progressManager.increment();

    // Thêm category trước khi thêm events
    await seedEventCategories(payload);
    progressManager.increment();
      await seedEvents(payload);
    progressManager.increment();

    // Seed tools và resources
    await seedTools(payload);
    progressManager.increment();

    await seedResources(payload);
    progressManager.increment();

    // Seed banner carousel
    await seedBanners(payload);
    progressManager.increment();

    // Seed homepage settings (after all related data)
    await seedHomepageSettings(payload);
    progressManager.increment();

    // Hoàn thành progress bar
    progressManager.complete();

    console.log('🌱 Seed process completed!');
    console.log('🖼️ All available frontend images have been uploaded to the backend');
  } catch (error) {
    console.error('❌ Error during seed process:', error);
    progressManager.complete();
  }
};

export default seed;
