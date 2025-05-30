import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { createCORSHeaders, handleApiError, checkAuth } from "../../_shared/cors";
import { isAdminRequest, extractToolId, extractToolIds } from "../utils/requests";
import { formatApiResponse, formatApiErrorResponse, formatBulkResponse } from "../utils/responses";

/**
 * Delete a tool or multiple tools
 *
 * DELETE /api/tools?id=123456
 * DELETE /api/tools?ids=123456,789012
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
    console.log("DELETE /api/tools: Is admin request:", adminReq);

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

    // Extract tool IDs
    const toolId = await extractToolId(req);
    const toolIds = extractToolIds(req);

    const _headers = createCORSHeaders();

    // Handle bulk delete with comma-separated IDs
    if (toolIds) {
      console.log(`🗑️ Processing bulk delete for ${toolIds.length} tools:`, toolIds);

      if (toolIds.length === 0) {
        return formatApiErrorResponse("Không có ID công cụ được cung cấp", null, 400);
      }

      // Delete multiple tools
      const results = [];
      const errors = [];

      // Process deletions sequentially to avoid race conditions
      for (const id of toolIds) {
        try {
          console.log(`Deleting tool ID: ${id}`);

          // Verify tool exists first
          const tool = await payload.findByID({
            collection: "tools",
            id,
          }).catch(() => null);

          if (!tool) {
            errors.push({ id, error: "Không tìm thấy công cụ" });
            continue; // Skip to next tool
          }

          // Delete the tool
          await payload.delete({
            collection: "tools",
            id,
          });

          console.log(`✅ Successfully deleted tool: ${id}`);
          results.push({ id, success: true });

        } catch (deleteError: unknown) {
          console.error(`❌ Error deleting tool ${id}:`, deleteError);
          // Cast to any for error handling
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const err = deleteError as any;
          errors.push({
            id,
            error: err.message || "Lỗi khi xóa công cụ"
          });
        }
      }

      console.log(`Bulk delete completed: ${results.length} successes, ${errors.length} errors`);

      // Return bulk operation response
      return formatBulkResponse(results, errors, adminReq);

    } else if (toolId) {
      // Handle single tool delete
      console.log(`🗑️ Processing single delete for tool ID: ${toolId}`);

      try {
        // Verify tool exists first
        const tool = await payload.findByID({
          collection: "tools",
          id: toolId,
        });

        if (!tool) {
          return formatApiErrorResponse("Không tìm thấy công cụ", null, 404);
        }

        // Delete the tool
        await payload.delete({
          collection: "tools",
          id: toolId,
        });

        console.log(`✅ Successfully deleted tool: ${toolId}`);

        return formatApiResponse(
          { id: toolId },
          "Công cụ đã được xóa thành công"
        );

      } catch (deleteError: unknown) {
        console.error(`❌ Error deleting tool ${toolId}:`, deleteError);
        // Cast to any for error handling
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = deleteError as any;
        return formatApiErrorResponse(
          "Lỗi khi xóa công cụ",
          err.message,
          500
        );
      }

    } else {
      // No valid ID provided
      console.log("❌ No valid tool ID provided for deletion");
      return formatApiErrorResponse(
        "Không có ID công cụ hợp lệ được cung cấp",
        null,
        400
      );
    }

  } catch (error: unknown) {
    console.error("DELETE /api/tools: Unexpected error:", error);
    return handleApiError(error, "Lỗi khi xóa công cụ");
  }
}
