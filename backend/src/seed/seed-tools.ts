import type { Payload } from 'payload';
import { toolsData } from './tools';

export const seedTools = async (payload: Payload): Promise<void> => {
  try {
    console.log('🔧 Seeding Tools...');

    // Clear existing tools (optional)
    const existingTools = await payload.find({
      collection: 'tools',
      limit: 1000,
    });

    if (existingTools.docs.length > 0) {
      console.log(`Found ${existingTools.docs.length} existing tools. Clearing them...`);
      for (const tool of existingTools.docs) {
        await payload.delete({
          collection: 'tools',
          id: tool.id,
        });
      }
    }

    // Create new tools
    for (const toolData of toolsData) {
      try {
        console.log(`🔧 Attempting to create tool: ${toolData.name}`);
        console.log(`   Data structure:`, JSON.stringify(toolData, null, 2).substring(0, 500) + '...');

        const tool = await payload.create({
          collection: 'tools',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: toolData as any,
        });
        console.log(`✅ Created tool: ${tool.name}`);
      } catch (error) {
        console.error(`❌ Error creating tool ${toolData.name}:`, error);
        if (error instanceof Error) {
          console.error(`   Error message: ${error.message}`);
        }
      }
    }

    console.log(`✅ Tools seeded successfully! Created ${toolsData.length} tools.`);
  } catch (error) {
    console.error('❌ Error seeding Tools:', error);
    throw error;
  }
};
