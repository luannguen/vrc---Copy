import { getPayload } from 'payload';
import configPromise from '@/payload.config';

// Sample FAQ data cho tất cả 3 ngôn ngữ
const faqsData = [
  {
    question: {
      vi: 'VRC Tech cung cấp những dịch vụ gì?',
      en: 'What services does VRC Tech provide?',
      tr: 'VRC Tech hangi hizmetleri sağlıyor?'
    },
    answer: {
      vi: 'VRC Tech chuyên cung cấp các giải pháp công nghệ thông tin bao gồm phát triển phần mềm, thiết kế website, ứng dụng di động, và tư vấn chuyển đổi số.',
      en: 'VRC Tech specializes in providing information technology solutions including software development, website design, mobile applications, and digital transformation consulting.',
      tr: 'VRC Tech, yazılım geliştirme, web sitesi tasarımı, mobil uygulamalar ve dijital dönüşüm danışmanlığı dahil olmak üzere bilgi teknolojisi çözümleri sağlama konusunda uzmanlaşmıştır.'
    },
    searchKeywords: {
      vi: 'dịch vụ, phần mềm, website, ứng dụng, tư vấn',
      en: 'services, software, website, application, consulting',
      tr: 'hizmetler, yazılım, web sitesi, uygulama, danışmanlık'
    },
    category: 'services' as const,
    status: 'published' as const,
    featured: true,
    isPopular: true,
    helpfulCount: 25,
    order: 1
  },
  {
    question: {
      vi: 'Làm thế nào để liên hệ với VRC Tech?',
      en: 'How to contact VRC Tech?',
      tr: 'VRC Tech ile nasıl iletişime geçilir?'
    },
    answer: {
      vi: 'Bạn có thể liên hệ với chúng tôi qua email: contact@vrctech.vn, điện thoại: +84 123 456 789, hoặc đến trực tiếp văn phòng tại địa chỉ được công bố trên website.',
      en: 'You can contact us via email: contact@vrctech.vn, phone: +84 123 456 789, or visit our office at the address published on the website.',
      tr: 'Bize e-posta yoluyla ulaşabilirsiniz: contact@vrctech.vn, telefon: +84 123 456 789, veya web sitesinde yayınlanan adreste ofisimizi ziyaret edebilirsiniz.'
    },
    searchKeywords: {
      vi: 'liên hệ, email, điện thoại, địa chỉ',
      en: 'contact, email, phone, address',
      tr: 'iletişim, e-posta, telefon, adres'
    },
    category: 'general' as const,
    status: 'published' as const,
    featured: false,
    isPopular: true,
    helpfulCount: 18,
    order: 2
  },
  {
    question: {
      vi: 'Thời gian phát triển một dự án thường mất bao lâu?',
      en: 'How long does it typically take to develop a project?',
      tr: 'Bir projenin geliştirilmesi genellikle ne kadar sürer?'
    },
    answer: {
      vi: 'Thời gian phát triển phụ thuộc vào quy mô và độ phức tạp của dự án. Thông thường, một website đơn giản mất 2-4 tuần, ứng dụng di động mất 2-6 tháng, và hệ thống phần mềm lớn có thể mất 6-12 tháng.',
      en: 'Development time depends on the scale and complexity of the project. Typically, a simple website takes 2-4 weeks, a mobile app takes 2-6 months, and large software systems can take 6-12 months.',
      tr: 'Geliştirme süresi projenin ölçeğine ve karmaşıklığına bağlıdır. Genellikle, basit bir web sitesi 2-4 hafta, bir mobil uygulama 2-6 ay ve büyük yazılım sistemleri 6-12 ay sürebilir.'
    },
    searchKeywords: {
      vi: 'thời gian, phát triển, dự án, website, ứng dụng',
      en: 'time, development, project, website, application',
      tr: 'zaman, geliştirme, proje, web sitesi, uygulama'
    },
    category: 'projects' as const,
    status: 'published' as const,
    featured: true,
    isPopular: false,
    helpfulCount: 12,
    order: 3
  },
  {
    question: {
      vi: 'VRC Tech có hỗ trợ bảo trì sau khi bàn giao dự án không?',
      en: 'Does VRC Tech provide maintenance support after project delivery?',
      tr: 'VRC Tech proje tesliminden sonra bakım desteği sağlıyor mu?'
    },
    answer: {
      vi: 'Có, chúng tôi cung cấp gói bảo trì và hỗ trợ kỹ thuật sau bàn giao. Gói bảo trì bao gồm sửa lỗi, cập nhật bảo mật, và hỗ trợ kỹ thuật trong vòng 6-12 tháng tùy theo gói dịch vụ.',
      en: 'Yes, we provide maintenance and technical support packages after delivery. Maintenance packages include bug fixes, security updates, and technical support for 6-12 months depending on the service package.',
      tr: 'Evet, teslimattan sonra bakım ve teknik destek paketleri sağlıyoruz. Bakım paketleri, hata düzeltmeleri, güvenlik güncellemeleri ve hizmet paketine bağlı olarak 6-12 ay teknik destek içerir.'
    },
    searchKeywords: {
      vi: 'bảo trì, hỗ trợ, bàn giao, kỹ thuật',
      en: 'maintenance, support, delivery, technical',
      tr: 'bakım, destek, teslimat, teknik'
    },
    category: 'warranty' as const,
    status: 'published' as const,
    featured: false,
    isPopular: true,
    helpfulCount: 15,
    order: 4
  },
  {
    question: {
      vi: 'Chi phí phát triển một website thường như thế nào?',
      en: 'What are the typical costs for website development?',
      tr: 'Web sitesi geliştirme için tipik maliyetler nelerdir?'
    },
    answer: {
      vi: 'Chi phí phát triển website phụ thuộc vào nhiều yếu tố như thiết kế, tính năng, và độ phức tạp. Website cơ bản từ 10-30 triệu VNĐ, website thương mại điện tử từ 50-200 triệu VNĐ. Chúng tôi sẽ báo giá cụ thể sau khi tư vấn.',
      en: 'Website development costs depend on various factors such as design, features, and complexity. Basic websites range from $400-1200, e-commerce websites from $2000-8000. We will provide specific quotes after consultation.',
      tr: 'Web sitesi geliştirme maliyetleri tasarım, özellikler ve karmaşıklık gibi çeşitli faktörlere bağlıdır. Temel web siteleri $400-1200, e-ticaret web siteleri $2000-8000 arasında değişir. Danışmanlıktan sonra belirli teklifler sunacağız.'
    },
    searchKeywords: {
      vi: 'chi phí, giá, website, báo giá',
      en: 'cost, price, website, quote',
      tr: 'maliyet, fiyat, web sitesi, teklif'
    },
    category: 'payment' as const,
    status: 'published' as const,
    featured: true,
    isPopular: true,
    helpfulCount: 22,
    order: 5
  }
];

export async function seedFAQs() {
  const payload = await getPayload({ config: configPromise });

  console.log('🚀 Bắt đầu tạo dữ liệu mẫu FAQs...');

  try {
    // Kiểm tra xem đã có FAQs nào chưa
    const existingFAQs = await payload.find({
      collection: 'faqs',
      limit: 1,
    });

    if (existingFAQs.totalDocs > 0) {
      console.log('⚠️ Đã có dữ liệu FAQs, bỏ qua seed...');
      return;
    }

    // Tạo FAQs mới cho từng locale
    for (const faqData of faqsData) {
      // Tạo FAQ với locale vi (default)
      const createdFAQ = await payload.create({
        collection: 'faqs',
        data: {
          question: faqData.question.vi,
          answer: faqData.answer.vi,
          searchKeywords: faqData.searchKeywords.vi,
          category: faqData.category,
          status: faqData.status,
          featured: faqData.featured,
          isPopular: faqData.isPopular,
          helpfulCount: faqData.helpfulCount,
          order: faqData.order,
        },
        locale: 'vi',
      });

      // Cập nhật với locale en
      await payload.update({
        collection: 'faqs',
        id: createdFAQ.id,
        data: {
          question: faqData.question.en,
          answer: faqData.answer.en,
          searchKeywords: faqData.searchKeywords.en,
        },
        locale: 'en',
      });

      // Cập nhật với locale tr
      await payload.update({
        collection: 'faqs',
        id: createdFAQ.id,
        data: {
          question: faqData.question.tr,
          answer: faqData.answer.tr,
          searchKeywords: faqData.searchKeywords.tr,
        },
        locale: 'tr',
      });

      console.log(`✅ Đã tạo FAQ: ${faqData.question.vi}`);
    }

    console.log(`🎉 Hoàn thành! Đã tạo ${faqsData.length} FAQs với 3 ngôn ngữ.`);

  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu FAQs:', error);
    throw error;
  }
}

// Chạy nếu file được execute trực tiếp
if (require.main === module) {
  seedFAQs()
    .then(() => {
      console.log('✅ Seed FAQs hoàn thành!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed FAQs thất bại:', error);
      process.exit(1);
    });
}
