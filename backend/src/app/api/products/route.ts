import { NextRequest } from 'next/server';
import { handleGET } from '../../(payload)/api/products/handlers/get';
import { handlePOST } from '../../(payload)/api/products/handlers/post';
import { handleOptionsRequest } from '../../(payload)/api/_shared/cors';

// OPTIONS handler for CORS preflight
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req, ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']);
}

// GET handler - list products with filtering
export async function GET(req: NextRequest) {
  return handleGET(req);
}

// POST handler - create new product
export async function POST(req: NextRequest) {
  return handlePOST(req);
}
