# API Endpoint Development Guide

This guide provides best practices and patterns for developing API endpoints in our Next.js application with Payload CMS.

## Current Architecture

Our project has **migrated from Express-based Payload CMS endpoints to Next.js App Router API routes**. Understanding this architecture is critical for proper implementation.

## API Development Locations

### ✅ New API Endpoints

All new API endpoints should be created in the Next.js App Router structure:

```
/src/app/(payload)/api/[endpoint-name]/route.ts
```

or 

```
/src/app/api/[endpoint-name]/route.ts
```

### ❌ Legacy Endpoint Structure (Do Not Use for New Development)

```
/src/endpoints/[endpoint-name].ts
```

These files are maintained only for compatibility and will eventually be removed. **Do not create new endpoints here.**

## API Implementation Pattern

### Standard Route File Structure

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  handleOptionsRequest,
  createCORSResponse,
  createCORSHeaders,
  handleApiError
} from '../_shared/cors';

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({
      config,
    })
    
    // Your implementation here
    // ...
    
    // Return success response with CORS headers
    return createCORSResponse({
      success: true,
      data: result,
    }, 200);
  } catch (error) {
    console.error('API Error:', error)
    return handleApiError(error, 'Error message for users', 500)
  }
}
```

## Common TypeScript Pitfalls

### Function vs Boolean Values

**❌ Incorrect:**
```typescript
if (canUseDOM) {
  // Browser code
}
```

**✅ Correct:**
```typescript
if (canUseDOM()) {
  // Browser code
}
```

This issue has been fixed in several places, including `src/utilities/getURL.ts` and `src/providers/HeaderTheme/index.tsx`.

### Handler Type Signatures in Legacy Code

When maintaining legacy endpoint code, use the `@ts-nocheck` directive to avoid type errors with Payload handler signatures:

```typescript
// @ts-nocheck
export const someEndpoint = {
  path: "/path",
  method: "get",
  handler: (req, res, next) => {
    // Implementation
  }
};
```

## Testing API Endpoints

All API endpoints should have corresponding test files in the `/test` directory:

```
/test/endpoint-name-test.js
```

## CORS Handling

Always use the provided CORS utilities:

- `handleOptionsRequest` - For OPTIONS preflight requests
- `createCORSResponse` - For creating responses with proper CORS headers
- `createCORSHeaders` - For getting CORS headers to add to custom responses
- `handleApiError` - For standardized error handling with CORS support

## Documentation

Update or create documentation for each API endpoint in the `/docs` directory.

## Migration Pattern

When migrating an endpoint from Express to Next.js:

1. Keep the old endpoint with a stub that redirects to the new endpoint
2. Create the new Next.js API route with proper CORS handling
3. Update documentation to reflect the change
4. Add a test file for the new endpoint
5. After thorough testing, the old endpoint can be deprecated

## Runtime Environment Considerations

- Always use proper checks like `canUseDOM()` before accessing browser-only APIs
- Handle server-side vs client-side rendering differences appropriately
- Use environment variables consistently across environments
