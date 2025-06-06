import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      vi: 'Chi phí dịch vụ của VRC Tech như thế nào?',
      en: 'What are VRC Tech service costs?',
      tr: 'VRC Tech hizmet maliyetleri nasıl?'
    },
    answer: {
      vi: 'Chi phí dịch vụ của chúng tôi được tính dựa trên độ phức tạp, thời gian thực hiện và yêu cầu cụ thể của từng dự án. Vui lòng liên hệ để được tư vấn báo giá chi tiết.',
      en: 'Our service costs are calculated based on complexity, implementation time, and specific requirements of each project. Please contact us for detailed consultation and quotation.',
      tr: 'Hizmet maliyetlerimiz karmaşıklık, uygulama süresi ve her projenin özel gereksinimlerine göre hesaplanmaktadır. Ayrıntılı danışmanlık ve teklif için lütfen bizimle iletişime geçin.'
    },
    searchKeywords: {
      vi: 'chi phí, giá, báo giá, tiền',
      en: 'cost, price, quotation, money',
      tr: 'maliyet, fiyat, teklif, para'
    },
    category: 'payment' as const,
    status: 'published' as const,
    featured: true,
    isPopular: false,
    helpfulCount: 12,
    order: 3
  }
];

export async function POST(_req: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise });

    // Xóa tất cả FAQs hiện có trước
    const existingFAQs = await payload.find({
      collection: 'faqs',
      limit: 1000
    });

    if (existingFAQs.docs.length > 0) {
      for (const faq of existingFAQs.docs) {
        await payload.delete({
          collection: 'faqs',
          id: faq.id
        });
      }
    }

    const results = [];

    // Tạo FAQs mới - tạo một document cho mỗi FAQ rồi update với các locale khác
    for (const faqData of faqsData) {
      // Tạo document với locale mặc định (vi)
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
          viewCount: 0
        },
        locale: 'vi'
      });

      // Update với locale en
      await payload.update({
        collection: 'faqs',
        id: createdFAQ.id,
        data: {
          question: faqData.question.en,
          answer: faqData.answer.en,
          searchKeywords: faqData.searchKeywords.en,
        },
        locale: 'en'
      });

      // Update với locale tr
      await payload.update({
        collection: 'faqs',
        id: createdFAQ.id,
        data: {
          question: faqData.question.tr,
          answer: faqData.answer.tr,
          searchKeywords: faqData.searchKeywords.tr,
        },
        locale: 'tr'
      });

      results.push(createdFAQ);
    }

    return NextResponse.json({
      success: true,
      message: `Đã tạo thành công ${results.length} FAQs với dữ liệu đa ngôn ngữ`,
      data: {
        count: results.length,
        localesCount: 3, // vi, en, tr
        itemsPerLocale: faqsData.length,
        faqs: results.map(r => ({
          id: r.id,
          question: r.question,
          category: r.category
        }))
      }
    });

  } catch (error) {
    console.error('Error seeding FAQs:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to seed FAQs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
