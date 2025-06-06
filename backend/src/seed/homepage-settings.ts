import { Payload } from 'payload';

// Multilingual content for homepage settings
const multilingualContent = {
  vi: {
    featuredTopics: {
      sectionTitle: 'Sản phẩm nổi bật',
      sectionSubtitle: 'Khám phá các giải pháp điện lạnh hàng đầu của chúng tôi',
    },
    latestPublications: {
      sectionTitle: 'Bài viết mới nhất',
    },
    dataResources: {
      resourcesTitle: 'Dữ liệu & Thống kê năng lượng',
      toolsTitle: 'Công cụ tính toán & Thiết kế',
    },
    contactForm: {
      sectionTitle: 'Liên hệ với chúng tôi',
      sectionSubtitle: 'Để lại thông tin, chúng tôi sẽ tư vấn cho bạn',
      successMessage: 'Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.',
    },
    seo: {
      metaTitle: 'VRC - Giải pháp điện lạnh công nghiệp hàng đầu Việt Nam',
      metaDescription: 'VRC cung cấp giải pháp điện lạnh công nghiệp toàn diện với công nghệ tiên tiến, dịch vụ chuyên nghiệp và hỗ trợ kỹ thuật 24/7.',
    },
    maintenance: {
      message: 'Hệ thống đang được bảo trì. Vui lòng quay lại sau.',
    },
  },
  en: {
    featuredTopics: {
      sectionTitle: 'Featured Products',
      sectionSubtitle: 'Discover our leading refrigeration solutions',
    },
    latestPublications: {
      sectionTitle: 'Latest Articles',
    },
    dataResources: {
      resourcesTitle: 'Energy Data & Statistics',
      toolsTitle: 'Calculation & Design Tools',
    },
    contactForm: {
      sectionTitle: 'Contact Us',
      sectionSubtitle: 'Leave your information, we will advise you',
      successMessage: 'Thank you! We will contact you as soon as possible.',
    },
    seo: {
      metaTitle: 'VRC - Leading Industrial Refrigeration Solutions in Vietnam',
      metaDescription: 'VRC provides comprehensive industrial refrigeration solutions with advanced technology, professional services and 24/7 technical support.',
    },
    maintenance: {
      message: 'System is under maintenance. Please come back later.',
    },
  },
  tr: {
    featuredTopics: {
      sectionTitle: 'Öne Çıkan Ürünler',
      sectionSubtitle: 'Önde gelen soğutma çözümlerimizi keşfedin',
    },
    latestPublications: {
      sectionTitle: 'Son Makaleler',
    },
    dataResources: {
      resourcesTitle: 'Enerji Verileri ve İstatistikleri',
      toolsTitle: 'Hesaplama ve Tasarım Araçları',
    },
    contactForm: {
      sectionTitle: 'Bizimle İletişime Geçin',
      sectionSubtitle: 'Bilgilerinizi bırakın, size danışmanlık verelim',
      successMessage: 'Teşekkürler! En kısa sürede sizinle iletişime geçeceğiz.',
    },
    seo: {
      metaTitle: 'VRC - Vietnam\'da Önde Gelen Endüstriyel Soğutma Çözümleri',
      metaDescription: 'VRC, ileri teknoloji, profesyonel hizmetler ve 7/24 teknik destek ile kapsamlı endüstriyel soğutma çözümleri sunar.',
    },
    maintenance: {
      message: 'Sistem bakım altındadır. Lütfen daha sonra tekrar gelin.',
    },
  },
};

// Common non-localized data structure (matching actual globals schema)
const baseHomepageData = {
  heroSection: {
    enableCarousel: true,
    autoSlideInterval: 6,
    // Will use banners from existing collection
  },
  featuredSection: {
    isEnabled: true,
    // title and description will be set per locale
    viewAllLink: '/products',
  },
  publicationsSection: {
    isEnabled: true,
    // title and description will be set per locale
    displayMode: 'auto',
    numberOfPosts: 4,
    viewAllLink: '/publications',
  },
  resourcesSection: {
    isEnabled: true,
    // title will be set per locale for both panels
    leftPanel: {
      description: 'Truy cập cơ sở dữ liệu toàn diện về hiệu suất năng lượng, thống kê tiêu thụ và xu hướng thị trường mới nhất.',
      features: [
        { text: 'Thống kê tiêu thụ điện quốc gia' },
        { text: 'Dữ liệu hiệu suất thiết bị' },
        { text: 'Xu hướng công nghệ xanh' },
        { text: 'Báo cáo phân tích thị trường' },
      ],
      linkText: 'Xem thống kê',
      linkUrl: '/data/statistics',
    },
    rightPanel: {
      description: 'Bộ công cụ chuyên nghiệp hỗ trợ tính toán tải nhiệt, thiết kế hệ thống và lựa chọn thiết bị phù hợp.',
      features: [
        { text: 'Tính toán tải nhiệt phòng' },
        { text: 'Thiết kế hệ thống điều hòa' },
        { text: 'Chọn thiết bị phù hợp' },
        { text: 'Ước tính chi phí lắp đặt' },
      ],
      linkText: 'Khám phá công cụ',
      linkUrl: '/data/tools',
    },
  },
  contactSection: {
    isEnabled: true,
    backgroundColor: 'gray' as const,
  },
  maintenance: {
    isEnabled: false,
  },
};

export const seedHomepageSettings = async (payload: Payload) => {
  console.log('🏠 Seeding multilingual homepage settings...');

  try {
    // Check if homepage settings already exist
    let existingSettings;
    try {
      existingSettings = await payload.findGlobal({
        slug: 'homepage-settings',
        locale: 'vi', // Check with default locale
      });    } catch (_error) {
      console.log('No existing homepage settings found, will create new ones');
      existingSettings = null;
    }// Seed for each locale to ensure multilingual support
    const locales: ('vi' | 'en' | 'tr')[] = ['vi', 'en', 'tr'];

    for (const locale of locales) {
      console.log(`📝 Seeding homepage settings for locale: ${locale}`);

      // Get multilingual content for this locale
      const content = multilingualContent[locale as keyof typeof multilingualContent];

      // Merge base data with localized content
      const localeData = {
        ...baseHomepageData,
        // Override with localized content for featuredSection
        featuredSection: {
          ...baseHomepageData.featuredSection,
          title: content.featuredTopics.sectionTitle,
          description: content.featuredTopics.sectionSubtitle,
        },
        // publicationsSection mapping
        publicationsSection: {
          ...baseHomepageData.publicationsSection,
          title: content.latestPublications.sectionTitle,
          description: 'Tham khảo các báo cáo, nghiên cứu và hướng dẫn mới nhất',
          displayMode: 'auto' as const,
        },
        // resourcesSection mapping
        resourcesSection: {
          ...baseHomepageData.resourcesSection,
          title: 'Công cụ & Tài nguyên',
          description: 'Truy cập các công cụ tính toán, dữ liệu phân tích và tài nguyên hỗ trợ',
          leftPanel: {
            ...baseHomepageData.resourcesSection?.leftPanel,
            title: content.dataResources.resourcesTitle,
            description: 'Truy cập cơ sở dữ liệu toàn diện về hiệu suất năng lượng, thống kê tiêu thụ và xu hướng thị trường mới nhất.',
          },
          rightPanel: {
            ...baseHomepageData.resourcesSection?.rightPanel,
            title: content.dataResources.toolsTitle,
            description: 'Bộ công cụ chuyên nghiệp hỗ trợ tính toán tải nhiệt, thiết kế hệ thống và lựa chọn thiết bị phù hợp.',
          },
        },
        // contactSection mapping
        contactSection: {
          ...baseHomepageData.contactSection,
        },
        // seoSettings mapping
        seoSettings: {
          metaTitle: content.seo.metaTitle,
          metaDescription: content.seo.metaDescription,
          metaKeywords: 'điện lạnh, công nghiệp, VRC, giải pháp năng lượng',
        },
        // maintenance mapping
        maintenance: {
          ...baseHomepageData.maintenance,
        },
      };

      // If existing settings and this is not the first locale, check if it's actually localized
      // If no existing settings or this is the first locale, create/update fully
      if (existingSettings && locale !== 'vi') {
        // For non-default locales, check if the data is actually localized
        try {
          const localeSettings = await payload.findGlobal({
            slug: 'homepage-settings',
            locale,
          });

          // Check if this locale has been properly localized by comparing title
          // If the title matches the expected locale content, it's already localized
          const expectedTitle = content.featuredTopics.sectionTitle;
          const currentTitle = (localeSettings as unknown as { featuredSection?: { title?: string } })?.featuredSection?.title;

          if (currentTitle && currentTitle === expectedTitle) {
            console.log(`⚠️ Locale ${locale} data already localized, skipping to preserve existing data`);
            continue;
          } else {
            console.log(`🔄 Locale ${locale} needs localization (current: "${currentTitle}", expected: "${expectedTitle}")`);
          }
        } catch (_error) {
          // Locale data doesn't exist, proceed with seeding
          console.log(`📝 Locale ${locale} data not found, proceeding with seeding`);
        }
      }

      await payload.updateGlobal({
        slug: 'homepage-settings',
        locale,
        data: localeData,
      });

      console.log(`✅ Homepage settings seeded successfully for locale: ${locale}`);
    }

    console.log('✅ All homepage settings seeded successfully across all locales');
  } catch (error) {
    console.error('❌ Error seeding homepage settings:', error);
    throw error;
  }
};
