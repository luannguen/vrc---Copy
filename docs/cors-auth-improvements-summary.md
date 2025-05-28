# CORS and Authentication Improvements

## Overview
This document summarizes the improvements made to the CORS and authentication system in the VRC backend project.

## Recent Improvements (May 2025)

### 1. Origin-Aware CORS Headers
- Enhanced CORS handling to check the request's origin against a whitelist
- Properly responds with the specific origin instead of always using the first allowed origin
- Improved security and compatibility with multiple frontend domains

### 2. WWW-Authenticate Header for JWT Failures
- Added RFC 6750 compliant WWW-Authenticate header for authentication failures
- Helps clients understand how to authenticate properly
- Provides standardized error information for token issues

### 3. Improved Cookie-Based Auth Detection
- Added dedicated utility function `isCookieBasedAuth` to detect cookie-based authentication
- Simplifies authentication checking logic
- Better separation of concerns for authentication methods

### 4. Extended Authentication Logging
- Added comprehensive logging for authentication events
- Includes user-agent and IP address tracking for better debugging
- Structured logs with timestamps and authentication status

### 5. Enhanced Error Response Structure
- Added standardized error response format with error types
- Support for validation errors, formatted as `field: [array of errors]`
- Includes optional additional error details and error codes
- Error types: 'validation' | 'unauthorized' | 'forbidden' | 'server'

## Previous Implemented Improvements

### 1. Enhanced JWT Verification
- Added specific error types for different JWT errors (expired, invalid, not active)
- Added `strict` mode parameter to make verification optional based on context
- Added manual expiration checking for extra security
- Added `getUserFromRequest` helper to simplify getting the user from any request

### 2. Better Error Handling
- Created custom `JwtVerificationError` class with error type classification
- Added specific error handling for different JWT error scenarios
- Improved error messages for better debugging

### 3. Structured Logging
- Replaced console.log with a structured logger
- Added context-based logging (`logger.child()`)
- Implemented different log levels (DEBUG, INFO, WARN, ERROR)

### 4. CSRF Protection
- Added double-submit cookie pattern for CSRF protection
- Automatically validates CSRF tokens for non-GET requests using cookies
- Added helper functions for token generation and verification

### 5. Role-Based Access Control
- Enhanced checkAuth to support role-based permissions
- Supports both single role and roles array in JWT payload
- Allows specifying required roles for specific endpoints

### 6. Flexible Authentication Modes
- Development bypass with X-API-Test header
- Support for both Bearer token and cookie-based authentication
- Conditional CSRF protection based on authentication type

### 7. URL Configuration
- Updated getURL to use BASE_URL from environment variables
- Added fallbacks for different deployment environments
- Separate functions for client-side and server-side URL resolution

## New Features

### withCORS Higher-Order Function
- Wraps any API route handler with CORS and authentication in one line
- Automatically handles preflight requests and error responses
- Simplifies applying consistent CORS and auth across all endpoints

### API Helper Functions
- Added `createGetHandler`, `createPostHandler`, etc. for quick route creation
- Each helper automatically applies the appropriate HTTP methods and CORS

### User Information Extraction
- Added `getUserFromRequest` to easily get user information from any request
- Non-strict mode allows getting user info without blocking unauthenticated requests

## Code Quality
- Added TypeScript interfaces and types for better type safety
- Improved documentation with JSDoc comments
- Modular design for better testability and maintenance

## Testing
- Added test script to verify CORS and authentication functionality
- Tests different scenarios: OPTIONS requests, public endpoints, authentication bypass, and invalid auth

## Migration Guide

To update existing API routes to use the new system:

1. Import the withCORS function:
```typescript
import { withCORS } from '../_shared/cors';
```

2. Wrap your handler with withCORS:
```typescript
export const GET = withCORS(
  async (req) => {
    // Your handler code
    return NextResponse.json({ ... });
  },
  { requireAuth: true, requiredRoles: ['admin'] } // Optional auth config
);
```

3. For simpler usage, use the helper functions:
```typescript
import { createGetHandler } from '../_shared/api-helpers';

export const GET = createGetHandler(async (req) => {
  // Your handler code
  return NextResponse.json({ ... });
});
```
