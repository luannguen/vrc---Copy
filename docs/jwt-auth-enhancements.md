# JWT Authentication Enhancements

This document outlines the enhancements made to the JWT authentication system in the VRC backend.

## Overview of Changes

1. **Enhanced Token Tracking**
   - Added `iat` (Issued At) and `updatedAt` timestamps to tokens
   - Added `refreshCount` to track how many times a token has been refreshed
   - Added `tokenVersion` for revocation tracking

2. **Refresh Token Support**
   - Implemented robust refresh token verification
   - Added token rotation for security (every 3 refreshes)
   - Created proper typing for refresh tokens

3. **Auto-Refresh Capability**
   - Enhanced `getUserFromRequest` function to support automatic token refresh
   - Added proper error handling for expired tokens
   - Simplified the API for token renewal

4. **Multiple Device Support**
   - Added device tracking via `deviceId`
   - Sessions can be managed independently

5. **Better Type Safety**
   - Fixed TypeScript errors in JWT verification
   - Enhanced error typing with `JwtErrorType` enum
   - Added proper return type definitions

## Using the Enhanced JWT Authentication

### Basic Authentication

```typescript
import { getUserFromRequest } from '../../../../utilities/verifyJwt';

// In your API route handler:
export async function GET(req: Request) {
  const { payload } = await getUserFromRequest(req);
  
  if (!payload) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // User is authenticated, access user info
  const userId = payload.userId || payload.sub;
  const userRoles = payload.roles || [];
  
  // Continue with your logic...
}
```

### Auto-Refresh Support

```typescript
// Enable automatic token refresh when tokens are about to expire
const { payload, newAccessToken, newRefreshToken } = await getUserFromRequest(req, {
  strict: false,
  autoRefresh: true
});

// If we got a new access token, we should return it to the client
if (newAccessToken) {
  const response = new Response(JSON.stringify({ data }));
  
  // Set the new access token as a cookie or header
  response.headers.set('Authorization', `Bearer ${newAccessToken}`);
  
  // If we also got a new refresh token, set it too
  if (newRefreshToken) {
    response.headers.append('Set-Cookie', `refresh-token=${newRefreshToken}; Path=/; HttpOnly; Secure; SameSite=Strict`);
  }
  
  return response;
}
```

### Manual Token Verification

```typescript
import { verifyJwt, JwtErrorType, JwtVerificationError } from '../../../../utilities/verifyJwt';

try {
  // Strict mode will throw errors for invalid tokens
  const payload = verifyJwt(token, true);
  
  // Token is valid
  console.log(`User ${payload.userId} is authenticated`);
  
} catch (error) {
  if (error instanceof JwtVerificationError) {
    switch (error.type) {
      case JwtErrorType.EXPIRED:
        console.log('Token has expired');
        break;
      case JwtErrorType.INVALID:
        console.log('Token is invalid');
        break;
      // Handle other error types...
    }
  }
}
```

### Refreshing Tokens Manually

```typescript
import { refreshAccessToken } from '../../../../utilities/verifyJwt';

// When a token is expired
const { accessToken, refreshToken } = await refreshAccessToken(
  expiredAccessToken,
  currentRefreshToken
);

if (accessToken) {
  // Use the new access token
  // Optionally update the refresh token if a new one was provided
}
```

## Security Considerations

1. **Token Rotation**: Refresh tokens are automatically rotated periodically to prevent replay attacks.

2. **Token Tracking**: Each token contains version information to allow for forced invalidation if needed.

3. **Timestamps**: All tokens include creation and update timestamps for auditing and tracking.

4. **Strict Mode**: The verification functions support a strict mode that throws specific errors for invalid tokens.

5. **CSRF Protection**: The system integrates with the existing CSRF protection for cookie-based authentication.

## Next Steps

1. Consider implementing a token blacklist for immediate revocation of compromised tokens.
2. Add rate limiting for refresh token attempts to prevent brute force attacks.
3. Implement detailed logging of authentication events for security monitoring.
