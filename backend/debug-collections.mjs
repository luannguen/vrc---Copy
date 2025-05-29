import { getPayload } from 'payload';
import config from './src/payload.config.ts';

async function debugCollections() {
  try {
    console.log('Initializing Payload...');

    // Initialize payload with config
    const payload = await getPayload({ config });

    console.log('Payload initialized successfully');

    // Get all collections
    const collections = payload.config.collections;
    console.log('Total collections found:', collections.length);

    // List all collection slugs
    console.log('\nCollection slugs:');
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. ${collection.slug} (${collection.labels?.singular || 'No label'})`);
    });

    // Check if Tools and Resources exist
    const toolsCollection = collections.find(c => c.slug === 'tools');
    const resourcesCollection = collections.find(c => c.slug === 'resources');

    console.log('\nTools collection found:', !!toolsCollection);
    console.log('Resources collection found:', !!resourcesCollection);

    if (toolsCollection) {
      console.log('Tools collection config:', {
        slug: toolsCollection.slug,
        labels: toolsCollection.labels,
        admin: toolsCollection.admin?.useAsTitle
      });
    }

    if (resourcesCollection) {
      console.log('Resources collection config:', {
        slug: resourcesCollection.slug,
        labels: resourcesCollection.labels,
        admin: resourcesCollection.admin?.useAsTitle
      });
    }

    // Try to access collections via find operation
    console.log('\nTesting collections access...');

    try {
      const toolsResult = await payload.find({
        collection: 'tools',
        limit: 1
      });
      console.log('Tools collection accessible:', true);
      console.log('Tools count:', toolsResult.totalDocs);
    } catch (error) {
      console.log('Tools collection error:', error.message);
    }

    try {
      const resourcesResult = await payload.find({
        collection: 'resources',
        limit: 1
      });
      console.log('Resources collection accessible:', true);
      console.log('Resources count:', resourcesResult.totalDocs);
    } catch (error) {
      console.log('Resources collection error:', error.message);
    }

    // Test other collections for comparison
    try {
      const usersResult = await payload.find({
        collection: 'users',
        limit: 1
      });
      console.log('Users collection accessible:', true);
      console.log('Users count:', usersResult.totalDocs);
    } catch (error) {
      console.log('Users collection error:', error.message);
    }

    try {
      const productsResult = await payload.find({
        collection: 'products',
        limit: 1
      });
      console.log('Products collection accessible:', true);
      console.log('Products count:', productsResult.totalDocs);
    } catch (error) {
      console.log('Products collection error:', error.message);
    }

    process.exit(0);

  } catch (error) {
    console.error('Debug error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

debugCollections().catch(console.error);
