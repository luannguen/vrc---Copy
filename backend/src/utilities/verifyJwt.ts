import { verify, sign, JwtPayload, JsonWebTokenError, TokenExpiredError, NotBeforeError } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import logger from './logger';

/**
 * Enhanced JWT payload with optional custom fields
 */
export interface EnhancedJwtPayload extends JwtPayload {
  // Custom fields
  userId?: string;
  email?: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  updatedAt?: number; // Timestamp when token was last updated (for refresh tracking)
  
  // Standard JWT claims
  sub?: string;
  exp?: number;
  iat?: number; // Issued at timestamp
  nbf?: number;
  iss?: string;
  aud?: string;
  jti?: string;
  
  // Refresh token related
  refreshTokenId?: string;    // ID connecting to refresh token
  refreshCount?: number;      // How many times the token has been refreshed
  refreshExpiry?: number;     // When the refresh token expires
  tokenVersion?: number;      // Version of the token for revocation checking
  deviceId?: string;          // Device identifier for multi-device tracking
  sessionData?: {             // Optional session-related data
    lastActivity?: number;    // Last activity timestamp
    ipAddress?: string;       // IP address of the user
    userAgent?: string;       // User agent information
  };
}

/**
 * JWT verification error types
 */
export enum JwtErrorType {
  EXPIRED = 'token_expired',
  INVALID = 'token_invalid',
  NOT_ACTIVE = 'token_not_active',
  MISSING = 'token_missing',
  UNKNOWN = 'token_error'
}

/**
 * Custom JWT verification error
 */
export class JwtVerificationError extends Error {
  type: JwtErrorType;
  
  constructor(message: string, type: JwtErrorType) {
    super(message);
    this.name = 'JwtVerificationError';
    this.type = type;
  }
}

/**
 * Verifies a JWT token and returns the payload
 * 
 * @param token The JWT token to verify
 * @param strict If true, throws error for invalid tokens. If false, returns null for invalid tokens.
 * @returns The decoded token payload or null if strict=false and token is invalid
 * @throws JwtVerificationError if token is invalid/expired and strict=true
 */
export function verifyJwt(token: string, strict = true): EnhancedJwtPayload | null {
  if (!token) {
    if (strict) {
      throw new JwtVerificationError('Token is missing', JwtErrorType.MISSING);
    }
    return null;
  }
  
  try {
    // Use environment variable for the secret key
    const jwtSecret = process.env.JWT_SECRET || process.env.PAYLOAD_SECRET || 'default-secret-do-not-use-in-production';
    
    // Verify the token with explicit expiration checking
    const payload = verify(token, jwtSecret, {
      ignoreExpiration: false, // Ensure expired tokens are caught
    }) as EnhancedJwtPayload;
    
    // Double-check expiration manually
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      if (strict) {
        throw new JwtVerificationError('Token has expired', JwtErrorType.EXPIRED);
      }
      return null;
    }
    
    // Log in development for debugging
    if (process.env.NODE_ENV === 'development') {
      logger.debug('JWT verified successfully:', {
        exp: payload.exp ? new Date(payload.exp * 1000).toISOString() : 'No expiration',
        sub: payload.sub,
        role: payload.role,
      });
    }
    
    return payload;
  } catch (error) {
    // Handle specific JWT error types with better error messages
    if (error instanceof TokenExpiredError) {
      logger.warn('JWT expired:', error.message);
      if (strict) {
        throw new JwtVerificationError('Token has expired', JwtErrorType.EXPIRED);
      }
      return null;
    }
    
    if (error instanceof NotBeforeError) {
      logger.warn('JWT not active yet:', error.message);
      if (strict) {
        throw new JwtVerificationError('Token not active yet', JwtErrorType.NOT_ACTIVE);
      }
      return null;
    }
    
    if (error instanceof JsonWebTokenError) {
      logger.warn('JWT invalid:', error.message);
      if (strict) {
        throw new JwtVerificationError('Invalid token', JwtErrorType.INVALID);
      }
      return null;
    }
    
    // Handle unknown errors
    logger.error('JWT verification failed:', error instanceof Error ? error.message : 'Unknown error');
    if (strict) {
      throw new JwtVerificationError('Token verification failed', JwtErrorType.UNKNOWN);
    }
    return null;
  }
}

/**
 * Extracts JWT token from various request sources
 * 
 * @param req NextRequest object
 * @returns The extracted token or null if not found
 */
export function extractToken(req: Request): string | null {
  // Try to get token from Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
    // Try to get token from cookies
  const cookies = req.headers.get('cookie');
  if (cookies) {
    const tokenCookieMatch = cookies.match(/payload-token=([^;]+)/);
    if (tokenCookieMatch && tokenCookieMatch[1]) {
      return tokenCookieMatch[1];
    }
  }
  
  // No token found
  return null;
}

/**
 * Gets the user from a request by extracting and verifying the JWT token
 * 
 * @param req The request object
 * @param options Configuration options
 * @returns The JWT payload with user info and optional new tokens
 */
export async function getUserFromRequest(
  req: Request, 
  options: {
    strict?: boolean;
    autoRefresh?: boolean;
  } = {}
): Promise<{
  payload: EnhancedJwtPayload | null;
  newAccessToken?: string;
  newRefreshToken?: string;
}> {
  const { strict = false, autoRefresh = false } = options;
  const token = extractToken(req);
  
  if (!token) return { payload: null };
  
  try {
    // Attempt to verify the token
    const payload = verifyJwt(token, false); // Use non-strict mode to catch expired tokens
    
    // If token is valid, return the payload
    if (payload) {
      return { payload };
    }
    
    // If we're here, the token might be expired
    // Check if we should auto-refresh
    if (autoRefresh) {
      // Extract refresh token from cookies
      const cookies = req.headers.get('cookie');
      if (cookies) {
        const refreshTokenMatch = cookies.match(/refresh-token=([^;]+)/);
        if (refreshTokenMatch && refreshTokenMatch[1]) {
          const refreshToken = refreshTokenMatch[1];
          
          try {
            // Attempt to refresh the token
            const refreshResult = await refreshAccessToken(token, refreshToken);
            
            if (refreshResult) {
              // Token was successfully refreshed
              logger.debug('Auto-refreshed access token');
              
              // Decode the new token to get the payload
              const newPayload = verifyJwt(refreshResult.accessToken, false);
              
              const result: { 
                payload: EnhancedJwtPayload | null;
                newAccessToken?: string;
                newRefreshToken?: string;
              } = { 
                payload: newPayload,
                newAccessToken: refreshResult.accessToken
              };
              
              if (refreshResult.refreshToken) {
                result.newRefreshToken = refreshResult.refreshToken;
              }
              
              return result;
            }
          } catch (refreshError) {
            logger.warn('Failed to refresh token:', 
              refreshError instanceof Error ? refreshError.message : 'Unknown error');
            // Continue to return null payload below
          }
        }
      }
    }
    
    // If we got here, either autoRefresh is false or refresh failed
    if (strict) {
      throw new JwtVerificationError('Token verification failed', JwtErrorType.UNKNOWN);
    }
    
    return { payload: null };
  } catch (error) {
    logger.debug('Failed to get user from request:', error instanceof Error ? error.message : 'Unknown error');
    
    if (strict) {
      throw error;
    }
    
    return { payload: null };
  }
}

/**
 * Refresh token information
 */
export interface RefreshToken {
  id: string;
  token: string;
  userId: string;
  expiresAt: number; // Timestamp when the refresh token expires
  createdAt: number;
  used: boolean;     // Whether the refresh token has been used
  revoked: boolean;  // Whether the refresh token has been revoked
  family?: string;   // Token family for tracking and preventing reuse
}

/**
 * Verifies a refresh token
 * 
 * @param refreshToken The refresh token to verify
 * @param strict If true, throws error for invalid tokens. If false, returns false for invalid tokens.
 * @returns The refresh token payload if valid, or false if invalid
 */
export function verifyRefreshToken(
  refreshToken: string, 
  strict = false
): { id: string; userId: string; family?: string; iat?: number; exp?: number } | false {
  if (!refreshToken) {
    if (strict) throw new JwtVerificationError('Refresh token is missing', JwtErrorType.MISSING);
    return false;
  }
  
  try {
    // Use a separate secret for refresh tokens if available
    const jwtRefreshSecret = 
      process.env.JWT_REFRESH_SECRET || 
      process.env.PAYLOAD_SECRET || 
      'default-refresh-secret-do-not-use-in-production';
    
    // Verify the refresh token - with different options than normal tokens
    const payload = verify(refreshToken, jwtRefreshSecret, {
      ignoreExpiration: false,
    }) as { id: string; userId: string; family?: string; iat?: number; exp?: number };
    
    // Validate the required fields
    if (!payload.id || !payload.userId) {
      logger.warn('Invalid refresh token format - missing required fields');
      if (strict) throw new JwtVerificationError('Invalid refresh token format', JwtErrorType.INVALID);
      return false;
    }
    
    // Check expiration manually to be extra safe
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      logger.warn('Refresh token has expired');
      if (strict) throw new JwtVerificationError('Refresh token has expired', JwtErrorType.EXPIRED);
      return false;
    }
    
    // In a real implementation, here you would:
    // 1. Check against database if this token ID exists
    // 2. Verify it hasn't been used (for one-time use tokens) 
    // 3. Check it hasn't been revoked (for security incidents)
    // 4. Validate the token family to prevent replay attacks
    
    logger.debug('Refresh token verified successfully for user:', payload.userId);
    return payload;
  } catch (error) {
    logger.warn('Refresh token verification failed:', error instanceof Error ? error.message : 'Unknown error');
    
    if (strict && error instanceof Error) {
      // Convert standard JWT errors to our custom error type
      if (error instanceof TokenExpiredError) {
        throw new JwtVerificationError('Refresh token has expired', JwtErrorType.EXPIRED);
      } else if (error instanceof JsonWebTokenError) {
        throw new JwtVerificationError('Invalid refresh token', JwtErrorType.INVALID);
      } else {
        throw new JwtVerificationError('Refresh token verification failed', JwtErrorType.UNKNOWN);
      }
    }
    
    return false;
  }
}

/**
 * Attempts to refresh an access token using a refresh token
 * 
 * @param expiredToken The expired access token
 * @param refreshToken The refresh token
 * @returns New access token and optionally a new refresh token, or null if refresh failed
 */
export async function refreshAccessToken(
  expiredToken: string,
  refreshToken: string
): Promise<{ accessToken: string; refreshToken?: string } | null> {
  try {
    // Verify the refresh token first
    const refreshPayload = verifyRefreshToken(refreshToken);
    if (!refreshPayload) {
      logger.warn('Attempted to refresh with invalid refresh token');
      return null;
    }
    
    // Even though the access token is expired, we can still decode it to get the payload
    // We just need to ignore the expiration check
    const jwtSecret = process.env.JWT_SECRET || process.env.PAYLOAD_SECRET || 'default-secret-do-not-use-in-production';
    const expiredPayload = verify(expiredToken, jwtSecret, { ignoreExpiration: true }) as EnhancedJwtPayload;
    
    // Verify the user IDs match between refresh token and access token
    const accessTokenUserId = expiredPayload.userId || expiredPayload.sub;
    if (refreshPayload.userId !== accessTokenUserId) {
      logger.warn('User ID mismatch between access token and refresh token');
      return null;
    }
    
    // Create a new token with updated fields and refresh tracking
    const now = Math.floor(Date.now() / 1000);
    const expiresIn = process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 3600; // 1 hour default
    
    const newPayload: EnhancedJwtPayload = {
      ...expiredPayload,
      iat: now,                                   // New issued at time
      exp: now + expiresIn,                       // New expiration time
      updatedAt: now,                             // Track when token was updated
      refreshCount: (expiredPayload.refreshCount || 0) + 1,  // Increment refresh count
      refreshTokenId: refreshPayload.id,          // Link to the refresh token used
      tokenVersion: (expiredPayload.tokenVersion || 0) + 1,  // Increment version for revocation tracking
      sessionData: {
        ...(expiredPayload.sessionData || {}),
        lastActivity: now                         // Update last activity timestamp
      }
    };
      // Sign a new token
    const newAccessToken = sign(
      newPayload,
      jwtSecret,
      { expiresIn }
    );
    
    logger.debug('Access token refreshed successfully', { 
      userId: accessTokenUserId,
      refreshCount: newPayload.refreshCount,
      tokenVersion: newPayload.tokenVersion
    });
    
    // In a real implementation, we want to also refresh the refresh token
    // after a certain number of uses (token rotation pattern) to prevent replay attacks
    let newRefreshToken: string | undefined;
    
    // Implement token rotation after a certain number of refreshes (e.g. every 3 refreshes)
    const refreshCount = newPayload.refreshCount || 1;
    if (refreshCount % 3 === 0) {
      // Generate a new refresh token with rotation for security
      newRefreshToken = generateNewRefreshToken(expiredPayload.userId || expiredPayload.sub);
      logger.debug('Refresh token rotated after multiple uses');
    }
    
    const result: { accessToken: string; refreshToken?: string } = {
      accessToken: newAccessToken
    };
    
    if (newRefreshToken) {
      result.refreshToken = newRefreshToken;
    }
    
    return result;
    } catch (error) {
    logger.error('Failed to refresh access token:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Generates a new refresh token for a user
 * 
 * @param userId The user ID to generate a token for
 * @returns A new refresh token string
 */
export function generateNewRefreshToken(userId?: string): string {
  if (!userId) {
    logger.warn('Attempted to generate refresh token without userId');
    throw new Error('User ID is required to generate refresh token');
  }
  
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || process.env.PAYLOAD_SECRET || 'default-refresh-secret-do-not-use-in-production';  const now = Math.floor(Date.now() / 1000);
  const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN) : 604800; // 7 days default
  const tokenId = randomBytes(16).toString('hex'); // Random token ID
  
  // Create refresh token payload with token ID for revocation checking
  const refreshPayload = {
    userId,
    id: tokenId,
    family: randomBytes(8).toString('hex'), // Token family for tracking
    iat: now,
    exp: now + refreshExpiresIn,
  };
    // Sign token with refresh secret
  return sign(
    refreshPayload,
    jwtRefreshSecret,
    { expiresIn: refreshExpiresIn }
  );
}
