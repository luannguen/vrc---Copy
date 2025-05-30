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
      console.log(`🔥 Built-in Payload route called: ${req.url} | Collection: ${collection}`);    }

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

    // Specific logging for tools collection
    if (collection === 'tools') {
      console.log(`\n🔧 === TOOLS BUILT-IN ROUTE [${new Date().toISOString()}] ===`);
      console.log('Method:', req.method);
      console.log('URL:', req.url);
      console.log('Referer:', req.headers.get('referer'));
      console.log('Content-Type:', req.headers.get('content-type'));
      console.log('Authorization:', req.headers.get('authorization') ? 'Present' : 'None');
      console.log('Query params:', Object.fromEntries(url.searchParams.entries()));

      // Log request body for non-GET requests
      if (req.method !== 'GET') {
        try {
          const clonedReq = req.clone();
          const contentType = req.headers.get('content-type') || '';

          if (contentType.includes('application/json')) {
            const body = await clonedReq.json();
            console.log('🔄 JSON Request body:', JSON.stringify(body, null, 2));
          } else if (contentType.includes('multipart/form-data')) {
            console.log('🔄 Form data detected - logging form entries:');
            const formData = await clonedReq.formData();
            for (const [key, value] of formData.entries()) {
              console.log(`🔄   ${key}:`, typeof value === 'string' ? value : '[File Object]');
            }
          } else {
            const body = await clonedReq.text();
            console.log('🔄 Raw Request body:', body);
          }
        } catch (e) {
          console.log('🔄 Could not parse request body:', e);
        }
      }
      console.log('=================================\n');
    }

    // Check if this is from the admin panel
    const referer = req.headers.get('referer') || '';
    const isAdminRequest = referer.includes('/admin');

    if (isAdminRequest && isPostsRoute) {
      console.log('Admin panel request for posts collection detected');
    }

    // Get original response from Payload handler
    const originalResponse = await handler(req, ...rest);

    // Log response for tools collection
    if (collection === 'tools') {
      console.log(`\n🔧 === TOOLS RESPONSE [${new Date().toISOString()}] ===`);
      console.log('Status:', originalResponse.status);
      console.log('Status Text:', originalResponse.statusText);

      // Try to log response body
      try {
        const responseClone = originalResponse.clone();
        const responseText = await responseClone.text();

        if (responseText) {
          try {
            const responseJson = JSON.parse(responseText);
            console.log('🔄 Response JSON:', JSON.stringify(responseJson, null, 2));
          } catch (_) {
            console.log('🔄 Response Text (first 500 chars):', responseText.substring(0, 500));
          }
        }
      } catch (e) {
        console.log('🔄 Could not read response body:', e);
      }
      console.log('================================\n');
    }

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

    // For admin panel tools requests, add aggressive cache-busting headers
    if (isAdminRequest && collection === 'tools') {
      headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
      headers.set('Pragma', 'no-cache');
      headers.set('Expires', '0');
      headers.set('X-Payload-Admin-Refresh', 'true');
      headers.set('X-Timestamp', Date.now().toString());

      // Add special headers to force admin UI refresh
      if (req.method === 'PATCH' || req.method === 'PUT' || req.method === 'POST') {
        headers.set('X-Payload-Collection-Invalidate', 'tools');
        headers.set('X-Force-Refresh', 'true');
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
export const PUT = withCorsHeaders(REST_PUT(config))
export const OPTIONS = REST_OPTIONS(config)
