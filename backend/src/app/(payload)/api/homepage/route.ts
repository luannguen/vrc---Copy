import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  handleOptionsRequest,
  createCORSResponse,
  handleApiError
} from '../_shared/cors'

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const _payload = await getPayload({
      config,
    })
    
    // Implementation depends on the specific API
    // For now, just return a simple response
    return createCORSResponse({
      success: true,
      message: 'homepage API endpoint is working!',
    }, 200);
  } catch (error) {
    console.error('API Error:', error);
    return handleApiError(error, 'An error occurred', 500);
  }
}
