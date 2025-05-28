import { Payload } from 'payload';
// Use IncomingMessage type instead of PayloadRequest
import { IncomingMessage } from 'http';
// Import from the correct location since the file structure has changed
import { homeStatic } from '../../home-static-fixed';

interface SeedProps {
  payload: Payload
  req?: IncomingMessage & { user?: any }
}

export const seed = async ({ payload, req }: SeedProps): Promise<void> => {
  payload.logger.info('Seeding data started');

  try {
    // Check if pages collection exists
    const collections = await payload.collections;
    if (!collections.pages) {
      payload.logger.warn('Pages collection not found, skipping home page seed');
      return;
    }

    // Check if home page already exists
    const existingHomePage = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
      },
    });

    if (existingHomePage.totalDocs > 0) {
      payload.logger.info('Home page already exists, skipping seed');
      return;
    }

    // Create home page using static data
    await payload.create({
      collection: 'pages',
      data: homeStatic,
      user: req?.user,
    });

    payload.logger.info('Successfully seeded home page');
  } catch (error) {
    payload.logger.error('Error seeding data:');
    payload.logger.error(error);
    throw error;
  }
};
