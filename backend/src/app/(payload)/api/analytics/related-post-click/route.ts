import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import {
  handleOptionsRequest,
  createCORSResponse,
  withCORS
} from '../../_shared/cors';

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req, ['POST', 'OPTIONS']);
}

// POST handler for tracking related post clicks
export const POST = withCORS(async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();
    const { sourcePostId, clickedPostId, timestamp } = body;

    if (!sourcePostId || !clickedPostId) {
      return createCORSResponse({
        success: false,
        message: 'Missing required fields: sourcePostId and clickedPostId'
      }, 400);    }

    // Initialize Payload
    const _payload = await getPayload({ config });

    // Log the click event
    // For now, just log to console - in a real implementation you'd store this in a database
    console.log(`Related post click tracked: ${sourcePostId} -> ${clickedPostId} at ${timestamp || new Date().toISOString()}`);

    // In a future implementation, this data could be stored in a dedicated collection
    // and used to improve the recommendation algorithm
    
    return createCORSResponse({
      success: true,
      message: 'Click tracked successfully'
    }, 200);
  } catch (error) {
    console.error('Error tracking related post click:', error);
    return createCORSResponse({
      success: false,
      message: 'Error tracking click'
    }, 500);
  }
});