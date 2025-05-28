import { Payload } from 'payload';
import { seedProducts } from './products';
import { seedServices } from './services';
import { seedProjects } from './projects';
import { seedTechnologies } from './technologies';
import { seedNavigation } from './navigation';
import { seedCompanyInfo } from './company-info';
import { seedHeaderFooter } from './header-footer';
import { seedPosts } from './posts';
import { seedEventCategories } from './event-categories';
import { seedEvents } from './events';
import { progressManager } from './utils/progressUtils';

export const seed = async (payload: Payload) => {
  console.log('🌱 Starting seed process...');
  console.log('🖼️ Images will be automatically uploaded from the frontend directory during seeding');

  // Tổng số collection/global cần seed
  const totalSeedTasks = 10;
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
