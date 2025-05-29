import { Payload } from 'payload';

export const seedTechnologies = async (payload: Payload) => {
  try {
    console.log('🔧 Seeding technologies...');

    // Check if technologies already exist
    const existingTechnologies = await payload.find({
      collection: 'technologies',
      limit: 1,
    });

    if (existingTechnologies.totalDocs > 0) {
      console.log('⏭️ Technologies already exist, skipping...');
      return;
    }    const technologiesData = [
      {
        name: 'Công nghệ Inverter',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Tiết kiệm năng lượng lên đến 40%',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1
          }
        },
        type: 'technology' as const,
        status: 'published' as const,
      },
      {
        name: 'Hệ thống VRF',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Giải pháp điều hòa đa zone hiệu quả',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1
          }
        },
        type: 'technology' as const,
        status: 'published' as const,
      },
      {
        name: 'Heat Recovery',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'Thu hồi nhiệt thải để tái sử dụng',
                    version: 1
                  }
                ],
                version: 1
              }
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1
          }
        },
        type: 'technology' as const,
        status: 'published' as const,
      },
    ];

    const createdTechnologies = [];
    for (const tech of technologiesData) {
      const technology = await payload.create({
        collection: 'technologies',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: tech as any, // Type assertion to bypass strict typing for seed data
      });
      createdTechnologies.push(technology);
      console.log(`✅ Created technology: ${tech.name}`);
    }

    console.log(`🔧 Technologies seeding completed: ${createdTechnologies.length} technologies created`);
    return createdTechnologies;

  } catch (error) {
    console.error('❌ Error seeding technologies:', error);
    throw error;
  }
};
