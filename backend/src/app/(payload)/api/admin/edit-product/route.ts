import { NextRequest, NextResponse } from 'next/server';
import { createCORSHeaders } from '../../_shared/cors';

/**
 * Admin edit product API endpoint
 * This is an auxiliary endpoint for admin operations on products
 */

export async function GET(_req: NextRequest) {
  const headers = createCORSHeaders();
  return NextResponse.json(
    { message: 'Admin edit product API endpoint' },
    { status: 200, headers }
  );
}

export async function OPTIONS(_req: NextRequest) {
  const headers = createCORSHeaders();
  return new NextResponse(null, { status: 204, headers });
}