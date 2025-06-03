"use strict";
/**
 * @deprecated This file is kept for reference but is no longer used
 * The health endpoint has been migrated to: src/app/api/health/route.ts
 *
 * Any changes should be made to the new API route, not this file.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthEndpoint = void 0;
// Export a stub endpoint to prevent build errors
exports.healthEndpoint = {
    path: "/health",
    method: "get",
    handler: (req, res, next) => {
        return res.status(301).json({
            deprecated: true,
            message: "This endpoint has been moved to /api/health"
        });
    }
};
