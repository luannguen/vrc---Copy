# CORS and API Error Handling Standardization Guide

## Overview

This document provides guidance on CORS handling and error standardization across the backend API routes. After identifying several issues during the build process, we've implemented fixes to ensure consistent error handling and proper CORS implementation.

## Key Issues Found

1. **Missing Import**: Several route files were missing the `createCORSHeaders` import but were attempting to use it.
2. **Unused Variables**: Some files had unused imports such as `createCORSHeaders` or `createCORSResponse`.
3. **Undefined Error Variable**: Some error handling code referenced undefined variables.

## Standardized API Response Structure

For consistent API responses, all endpoints should follow this structure:

### Success Response
```json
{
  "success": true,
  "data": [result_data],
  "pagination": {
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalDocs": 45
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "User-friendly message explaining the error",
  "error": "Technical error details (optional in production)"
}
```

## Proper CORS Implementation

To ensure proper CORS handling, follow these guidelines:

1. **Import the necessary functions**:
```typescript
import {
  createCORSHeaders,
  createCORSResponse,
  handleOptionsRequest,
  handleApiError
} from '../_shared/cors';
```

2. **Always include an OPTIONS handler**:
```typescript
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req);
}
```

3. **Use createCORSResponse for API responses**:
```typescript
return createCORSResponse(
  {
    success: true,
    data: results,
    pagination
  },
  200
);
```

4. **Use handleApiError for error responses**:
```typescript
return handleApiError(
  error,
  'User-friendly error message',
  statusCode
);
```

## Fixed Files

The following files have been reviewed and fixed:

1. `src/app/(payload)/api/suppliers/route.ts` - Fixed missing import and invalid error reference
2. `src/app/(payload)/api/services/route.ts` - All required imports present
3. `src/app/(payload)/api/projects/route.ts` - All required imports present
4. `src/app/(payload)/api/company-info/route.ts` - Using proper error handling

## Test Implementation

We've created test files to validate the fixes and ensure proper CORS headers and error responses:

- `test/suppliers-route-test.js` - Tests the suppliers API endpoint

## Future Improvements

Future API development should follow these guidelines:

1. Always validate request parameters before processing
2. Implement proper error logging and structured error responses
3. Use TypeScript types consistently to avoid `any` type usage 
4. Use properly named parameters in handler functions (e.g., use `_req` for unused request parameters)
5. Ensure consistent pagination implementation across all list endpoints

## References

- [MDN CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Next.js API Routes Documentation](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
