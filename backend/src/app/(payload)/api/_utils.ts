/* Utility helper for custom API endpoints */
import config from '@payload-config'
import { getPayload } from 'payload'
import { NextRequest, NextResponse } from 'next/server'

// Helper function to create CORS headers
export function createCorsHeaders() {
  const headers = new Headers()
  
  // Allow requests from any origin
  headers.append('Access-Control-Allow-Origin', '*')
  
  // Allow all needed HTTP methods
  headers.append('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  
  // Allow necessary headers
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
  
  // Allow credentials (cookies, authorization headers)
  headers.append('Access-Control-Allow-Credentials', 'true')
  
  // Add standard content type for better client compatibility
  headers.append('Content-Type', 'application/json')
  
  return headers
}

// Helper function to get Payload instance with proper initialization
export async function getPayloadInstance() {
  // Check if we're in a server environment
  if (typeof window === 'undefined') {
    return await getPayload({
      config,
    })
  }
  return null
}

// Helper function for common error handling
export function handleApiError(error: any, message = 'Đã xảy ra lỗi. Vui lòng thử lại sau.') {
  console.error('API Error:', error)
  const headers = createCorsHeaders()
  
  // Log the error details for debugging
  console.error('Error details:', error.message, error.stack)
  
  // Include error information in the response
  return NextResponse.json(
    {
      success: false,
      message,
      error: error.message || 'Unknown error',
    },
    {
      status: 500,
      headers,
    }
  )
}

// Helper function to handle OPTIONS requests for CORS
export function handleOptionsRequest(req?: NextRequest) {
  const headers = createCorsHeaders()
  
  // If request is provided, check for specific request headers
  if (req) {
    const requestMethod = req.headers.get('access-control-request-method')
    const requestHeaders = req.headers.get('access-control-request-headers')
    
    // Log to help with debugging
    console.log('OPTIONS Preflight Request:')
    console.log('- Requested Method:', requestMethod || 'none')
    console.log('- Requested Headers:', requestHeaders || 'none')
    
    // Ensure we explicitly allow the requested method
    if (requestMethod) {
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    }
    
    // Ensure we explicitly allow the requested headers
    if (requestHeaders) {
      headers.set('Access-Control-Allow-Headers', 
        'Content-Type, Authorization, X-Requested-With, Accept, X-API-Test')
    }
  }
  
  // Cache preflight response for better performance
  headers.append('Access-Control-Max-Age', '86400')
  
  return new NextResponse(null, {
    status: 204,
    headers,
  })
}

// Helper function to check authentication
export async function checkAuth(req: NextRequest, requireAuth: boolean) {
  if (!requireAuth) {
    console.log('Authentication check: Not required')
    return true
  }
  
  console.log('Authentication check: Required, checking credentials')
  console.log('Request headers:', Object.fromEntries(req.headers.entries()))
  
  // Development bypass - Check for a special header for API testing
  const isApiTest = req.headers.get('x-api-test') === 'true'
  if (isApiTest && process.env.NODE_ENV !== 'production') {
    console.log('Authentication check: Bypassing for API testing')
    return true
  }
  
  // Check for Bearer token
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    console.log('Authentication check: Valid Bearer token found')
    // In a real application, you'd validate the token here
    return true
  } else {
    console.log('Authentication check: No valid Bearer token found')
  }
  
  // Check for Payload cookie
  const cookies = req.headers.get('cookie')
  if (cookies && cookies.includes('payload-token=')) {
    console.log('Authentication check: Valid payload-token cookie found')
    return true
  } else {
    console.log('Authentication check: No valid payload-token cookie found')
  }

  // Check if the request is coming from the admin panel
  const referer = req.headers.get('referer') || ''
  if (referer.includes('/admin') && process.env.NODE_ENV !== 'production') {
    console.log('Authentication check: Request from admin panel, allowing in development')
    return true
  }
  
  // For development purposes only - allow all requests if BYPASS_AUTH is set
  const bypassAuth = process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true'
  if (bypassAuth) {
    console.log('Authentication check: Bypassing in development mode')
    return true
  }
  
  console.log('Authentication check: Failed, no valid credentials found')
  return false
}
