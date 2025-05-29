import { NextRequest } from 'next/server';
import { handleGET } from '../../../(payload)/api/products/handlers/get';
import { handleUpdate } from '../../../(payload)/api/products/handlers/update';
import { handleDELETE } from '../../../(payload)/api/products/handlers/delete';
import { handleOptionsRequest } from '../../../(payload)/api/_shared/cors';

// OPTIONS handler for CORS preflight
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req, ['GET', 'PUT', 'DELETE', 'OPTIONS']);
}

// GET handler - get single product by ID
export async function GET(req: NextRequest) {
  return handleGET(req);
}

// PUT handler - update product
export async function PUT(req: NextRequest) {
  return handleUpdate(req);
}

// DELETE handler - delete product
export async function DELETE(req: NextRequest) {
  return handleDELETE(req);
}
