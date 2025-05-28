import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import logger from './logger';

/**
 * CSRF token configuration
 */
interface CSRFConfig {
  cookieName: string;
  headerName: string;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    maxAge: number;
  };
}

/**
 * Default CSRF configuration
 */
const defaultConfig: CSRFConfig = {
  cookieName: 'csrf-token',
  headerName: 'x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 3600 // 1 hour
  }
};

/**
 * Generate a secure random token
 * 
 * @returns Random token string
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Set a CSRF token in the response cookies
 * 
 * @param response NextResponse object
 * @param config CSRF configuration
 * @returns The generated token
 */
export function setCSRFToken(
  response: NextResponse, 
  config: CSRFConfig = defaultConfig
): string {
  const token = generateCSRFToken();
  
  // Set the cookie
  response.cookies.set({
    name: config.cookieName,
    value: token,
    httpOnly: config.cookieOptions.httpOnly,
    secure: config.cookieOptions.secure,
    sameSite: config.cookieOptions.sameSite,
    path: config.cookieOptions.path,
    maxAge: config.cookieOptions.maxAge
  });
  
  logger.debug(`CSRF token set in cookie: ${config.cookieName}`);
  return token;
}

/**
 * Verify a CSRF token by comparing cookie and header values
 * 
 * @param req NextRequest object
 * @param config CSRF configuration
 * @returns Boolean indicating if CSRF validation passed
 */
export function verifyCSRFToken(
  req: NextRequest, 
  config: CSRFConfig = defaultConfig
): boolean {
  // Get the token from the cookie
  const cookieToken = req.cookies.get(config.cookieName)?.value;
  
  // Get the token from the header
  const headerToken = req.headers.get(config.headerName);
  
  // Both must exist and match
  if (!cookieToken || !headerToken) {
    logger.warn('CSRF validation failed: Missing token in cookie or header');
    return false;
  }
  
  const isValid = cookieToken === headerToken;
  
  if (!isValid) {
    logger.warn('CSRF validation failed: Token mismatch');
  }
  
  return isValid;
}

/**
 * Get the CSRF token from request cookies
 * 
 * @param req NextRequest object
 * @param config CSRF configuration
 * @returns The CSRF token or null if not found
 */
export function getCSRFToken(
  req: NextRequest, 
  config: CSRFConfig = defaultConfig
): string | null {
  return req.cookies.get(config.cookieName)?.value || null;
}

export default {
  generateCSRFToken,
  setCSRFToken,
  verifyCSRFToken,
  getCSRFToken
};
