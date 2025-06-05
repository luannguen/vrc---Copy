import { seedFAQs } from './src/seed/faqs.ts';

async function runFAQSeed() {
  try {
    console.log('🌱 Bắt đầu tạo dữ liệu FAQs...');
    await seedFAQs();
    console.log('✅ Hoàn thành FAQs!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi FAQ seed:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

runFAQSeed();
