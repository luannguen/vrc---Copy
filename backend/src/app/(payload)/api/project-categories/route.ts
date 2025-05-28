import { NextRequest, NextResponse } from 'next/server';
import { handleGET, handlePOST, handlePUT, handleDELETE } from './handlers';
import { createCORSHeaders } from '../_shared/cors';

// GET handler
export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleGET(req);
}

// POST handler
export async function POST(req: NextRequest): Promise<NextResponse> {
  return handlePOST(req);
}

// PUT handler
export async function PUT(req: NextRequest): Promise<NextResponse> {
  return handlePUT(req);
}

// DELETE handler
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return handleDELETE(req);
}

// OPTIONS handler for CORS preflight
export async function OPTIONS(): Promise<NextResponse> {
  const headers = createCORSHeaders();
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}
