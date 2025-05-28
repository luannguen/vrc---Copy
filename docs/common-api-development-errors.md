# Common API Development Errors and Solutions

This document outlines common errors encountered in our API development and provides clear solutions.

## TypeScript Function vs Boolean Error

### Error Message
```
This condition will always return true since this function is always defined. 
Did you mean to call it instead?
```

### Problem
This occurs when using a function name directly in a conditional statement without calling it:

```typescript
// INCORRECT - will always evaluate to true!
if (canUseDOM) {
  // Use browser APIs
}
```

The function reference itself is treated as a truthy value (since it exists), not its return value.

### Solution
Simply call the function:

```typescript
// CORRECT - calls the function and evaluates its return value
if (canUseDOM()) {
  // Use browser APIs
}
```

### Files Previously Fixed
- `src/utilities/getURL.ts`
- `src/providers/HeaderTheme/index.tsx`

## Payload Handler Type Errors

### Error Message
Various TypeScript errors related to handler signatures in Payload CMS endpoints.

### Problem
Payload CMS v3.x has stricter typing for handler functions than our implementation:

```typescript
// Expected signature conflicts with our implementation
handler: async (req: PayloadRequest, res: Response, next: NextFunction) => void
```

### Solution
For deprecated endpoints that are kept only as stubs, use `@ts-nocheck`:

```typescript
/**
 * @deprecated This file is kept for reference but is no longer used
 * The actual endpoint has been migrated to: src/app/api/path/route.ts
 */

/* eslint-disable */
// @ts-nocheck
import type { Endpoint } from "payload";

export const someEndpoint: Endpoint = {
  path: "/path",
  method: "get",
  handler: (req, res, next) => {
    return res.status(301).json({
      deprecated: true,
      message: "This endpoint has been moved to /api/path"
    });
  }
};
```

### Files Previously Fixed
- `src/endpoints/health.ts`

## CORS Implementation Errors

### Error Message
Various CORS-related errors when testing the API from a different origin.

### Problem
Inconsistent or missing CORS headers across different API endpoints.

### Solution
Always use the standard CORS utilities in all API routes:

```typescript
import {
  handleOptionsRequest,
  createCORSResponse,
  createCORSHeaders,
  handleApiError
} from '../_shared/cors';

// Required OPTIONS method handler for CORS preflight requests
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Your implementation
    
    // Return with CORS headers
    return createCORSResponse({
      success: true,
      data: result
    }, 200);
  } catch (error) {
    // Handle errors with CORS headers
    return handleApiError(error, 'User-friendly message', 500);
  }
}
```

## React Hydration Errors

### Error Message
```
Hydration failed because the initial UI does not match what was rendered on the server.
```

### Problem
This often happens when using browser-only APIs during rendering without proper checks.

### Solution
Use `canUseDOM()` before accessing browser APIs, and ensure proper handling of browser vs server environments:

```typescript
const [state, setState] = useState(() => {
  // Initialize state safely depending on environment
  if (canUseDOM()) {
    return window.localStorage.getItem('key') || defaultValue;
  }
  return defaultValue;
});
```

## Wrong Import Path Errors

### Error Message
```
Module not found: Can't resolve '...'
```

### Problem
When paths change during refactoring or project structure updates, imports may break.

### Solution
Always update import paths when files are moved:

```typescript
// BEFORE
import { something } from '../../../../endpoints/path/file';

// AFTER
import { something } from '../../path/file';
```

### Best Practice
Use path aliases where possible to make imports more resilient to refactoring:

```typescript
// With path alias
import { something } from '@/path/file';
```

## Conclusion

Most errors in our API development fall into these categories. By following the patterns and solutions outlined above, we can maintain a consistent and error-free codebase.
