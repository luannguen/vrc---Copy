import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Hàm này sẽ chạy trước khi request được xử lý
export function middleware(request: NextRequest) {
  // Chỉ áp dụng middleware này cho các API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Nếu là preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      const headers = new Headers()
      
      // CORS headers cơ bản
      headers.set('Access-Control-Allow-Origin', '*')
      headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-API-Test')
      headers.set('Access-Control-Allow-Credentials', 'true')
      headers.set('Access-Control-Max-Age', '86400') // Cache preflight trong 24 giờ
      
      // Đọc request headers đặc biệt từ preflight request
      const requestMethod = request.headers.get('access-control-request-method')
      const requestHeaders = request.headers.get('access-control-request-headers')
      
      // Nếu có specific request headers, đảm bảo chúng được bao gồm
      if (requestMethod) {
        headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
      }
      
      if (requestHeaders) {
        headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-API-Test')
      }
      
      // Trả về phản hồi OPTIONS ngay lập tức
      return new NextResponse(null, { 
        status: 204,
        headers 
      })
    }
    
    // Cho các request không phải OPTIONS, thêm CORS headers vào response
    const response = NextResponse.next()
    
    // Thêm CORS headers vào tất cả responses
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
    
    return response
  }
  
  // Đối với các request không phải API, tiếp tục như bình thường
  return NextResponse.next()
}

// Chỉ áp dụng middleware này cho các API routes
export const config = {
  matcher: '/api/:path*',
}
