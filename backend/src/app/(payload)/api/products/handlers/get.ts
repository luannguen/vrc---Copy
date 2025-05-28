import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { createCORSHeaders, handleApiError } from '../../_shared/cors';
import { formatApiResponse, formatApiErrorResponse, formatAdminResponse } from '../utils/responses';
import { isAdminRequest } from '../utils/requests';

/**
 * Fetch products with various filters, sorting, and pagination
 * 
 * GET /api/products - List all products with pagination and filters
 * GET /api/products?slug=example - Get single product by slug
 * GET /api/products?id=123456 - Get single product by ID
 * GET /api/products?category=abc - Filter products by category
 * GET /api/products?featured=true - Filter featured products
 * GET /api/products?search=query - Search products
 * GET /api/products?page=1&limit=10 - Pagination
 * GET /api/products?sort=createdAt&sortDirection=desc - Sorting
 */
export async function handleGET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    const url = new URL(req.url);
    
    // Parse query parameters - handle both URL params and form data (for method override requests)
    let queryParams = new URLSearchParams();
    
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
        console.log('GET /api/products: Parsed form data as query params:', Object.fromEntries(queryParams.entries()));
      } catch (formError) {
        console.log('GET /api/products: Could not parse form data, using URL params only');
      }
    }
    
    // Extract parameters from the combined query params
    const id = queryParams.get("id");
    const slug = queryParams.get("slug");
    const page = Number(queryParams.get("page")) || 1;
    const limit = Number(queryParams.get("limit")) || 20;
    const category = queryParams.get("category");
    const featured = queryParams.get("featured") === "true";
    const search = queryParams.get("search");
    const sort = queryParams.get("sort") || "createdAt";
    const sortDirection = queryParams.get("sortDirection") || "desc";
    const status = queryParams.get("status") || "published";
    const depth = Number(queryParams.get("depth")) || 1;
    const draft = queryParams.get("draft") === "true";
    
    // Handle admin-specific query parameters
    const selectName = queryParams.get("select[name]") === "true";
    
    console.log('GET /api/products: Processed parameters:', {
      id, slug, page, limit, category, featured, search, sort, sortDirection, status, depth, draft, selectName
    });

    const headers = createCORSHeaders();

    // If fetching a single product by ID
    if (id) {
      try {
        const product = await payload.findByID({
          collection: "products",
          id,
          depth: 2, // Populate relationships 2 levels deep
        });

        return NextResponse.json(
          {
            success: true,
            data: product,
          },
          {
            status: 200,
            headers,
          }
        );
      } catch (err: any) {
        return formatApiErrorResponse("Không tìm thấy sản phẩm", err.message, 404);
      }
    }

    // If fetching a single product by slug
    if (slug) {
      const productResult = await payload.find({
        collection: "products",
        where: {
          slug: { equals: slug },
          status: { equals: status },
        },
        depth: 2, // Populate relationships 2 levels deep
      });

      if (productResult.docs && productResult.docs.length > 0) {
        return formatApiResponse(productResult.docs[0]);
      } else {
        return formatApiErrorResponse("Sản phẩm không tồn tại", null, 404);
      }
    }    // Build the query conditionally for product listing
    const query: any = {};
    
    // Handle admin-specific complex query parameters
    // Parse "where[and][1][id][not_in][0]" type parameters
    const excludeIds: string[] = [];
    for (const [key, value] of queryParams.entries()) {
      if (key.includes('[id][not_in]') && value) {
        excludeIds.push(value);
      }
    }
    
    // If we have IDs to exclude, add them to the query
    if (excludeIds.length > 0) {
      query.id = {
        not_in: excludeIds,
      };
      console.log('GET /api/products: Excluding IDs:', excludeIds);
    }
    
    // Add status filter
    if (status && status !== "published") {
      query.status = {
        equals: status,
      };
    } else if (!draft) {
      // Default to published for non-draft requests
      query.status = {
        equals: "published",
      };
    }
    // If draft=true, don't add status filter to include all statuses

    // Add filters if they exist
    if (category) {
      query.category = {
        equals: category,
      };
    }

    if (featured) {
      query.featured = {
        equals: true,
      };
    }

    if (search) {
      query.or = [
        {
          name: {
            like: search,
          },
        },
        {
          excerpt: {
            like: search,
          },
        },
        {
          description: {
            like: search,
          },
        },
        {
          productCode: {
            like: search,
          },
        },
      ];
    }
    
    // Sort direction preparation
    let sortOptions = "-createdAt";
    if (sort) {
      sortOptions = sortDirection === "asc" ? sort : `-${sort}`;
    }    // Fetch products with filters, sorting, and pagination
    const findOptions: any = {
      collection: "products",
      where: query,
      sort: sortOptions,
      page,
      limit,
      depth: depth, // Use dynamic depth from parameters
    };
    
    // Handle field selection for admin requests
    if (selectName) {
      // Admin interface only wants specific fields
      findOptions.select = {
        id: true,
        name: true,
        updatedAt: true,
        createdAt: true,
      };
    }
      console.log('GET /api/products: Find options:', JSON.stringify(findOptions, null, 2));
    
    const products = await payload.find(findOptions);

    // Check if this is an admin request
    if (isAdminRequest(req)) {
      console.log('GET /api/products: Returning admin format response');
      // For admin interface, return the format expected by Payload UI
      return formatAdminResponse({
        docs: products.docs,
        totalDocs: products.totalDocs,
        totalPages: products.totalPages,
        page: products.page,
        limit: products.limit,
        pagingCounter: products.pagingCounter,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
      });
    } else {
      // For API clients, return our custom format
      console.log('GET /api/products: Returning API format response');
      return formatApiResponse({
        docs: products.docs,
        totalDocs: products.totalDocs,
        totalPages: products.totalPages,
        page: products.page,
        limit: products.limit,
        pagingCounter: products.pagingCounter,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
      });
    }
  } catch (error) {
    console.error("Products API Error:", error);
    return handleApiError(error, "Lỗi khi lấy dữ liệu sản phẩm");
  }
}
