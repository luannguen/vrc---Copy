import { createLocalReq, getPayload } from 'payload';
import { seed } from './seed';
import config from '@payload-config';

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

export async function POST(): Promise<Response> {
  const payload = await getPayload({ config });
  
  try {
    // For demonstration purposes, create a basic local request without authentication
    const payloadReq = await createLocalReq({}, payload);
    
    // Call the seed function with payload and request
    // We need to cast the request to the expected type in seed.ts
    await seed({ 
      payload, 
      req: payloadReq as any // Force type compatibility
    });
    return Response.json({ success: true });
  } catch (e) {
    payload.logger.error({ err: e, message: 'Error seeding data' });
    return new Response('Error seeding data.', { status: 500 });
  }
}