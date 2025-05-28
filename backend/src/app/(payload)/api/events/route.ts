import { NextRequest, NextResponse } from 'next/server'
import {
  handleOptionsRequest,
} from '../_shared/cors'

// Import handlers
import { handleGET } from './handlers/get'
import { handlePOST } from './handlers/post'
import { handleDELETE } from './handlers/delete'
import { handlePATCH } from './handlers/patch'

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleGET(req);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return handlePOST(req);
}

// PATCH method handler for updates
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  return handlePATCH(req);
}

// DELETE method handler
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  return handleDELETE(req);
}
