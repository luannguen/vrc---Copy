/**
 * Creates a GET API route handler with withCORS wrapper
 * Example:
 * ```ts
 * export { OPTIONS } from '../_shared/cors';
 * export const GET = createGetHandler(async (req) => {
 *   // Your handler logic
 * });
 * ```
 */
import { NextRequest, NextResponse } from 'next/server';
import { withCORS } from '../_shared/cors';

export const createGetHandler = (
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options = {}
) => withCORS(handler, { ...options, methods: ['GET', 'OPTIONS'] });

export const createPostHandler = (
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options = {}
) => withCORS(handler, { ...options, methods: ['POST', 'OPTIONS'] });

export const createPutHandler = (
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options = {}
) => withCORS(handler, { ...options, methods: ['PUT', 'OPTIONS'] });

export const createPatchHandler = (
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options = {}
) => withCORS(handler, { ...options, methods: ['PATCH', 'OPTIONS'] });

export const createDeleteHandler = (
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options = {}
) => withCORS(handler, { ...options, methods: ['DELETE', 'OPTIONS'] });

export const createApiHandlers = (options = {}) => {
  return {
    GET: createGetHandler((req) => handleMethod(req, 'GET'), options),
    POST: createPostHandler((req) => handleMethod(req, 'POST'), options),
    PUT: createPutHandler((req) => handleMethod(req, 'PUT'), options),
    PATCH: createPatchHandler((req) => handleMethod(req, 'PATCH'), options),
    DELETE: createDeleteHandler((req) => handleMethod(req, 'DELETE'), options),
    OPTIONS: (req: NextRequest) => {
      const allowedMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
      return withCORS(() => new NextResponse(null, { status: 204 }), { methods: allowedMethods })(req);
    },
  };
};

const handleMethod = (req: NextRequest, method: string) => {
  return NextResponse.json(
    { message: `Method ${method} not implemented` },
    { status: 501 }
  );
};
