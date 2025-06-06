#!/usr/bin/env node
/**
 * VRC Multilingual Data Migration Script
 * Migrates existing data to the new multilingual structure
 */

import { writeFileSync } from 'fs';
import { resolve } from 'path';

class DataMigration {
  constructor() {
    this.baseDir = process.cwd();
    this.backendDir = resolve(this.baseDir, 'backend');
  }

  async createMigrationScript() {
    console.log('🔄 Creating multilingual data migration script...\n');

    const migrationScript = `import payload from 'payload';
import { getPayload } from 'payload';

/**
 * Migration script to add multilingual support to existing data
 * This script will:
 * 1. Update existing records to have default language values
 * 2. Create placeholders for additional languages
 */

async function migrateMultilingualData() {
  const payloadInstance = await getPayload({
    config: await import('./src/payload.config.js'),
  });

  console.log('🚀 Starting multilingual data migration...');

  try {
    // Migrate Products
    console.log('📦 Migrating Products...');
    const products = await payloadInstance.find({
      collection: 'products',
      limit: 1000,
      locale: 'all', // Get all locales
    });

    for (const product of products.docs) {
      // Update existing data to have proper locale structure
      await payloadInstance.update({
        collection: 'products',
        id: product.id,
        data: {
          name: {
            vi: product.name || '',
            en: product.name || '',
            tr: product.name || '',
          },
          excerpt: {
            vi: product.excerpt || '',
            en: product.excerpt || '',
            tr: product.excerpt || '',
          },
          // Add more localized fields as needed
        },
        locale: 'vi', // Set default locale
      });
    }

    // Migrate Posts
    console.log('📝 Migrating Posts...');
    const posts = await payloadInstance.find({
      collection: 'posts',
      limit: 1000,
      locale: 'all',
    });

    for (const post of posts.docs) {
      await payloadInstance.update({
        collection: 'posts',
        id: post.id,
        data: {
          title: {
            vi: post.title || '',
            en: post.title || '',
            tr: post.title || '',
          },
          excerpt: {
            vi: post.excerpt || '',
            en: post.excerpt || '',
            tr: post.excerpt || '',
          },
        },
        locale: 'vi',
      });
    }

    // Migrate Services
    console.log('🛠️ Migrating Services...');
    const services = await payloadInstance.find({
      collection: 'services',
      limit: 1000,
      locale: 'all',
    });

    for (const service of services.docs) {
      await payloadInstance.update({
        collection: 'services',
        id: service.id,
        data: {
          name: {
            vi: service.name || '',
            en: service.name || '',
            tr: service.name || '',
          },
          description: {
            vi: service.description || '',
            en: service.description || '',
            tr: service.description || '',
          },
        },
        locale: 'vi',
      });
    }

    // Migrate Company Info Global
    console.log('🏢 Migrating Company Info...');
    const companyInfo = await payloadInstance.findGlobal({
      slug: 'company-info',
      locale: 'all',
    });

    if (companyInfo) {
      await payloadInstance.updateGlobal({
        slug: 'company-info',
        data: {
          companyName: {
            vi: companyInfo.companyName || '',
            en: companyInfo.companyName || '',
            tr: companyInfo.companyName || '',
          },
          companyShortName: {
            vi: companyInfo.companyShortName || '',
            en: companyInfo.companyShortName || '',
            tr: companyInfo.companyShortName || '',
          },
          companyDescription: {
            vi: companyInfo.companyDescription || '',
            en: companyInfo.companyDescription || '',
            tr: companyInfo.companyDescription || '',
          },
          additionalInfo: {
            vi: companyInfo.additionalInfo || null,
            en: companyInfo.additionalInfo || null,
            tr: companyInfo.additionalInfo || null,
          },
        },
        locale: 'vi',
      });
    }

    console.log('✅ Migration completed successfully!');
    console.log('📋 Next steps:');
    console.log('  1. Update translation files with actual content');
    console.log('  2. Test the multilingual functionality');
    console.log('  3. Configure frontend to use new API endpoints');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateMultilingualData()
    .then(() => {
      console.log('🎉 Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

export default migrateMultilingualData;
`;

    const migrationPath = resolve(this.backendDir, 'scripts', 'migrate-multilingual.js');
    writeFileSync(migrationPath, migrationScript);
    console.log(`✅ Created migration script: ${migrationPath}`);
  }

  async createTranslationTemplates() {
    console.log('📝 Creating translation template files...\n');

    // Create a template for missing translations
    const translationTemplate = {
      vi: {
        // Vietnamese (default)
        common: {
          readMore: 'Đọc thêm',
          viewAll: 'Xem tất cả',
          contactUs: 'Liên hệ với chúng tôi',
          learnMore: 'Tìm hiểu thêm',
          getStarted: 'Bắt đầu',
          ourServices: 'Dịch vụ của chúng tôi',
          ourProducts: 'Sản phẩm của chúng tôi',
          aboutUs: 'Giới thiệu về chúng tôi',
        },
        navigation: {
          home: 'Trang chủ',
          about: 'Giới thiệu',
          services: 'Dịch vụ',
          products: 'Sản phẩm',
          projects: 'Dự án',
          news: 'Tin tức',
          contact: 'Liên hệ',
        },
        seo: {
          siteName: 'VRC - Vietnam Research and Consulting',
          defaultTitle: 'VRC - Công ty tư vấn và nghiên cứu hàng đầu Việt Nam',
          defaultDescription: 'VRC cung cấp dịch vụ tư vấn và nghiên cứu chuyên nghiệp, giúp doanh nghiệp phát triển bền vững.',
        }
      },
      en: {
        // English translations
        common: {
          readMore: 'Read More',
          viewAll: 'View All',
          contactUs: 'Contact Us',
          learnMore: 'Learn More',
          getStarted: 'Get Started',
          ourServices: 'Our Services',
          ourProducts: 'Our Products',
          aboutUs: 'About Us',
        },
        navigation: {
          home: 'Home',
          about: 'About',
          services: 'Services',
          products: 'Products',
          projects: 'Projects',
          news: 'News',
          contact: 'Contact',
        },
        seo: {
          siteName: 'VRC - Vietnam Research and Consulting',
          defaultTitle: 'VRC - Leading Research and Consulting Company in Vietnam',
          defaultDescription: 'VRC provides professional consulting and research services to help businesses achieve sustainable growth.',
        }
      },
      tr: {
        // Turkish translations
        common: {
          readMore: 'Daha Fazla Oku',
          viewAll: 'Tümünü Gör',
          contactUs: 'Bizimle İletişime Geçin',
          learnMore: 'Daha Fazla Öğren',
          getStarted: 'Başlayın',
          ourServices: 'Hizmetlerimiz',
          ourProducts: 'Ürünlerimiz',
          aboutUs: 'Hakkımızda',
        },
        navigation: {
          home: 'Ana Sayfa',
          about: 'Hakkımızda',
          services: 'Hizmetler',
          products: 'Ürünler',
          projects: 'Projeler',
          news: 'Haberler',
          contact: 'İletişim',
        },
        seo: {
          siteName: 'VRC - Vietnam Araştırma ve Danışmanlık',
          defaultTitle: 'VRC - Vietnam\'da Lider Araştırma ve Danışmanlık Şirketi',
          defaultDescription: 'VRC, işletmelerin sürdürülebilir büyüme sağlamasına yardımcı olmak için profesyonel danışmanlık ve araştırma hizmetleri sunmaktadır.',
        }
      }
    };

    // Update frontend translation files
    const frontendDir = resolve(this.baseDir, 'vrcfrontend');
    
    Object.entries(translationTemplate).forEach(([locale, translations]) => {
      const translationPath = resolve(frontendDir, 'src', 'i18n', 'locales', `${locale}.json`);
      writeFileSync(translationPath, JSON.stringify(translations, null, 2), 'utf8');
      console.log(`✅ Updated: ${translationPath}`);
    });
  }

  async run() {
    console.log('🌍 VRC Multilingual Data Migration Tool\n');
    
    await this.createMigrationScript();
    await this.createTranslationTemplates();
    
    console.log('\n🎉 Migration setup completed!');
    console.log('\n📋 Next Steps:');
    console.log('  1. Review the migration script before running');
    console.log('  2. Run: cd backend && node scripts/migrate-multilingual.js');
    console.log('  3. Test the multilingual functionality');
    console.log('  4. Update translation content as needed');
  }
}

const migration = new DataMigration();
migration.run().catch(console.error);
