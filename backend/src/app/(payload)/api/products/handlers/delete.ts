import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { createCORSHeaders, handleApiError, checkAuth } from "../../_shared/cors";
import { isAdminRequest, extractProductId, extractProductIds } from "../utils/requests";
import { formatApiResponse, formatApiErrorResponse, formatBulkResponse } from "../utils/responses";

/**
 * Delete a product or multiple products
 *
 * DELETE /api/products?id=123456
 * DELETE /api/products?ids=123456,789012
 *
 * Requires authentication
 */
export async function handleDELETE(req: NextRequest): Promise<NextResponse> {
  try {
    // Debug: Log exactly what PayloadCMS is sending
    const url = new URL(req.url);
    console.log("\n🔍 === DELETE REQUEST DEBUG ===");
    console.log("Full URL:", req.url);
    console.log("Method:", req.method);
    console.log("Search params:");
    for (const [key, value] of url.searchParams.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    // Log request body if any
    try {
      const bodyText = await req.text();
      if (bodyText) {
        console.log("Request body:", bodyText);
        // Re-create request since we consumed the body
        req = new NextRequest(req.url, {
          method: req.method,
          headers: req.headers,
          body: bodyText
        });
      }
    } catch (_e) {
      console.log("No request body");
    }

    // Log headers
    console.log("Important headers:");
    console.log("  Referer:", req.headers.get('referer'));
    console.log("  Content-Type:", req.headers.get('content-type'));
    console.log("  User-Agent:", req.headers.get('user-agent'));
    console.log("================================\n");

    // Check if this is an admin panel request
    const adminReq = isAdminRequest(req);
    console.log("DELETE /api/products: Is admin request:", adminReq);

    // Require authentication
    const isAuthenticated = await checkAuth(req, true);
    if (!isAuthenticated) {
      return formatApiErrorResponse(
        "Xác thực thất bại. Vui lòng đăng nhập để thực hiện chức năng này.",
        null,
        401
      );
    }

    // Initialize Payload
    const payload = await getPayload({
      config,
    });

    // Extract product IDs
    const productId = await extractProductId(req);
    const productIds = extractProductIds(req);

    const _headers = createCORSHeaders();

    // Handle bulk delete with comma-separated IDs
    if (productIds) {
      console.log(`🗑️ Processing bulk delete for ${productIds.length} products:`, productIds);

      if (productIds.length === 0) {
        return formatApiErrorResponse("Không có ID sản phẩm được cung cấp", null, 400);
      }

      // Delete multiple products
      const results = [];
      const errors = [];

      // Process deletions sequentially to avoid race conditions
      for (const id of productIds) {
        try {
          console.log(`Deleting product ID: ${id}`);

          // Verify product exists first
          const product = await payload.findByID({
            collection: "products",
            id,
          }).catch(() => null);

          if (!product) {
            errors.push({ id, error: "Không tìm thấy sản phẩm" });
            continue;
          }

          // Delete the product
          await payload.delete({
            collection: "products",
            id,
          });

          console.log(`✅ Successfully deleted product: ${id}`);
          results.push({ id, success: true, name: product.name || `Product ${id}` });

        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định";
          console.error(`❌ Failed to delete product ${id}:`, errorMessage);
          errors.push({ id, error: errorMessage });
        }
      }

      console.log(`🎯 Bulk delete completed: ${results.length} success, ${errors.length} errors`);

      // Return formatted response based on request type
      return formatBulkResponse(results, errors, adminReq);
    }

    // Handle single delete
    if (!productId) {
      return formatApiErrorResponse("Không thể xác định ID sản phẩm từ yêu cầu", null, 400);
    }

    try {
      // Find the product first (to log what"s being deleted)
      const product = await payload.findByID({
        collection: "products",
        id: productId,
      }).catch(() => null);

      // Delete the product
      await payload.delete({
        collection: "products",
        id: productId,
      });

      // For admin requests
      if (adminReq) {
        // Định dạng đặc biệt cho admin UI để tránh lỗi "unknown error"
        // Tạo header với các thông số đặc biệt cho Payload UI
        const headers = createCORSHeaders();
        headers.append('X-Payload-Admin', 'true');
        headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
        headers.append('Pragma', 'no-cache');
        headers.append('Expires', '0');

        // Header đặc biệt để kích hoạt việc làm mới danh sách
        headers.append('X-Payload-Refresh', 'products');

        // Trả về CHÍNH XÁC định dạng Payload CMS mong đợi
        // Phát hiện referer để xem request đến từ list view hay edit view
        const referer = req.headers.get('referer') || '';
        const isFromListView = referer.includes('/admin/collections/products') && !referer.includes('/edit');

        console.log('Request referer:', referer);
        console.log('Is request from list view:', isFromListView);

        if (isFromListView) {
          // Format dành riêng cho list view (khác với edit view)
          const listResponse = {
            docs: [{ id: productId }],
            errors: [],
            message: null,
          };
          console.log('Response for list view:', listResponse);
          return NextResponse.json(listResponse, {
            status: 200,
            headers: headers
          });
        } else {
          // Format dành cho edit view (chi tiết sản phẩm)
          const detailResponse = {
            message: null,
            doc: {
              id: productId,
              status: 'deleted'
            },
            errors: [],
          };
          console.log('Response for detail view:', detailResponse);
          return NextResponse.json(detailResponse, {
            status: 200,
            headers: headers
          });
        }
      }

      // For API clients
      return formatApiResponse(
        null,
        `Đã xóa sản phẩm thành công: ${product?.name || productId}`
      );
    } catch (err: unknown) {
      console.error("Delete product error:", err);

      if (adminReq) {
        // Trả về lỗi cho admin UI đúng định dạng
        const headers = createCORSHeaders();
        headers.append('X-Payload-Admin', 'true');

        const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
        return NextResponse.json({
          message: `Không thể xóa sản phẩm: ${errorMessage}`,
          errors: [{
            message: errorMessage,
            field: 'id'
          }]
        }, {
          status: 404,
          headers
        });
      }

      const errorMessage = err instanceof Error ? err.message : 'Lỗi không xác định';
      return formatApiErrorResponse(`Không thể xóa sản phẩm: ${errorMessage}`, null, 404);
    }
  } catch (error) {
    console.error("Products API DELETE Error:", error);

    // Kiểm tra nếu là admin request
    const adminReq = isAdminRequest(req);
    if (adminReq) {
      // Định dạng lỗi cho admin UI
      const headers = createCORSHeaders();
      headers.append('X-Payload-Admin', 'true');

      return NextResponse.json({
        message: `Lỗi khi xóa sản phẩm: ${error instanceof Error ? error.message : 'Lỗi không xác định'}`,
        errors: [{
          message: error instanceof Error ? error.message : 'Lỗi không xác định',
          field: 'general'
        }]
      }, {
        status: 500,
        headers
      });
    }

    return handleApiError(error, "Lỗi khi xóa sản phẩm");
  }
}
