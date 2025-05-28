import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { checkAuth } from '../../_shared/cors';
import { isAdminRequest } from '../utils/requests';
import { formatAdminResponse, formatApiResponse, formatAdminErrorResponse, formatApiErrorResponse } from '../utils/responses';

/**
 * Handle POST requests to create new products
 */
export async function handlePOST(req: NextRequest): Promise<NextResponse> {
  console.log('POST /api/products: Request received');
  try {
    // Check for HTTP method override (admin interface uses this for GET requests via POST)
    const methodOverride = req.headers.get('x-http-method-override');
    console.log('POST /api/products: Method override header:', methodOverride);
    
    // If this is actually a GET request disguised as POST, delegate to GET handler
    if (methodOverride === 'GET') {
      console.log('POST /api/products: Delegating to GET handler due to method override');
      
      // Check if this is an admin request before delegating
      const adminRequest = isAdminRequest(req);
      console.log('POST /api/products: Method override from admin request:', adminRequest);
      
      const { handleGET } = await import('./get');
      return handleGET(req);
    }
    
    // Log request details for debugging
    console.log('POST /api/products: Headers:', JSON.stringify(Object.fromEntries(req.headers.entries())));
    
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log('POST /api/products: Is Payload Admin request:', adminRequest);
    
    // Check if this is a save operation from the admin panel
    const url = new URL(req.url);
    const isAdminSaveOperation = adminRequest && url.searchParams.has('depth');
    console.log('POST /api/products: Is admin save operation:', isAdminSaveOperation, 'URL:', req.url);

    // Authentication - skip for admin UI requests which handle auth differently
    // Non-admin requests require auth token
    if (!adminRequest) {
      const isAuthenticated = await checkAuth(req);
      if (!isAuthenticated) {
        return formatApiErrorResponse(
          'Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.',
          null,
          401
        );
      }
    }
    
    // Parse the request body with special handling for content types
    let productData: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        // Parse JSON body
        productData = await req.json();
        console.log('POST /api/products: Parsed JSON data:', JSON.stringify(productData));
      } else if (contentType.includes('multipart/form-data')) {
        // Handle multipart/form-data, used in admin forms
        const formData = await req.formData();
        
        // Log all form fields for debugging
        console.log('POST /api/products: FormData fields:', Array.from(formData.keys()));
        
        // Special handling for _payload field which contains the actual data as JSON string
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            try {
              const payloadString = payloadValue.toString();
              console.log('POST /api/products: _payload content:', payloadString);
              
              const payloadData = JSON.parse(payloadString);
              // Use the parsed payload as the primary data source
              productData = { ...payloadData };
              console.log('POST /api/products: Successfully parsed _payload field:', JSON.stringify(productData));
            } catch (jsonError) {
              console.error('POST /api/products: Error parsing _payload field:', jsonError);
            }
          }
        }
        
        // Add any other fields from the form (files or fields not in _payload)
        for (const [key, value] of formData.entries()) {
          // Skip _payload since we already processed it
          if (key === '_payload') continue;
          
          // Special handling for file uploads
          if (value instanceof File) {
            productData[key] = value;
          } else if (key === 'categories' || key === 'relatedProducts' || key === 'related_products') {            try {
              // Parse JSON strings for relationship fields
              productData[key] = JSON.parse(value.toString());
            } catch (_e) {
              productData[key] = value;
            }
          } else {
            productData[key] = value;
          }
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle x-www-form-urlencoded, common in form submissions
        const formData = await req.formData();
          // Convert FormData to regular object
        for (const [key, value] of formData.entries()) {
          // Handle special fields requiring JSON parsing
          if (key === 'categories' || key === 'relatedProducts' || key === 'related_products') {
            try {
              productData[key] = JSON.parse(value.toString());
            } catch (_e) {
              productData[key] = value;
            }
          } else {
            productData[key] = value;
          }
        }
      } else {
        // Default to formData for any other content type, with fallback to json()
        try {
          const formData = await req.formData();
          for (const [key, value] of formData.entries()) {
            productData[key] = value;
          }        } catch (_formError) {
          try {
            productData = await req.json();} catch (_jsonError) {
            console.error('POST /api/products: Failed to parse request body as formData or JSON:', _jsonError);
            return adminRequest 
              ? formatAdminErrorResponse('Định dạng dữ liệu không hợp lệ', 400)
              : formatApiErrorResponse(
                  'Định dạng dữ liệu không hợp lệ. Vui lòng gửi dữ liệu ở định dạng JSON, form-urlencoded hoặc form-data.',
                  null,
                  400
                );
          }
        }
      }
    } catch (parseError) {
      console.error('POST /api/products: Failed to parse request body:', parseError);
      return adminRequest 
        ? formatAdminErrorResponse('Invalid request format', 400)
        : formatApiErrorResponse(
            'Định dạng dữ liệu không hợp lệ. Vui lòng gửi dữ liệu ở định dạng JSON hoặc form-urlencoded.',
            null,
            400
          );
    }
    
    // Log the final parsed data
    console.log('POST /api/products: Product data after parsing:', JSON.stringify(productData, null, 2));
    
    // Validate required fields - check both title and name fields to be compatible with both API versions
    if (!productData.title && !productData.name) {
      console.log('POST /api/products: Missing required title/name field in request:', JSON.stringify(productData));
      
      if (adminRequest) {
        return formatAdminErrorResponse([{ message: 'Title or name is required', field: 'title' }], 400);
      } else {
        return formatApiErrorResponse(
          'Thiếu thông tin bắt buộc: Tiêu đề sản phẩm.',
          null,
          400
        );
      }
    }
    
    // Ensure the title field is set (for compatibility)
    if (!productData.title && productData.name) {
      productData.title = productData.name;
      console.log('POST /api/products: Set title to name:', productData.title);
    } else if (!productData.name && productData.title) {
      productData.name = productData.title;
      console.log('POST /api/products: Set name to title:', productData.name);
    }
    
    // Handle related products field - ensure it's properly formatted
    if (productData.relatedProducts !== undefined) {
      if (productData.relatedProducts === null || productData.relatedProducts === 0 || productData.relatedProducts === '0') {
        // If relatedProducts is null, 0 or '0', set it to an empty array
        productData.relatedProducts = [];
        console.log('POST /api/products: relatedProducts was null/0, setting to empty array');
      } else if (!Array.isArray(productData.relatedProducts)) {
        // If it's not an array (but not null/undefined), try to format it properly
        try {
          if (typeof productData.relatedProducts === 'string') {
            // Try to parse JSON if it's a string
            if (productData.relatedProducts.trim() === '') {
              productData.relatedProducts = [];
            } else if (productData.relatedProducts.startsWith('[')) {
              productData.relatedProducts = JSON.parse(productData.relatedProducts);
            } else {
              // Single ID as string
              productData.relatedProducts = [productData.relatedProducts];
            }
          } else if (typeof productData.relatedProducts === 'object') {
            // Handle single object case
            productData.relatedProducts = [productData.relatedProducts];
          } else {
            // Any other case, set to empty
            productData.relatedProducts = [];
          }
          console.log('POST /api/products: Formatted relatedProducts:', JSON.stringify(productData.relatedProducts));
        } catch (error) {
          console.error('POST /api/products: Error formatting relatedProducts, setting to empty array:', error);
          productData.relatedProducts = [];
        }
      }
    }
    
    // Apply the same formatting to categories if present
    if (productData.categories !== undefined) {
      if (productData.categories === null || productData.categories === 0 || productData.categories === '0') {
        // If categories is null, 0 or '0', set it to an empty array
        productData.categories = [];
        console.log('POST /api/products: categories was null/0, setting to empty array');
      } else if (!Array.isArray(productData.categories)) {
        // If it's not an array (but not null/undefined), try to format it properly
        try {
          if (typeof productData.categories === 'string') {
            // Try to parse JSON if it's a string
            if (productData.categories.trim() === '') {
              productData.categories = [];
            } else if (productData.categories.startsWith('[')) {
              productData.categories = JSON.parse(productData.categories);
            } else {
              // Single ID as string
              productData.categories = [productData.categories];
            }
          } else if (typeof productData.categories === 'object') {
            // Handle single object case
            productData.categories = [productData.categories];
          } else {
            // Any other case, set to empty
            productData.categories = [];
          }
          console.log('POST /api/products: Formatted categories:', JSON.stringify(productData.categories));
        } catch (error) {
          console.error('POST /api/products: Error formatting categories, setting to empty array:', error);
          productData.categories = [];
        }
      }
    }
    
    // Initialize Payload CMS
    const payload = await getPayload({
      config,
    });
    
    // Create the product
    const product = await payload.create({
      collection: 'products',
      data: productData as any, // Type assertion to bypass payload type checking
      // Use different contexts for admin vs API
      context: {
        isFromAPI: !adminRequest,
        disableRevalidate: false,
      },
      // Only include drafts info for admin requests
      draft: adminRequest ? undefined : false,
    });
    
    console.log(`POST /api/products: Product created successfully. ID: ${product.id}`);
    
    // Format response based on request type
    if (adminRequest) {
      return formatAdminResponse(product, 201);
    } else {
      return formatApiResponse(product, 'Tạo sản phẩm thành công', 201);
    }
  } catch (error: unknown) {
    console.error('POST /api/products: Error creating product:', error);
    
    // Handle different error types
    const err = error as any; // Cast to any for error handling
    if (err?.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      // Format validation errors
      const errorMessage = err.errors.map((e: any) => e.message).join(', ');
      
      if (isAdminRequest(req)) {
        return formatAdminErrorResponse(err.errors, 400);
      } else {
        return formatApiErrorResponse(
          `Lỗi tạo sản phẩm: ${errorMessage}`,
          { errors: err.errors },
          400
        );
      }
    }
    
    // Generic error handling
    if (isAdminRequest(req)) {
      const errorMessage = err?.message || 'Unknown error occurred';
      return formatAdminErrorResponse(errorMessage, 500);
    } else {
      return formatApiErrorResponse(
        'Đã xảy ra lỗi khi tạo sản phẩm. Vui lòng thử lại sau.',
        null,
        500
      );
    }
  }
}
