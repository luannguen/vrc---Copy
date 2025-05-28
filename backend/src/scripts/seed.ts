// filepath: e:\Download\vrc\backend\src\scripts\seed.ts
/**
 * This script seeds the database with initial data
 * 
 * Usage: 
 * npx ts-node src/scripts/seed.ts
 */

// Import dependencies
import dotenv from 'dotenv';
import { seed } from '../seed';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Import payload and config dynamically
    const { default: payload } = await import('payload');
    
    // Use type assertion to bypass type checking issues
    await payload.init({
      // @ts-ignore - Type definitions may not match the runtime implementation
      local: true,
    } as any);
    
    // Run the seed function with payload instance
    await seed(payload);
    
    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    console.error(error instanceof Error ? error.stack : String(error));
    process.exit(1);
  }
};

// Execute the seed function
seedDatabase();
