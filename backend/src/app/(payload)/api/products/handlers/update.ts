import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import { checkAuth } from '../../_shared/cors';
import { isAdminRequest } from '../utils/requests';
import { formatAdminResponse, formatApiResponse, formatAdminErrorResponse, formatApiErrorResponse } from '../utils/responses';
import { extractProductId } from '../utils/requests';

/**
 * Handle PUT and PATCH requests to update products
 * This function is shared between both methods as the logic is very similar
 */
export async function handleUpdate(req: NextRequest): Promise<NextResponse> {
  const method = req.method;
  console.log(`${method} /api/products: Request received`);
  
  try {
    // Check if this is an admin panel request
    const adminRequest = isAdminRequest(req);
    console.log(`${method} /api/products: Is admin request: ${adminRequest}`);
    
    // Require authentication with bypass for admin
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

    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    // Get product ID from query params
    const id = await extractProductId(req);
    
    if (!id) {
      return adminRequest
        ? formatAdminErrorResponse([{ message: 'Product ID is required', field: 'id' }], 400)
        : formatApiErrorResponse('ID sản phẩm là bắt buộc', null, 400);
    }

    // Parse request body with improved handling
    let body: Record<string, any> = {};
    const contentType = req.headers.get('content-type') || '';
    console.log(`${method} /api/products: Content-Type:`, contentType);
    
    try {
      if (contentType.includes('application/json')) {
        // Parse JSON body
        body = await req.json();
        console.log(`${method} /api/products: Parsed JSON body:`, JSON.stringify(body).substring(0, 500) + '...');
      } else if (contentType.includes('multipart/form-data')) {
        // Handle multipart/form-data, used in admin forms
        const formData = await req.formData();
        
        // Log all form fields for debugging
        console.log(`${method} /api/products: FormData fields:`, Array.from(formData.keys()));
        
        // Special handling for _payload field first - this contains most of the structured data
        if (formData.has('_payload')) {
          const payloadValue = formData.get('_payload');
          if (payloadValue) {
            try {
              const payloadString = payloadValue.toString();
              console.log(`${method} /api/products: _payload content (sample):`, 
                payloadString.length > 200 ? payloadString.substring(0, 200) + '...' : payloadString);
              
              const payloadData = JSON.parse(payloadString);
              // Use the parsed payload as the primary data source
              body = { ...payloadData };
              console.log(`${method} /api/products: Successfully parsed _payload field`);
            } catch (jsonError) {
              console.error(`${method} /api/products: Error parsing _payload field:`, jsonError);
            }
          }
        }
        
        // Add any other fields from the form (files or fields not in _payload)
        for (const [key, value] of formData.entries()) {
          // Skip _payload since we already processed it
          if (key === '_payload') continue;
            if (value instanceof File) {
            body[key] = value;
          } else {
            // For relationship fields that might be JSON strings
            if (key === 'categories' || key === 'relatedProducts' || key === 'related_products') {
              try {
                body[key] = JSON.parse(value.toString());
              } catch (_e) {
                body[key] = value;
              }
            } else {
              body[key] = value;
            }
          }
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        // Handle form-urlencoded data
        const formData = await req.formData();
          for (const [key, value] of formData.entries()) {
          // For relationship fields that might be JSON strings
          if (key === 'categories' || key === 'relatedProducts' || key === 'related_products') {
            try {
              body[key] = JSON.parse(value.toString());
            } catch (_e) {
              body[key] = value;
            }
          } else {
            body[key] = value;
          }
        }
      } else {
        // Default to try both formData and JSON
        try {
          const formData = await req.formData();
          for (const [key, value] of formData.entries()) {            if (key === '_payload') {
              try {
                const payloadData = JSON.parse(value.toString());
                body = { ...body, ...payloadData };
              } catch (_e) {
                body[key] = value;
              }
            } else {
              body[key] = value;
            }
          }        } catch (_formError) {
          // Fallback to JSON if formData fails
          body = await req.json();
        }
      }
      
      console.log(`${method} /api/products: Body parsed (sample):`, 
        JSON.stringify(body).length > 200 ? JSON.stringify(body).substring(0, 200) + '...' : JSON.stringify(body));
    } catch (parseError) {
      console.error(`${method} /api/products: Parse error:`, parseError);
      return adminRequest
        ? formatAdminErrorResponse('Định dạng dữ liệu không hợp lệ', 400)
        : formatApiErrorResponse(
            'Không thể đọc dữ liệu gửi lên. Vui lòng đảm bảo gửi dữ liệu ở định dạng hợp lệ.',
            { error: (parseError as Error).message },
            400
          );
    }

    try {
      // Determine the actual data to use (handle both direct data and nested structure)
      const productData: Record<string, any> = body.data || body;
      
      // Validate and ensure title field is set
      if (!productData.title && productData.name) {
        productData.title = productData.name;
        console.log(`${method} /api/products: Set title to name:`, productData.title);
      } else if (!productData.name && productData.title) {
        productData.name = productData.title;
        console.log(`${method} /api/products: Set name to title:`, productData.name);
      }
      
      // Handle related products field - ensure it's properly formatted
      if (productData.relatedProducts !== undefined) {
        if (productData.relatedProducts === null || productData.relatedProducts === 0 || productData.relatedProducts === '0') {
          // If relatedProducts is null, 0 or '0', set it to an empty array
          productData.relatedProducts = [];
          console.log(`${method} /api/products: relatedProducts was null/0, setting to empty array`);
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
            console.log(`${method} /api/products: Formatted relatedProducts:`, JSON.stringify(productData.relatedProducts));
          } catch (error) {
            console.error(`${method} /api/products: Error formatting relatedProducts, setting to empty array:`, error);
            productData.relatedProducts = [];
          }
        }
      }
      
      // Apply the same formatting to categories if present
      if (productData.categories !== undefined) {
        if (productData.categories === null || productData.categories === 0 || productData.categories === '0') {
          productData.categories = [];
          console.log(`${method} /api/products: categories was null/0, setting to empty array`);
        } else if (!Array.isArray(productData.categories)) {
          try {
            if (typeof productData.categories === 'string') {
              if (productData.categories.trim() === '') {
                productData.categories = [];
              } else if (productData.categories.startsWith('[')) {
                productData.categories = JSON.parse(productData.categories);
              } else {
                productData.categories = [productData.categories];
              }
            } else if (typeof productData.categories === 'object') {
              productData.categories = [productData.categories];
            } else {
              productData.categories = [];
            }
            console.log(`${method} /api/products: Formatted categories:`, JSON.stringify(productData.categories));
          } catch (error) {
            console.error(`${method} /api/products: Error formatting categories, setting to empty array:`, error);
            productData.categories = [];
          }
        }
      }
      
      console.log(`${method} /api/products: Using data (sample):`, 
        JSON.stringify(productData).length > 200 ? JSON.stringify(productData).substring(0, 200) + '...' : JSON.stringify(productData));
      
      // Update the product
      const updatedProduct = await payload.update({
        collection: 'products',
        id,
        data: productData as any, // Type assertion to bypass payload type checking
        // Add context for Payload
        context: {
          isFromAPI: !adminRequest,
          disableRevalidate: false,
        },
        // Handle draft status differently for admin vs API
        draft: adminRequest ? undefined : false,
      });

      console.log(`${method} /api/products: Product updated successfully. ID: ${id}`);
      
      // Format response based on request source
      if (adminRequest) {
        return formatAdminResponse(updatedProduct, 200);
      } else {
        return formatApiResponse(
          updatedProduct, 
          'Đã cập nhật sản phẩm thành công',
          200
        );
      }
    } catch (err: any) {
      // Handle if product doesn't exist
      console.error(`${method} /api/products: Error updating product:`, err);
      
      if (adminRequest) {
        // Format error for admin interface
        return formatAdminErrorResponse(
          [{ message: err.message || 'Không tìm thấy sản phẩm', field: 'id' }],
          err.status || 404
        );
      }
      
      return formatApiErrorResponse(
        'Không tìm thấy sản phẩm',
        err.message,
        404
      );
    }
  } catch (error: unknown) {
    console.error(`${method} /api/products Error:`, error);
    
    // Handle validation errors
    const err = error as any; // Cast to any for error handling
    if (err?.errors) {
      if (isAdminRequest(req)) {
        return formatAdminErrorResponse(err.errors, 400);
      } else {
        return formatApiErrorResponse(
          'Dữ liệu không hợp lệ',
          { errors: err.errors },
          400
        );
      }
    }
    
    // Generic error handling
    if (isAdminRequest(req)) {
      return formatAdminErrorResponse('An error occurred while updating the product', 500);
    } else {
      return formatApiErrorResponse(
        'Lỗi khi cập nhật sản phẩm',
        null,
        500
      );
    }
  }
  
  // This is just a safety net to ensure we always return a response
  // It should not normally be reached as all code paths above return a response
  return formatApiErrorResponse('Unexpected error in request processing', null, 500);
}
