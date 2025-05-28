# Health Endpoint Migration Guide

This document describes the migration of the health endpoint from the Payload CMS Express-based endpoint to the Next.js App Router API route.

## Overview

The health endpoint provides basic server health information and serves as an uptime check for monitoring services. As part of our migration to the Next.js App Router, we've moved this endpoint from the Express-based implementation to a Next.js API route.

## Changes Made

1. **Deprecated Old Endpoint**: The original endpoint at `src/endpoints/health.ts` has been replaced with a stub that returns a 301 redirect to the new endpoint.

2. **Created New API Route**: The new implementation is at `src/app/api/health/route.ts` and follows the Next.js App Router pattern.

3. **Added CORS Support**: The new endpoint properly handles CORS with preflight requests and appropriate headers.

4. **Added HEAD Request Support**: The new endpoint supports HEAD requests in addition to GET and OPTIONS.

## Implementation Details

### Old Implementation (Express-based)

The original implementation was registered as a Payload endpoint:

```typescript
// src/endpoints/health.ts
export const healthEndpoint: Endpoint = {
  path: "/health",
  method: "get",
  handler: (req, res, next) => {
    // Handler implementation
  }
};

// In payload.config.ts
endpoints: [
  (await import('./endpoints/health')).healthEndpoint,
],
```

### New Implementation (Next.js App Router)

The new implementation uses Next.js App Router API routes:

```typescript
// src/app/api/health/route.ts
export async function GET(req: NextRequest) {
  // Implementation
}

export async function HEAD(req: NextRequest) {
  // Implementation
}

export async function OPTIONS(req: NextRequest) {
  // Implementation
}
```

## Testing

You can test the health endpoint using the test script at `test/health-endpoint-test.js`, which checks both implementations for backward compatibility.

## Migration Pattern

This migration follows a standard pattern that can be used for other endpoints:

1. Keep the old endpoint with a stub that redirects to the new one
2. Create a new Next.js API route with proper CORS handling
3. Support all necessary HTTP methods (GET, POST, PUT, DELETE, OPTIONS, etc.)
4. Ensure consistent error handling
5. Add appropriate tests

## Common Issues

### Type Errors in Payload Handlers

When migrating Payload endpoints, you may encounter TypeScript errors with the handler signature. Solutions:

- Use `@ts-nocheck` for deprecated handlers
- Properly type the request and response objects
- Ensure return types match the expected signature

### CORS Issues

If you encounter CORS issues, ensure:

- OPTIONS route is implemented
- Appropriate CORS headers are set for all responses
- Origin validation is properly implemented

## Conclusion

By following this pattern, we can gradually migrate all Express-based endpoints to the Next.js App Router without breaking existing functionality.
