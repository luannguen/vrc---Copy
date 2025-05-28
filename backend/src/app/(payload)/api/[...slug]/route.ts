/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import config from '@payload-config'
import '@payloadcms/next/css'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import { NextRequest } from 'next/server'
import { createCORSHeaders } from '../_shared/cors'

// Create a wrapped version that adds CORS headers for better compatibility
const withCorsHeaders = (handler: any) => {
  return async (req: NextRequest, ...rest: any[]) => {
    const url = new URL(req.url);
    const segments = url.pathname.split('/').filter(Boolean);
    
    // Check if this is likely a collection route
    const isCollectionRoute = segments.length >= 2 && segments[0] === 'api';
    const collection = isCollectionRoute ? segments[1] : '';
    const isPostsRoute = collection === 'posts';
      if (isPostsRoute) {
      console.log(`Built-in Payload posts route called: ${req.url}`);
    } else {
      console.log(`🔥 Built-in Payload route called: ${req.url} | Collection: ${collection}`);
    }
    
    // Specific logging for technologies collection
    if (collection === 'technologies') {
      console.log(`\n🚀 === TECHNOLOGIES BUILT-IN ROUTE ===`);
      console.log('Method:', req.method);
      console.log('URL:', req.url);
      console.log('Referer:', req.headers.get('referer'));
      console.log('Content-Type:', req.headers.get('content-type'));
      
      if (req.method === 'POST') {
        try {
          const body = await req.clone().json();
          console.log('Technologies POST body:', JSON.stringify(body, null, 2));
        } catch (e) {
          console.log('Cannot parse request body');
        }
      }
      console.log('===========================================\n');
    }
    
    // Check if this is from the admin panel
    const referer = req.headers.get('referer') || '';
    const isAdminRequest = referer.includes('/admin');
    
    if (isAdminRequest && isPostsRoute) {
      console.log('Admin panel request for posts collection detected');
    }
    
    // Get original response from Payload handler
    const originalResponse = await handler(req, ...rest);
    
    // If this is a built-in route but for a custom collection, 
    // make sure CORS headers are properly set
    const corsHeaders = createCORSHeaders();
    
    // Clone the response and add CORS headers
    const headers = new Headers(originalResponse.headers);
    
    // Add each CORS header
    for (const [key, value] of corsHeaders.entries()) {
      if (!headers.has(key)) {
        headers.set(key, value);
      }
    }
    
    // Reconstruct response with new headers
    return new Response(originalResponse.body, {
      status: originalResponse.status,
      statusText: originalResponse.statusText,
      headers
    });
  };
};

export const GET = withCorsHeaders(REST_GET(config))
export const POST = withCorsHeaders(REST_POST(config))
export const DELETE = withCorsHeaders(REST_DELETE(config))
export const PATCH = withCorsHeaders(REST_PATCH(config))

export const PUT = REST_PUT(config)
export const OPTIONS = REST_OPTIONS(config)
