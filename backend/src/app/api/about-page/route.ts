import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

/**
 * API Key validation utilities
 */
const API_KEY = process.env.PUBLIC_API_KEY || 'vrc-public-2024';

function validateApiKey(req: NextRequest): boolean {
  const apiKey = req.headers.get('x-api-key') ||
                req.headers.get('authorization')?.replace('Bearer ', '') ||
                req.nextUrl.searchParams.get('api_key');

  if (!apiKey || apiKey !== API_KEY) {
    return false;
  }
  return true;
}

function createApiKeyErrorResponse() {
  return {
    success: false,
    error: 'INVALID_API_KEY',
    message: 'API key không hợp lệ. Vui lòng cung cấp API key hợp lệ trong header x-api-key.',
    code: 401
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
  'Access-Control-Max-Age': '86400',
};

// Pre-flight request handler for CORS
export function OPTIONS(_req: NextRequest) {
  console.log('OPTIONS /api/about-page: Handling preflight request');
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}

/**
 * Get about page settings
 * GET /api/about-page
 * Requires API key for authentication
 */
export async function GET(req: NextRequest) {
  try {
    // Validate API key to prevent spam and unauthorized access
    if (!validateApiKey(req)) {
      const errorResponse = createApiKeyErrorResponse();
      return NextResponse.json(errorResponse, {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    const payload = await getPayload({ config });

    const aboutPageSettings = await payload.findGlobal({
      slug: 'about-page-settings',
    });

    return NextResponse.json(aboutPageSettings, {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('Error fetching about page settings:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch about page settings',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
