import payload from 'payload';
import { getPayload } from 'payload';

/**
 * Migration script to add multilingual support to existing data
 * This scrip// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateMultilingualData()
    .then(() => {
      console.log('🎉 Migration process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}. Update existing records to have default language values
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
