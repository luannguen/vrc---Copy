/**
 * @deprecated This file is kept for reference but is no longer used
 * The health endpoint has been migrated to: src/app/api/health/route.ts
 *
 * Any changes should be made to the new API route, not this file.
 */

/* eslint-disable */
// @ts-nocheck
import type { Endpoint } from "payload";

// Export a stub endpoint to prevent build errors
export const healthEndpoint: Endpoint = {
  path: "/health",
  method: "get",
  handler: (req, res, next) => {
    return res.status(301).json({
      deprecated: true,
      message: "This endpoint has been moved to /api/health"
    });
  }
};