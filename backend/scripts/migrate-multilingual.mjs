#!/usr/bin/env node
/**
 * VRC Multilingual Data Migration Script
 * Migrates existing data to support the new localization structure
 */

import { getPayload } from 'payload';

async function migrateData() {
  console.log('🚀 Starting VRC Multilingual Data Migration...\n');

  try {
    const payload = await getPayload({
      config: await import('../src/payload.config.ts').then(m => m.default)
    });

    // Migrate Products
    console.log('📦 Migrating Products...');
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
      locale: 'all', // Get all locales
    });

    for (const product of products.docs) {
      if (!product.name?.vi) { // Check if Vietnamese version exists
        // Migrate existing data to Vietnamese (default locale)
        const updateData = {
          name: {
            vi: product.name,
            en: `${product.name} (EN)`, // Placeholder
            tr: `${product.name} (TR)`, // Placeholder
          },
          excerpt: {
            vi: product.excerpt,
            en: product.excerpt ? `${product.excerpt} (EN)` : undefined,
            tr: product.excerpt ? `${product.excerpt} (TR)` : undefined,
          },
          description: {
            vi: product.description,
            en: product.description, // Copy for now
            tr: product.description, // Copy for now
          }
        };

        await payload.update({
          collection: 'products',
          id: product.id,
          data: updateData,
          locale: 'vi',
        });

        console.log(`✅ Migrated product: ${product.name}`);
      }
    }

    // Migrate Posts
    console.log('\n📝 Migrating Posts...');
    const posts = await payload.find({
      collection: 'posts',
      limit: 1000,
      locale: 'all',
    });

    for (const post of posts.docs) {
      if (!post.title?.vi) {
        const updateData = {
          title: {
            vi: post.title,
            en: `${post.title} (EN)`,
            tr: `${post.title} (TR)`,
          },
          content: {
            vi: post.content,
            en: post.content,
            tr: post.content,
          }
        };

        await payload.update({
          collection: 'posts',
          id: post.id,
          data: updateData,
          locale: 'vi',
        });

        console.log(`✅ Migrated post: ${post.title}`);
      }
    }

    // Migrate Services
    console.log('\n🛠️ Migrating Services...');
    const services = await payload.find({
      collection: 'services',
      limit: 1000,
      locale: 'all',
    });

    for (const service of services.docs) {
      if (!service.title?.vi) {
        const updateData = {
          title: {
            vi: service.title,
            en: `${service.title} (EN)`,
            tr: `${service.title} (TR)`,
          },
          summary: service.summary ? {
            vi: service.summary,
            en: `${service.summary} (EN)`,
            tr: `${service.summary} (TR)`,
          } : undefined,
          content: {
            vi: service.content,
            en: service.content,
            tr: service.content,
          }
        };

        await payload.update({
          collection: 'services',
          id: service.id,
          data: updateData,
          locale: 'vi',
        });

        console.log(`✅ Migrated service: ${service.title}`);
      }
    }

    // Migrate CompanyInfo Global
    console.log('\n🏢 Migrating Company Info...');
    const companyInfo = await payload.findGlobal({
      slug: 'company-info',
      locale: 'all',
    });

    if (!companyInfo.companyName?.vi) {
      const updateData = {
        companyName: {
          vi: companyInfo.companyName,
          en: companyInfo.companyName ? `${companyInfo.companyName} (EN)` : undefined,
          tr: companyInfo.companyName ? `${companyInfo.companyName} (TR)` : undefined,
        },
        companyShortName: {
          vi: companyInfo.companyShortName,
          en: companyInfo.companyShortName,
          tr: companyInfo.companyShortName,
        },
        companyDescription: {
          vi: companyInfo.companyDescription,
          en: companyInfo.companyDescription ? `${companyInfo.companyDescription} (EN)` : undefined,
          tr: companyInfo.companyDescription ? `${companyInfo.companyDescription} (TR)` : undefined,
        }
      };

      await payload.updateGlobal({
        slug: 'company-info',
        data: updateData,
        locale: 'vi',
      });

      console.log('✅ Migrated Company Info');
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('  1. Review migrated content in the admin panel');
    console.log('  2. Update English and Turkish translations');
    console.log('  3. Test multilingual API endpoints');
    console.log('  4. Update frontend to use new multilingual hooks');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();
