import { NextRequest } from 'next/server';

/**
 * Extracts post ID(s) from a request in various formats
 * Handles standard query params, complex admin UI formats, and request body
 * 
 * @param req NextRequest object
 * @returns Object containing extracted postId and postIds
 */
export async function extractPostIds(req: NextRequest): Promise<{ postId: string | null; postIds: string[] }> {
  console.log('Extracting post IDs from request URL:', req.url);
  
  const url = new URL(req.url);
  const ids = new Set<string>();
  
  // Check standard ID param
  const id = url.searchParams.get('id');
  let singleId = id;
  
  // Check path-based ID (e.g., /api/posts/123456)
  if (!singleId) {
    const pathSegments = url.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment && lastSegment !== 'posts' && /^[a-f0-9]+$/.test(lastSegment)) {
      console.log('Found path-based ID:', lastSegment);
      singleId = lastSegment;
    }
  }
  
  // Check comma-separated IDs
  const postIdsParam = url.searchParams.get('ids');
  const multipleIds: string[] = [];
  
  if (postIdsParam) {
    console.log('Found comma-separated IDs param:', postIdsParam);
    postIdsParam.split(',')
      .map(id => id.trim())
      .filter(Boolean)
      .forEach(id => {
        ids.add(id);
        multipleIds.push(id);
      });
  }
  
  // Cải thiện: Xử lý định dạng query phức tạp từ admin panel
  // Trường hợp 1: where[and][1][id][in][0]=123456
  for (const [key, value] of url.searchParams.entries()) {
    if (key.match(/where\[\w+\]\[\d+\]\[id\]\[in\]\[\d+\]/) && value) {
      console.log(`Extracted post ID from admin panel query format: ${value}`);
      singleId = value;
      ids.add(value);
    }
  }
  
  // Trường hợp 2: where[id][in][0]=123456
  for (const [key, value] of url.searchParams.entries()) {
    if (key.match(/where\[id\]\[in\]\[\d+\]/) && value) {
      console.log(`Extracted post ID from admin panel simplified query: ${value}`);
      singleId = value;
      ids.add(value);
    }
  }
  
  // Trường hợp 3: where[id][equals]=123456
  for (const [key, value] of url.searchParams.entries()) {
    if (key === 'where[id][equals]' && value) {
      console.log(`Extracted post ID from equals query: ${value}`);
      singleId = value;
      ids.add(value);
    }
  }
    
  // Parse structured query với các định dạng phức tạp khác
  for (const [key, value] of url.searchParams.entries()) {
    if (key.startsWith('where')) {
      try {
        // Log all where parameters for debugging
        console.log(`Found where parameter: ${key}=${value}`);
        
        // Nếu chưa tìm thấy ID từ các kiểm tra trước, thử xử lý các mẫu phức tạp hơn
        if (!singleId) {
          if (value && /^[a-f0-9]{24}$/.test(value)) {
            console.log(`Extracted MongoDB ObjectId from complex where clause: ${value}`);
            singleId = value;
            ids.add(value);
          }
        }
      } catch (e) {
        console.error('Error parsing where params:', e);
      }
    }
  }
  
  // Check request body for ID
  if (!singleId && multipleIds.length === 0) {
    try {
      // Clone the request to avoid consuming the body stream
      const clonedReq = req.clone();
      const body = await clonedReq.json().catch(() => ({}));
      
      if (body && body.id) {
        singleId = body.id;
        console.log(`Extracted post ID from request body: ${body.id}`);
      }
      
      // Check for ids array in body
      if (body && Array.isArray(body.ids) && body.ids.length > 0) {
        body.ids.forEach((id: string) => {
          if (id) {
            ids.add(id);
            multipleIds.push(id);
          }
        });
        console.log(`Extracted ${multipleIds.length} post IDs from request body array`);
      }    } catch (_e) {
      // No JSON body or error parsing body
      console.log('Could not parse request body for ID');
    }
  }
  
  // Extract post ID from path if present (e.g. /api/posts/123456)
  if (!singleId && multipleIds.length === 0) {
    const path = url.pathname;
    const pathSegments = path.split('/');
    const pathId = pathSegments[pathSegments.length - 1];
    
    if (pathId && pathId !== 'posts') {
      singleId = pathId;
      console.log(`Extracted post ID from URL path: ${pathId}`);
    }
  }
  
  if (singleId) {
    ids.add(singleId);
  }
  
  return {
    postId: singleId || null,
    postIds: multipleIds.length > 0 ? multipleIds : [...ids]
  };
}

/**
 * Simpler version of extractPostIds that doesn't attempt to read the request body
 * Use this when you don't expect IDs to be in the request body
 * 
 * @param req NextRequest object
 * @returns Object containing extracted postId and postIds
 */
export function extractPostIdsSync(req: NextRequest): { postId: string | null; postIds: string[] } {
  const url = new URL(req.url);
  const ids = new Set<string>();
  
  // Check standard ID param
  const id = url.searchParams.get('id');
  let singleId = id;
  
  // Check comma-separated IDs
  const postIdsParam = url.searchParams.get('ids');
  const multipleIds: string[] = [];
  
  if (postIdsParam) {
    postIdsParam.split(',')
      .map(id => id.trim())
      .filter(Boolean)
      .forEach(id => {
        ids.add(id);
        multipleIds.push(id);
      });
  }
  
  // Cải thiện: Kiểm tra các định dạng query phức tạp
  // Trường hợp 1: where[and][1][id][in][0]=123456
  for (const [key, value] of url.searchParams.entries()) {
    if (key.match(/where\[\w+\]\[\d+\]\[id\]\[in\]\[\d+\]/) && value) {
      singleId = value;
      ids.add(value);
    }
  }
  
  // Trường hợp 2: where[id][in][0]=123456
  for (const [key, value] of url.searchParams.entries()) {
    if (key.match(/where\[id\]\[in\]\[\d+\]/) && value) {
      singleId = value;
      ids.add(value);
    }
  }
  
  // Extract post ID from path if present (e.g. /api/posts/123456)
  if (!singleId && multipleIds.length === 0) {
    const path = url.pathname;
    const pathSegments = path.split('/');
    const pathId = pathSegments[pathSegments.length - 1];
    
    if (pathId && pathId !== 'posts') {
      singleId = pathId;
    }
  }
  
  if (singleId) {
    ids.add(singleId);
  }
  
  return {
    postId: singleId || null,
    postIds: multipleIds.length > 0 ? multipleIds : [...ids]
  };
}
