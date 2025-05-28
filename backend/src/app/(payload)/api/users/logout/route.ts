import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { createCorsHeaders } from '../../_shared/cors'
import { getPayload } from 'payload'

/**
 * Enhanced logout handler to ensure proper CORS headers and complete JSON responses
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    console.log('Custom logout handler called');
    
    const _payload = await getPayload({
      config,
    });
    
    // Get the token either from header or cookie
    const _authHeader = req.headers.get('authorization');
    const _cookies = req.cookies;
      // Clear the payload-token cookie regardless
    const headers = createCorsHeaders();
    headers.append('Set-Cookie', 'payload-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    
    // Always return a JSON response to prevent "unexpected end of JSON input" error
    return NextResponse.json(
      { 
        success: true,
        message: "Đã đăng xuất thành công",
        redirectTo: '/admin/login'
      },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error('Logout error:', error);
      // Even if there's an error, we should return a valid JSON response
    const headers = createCorsHeaders();
    headers.append('Set-Cookie', 'payload-token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Đã xảy ra lỗi khi đăng xuất',
        error: (error as Error)?.message || 'Lỗi không xác định',
        redirectTo: '/admin/login'
      },
      {
        status: 500,
        headers,
      }
    );
  }
}
