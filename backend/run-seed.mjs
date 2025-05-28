import { seedProjectCategories } from './src/seed/project-categories.js';

async function runSeed() {
  try {
    console.log('🚀 Bắt đầu tạo danh mục dự án...');
    await seedProjectCategories();
    console.log('✅ Hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

runSeed();
