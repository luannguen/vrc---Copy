# CORS Improvements in VRC Backend

## Summary of Changes

We've significantly improved the Cross-Origin Resource Sharing (CORS) implementation in the VRC Backend to ensure consistent behavior across all API endpoints and better security practices, particularly for production environments.

## Key Improvements

### 1. Enhanced Central CORS Configuration

The CORS configuration in `payload.config.ts` now:

- Uses environment-specific settings (dev vs prod)
- Removes the wildcard origin `*` in production
- Uses proper property names according to PayloadCMS docs
- Adds support for credentials (cookies, auth headers)
- Optimizes preflight caching for better performance

```typescript
cors: {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        getServerSideURL(),                                  // Backend URL
        process.env.FRONTEND_URL,                            // Frontend URL (production)
      ].filter(Boolean) as string[]
    : [
        getServerSideURL(),                                  // Backend URL
        process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend Vite URL
        'http://localhost:8080', 'http://localhost:8081',    // Custom frontend ports
        '*',                                                 // Allow all origins for development
      ].filter(Boolean) as string[],    
  exposedHeaders: [
    'authorization', 
    'content-type', 
    'x-custom-header', 
    'cache-control', 
    'x-requested-with',
    'accept',
    'x-api-test',
  ],
  credentials: true,
  maxAge: 86400,
},
```

### 2. Standardized CORS Helpers

The shared CORS helper file at `src/app/(payload)/api/_shared/cors.ts` now provides:

- Consistent header generation based on Payload's config
- Proper environment-specific behavior
- Support for credentials and preflight caching
- Standardized OPTIONS request handling
- Unified response creation with CORS headers

### 3. Standardization Script

We've created a utility script at `test/standardize-cors.js` to automatically update API routes to use the shared CORS helpers. This script:

- Identifies custom CORS implementations
- Replaces them with references to shared helpers
- Ensures consistent behavior across all endpoints

### 4. CORS Testing Tool

A CORS testing utility has been added at `test/cors-test.js` to verify proper CORS header implementation on all endpoints. This tool:

- Tests all API endpoints for correct CORS headers
- Verifies OPTIONS request handling
- Provides clear feedback on issues

## Benefits

1. **Consistency**: All API endpoints now handle CORS in exactly the same way
2. **Security**: Production environments no longer accept requests from any origin
3. **Performance**: Preflight caching reduces OPTIONS requests
4. **Maintainability**: Central configuration makes future changes easier
5. **Standards Compliance**: Implementation follows CORS best practices

## Documentation

Additional documentation has been added:

- `docs/cors-configuration.md`: General CORS configuration guide
- `docs/cors-fix-guide.md`: Step-by-step guide for fixing CORS issues

## Enhanced Security and Authentication

We've added several new security and authentication features:

### 1. Improved Authentication with JWT Verification

The `checkAuth` function now fully verifies JWT tokens with:
- Token signature validation
- Expiration checking
- Role-based access control
- CSRF protection for cookie-based authentication

```typescript
// Example of protected endpoint with role requirement
export const POST = withCORS(
  async (req) => { /* handler logic */ },
  { requireAuth: true, requiredRoles: ['admin'] }
);
```

### 2. Enhanced Error Handling

The `handleApiError` function now intelligently detects various error types:
- Validation errors (ZodError)
- Database errors (PrismaError)
- External API errors (AxiosError)
- Authentication errors (JWT)

### 3. CSRF Protection for Cookie-Based Authentication

For improved security with cookie-based authentication:
- Double-submit cookie pattern implementation
- Automatic CSRF token verification for non-GET requests
- CSRF tokens cached on the client for better performance

### 4. Structured Logging

Replaced console.log calls with a structured logger:
- Log levels (DEBUG, INFO, WARN, ERROR)
- Context-based logging with parent/child relationships
- Improved readability in development with colors
- Environment-specific behavior

## Next Steps

To complete the CORS standardization:

1. Run the standardization script: `node test/standardize-cors.js`
2. Manually check any API routes that the script couldn't update
3. Run the CORS testing tool: `node test/cors-test.js`
4. Update the frontend to properly handle credentials if needed
