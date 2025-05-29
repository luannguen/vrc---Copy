import type { Payload } from 'payload';
import { resourcesData } from './resources';

export const seedResources = async (payload: Payload): Promise<void> => {
  try {
    console.log('📚 Seeding Resources...');

    // Clear existing resources (optional)
    const existingResources = await payload.find({
      collection: 'resources',
      limit: 1000,
    });

    if (existingResources.docs.length > 0) {
      console.log(`Found ${existingResources.docs.length} existing resources. Clearing them...`);
      for (const resource of existingResources.docs) {
        await payload.delete({
          collection: 'resources',
          id: resource.id,
        });
      }
    }

    // Create new resources
    for (const resourceData of resourcesData) {
      try {
        const resource = await payload.create({
          collection: 'resources',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: resourceData as any,
        });
        console.log(`✅ Created resource: ${resource.title}`);
      } catch (error) {
        console.error(`❌ Error creating resource ${resourceData.title}:`, error);
      }
    }

    console.log(`✅ Resources seeded successfully! Created ${resourcesData.length} resources.`);
  } catch (error) {
    console.error('❌ Error seeding Resources:', error);
    throw error;
  }
};
