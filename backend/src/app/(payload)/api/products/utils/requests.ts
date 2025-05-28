import { NextRequest } from 'next/server';

/**
 * Detects if a request is coming from the admin panel based on the referer header
 */
export function isAdminRequest(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes('/admin');
}

/**
 * Extracts product ID from various request formats
 * This handles different ways the ID might be provided in requests
 */
export async function extractProductId(req: NextRequest): Promise<string | null> {
  // Get URL parameters
  const url = new URL(req.url);
  
  // Direct ID parameter
  let productId = url.searchParams.get('id');
  
  // Handle complex query formats from admin UI
  if (!productId) {
    for (const [key, value] of url.searchParams.entries()) {
      if (key.includes('id') && key.includes('in')) {
        productId = value;
        console.log(`Extracted product ID from complex query: ${productId}`);
        break;
      }
    }
  }

  // Parse structured query with where[and][1][id][in][0] format
  if (!productId) {
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith('where')) {
        try {
          // Extract ID from complex structure
          const matches = key.match(/where\[.+\]\[id\]\[.+\]\[(\d+)\]/);
          if (matches && matches[1]) {
            productId = value;
            console.log(`Extracted product ID from complex where clause: ${productId}`);
            break;
          } else if (value.includes('id')) {
            // Handle common ID patterns in strings
            const idMatch = value.match(/id[\s:=]*['"]?([a-zA-Z0-9]+)['"]?/);
            if (idMatch && idMatch[1]) {
              productId = idMatch[1];
              console.log(`Extracted ID from string pattern: ${productId}`);
              break;
            }
          } else {
            // Direct value might be the ID
            productId = value;
            console.log(`Using direct value as ID: ${productId}`);
            break;
          }
        } catch (e) {
          console.error('Error parsing ID from query param:', e);
        }
      }
    }
  }
  
  // Check request body for ID
  if (!productId) {
    try {
      const clonedReq = req.clone();
      const body = await clonedReq.json();
      
      if (body && body.id) {
        productId = body.id;
        console.log(`Extracted product ID from body: ${productId}`);
      }    } catch (_e) {
      // No JSON body or error parsing body
      console.log('No JSON body or error parsing body for ID extraction');
    }
  }
  
  return productId;
}

/**
 * Extracts multiple product IDs from a request
 */
export function extractProductIds(req: NextRequest): string[] | null {
  const url = new URL(req.url);
  const productIds = url.searchParams.get('ids');
  
  if (!productIds) {
    return null;
  }
  
  return productIds.split(',').filter(Boolean);
}
