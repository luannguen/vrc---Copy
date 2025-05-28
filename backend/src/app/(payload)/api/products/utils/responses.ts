import { NextResponse } from 'next/server';
import { createCORSHeaders } from '../../_shared/cors';

/**
 * Formats a response for admin panel requests
 */
export function formatAdminResponse(data: any, status: number = 200): NextResponse {
  const headers = createCORSHeaders();
  
  // Add cache control headers to prevent stale data in admin panel
  headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.append('Pragma', 'no-cache');
  headers.append('Expires', '0');
  
  // Thêm header đặc biệt để đảm bảo làm mới danh sách
  headers.append('X-Payload-Admin', 'true');
  headers.append('X-Payload-Refresh', 'products');
  
  // Format the response in the specific format expected by the admin UI
  const adminResponse = {
    message: null, // Không có thông báo = không có lỗi
    doc: data,     // Dữ liệu được trả về
    errors: [],    // Mảng lỗi rỗng = không có lỗi
  };
  
  return NextResponse.json(adminResponse, { status, headers });
}

/**
 * Formats a response for API clients (non-admin)
 */
export function formatApiResponse(
  data: any, 
  message: string = 'Thành công', 
  status: number = 200,
  success: boolean = true
): NextResponse {
  const headers = createCORSHeaders();
  
  return NextResponse.json(
    {
      success,
      message,
      data,
    },
    {
      status,
      headers,
    }
  );
}

/**
 * Formats an error response for admin panel
 */
export function formatAdminErrorResponse(
  errors: Array<{ message: string, field: string }> | string | Error,
  status: number = 400
): NextResponse {
  const headers = createCORSHeaders();
  headers.append('X-Payload-Admin', 'true');
  headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  
  // Chuẩn bị mảng lỗi đúng định dạng
  let formattedErrors: Array<{ message: string, field: string }> = [];
  let errorMessage = 'An error occurred';
  
  if (Array.isArray(errors)) {
    formattedErrors = errors;
    // Kiểm tra cẩn thận để tránh lỗi undefined
    if (errors.length > 0 && errors[0] && typeof errors[0].message === 'string') {
      errorMessage = errors[0].message;
    }
  } else if (typeof errors === 'string') {
    formattedErrors = [{ message: errors, field: 'general' }];
    errorMessage = errors;
  } else if (errors instanceof Error) {
    const errorMsg = errors.message || 'Unknown error';
    formattedErrors = [{ message: errorMsg, field: 'general' }];
    errorMessage = errorMsg;
  }
  
  return NextResponse.json(
    {
      message: errorMessage,
      errors: formattedErrors,
    },
    {
      status,
      headers,
    }
  );
}

/**
 * Formats an error response for API clients (non-admin)
 */
export function formatApiErrorResponse(
  message: string = 'Đã xảy ra lỗi',
  error: any = null,
  status: number = 400
): NextResponse {
  const headers = createCORSHeaders();
  
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    {
      status,
      headers,
    }
  );
}

/**
 * Helper for bulk operation responses
 */
export function formatBulkResponse(
  results: Array<any>,
  errors: Array<any>,
  isAdmin: boolean = false
): NextResponse {
  const status = errors.length === 0 ? 200 : 207; // Use 207 Multi-Status for partial success
  const headers = createCORSHeaders();
  
  // Add cache headers
  headers.append('Cache-Control', 'no-cache, no-store, must-revalidate');
  headers.append('Pragma', 'no-cache');
  headers.append('Expires', '0');
  headers.append('X-Reload-Collection', 'products');
  
  if (isAdmin) {
    // Thêm header đặc biệt cho Payload UI
    headers.append('X-Payload-Admin', 'true');
    headers.append('X-Payload-Refresh', 'products');
    
    // Định dạng CHÍNH XÁC theo yêu cầu của Payload CMS admin UI
    // Phát hiện referer để xem request đến từ list view hay edit view
    return NextResponse.json(
      {
        message: null,
        docs: results.map(r => ({ id: r.id })),
        errors: errors.length > 0 ? errors.map(e => ({
          message: e.error || e.message || 'Lỗi không xác định',
          field: 'id'
        })) : [],
      },
      {
        status,
        headers,
      }
    );
  }
  
  return NextResponse.json(
    {
      success: errors.length === 0,
      message: `Đã xử lý ${results.length}/${results.length + errors.length} sản phẩm`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    },
    {
      status,
      headers,
    }
  );
}
