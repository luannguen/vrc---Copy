import { NextRequest, NextResponse } from 'next/server';

export function OPTIONS(req: NextRequest): NextResponse {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-HTTP-Method-Override',
    'Access-Control-Max-Age': '86400',
  };

  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}
