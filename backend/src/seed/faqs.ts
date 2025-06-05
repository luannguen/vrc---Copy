import { getPayload } from 'payload';
import config from '@payload-config';

export const seedFAQs = async (): Promise<void> => {
  console.log('🌱 Seeding FAQs...')

  try {
    const payload = await getPayload({ config });

    // FAQ data dựa trên dữ liệu hardcode của VRC
    const faqsData = [
      {
        question: 'Tổng công ty VRC cung cấp những dịch vụ nào?',
        answer: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'Tổng công ty VRC cung cấp đầy đủ các dịch vụ kỹ thuật lạnh bao gồm: Tư vấn thiết kế hệ thống điều hòa, Lắp đặt điều hòa gia đình và công nghiệp, Bảo trì bảo dưỡng định kỳ, Sửa chữa khẩn cấp 24/7, Cung cấp phụ tùng chính hãng.'
                  }
                ]
              }
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1
          }
        },
        category: 'services' as const,
        tags: [{ tag: 'dịch vụ' }, { tag: 'tư vấn' }, { tag: 'lắp đặt' }],
        isPopular: true,
        featured: true,
        order: 1,
        status: 'published' as const,
        language: 'vi' as const,
        searchKeywords: 'dịch vụ, tư vấn, lắp đặt, bảo trì, sửa chữa, phụ tùng',
      },
      {
        question: 'VRC có hỗ trợ dịch vụ bảo hành không?',
        answer: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'VRC cam kết bảo hành toàn diện: Bảo hành thiết bị 2-5 năm, Bảo hành thi công lắp đặt 2 năm, Hỗ trợ bảo trì miễn phí 6 tháng đầu, Dịch vụ khách hàng 24/7.'
                  }
                ]
              }
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1
          }
        },
        category: 'services' as const,
        tags: [{ tag: 'bảo hành' }, { tag: 'hỗ trợ' }, { tag: 'dịch vụ' }],
        isPopular: true,
        order: 2,
        status: 'published' as const,
        language: 'vi' as const,
        searchKeywords: 'bảo hành, hỗ trợ, dịch vụ, thiết bị, thi công, bảo trì',
      },
      {
        question: 'VRC có những thương hiệu điều hòa nào?',
        answer: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'VRC là đại lý chính thức của các thương hiệu hàng đầu: Daikin, Mitsubishi Electric, Panasonic, LG, Samsung, Gree, Midea. Tất cả sản phẩm đều chính hãng 100%.'
                  }
                ]
              }
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1
          }
        },
        category: 'products' as const,
        tags: [{ tag: 'thương hiệu' }, { tag: 'điều hòa' }, { tag: 'chính hãng' }],
        isPopular: true,
        featured: true,
        order: 3,
        status: 'published' as const,
        language: 'vi' as const,
        searchKeywords: 'thương hiệu, Daikin, Mitsubishi, Panasonic, LG, Samsung',
      },
      {
        question: 'Làm thế nào để chọn công suất điều hòa phù hợp?',
        answer: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'Để chọn công suất phù hợp, cần tính toán dựa trên: Diện tích phòng (600-800 BTU/m²), Chiều cao trần, Số người sử dụng, Thiết bị tỏa nhiệt, Hướng phòng. VRC cung cấp dịch vụ khảo sát miễn phí.'
                  }
                ]
              }
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1
          }
        },
        category: 'products' as const,
        tags: [{ tag: 'công suất' }, { tag: 'tư vấn' }, { tag: 'lựa chọn' }],
        isPopular: true,
        featured: false,
        order: 4,
        status: 'published' as const,
        language: 'vi' as const,
        searchKeywords: 'công suất, BTU, diện tích, tư vấn, khảo sát',
      },
      {
        question: 'Thời gian bảo hành dịch vụ lắp đặt điều hòa là bao lâu?',
        answer: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                version: 1,
                children: [
                  {
                    type: 'text',
                    version: 1,
                    text: 'VRC cam kết bảo hành dịch vụ lắp đặt trong 24 tháng cho thiết bị và 12 tháng cho thi công. Bảo hành bao gồm: Sửa chữa miễn phí các lỗi kỹ thuật, Thay thế linh kiện bị lỗi, Hỗ trợ kỹ thuật 24/7.'
                  }
                ]
              }
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1
          }
        },
        category: 'warranty' as const,
        tags: [{ tag: 'bảo hành' }, { tag: 'lắp đặt' }, { tag: 'điều hòa' }],
        isPopular: true,
        featured: true,
        order: 5,
        status: 'published' as const,
        language: 'vi' as const,
        searchKeywords: 'bảo hành, lắp đặt, điều hòa, thời gian, cam kết',
      }
    ];

    // Xóa tất cả FAQs hiện có
    await payload.delete({
      collection: 'faqs',
      where: {},
    });

    console.log('🗑️ Cleared existing FAQs');

    // Tạo FAQs mới
    for (const faqData of faqsData) {      await payload.create({
        collection: 'faqs' as const,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: faqData as any,
      });
    }

    console.log(`✅ Successfully seeded ${faqsData.length} FAQs`);

  } catch (error) {
    console.error('❌ Error during FAQ seeding:', error)
    throw error
  }
}
