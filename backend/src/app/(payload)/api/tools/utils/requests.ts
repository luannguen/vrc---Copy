import { NextRequest } from 'next/server';

/**
 * Detects if a request is coming from the admin panel based on the referer header
 */
export function isAdminRequest(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes('/admin');
}

/**
 * Extracts tool ID from various request formats
 * This handles different ways the ID might be provided in requests
 */
export async function extractToolId(req: NextRequest): Promise<string | null> {
  // Get URL parameters
  const url = new URL(req.url);

  // Direct ID parameter
  let toolId = url.searchParams.get('id');

  // Handle complex query formats from admin UI
  if (!toolId) {
    for (const [key, value] of url.searchParams.entries()) {
      if (key.includes('id') && key.includes('in')) {
        toolId = value;
        console.log(`Extracted tool ID from complex query: ${toolId}`);
        break;
      }
    }
  }

  // Parse structured query with where[and][1][id][in][0] format
  if (!toolId) {
    for (const [key, value] of url.searchParams.entries()) {
      if (key.startsWith('where')) {
        try {
          // Extract ID from complex structure
          const matches = key.match(/where\[.+\]\[id\]\[.+\]\[(\d+)\]/);
          if (matches && matches[1]) {
            toolId = value;
            console.log(`Extracted tool ID from complex where clause: ${toolId}`);
            break;
          } else if (value.includes('id')) {
            // Handle common ID patterns in strings
            const idMatch = value.match(/id[\s:=]*['"]?([a-zA-Z0-9]+)['"]?/);
            if (idMatch && idMatch[1]) {
              toolId = idMatch[1];
              console.log(`Extracted ID from string pattern: ${toolId}`);
              break;
            }
          } else {
            // Direct value might be the ID
            toolId = value;
            console.log(`Using direct value as ID: ${toolId}`);
            break;
          }
        } catch (e) {
          console.error('Error parsing ID from query param:', e);
        }
      }
    }
  }

  // Check request body for ID
  if (!toolId) {
    try {
      const clonedReq = req.clone();
      const body = await clonedReq.json();

      if (body && body.id) {
        toolId = body.id;
        console.log(`Extracted tool ID from body: ${toolId}`);
      }
    } catch (_e) {
      // No JSON body or error parsing body
      console.log('No JSON body or error parsing body for ID extraction');
    }
  }

  return toolId;
}

/**
 * Extracts multiple tool IDs from a request
 * Handles various bulk delete formats from Payload admin
 */
export function extractToolIds(req: NextRequest): string[] | null {
  const url = new URL(req.url);

  console.log("🔍 Extracting tool IDs from request:");
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
  const toolIds: string[] = [];
  for (const [key, value] of url.searchParams.entries()) {
    // Look for patterns like where[id][in][0], where[id][in][1], etc.
    if (key.includes('where') && key.includes('id') && key.includes('in')) {
      console.log(`Found complex where clause: ${key} = ${value}`);
      toolIds.push(value);
    }
  }

  if (toolIds.length > 0) {
    console.log("Extracted IDs from complex where clauses:", toolIds);
    return toolIds;
  }

  console.log("No tool IDs found for bulk operation");
  return null;
}
