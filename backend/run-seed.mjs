import { seedProjectCategories } from './src/seed/project-categories.ts';
import { seedForms } from './src/seed/forms.ts';
import { seedTechnologies } from './src/seed/technologies.ts';
import { seedFAQs } from './src/seed/faqs.ts';

async function runSeed() {
  try {
    console.log('🚀 Bắt đầu tạo dữ liệu mẫu...');

    await seedProjectCategories();
    console.log('✅ Hoàn thành danh mục dự án!');

    await seedForms();
    console.log('✅ Hoàn thành forms!');    await seedTechnologies();
    console.log('✅ Hoàn thành technologies!');

    await seedFAQs();
    console.log('✅ Hoàn thành FAQs!');

    console.log('🎉 Tất cả hoàn thành!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

runSeed();
