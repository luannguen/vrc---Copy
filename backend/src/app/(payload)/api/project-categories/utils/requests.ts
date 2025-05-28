import { NextRequest } from 'next/server';

/**
 * Check if the request comes from the admin panel
 */
export function isAdminRequest(req: NextRequest): boolean {
  const referer = req.headers.get('referer') || '';
  return referer.includes('/admin');
}

/**
 * Extract project category ID from various request sources
 */
export async function extractCategoryId(req: NextRequest): Promise<string | null> {
  // Try URL parameters first
  const url = new URL(req.url);
  const urlId = url.searchParams.get('id');
  if (urlId) {
    return urlId;
  }

  // Try request body
  try {
    const body = await req.json();
    if (body.id) {
      return body.id;
    }
  } catch (error) {
    // Ignore JSON parse errors
  }

  return null;
}

/**
 * Parse and validate project category data from request
 */
export function parseProjectCategoryData(data: any): any {
  const processedData = { ...data };

  // Process parent relationship field
  if (processedData.parent && typeof processedData.parent === 'object') {
    if (processedData.parent.value) {
      processedData.parent = processedData.parent.value;
    } else if (processedData.parent.relationTo && processedData.parent.value) {
      processedData.parent = processedData.parent.value;
    }
  }

  // Process featured image field
  if (processedData.featuredImage && typeof processedData.featuredImage === 'object') {
    if (processedData.featuredImage.value) {
      processedData.featuredImage = processedData.featuredImage.value;
    }
  }

  // Ensure orderNumber is a number
  if (processedData.orderNumber !== undefined) {
    processedData.orderNumber = parseInt(processedData.orderNumber) || 0;
  }

  // Ensure boolean fields are properly typed
  if (processedData.showInMenu !== undefined) {
    processedData.showInMenu = processedData.showInMenu === true || processedData.showInMenu === 'true';
  }

  return processedData;
}

/**
 * Build where clause for project category queries
 */
export function buildCategoryWhereClause(searchParams: URLSearchParams): any {
  const where: any = {};

  const search = searchParams.get('search');
  const showInMenu = searchParams.get('showInMenu');
  const parent = searchParams.get('parent');

  if (search) {
    where.or = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (showInMenu !== null && showInMenu !== undefined) {
    where.showInMenu = { equals: showInMenu === 'true' };
  }

  if (parent) {
    if (parent === 'null' || parent === 'none') {
      where.parent = { exists: false };
    } else {
      where.parent = { equals: parent };
    }
  }

  return where;
}
