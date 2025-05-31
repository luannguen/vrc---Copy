import { seedProjectCategories } from './src/seed/project-categories.js';
import { seedForms } from './src/seed/forms.js';

async function runSeed() {
  try {
    console.log('🚀 Bắt đầu tạo dữ liệu mẫu...');

    await seedProjectCategories();
    console.log('✅ Hoàn thành danh mục dự án!');

    await seedForms();
    console.log('✅ Hoàn thành forms!');

    console.log('🎉 Tất cả hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

runSeed();
