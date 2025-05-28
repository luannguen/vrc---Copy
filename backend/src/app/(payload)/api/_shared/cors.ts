import { NextRequest, NextResponse } from 'next/server'
import { getServerSideURL } from './getURL'
import { 
  getUserFromRequest, 
} from '../../../../utilities/verifyJwt'
import logger from '../../../../utilities/logger'
import { verifyCSRFToken } from '../../../../utilities/csrf'

/**
 * Tạo CORS headers dựa trên cấu hình chuẩn
 * 
 * @param methods Các phương thức HTTP được hỗ trợ (mặc định tất cả các phương thức phổ biến)
 * @param extraHeaders Các headers bổ sung nếu cần
 * @returns Headers object với các CORS headers cần thiết
 */
export function createCORSHeaders(
  methods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  extraHeaders: string[] = []
) {
  const headers = new Headers()
  
  // Use standard origins from config
  let origins: string[] = []
  
  // In development, allow all origins for convenience
  if (process.env.NODE_ENV === 'development') {
    headers.append('Access-Control-Allow-Origin', '*')
  } else {
    // In production, be more strict about origins
    origins = [
      getServerSideURL(),
      process.env.FRONTEND_URL || '',
    ].filter(Boolean) as string[]
    
    // If we have specific origins, use the first one (ideally we would check against request origin)
    headers.append('Access-Control-Allow-Origin', origins[0] || '*')
  }
  
  // Allow all specified HTTP methods
  headers.append('Access-Control-Allow-Methods', methods.join(', '))
  
  // Define standard headers + any extra headers
  const standardHeaders = [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'X-API-Test',
    'x-custom-header', 
    'cache-control'
  ]
  
  const allHeaders = [...new Set([...standardHeaders, ...extraHeaders])]
  headers.append('Access-Control-Allow-Headers', allHeaders.join(', '))
  
  // Allow credentials (cookies, authorization headers)
  headers.append('Access-Control-Allow-Credentials', 'true')
  
  // Add standard content type for better client compatibility
  headers.append('Content-Type', 'application/json')
  
  return headers
}

/**
 * Xử lý OPTIONS request cho CORS preflight
 * 
 * @param req NextRequest object
 * @param methods Các phương thức HTTP được hỗ trợ (mặc định tất cả các phương thức phổ biến)
 * @returns NextResponse với status 204 và CORS headers phù hợp
 */
export function handleOptionsRequest(
  req?: NextRequest,
  methods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
) {
  console.log(`OPTIONS Request Handler: ${req?.url || 'No URL'}`);
  
  // Create base headers
  const headers = createCORSHeaders(methods);
  
  // If request is provided, check for specific request headers
  if (req) {
    const requestMethod = req.headers.get('access-control-request-method');
    const requestHeaders = req.headers.get('access-control-request-headers');
    
    // Log để giúp debug
    if (requestMethod || requestHeaders) {
      console.log('OPTIONS Preflight Request Details:');
      console.log('- Requested Method:', requestMethod || 'none');
      console.log('- Requested Headers:', requestHeaders || 'none');
    }
  }
  
  // Cache preflight response for better performance
  headers.append('Access-Control-Max-Age', '86400'); // 24 hours
  
  return new NextResponse(null, {
    status: 204,
    headers,
  });
}

/**
 * Tạo response với CORS headers
 * 
 * @param data Dữ liệu để trả về trong response
 * @param status HTTP status code 
 * @param methods Các phương thức HTTP được hỗ trợ
 * @returns NextResponse với CORS headers và data
 */
export function createCORSResponse(
  data: any,
  status = 200,
  methods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
) {
  const headers = createCORSHeaders(methods);
  
  return NextResponse.json(data, {
    status,
    headers,
  });
}

/**
 * Kiểm tra xác thực với các tùy chọn linh hoạt
 * 
 * @param req NextRequest object
 * @param requireAuth Có yêu cầu xác thực hay không
 * @param requiredRoles Các vai trò được phép truy cập (nếu có)
 * @returns Boolean cho biết xác thực có thành công hay không
 */
export async function checkAuth(
  req: NextRequest, 
  requireAuth = true, 
  requiredRoles: string[] = []
) {
  const authLogger = logger.child('auth');
  
  if (!requireAuth) {
    authLogger.debug('Authentication check: Not required');
    return true;
  }
  
  authLogger.debug('Authentication check: Required');
  
  // Development bypass - Check for a special header for API testing
  const isApiTest = req.headers.get('x-api-test') === 'true';
  if (isApiTest && process.env.NODE_ENV !== 'production') {
    authLogger.debug('Authentication check: Bypassing for API testing');
    return true;
  }
  
  // Check if the request is coming from the admin panel - allow in all environments
  const referer = req.headers.get('referer') || '';
  if (referer.includes('/admin')) {
    authLogger.debug('Authentication check: Request from admin panel, allowing');
    return true;
  }
  
  // For development purposes only - allow all requests if BYPASS_AUTH is set
  const bypassAuth = process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true';
  if (bypassAuth) {
    authLogger.debug('Authentication check: Bypassing in development mode');
    return true;
  }
    // Get user from request
  try {
    // Attempt to extract and verify the token (with strict=true to catch errors)
    const result = await getUserFromRequest(req, { strict: true, autoRefresh: true });
    
    if (!result.payload) {
      authLogger.warn('Authentication check: No valid token found');
      return false;
    }
    
    const userPayload = result.payload;
    
    // Check for required roles if specified
    if (requiredRoles.length > 0) {
      // Get user roles from payload, either as roles array or single role
      const userRoles = userPayload.roles || 
                       (userPayload.role ? [userPayload.role] : []).filter(Boolean);
      
      // Check if the user has any of the required roles
      const hasRequiredRole = requiredRoles.some(role => 
        userRoles.includes(role)
      );
      
      if (!hasRequiredRole) {
        authLogger.warn(`Authorization failed: User ${userPayload.sub || 'unknown'} does not have required roles ${requiredRoles.join(', ')}`);
        return false;
      }
      
      authLogger.debug(`Authorization success: User ${userPayload.sub || 'unknown'} has required role`);
    }
    // Check CSRF token for cookie-based auth if not using Bearer token
    const authHeader = req.headers.get('authorization');
    const usesBearer = authHeader && authHeader.startsWith('Bearer ');
    const cookieBased = !usesBearer && req.headers.get('cookie')?.includes('payload-token=');
      if (cookieBased && req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'OPTIONS') {
      // For non-GET requests with cookie auth, verify CSRF token
      const csrfValid = verifyCSRFToken(req);
      if (!csrfValid) {
        authLogger.warn(`CSRF validation failed for user ${userPayload.sub || 'unknown'}`);
        return false;
      }
      authLogger.debug(`CSRF validation passed for user ${userPayload.sub || 'unknown'}`);
    }
    
    authLogger.debug(`Authentication success for user ${userPayload.sub || 'unknown'}`);
    return true;
    
  } catch (error) {
    authLogger.error('Authentication check failed', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

/**
 * Xử lý lỗi API chung với CORS headers
 * 
 * @param error Lỗi cần xử lý
 * @param message Message mặc định
 * @param status HTTP status code (mặc định 500)
 * @param methods Các phương thức HTTP được hỗ trợ
 * @returns NextResponse với CORS headers và thông tin lỗi
 */
export function handleApiError(
  error: unknown, 
  message = 'Đã xảy ra lỗi. Vui lòng thử lại sau.', 
  status = 500,
  methods: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
) {
  const errorLogger = logger.child('api-error');
  const headers = createCORSHeaders(methods);
  
  // Error response data structure
  const errorResponse: {
    success: false;
    message: string;
    error: string;
    details?: unknown;
    validationErrors?: Record<string, string[]>;
    code?: string;
  } = {
    success: false,
    message,
    error: 'Unknown error',
  };
  
  // Handle different types of errors
  if (error instanceof Error) {
    errorLogger.error(`API Error (${status}): ${error.message}`, error.stack);
    errorResponse.error = error.message;
    
    // Extract additional info from specific error types
    
    // Zod validation errors
    if (error.name === 'ZodError' && 'format' in error && typeof error.format === 'function') {
      try {
        const zodError = error as any; // Using any since we don't want to add zod as dependency
        errorResponse.validationErrors = zodError.format();
        errorResponse.code = 'VALIDATION_ERROR';
        status = status === 500 ? 400 : status; // Use 400 for validation errors
      } catch (formatError) {
        errorLogger.error('Failed to format Zod error', formatError);
      }
    }
    
    // Prisma/Database errors
    else if (error.name === 'PrismaClientKnownRequestError' || 
             error.name === 'PrismaClientValidationError' ||
             error.message.includes('Prisma')) {
      errorResponse.code = 'DATABASE_ERROR';
      // Don't expose internal DB errors to client in production
      if (process.env.NODE_ENV === 'production') {
        errorResponse.error = 'Database operation failed';
      }
    }
    
    // Axios/HTTP request errors
    else if ('isAxiosError' in error && error.isAxiosError === true && 'response' in error) {
      const axiosError = error as any; // Using any since we don't want to add axios as dependency
      errorResponse.code = 'EXTERNAL_API_ERROR';
      
      if (process.env.NODE_ENV !== 'production') {
        errorResponse.details = {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          url: axiosError.config?.url,
          method: axiosError.config?.method,
        };
      }
    }
    
    // JSON parse errors
    else if (error.name === 'SyntaxError' && error.message.includes('JSON')) {
      errorResponse.code = 'INVALID_JSON';
      status = status === 500 ? 400 : status;
    }
    
    // JWT/Auth errors
    else if (error.name === 'JsonWebTokenError' || 
             error.name === 'TokenExpiredError' || 
             error.message.includes('jwt') || 
             error.message.includes('token')) {
      errorResponse.code = 'AUTH_ERROR';
      status = status === 500 ? 401 : status;
    }
    
  } else {
    // Handle non-Error objects
    errorLogger.error(`API Error (${status}): Unknown error type`, error);
    
    if (typeof error === 'string') {
      errorResponse.error = error;
    } else if (error && typeof error === 'object') {
      try {
        errorResponse.error = JSON.stringify(error);
      } catch {
        errorResponse.error = 'Unserializable error object';
      }
    }
  }
  
  // Log in development for debugging
  if (process.env.NODE_ENV === 'development') {
    errorLogger.debug('Error response details:', errorResponse);
  }
  
  return NextResponse.json(errorResponse, { status, headers });
}

/**
 * Tương thích ngược với phiên bản trước - với tên createCorsHeaders
 * @deprecated Sử dụng createCORSHeaders thay thế
 */
// Make sure the lowercase version is exported and works correctly
export const createCorsHeaders = createCORSHeaders;

/**
 * Higher-order function để bọc API route handlers với CORS và authentication
 * 
 * @param handler API route handler function
 * @param options Tuỳ chọn cho CORS và authentication
 * @returns NextResponse với CORS headers
 */
export function withCORS(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse,
  options: {
    methods?: string[];
    requireAuth?: boolean;
    requiredRoles?: string[];
  } = {}
) {
  const {
    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    requireAuth = false,
    requiredRoles = [],
  } = options;
  
  return async function corsHandler(req: NextRequest): Promise<NextResponse> {
    const corsLogger = logger.child('cors-wrapper');
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      return handleOptionsRequest(req, methods);
    }
    
    // Check auth if required
    if (requireAuth) {
      const isAuthenticated = await checkAuth(req, requireAuth, requiredRoles);
      
      if (!isAuthenticated) {
        corsLogger.warn(`Auth failed for ${req.method} ${req.nextUrl.pathname}`);
        return createCORSResponse(
          { 
            success: false, 
            message: 'Authentication required', 
            code: requiredRoles.length ? 'INSUFFICIENT_PERMISSIONS' : 'UNAUTHENTICATED',
          }, 
          requiredRoles.length ? 403 : 401, 
          methods
        );
      }
    }
    
    try {
      // Call the original handler
      const response = await handler(req);
      
      // If the response already has CORS headers, return it as is
      if (response.headers.has('Access-Control-Allow-Origin')) {
        return response;
      }
      
      // Otherwise, add CORS headers to the response
      const corsHeaders = createCORSHeaders(methods);
      corsHeaders.forEach((value, key) => {
        response.headers.set(key, value);
      });
      
      return response;
      
    } catch (error) {
      corsLogger.error(`Error in handler for ${req.method} ${req.nextUrl.pathname}`, error);
      return handleApiError(error, 'Đã xảy ra lỗi khi xử lý yêu cầu.', 500, methods);
    }
  };
}
