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
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // Pass the ID from URL params to the handler
  const url = new URL(req.url);
  url.searchParams.set('id', params.id);

  // Create a new request with the ID in query params so existing handler can find it
  const modifiedReq = new NextRequest(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  return handleGET(modifiedReq);
}

// PUT handler - update product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // Pass the ID from URL params to the handler
  const url = new URL(req.url);
  url.searchParams.set('id', params.id);

  // Create a new request with the ID in query params so existing handler can find it
  const modifiedReq = new NextRequest(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  return handleUpdate(modifiedReq);
}

// DELETE handler - delete product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // Pass the ID from URL params to the handler
  const url = new URL(req.url);
  url.searchParams.set('id', params.id);

  // Create a new request with the ID in query params so existing handler can find it
  const modifiedReq = new NextRequest(url.toString(), {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  return handleDELETE(modifiedReq);
}
