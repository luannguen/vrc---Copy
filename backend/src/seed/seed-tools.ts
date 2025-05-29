import { getPayload } from 'payload';
import type { Payload } from 'payload';
import { toolsData } from './tools';

export const seedTools = async (payload: Payload) => {
  console.log('🔧 Seeding Tools...');

  try {
    // Check if tools already exist
    const existingTools = await payload.find({
      collection: 'tools',
      limit: 1,
    });

    if (existingTools.totalDocs > 0) {
      console.log(`⚠️  Found ${existingTools.totalDocs} existing tools. Clearing them first...`);

      // Delete existing tools before seeding new ones
      const allTools = await payload.find({
        collection: 'tools',
        limit: 1000, // Get all tools
      });

      for (const tool of allTools.docs) {
        await payload.delete({
          collection: 'tools',
          id: tool.id,
        });
        console.log(`🗑️  Deleted existing tool: ${tool.name}`);
      }
    }

    console.log(`📊 Seeding ${toolsData.length} tools...`);

    const createdTools = [];
    let successCount = 0;
    let failureCount = 0;

    for (const tool of toolsData) {
      try {
        console.log(`🔧 Creating tool: ${tool.name}`);

        const createdTool = await payload.create({
          collection: 'tools',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: tool as any,
        });

        createdTools.push(createdTool);
        successCount++;
        console.log(`✅ Created tool: ${tool.name} (ID: ${createdTool.id})`);

      } catch (error) {
        failureCount++;
        console.error(`❌ Failed to create tool: ${tool.name}`);
        console.error('Error details:', error instanceof Error ? error.message : String(error));

        // Continue with next tool instead of stopping
        continue;
      }
    }

    console.log(`✅ Tools seeding completed:`);
    console.log(`   - Successfully created: ${successCount} tools`);
    console.log(`   - Failed: ${failureCount} tools`);
    console.log(`   - Total processed: ${toolsData.length} tools`);

    return {
      success: true,
      message: `Successfully seeded ${successCount} tools`,
      created: createdTools,
      successCount,
      failureCount,
      totalProcessed: toolsData.length,
    };

  } catch (error) {
    console.error('❌ Error seeding tools:', error);
    return {
      success: false,
      error: 'Failed to seed tools',
      details: error instanceof Error ? error.message : String(error),
    };
  }
};

// Standalone function for direct execution
export const runToolsSeeding = async () => {
  try {
    const config = (await import('@payload-config')).default;
    const payload = await getPayload({ config });

    return await seedTools(payload);
  } catch (error) {
    console.error('❌ Failed to initialize Payload for tools seeding:', error);
    return {
      success: false,
      error: 'Failed to initialize Payload',
      details: error instanceof Error ? error.message : String(error),
    };
  }
};
