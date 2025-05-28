// API route for health checks to support frontend connectivity testing

import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  const headers = getCommonHeaders(req);
  
  // Set additional CORS headers specific for preflight
  headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours
  
  // Return empty 204 response with CORS headers
  return new Response(null, {
    status: 204,
    headers,
  });
}

// Common health data to return
const getHealthData = () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  server: 'VRC Backend API',
  environment: process.env.NODE_ENV || 'development',
  apiVersion: '1.0.0',
});

// Common headers for all responses
const getCommonHeaders = (req?: NextRequest) => {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.set('X-Health-Status', 'ok');
  headers.set('X-Backend-Available', 'true');
  headers.set('X-Health-Timestamp', new Date().toISOString());
  
  // Add CORS headers
  const origin = req?.headers.get('origin');
  const isProduction = process.env.NODE_ENV === 'production';
    // In production, be more restrictive; in development, allow all
  if (isProduction) {
    // Get allowed origins from env or default to server URL
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_SERVER_URL || '',
      process.env.FRONTEND_URL || ''
    ].filter(Boolean);
      // Set appropriate origin header
    if (origin && allowedOrigins.includes(origin)) {
      headers.set('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.length > 0) {
      headers.set('Access-Control-Allow-Origin', allowedOrigins[0] || '*');
    }
  } else {
    // In development, allow all origins
    headers.set('Access-Control-Allow-Origin', '*');
  }
  
  // Standard CORS headers
  headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return headers;
};

export async function GET(req: NextRequest) {
  console.log(`[API] Health GET request from ${req.headers.get('user-agent') || 'unknown'}`);
  
  try {
    // Return the health data with headers
    return new Response(JSON.stringify(getHealthData()), {
      status: 200,
      headers: getCommonHeaders(req),
    });
  } catch (error) {
    console.error('[API] Health GET error:', error);
    
    // Return a fallback response in case of error
    return new Response(JSON.stringify({
      status: 'error',
      message: 'Health check error',
      timestamp: new Date().toISOString(),
    }), {
      status: 200, // Still return 200 to indicate the server is running
      headers: getCommonHeaders(req),
    });
  }
}

// Support HEAD requests
export async function HEAD(req: NextRequest) {
  console.log(`[API] Health HEAD request from ${req.headers.get('user-agent') || 'unknown'}`);
  
  try {
    // Return just headers for HEAD requests
    return new Response(null, {
      status: 200,
      headers: getCommonHeaders(),
    });
  } catch (error) {
    console.error('[API] Health HEAD error:', error);
    
    // Return a fallback response in case of error
    const headers = getCommonHeaders();
    headers.set('X-Health-Status', 'warning');
    
    return new Response(null, {
      status: 200, // Still return 200 to indicate the server is running
      headers: headers,
    });
  }
}
