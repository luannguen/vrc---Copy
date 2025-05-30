import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { handleApiError } from '../../_shared/cors';
import { formatApiResponse, formatApiErrorResponse, formatAdminResponse } from '../utils/responses';
import { isAdminRequest } from '../utils/requests';

/**
 * Fetch tools with various filters, sorting, and pagination
 *
 * GET /api/tools - List all tools with pagination and filters
 * GET /api/tools?slug=example - Get single tool by slug
 * GET /api/tools?id=123456 - Get single tool by ID
 * GET /api/tools?category=abc - Filter tools by category
 * GET /api/tools?featured=true - Filter featured tools
 * GET /api/tools?search=query - Search tools
 * GET /api/tools?page=1&limit=10 - Pagination
 * GET /api/tools?sort=createdAt&sortDirection=desc - Sorting
 */
export async function handleGET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    const url = new URL(req.url);

    // Parse query parameters - handle both URL params and form data (for method override requests)
    const queryParams = new URLSearchParams();

    // First, get URL parameters
    url.searchParams.forEach((value, key) => {
      queryParams.set(key, value);
    });

    // If this is a POST request with form data (method override), parse form data as query params
    const contentType = req.headers.get('content-type') || '';
    if (req.method === 'POST' && contentType.includes('application/x-www-form-urlencoded')) {
      try {
        const formData = await req.formData();
        for (const [key, value] of formData.entries()) {
          queryParams.set(key, value.toString());
        }
        console.log('GET /api/tools: Parsed form data as query params:', Object.fromEntries(queryParams.entries()));
      } catch (_formError) {
        console.log('GET /api/tools: Could not parse form data, using URL params only');
      }
    }

    // Extract parameters from the combined query params
    const id = queryParams.get("id");
    const slug = queryParams.get("slug");
    const category = queryParams.get("category");
    const featured = queryParams.get("featured");
    const search = queryParams.get("search");
    const toolType = queryParams.get("toolType");
    const difficulty = queryParams.get("difficulty");
    const status = queryParams.get("status");
    const page = parseInt(queryParams.get("page") || "1");
    const limit = parseInt(queryParams.get("limit") || "10");
    const sort = queryParams.get("sort") || "createdAt";
    const sortDirection = queryParams.get("sortDirection") || "desc";

    console.log('GET /api/tools: Query parameters:', {
      id, slug, category, featured, search, toolType, difficulty, status, page, limit, sort, sortDirection
    });

    // Check if this is an admin request
    const isAdmin = isAdminRequest(req);
    console.log('GET /api/tools: Admin request detected:', isAdmin);

    // Single tool by ID
    if (id) {
      console.log('GET /api/tools: Fetching single tool by ID:', id);
      try {
        const tool = await payload.findByID({
          collection: "tools",
          id,
        });

        console.log('GET /api/tools: Found tool by ID:', tool ? tool.id : 'null');

        if (isAdmin) {
          return formatAdminResponse(tool);
        } else {
          return formatApiResponse(tool);
        }
      } catch (error) {
        console.error('GET /api/tools: Error finding tool by ID:', error);
        return formatApiErrorResponse('Tool not found', null, 404);
      }
    }

    // Single tool by slug
    if (slug) {
      console.log('GET /api/tools: Fetching single tool by slug:', slug);
      try {
        const result = await payload.find({
          collection: "tools",
          where: {
            slug: { equals: slug },
            status: { equals: "published" },
          },
          limit: 1,
        });

        const tool = result.docs[0];
        console.log('GET /api/tools: Found tool by slug:', tool ? tool.id : 'null');

        if (!tool) {
          return formatApiErrorResponse('Tool not found', null, 404);
        }

        if (isAdmin) {
          return formatAdminResponse(tool);
        } else {
          return formatApiResponse(tool);
        }
      } catch (error) {
        console.error('GET /api/tools: Error finding tool by slug:', error);
        return formatApiErrorResponse('Tool not found', null, 404);
      }
    }

    // Build where clause for collection query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Status filter - default to published for public API, all for admin
    if (status) {
      where.status = { equals: status };
    } else if (!isAdmin) {
      where.status = { equals: "published" };
    }

    // Category filter
    if (category) {
      where.category = { equals: category };
    }

    // Featured filter
    if (featured === "true") {
      where.featured = { equals: true };
    }

    // Tool type filter
    if (toolType) {
      where.toolType = { equals: toolType };
    }

    // Difficulty filter
    if (difficulty) {
      where.difficulty = { equals: difficulty };
    }

    // Search functionality
    if (search) {
      where.or = [
        { name: { contains: search } },
        { excerpt: { contains: search } },
        { description: { contains: search } },
        { 'tags.tag': { contains: search } },
      ];
    }

    console.log('GET /api/tools: Where clause:', JSON.stringify(where, null, 2));

    // Build sort parameter
    const sortParam = sortDirection === "asc" ? sort : `-${sort}`;
    console.log('GET /api/tools: Sort parameter:', sortParam);

    // Query tools
    const result = await payload.find({
      collection: "tools",
      where,
      page,
      limit,
      sort: sortParam,
    });

    console.log('GET /api/tools: Found tools:', result.docs.length, 'Total:', result.totalDocs);

    // Format response based on request type
    if (isAdmin) {
      return formatAdminResponse(result);
    } else {
      return formatApiResponse(result);
    }

  } catch (error) {
    console.error('GET /api/tools: Error:', error);
    return handleApiError(error, 'Error fetching tools');
  }
}
