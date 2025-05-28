import { NextRequest, NextResponse } from 'next/server';

// Import all handlers
export { GET } from './handlers/get';
export { POST } from './handlers/post';
export { PUT } from './handlers/put';
export { PATCH } from './handlers/patch';
export { DELETE } from './handlers/delete';
export { OPTIONS } from './handlers/options';
