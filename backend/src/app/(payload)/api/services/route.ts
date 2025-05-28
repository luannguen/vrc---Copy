import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'



import {
  handleOptionsRequest,
  handleApiError,
  createCORSHeaders
} from '../_shared/cors';
import { handleDELETE } from './handlers/delete';
import { handleGET } from './handlers/get';
import { handlePOST } from './handlers/post';
import { handlePUT } from './handlers/put';

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}

// GET method handler
export function GET(req: NextRequest) {
  return handleGET(req);
}

// DELETE method handler
export function DELETE(req: NextRequest) {
  return handleDELETE(req);
}

// POST method handler
export function POST(req: NextRequest) {
  return handlePOST(req);
}

// PUT method handler
export function PUT(req: NextRequest) {
  return handlePUT(req);
}
