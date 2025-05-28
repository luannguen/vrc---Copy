# API Endpoint Migration Guide

## Overview

This guide details the migration process from Payload CMS Express-based endpoints to Next.js App Router API routes. The project has moved from using traditional Payload endpoints to using modern Next.js API routes, which required several fixes and adjustments.

## Migration Context

Originally, this project used Payload CMS's endpoint configuration pattern:

```typescript
// Old approach: Payload CMS endpoint
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req: any, res: Response): Promise<Response> => {
    // Handler code
  }
}
```

The project is now using Next.js App Router API routes:

```typescript
// New approach: Next.js API route
export async function GET(req: NextRequest): Promise<NextResponse> {
  // Handler code
  return NextResponse.json(data);
}
```

## Resolving Common Issues

### 1. PayloadHandler Type Error

The most common error when trying to use the old Payload endpoints is:

```
Type '(req: any, res: any) => Promise<any>' is not assignable to type 'PayloadHandler'.
Target signature provides too few arguments. Expected 2 or more, but got 1.
```

**Solution**: 

For Payload CMS local endpoints (`src/endpoints/`), the endpoint should be defined as:

```typescript
// Correctly typed Payload endpoint
import { type Endpoint } from 'payload';

export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req, res, next) => {
    // Handler implementation
    return res.json({ status: 'ok' });
  },
};
```

The key difference is that Payload handlers now expect **three parameters**: `req`, `res`, and `next`.

For Next.js API routes (`src/app/api/`), use:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Implementation
  return NextResponse.json({ status: 'ok' });
}
```

### 2. Migrating Existing Endpoints

When migrating existing endpoints:

1. Create a new file in `src/app/api/[endpoint-name]/route.ts`
2. Implement the appropriate HTTP method handlers (GET, POST, etc.)
3. Use Next.js Response/Request objects instead of Express ones
4. Handle CORS properly for each endpoint

### 3. CORS Handling

CORS in Next.js routes is handled differently from Express:

```typescript
// Next.js CORS handling
export async function OPTIONS(req: NextRequest) {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}
```

## Testing API Routes

Create test files in the `test/` directory to validate your API routes:

```javascript
// Example test file structure
const axios = require('axios');

async function testEndpoint() {
  try {
    const response = await axios.get('http://localhost:3000/api/your-endpoint');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEndpoint();
```

## Future Work

The following endpoints still need to be fully migrated:

1. `src/endpoints/health.ts` - This should be deprecated in favor of `src/app/api/health/route.ts`

## Recommendations

1. Use the Next.js App Router pattern for all new API endpoints
2. For consistent CORS handling, use the utility functions in `src/app/(payload)/api/_shared/cors.ts`
3. Write tests for all API endpoints
4. Document API endpoints with examples in the `docs/` directory
