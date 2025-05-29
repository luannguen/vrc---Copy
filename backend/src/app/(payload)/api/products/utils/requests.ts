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
 * Handles various bulk delete formats from Payload admin
 */
export function extractProductIds(req: NextRequest): string[] | null {
  const url = new URL(req.url);

  console.log("🔍 Extracting product IDs from request:");
  console.log("Full URL:", req.url);

  // Method 1: Direct 'ids' parameter (comma-separated)
  const directIds = url.searchParams.get('ids');
  if (directIds) {
    const ids = directIds.split(',').filter(Boolean);
    console.log("Found direct 'ids' parameter:", ids);
    return ids;
  }

  // Method 2: Multiple 'id' parameters
  const allIds = url.searchParams.getAll('id');
  if (allIds.length > 1) {
    console.log("Found multiple 'id' parameters:", allIds);
    return allIds;
  }

  // Method 3: Array format 'ids[]'
  const arrayIds = url.searchParams.getAll('ids[]');
  if (arrayIds.length > 0) {
    console.log("Found 'ids[]' array format:", arrayIds);
    return arrayIds;
  }

  // Method 4: Payload admin 'where' clause with 'in' operator
  // Format: where[id][in]=id1,id2,id3
  const whereIdIn = url.searchParams.get('where[id][in]');
  if (whereIdIn) {
    const ids = whereIdIn.split(',').filter(Boolean);
    console.log("Found 'where[id][in]' parameter:", ids);
    return ids;
  }

  // Method 5: Complex where clause - parse all parameters
  const productIds: string[] = [];
  for (const [key, value] of url.searchParams.entries()) {
    // Look for patterns like where[id][in][0], where[id][in][1], etc.
    if (key.includes('where') && key.includes('id') && key.includes('in')) {
      console.log(`Found complex where clause: ${key} = ${value}`);
      productIds.push(value);
    }
  }

  if (productIds.length > 0) {
    console.log("Extracted IDs from complex where clauses:", productIds);
    return productIds;
  }

  console.log("No product IDs found for bulk operation");
  return null;
}
