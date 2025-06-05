import { seedFAQs } from './faqs';

async function runFAQSeed() {
  try {
    console.log('🌱 Bắt đầu tạo dữ liệu FAQs...');
    await seedFAQs();
    console.log('✅ Hoàn thành FAQs!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi FAQ seed:', error);
    console.error((error as Error)?.stack || error);
    process.exit(1);
  }
}

runFAQSeed();
