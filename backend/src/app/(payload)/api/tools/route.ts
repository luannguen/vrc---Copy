import { NextRequest } from 'next/server';
import { handleGET } from './handlers/get';
import { handlePOST } from './handlers/post';
import { handleDELETE } from './handlers/delete';
import { handleOPTIONS } from './handlers/options';
import { handlePatch } from './handlers/patch';
import { handlePUT } from './handlers/put';

/**
 * Tools Admin API Routes
 * This API provides admin panel integration for the Tools collection
 *
 * GET /admin/api/tools - List tools with admin formatting
 * POST /admin/api/tools - Create new tool
 * PATCH /admin/api/tools?id=123 - Update existing tool by ID
 * PUT /admin/api/tools?id=123 - Update existing tool by ID (alias for PATCH)
 * DELETE /admin/api/tools - Delete tool(s) by ID(s)
 * OPTIONS /admin/api/tools - CORS preflight
 */

// Handle CORS preflight requests
export function OPTIONS(req: NextRequest) {
  return handleOPTIONS(req);
}

// Handle GET requests - list tools or get single tool
export async function GET(req: NextRequest) {
  return handleGET(req);
}

// Handle POST requests - create new tool
export async function POST(req: NextRequest) {
  return handlePOST(req);
}

// Handle DELETE requests - delete tool(s)
export async function DELETE(req: NextRequest) {
  return handleDELETE(req);
}

// Handle PATCH requests - update existing tool
export async function PATCH(req: NextRequest) {
  return handlePatch(req);
}

// Handle PUT requests - update existing tool (alias for PATCH)
export async function PUT(req: NextRequest) {
  return handlePUT(req);
}
