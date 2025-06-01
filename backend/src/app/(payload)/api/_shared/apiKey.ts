import { NextRequest } from 'next/server'

/**
 * API Key validation utilities
 * Protects public APIs from spam and unauthorized access
 */

// Get API key from environment variable
const API_KEY = process.env.PUBLIC_API_KEY || 'vrc-public-2024'

/**
 * Validate API key from request headers
 * @param req - NextRequest object
 * @returns boolean - true if valid API key provided
 */
export function validateApiKey(req: NextRequest): boolean {
  // Check for API key in headers
  const apiKey = req.headers.get('x-api-key') ||
                req.headers.get('authorization')?.replace('Bearer ', '') ||
                req.nextUrl.searchParams.get('api_key')

  if (!apiKey) {
    console.warn('API Key missing in request to:', req.nextUrl.pathname)
    return false
  }

  if (apiKey !== API_KEY) {
    console.warn('Invalid API Key provided for:', req.nextUrl.pathname)
    return false
  }

  return true
}

/**
 * Create error response for invalid API key
 */
export function createApiKeyErrorResponse() {
  return {
    success: false,
    error: 'INVALID_API_KEY',
    message: 'API key không hợp lệ. Vui lòng cung cấp API key hợp lệ trong header x-api-key.',
    code: 401
  }
}
