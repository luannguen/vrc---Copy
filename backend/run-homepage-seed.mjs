/**
 * Simple script to run homepage settings seed
 */
import { getPayload } from 'payload';

async function runHomepageSettingsSeed() {
  console.log('🧪 Starting homepage settings seed...');

  try {
    // Import config same as FAQs script
    const config = await import('./src/payload.config.ts');
    const payload = await getPayload({ config: config.default });

    console.log('\n=== CURRENT STATE CHECK ===');
    const locales = ['vi', 'en', 'tr'];

    // Check current state
    for (const locale of locales) {
      try {
        const settings = await payload.findGlobal({
          slug: 'homepage-settings',
          locale,
        });
        console.log(`📍 Locale ${locale}: EXISTS`);
        if (settings.seo?.metaTitle) {
          console.log(`   - SEO title: ${settings.seo.metaTitle}`);
        }
        if (settings.featuredTopics?.sectionTitle) {
          console.log(`   - Featured topics: ${settings.featuredTopics.sectionTitle}`);
        }
      } catch (error) {
        console.log(`📍 Locale ${locale}: NOT FOUND or ERROR - ${error.message}`);
      }
    }

    console.log('\n=== RUNNING SEED ===');

    // Import and run the seed function from src
    const { seedHomepageSettings } = await import('./src/seed/homepage-settings.ts');
    await seedHomepageSettings(payload);

    console.log('\n=== POST-SEED VERIFICATION ===');

    // Verify the seeded data
    for (const locale of locales) {
      try {
        const settings = await payload.findGlobal({
          slug: 'homepage-settings',
          locale,
        });

        console.log(`✅ Locale ${locale}: ${settings.featuredTopics?.sectionTitle || 'Missing title'}`);
        if (settings.seo?.metaTitle) {
          console.log(`   - SEO: ${settings.seo.metaTitle}`);
        }
        if (settings.heroSection?.title) {
          console.log(`   - Hero: ${settings.heroSection.title}`);
        }
      } catch (error) {
        console.log(`❌ Locale ${locale}: Error - ${error.message}`);
      }
    }

    console.log('\n✅ Homepage settings seed completed successfully!');

  } catch (error) {
    console.error('❌ Error running homepage settings seed:', error);
    process.exit(1);
  }

  process.exit(0);
}

runHomepageSettingsSeed();
