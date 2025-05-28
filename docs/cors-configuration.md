# CORS Configuration Guide

Tài liệu này giải thích cách Cross-Origin Resource Sharing (CORS) được cấu hình trong VRC API và cách sửa lỗi 405 Method Not Allowed khi tạo sản phẩm và menu.

## Overview

Cross-Origin Resource Sharing (CORS) là một tính năng bảo mật do trình duyệt thực thi, giới hạn các trang web không thể thực hiện các request đến domain khác với domain gốc. API của chúng ta cần cho phép các cross-origin requests để hoạt động đúng với các ứng dụng frontend được host trên các domain khác nhau.

## Vấn đề CORS trong Payload CMS và Next.js App Router

Mặc dù Payload CMS hỗ trợ CORS thông qua cấu hình trong `payload.config.ts`, việc kết hợp Payload với Next.js App Router đã tạo ra sự không nhất quán trong xử lý CORS. Nhiều API route tùy chỉnh đã triển khai xử lý CORS riêng thay vì sử dụng cấu hình của Payload, dẫn đến các vấn đề như:

1. Xử lý CORS không nhất quán giữa các API endpoints
2. Không đồng bộ giữa cấu hình CORS của Payload và các API tùy chỉnh
3. Khó bảo trì và cập nhật khi cần thay đổi chính sách CORS

## Giải pháp tiêu chuẩn hóa

Chúng tôi đã quyết định tiêu chuẩn hóa việc xử lý CORS dựa trên cấu hình của Payload và một lớp helper dùng chung để đảm bảo tính nhất quán.

### 1. Cấu hình CORS trong Payload CMS

Payload CMS có cấu hình CORS trong file `payload.config.ts`:

```typescript
cors: {
  origins: [
    getServerSideURL(),                                    // Backend URL
    process.env.FRONTEND_URL || 'http://localhost:5173',   // Frontend URL
    'http://localhost:8080', 'http://localhost:8081',      // Development ports
    '*',                                                   // Allow all origins for development
  ].filter(Boolean),    
  headers: ['authorization', 'content-type', 'x-custom-header', 'cache-control', 'x-requested-with'],
},
```

### 2. Shared CORS Helpers

File `src/app/(payload)/api/_shared/cors.ts` chứa các helpers được tiêu chuẩn hóa cho tất cả API endpoints:

```typescript
// Tạo CORS headers
export function createCORSHeaders(
  methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  extraHeaders = []
) {
  const headers = new Headers()
  
  // Logic để quyết định origin dựa trên môi trường
  if (process.env.NODE_ENV === 'development') {
    headers.append('Access-Control-Allow-Origin', '*')
  } else {
    // Logic cho production
  }
  
  headers.append('Access-Control-Allow-Methods', methods.join(', '))
  // Thêm các headers khác...
  
  return headers
}

// Xử lý OPTIONS request
export function handleOptionsRequest(req, methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']) {
  const headers = createCORSHeaders(methods)
  // Logic xử lý preflight
  return new NextResponse(null, {
    status: 204,
    headers,
  })
}

// Tạo response với CORS headers
export function createCORSResponse(data, status = 200, methods) {
  const headers = createCORSHeaders(methods)
  return NextResponse.json(data, {
    status,
    headers,
  })
}

// Xử lý lỗi với CORS headers
export function handleApiError(error, message, status = 500, methods) {
  const headers = createCORSHeaders(methods)
  // Logic xử lý lỗi
  return NextResponse.json(
    { success: false, message, error: error.message },
    { status, headers }
  )
}
```

## Hướng dẫn triển khai API routes mới

Các API route mới nên sử dụng các helper functions từ `_shared/cors.ts` thay vì triển khai logic CORS riêng:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';
import {
  handleOptionsRequest,
  createCORSResponse,
  handleApiError
} from '../_shared/cors';

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req, ['GET', 'OPTIONS']);
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Initialize Payload
    const payload = await getPayload({ config });

    // Logic của API
    const result = await payload.find({
      // ...
    });

    // Sử dụng helper để tạo response
    return createCORSResponse(
      {
        success: true,
        data: result.docs,
      },
      200
    );
  } catch (error) {
    // Sử dụng helper để xử lý lỗi
    return handleApiError(error, 'Có lỗi xảy ra khi xử lý yêu cầu.');
  }
}
```

## Tiêu chuẩn hóa các API route hiện có

Tất cả các API route hiện có đã được tiêu chuẩn hóa để sử dụng các helper chung trong `_shared/cors.ts` thay vì các triển khai CORS cục bộ. Điều này đảm bảo tính nhất quán và dễ bảo trì.

## Môi trường phát triển và sản xuất

- **Development**: CORS được cấu hình để chấp nhận tất cả các origin (`*`) để thuận tiện cho việc phát triển
- **Production**: CORS được giới hạn chỉ cho các origin cụ thể được định nghĩa trong cấu hình

## Quy tắc và tiêu chuẩn CORS

1. **Không tạo các helper function CORS cục bộ** trong API routes
2. **Luôn khai báo một OPTIONS handler** trong mỗi API route
3. **Sử dụng `createCORSResponse()`** để tạo responses
4. **Sử dụng `handleApiError()`** để xử lý lỗi

## Troubleshooting CORS Issues

Nếu bạn gặp lỗi CORS:

1. Đảm bảo frontend đang gọi đến đúng URL của API
2. Kiểm tra xem API endpoint có xử lý OPTIONS request không
3. Đảm bảo các headers phù hợp được trả về từ API
4. Trong môi trường phát triển, sử dụng CORS browser extensions để debug
5. Kiểm tra logs của server để xem preflight requests và phản hồi

## Kết luận

Việc tiêu chuẩn hóa CORS đảm bảo tính nhất quán, dễ bảo trì và tránh các lỗi CORS phổ biến. Dựa vào cấu hình của Payload, chúng ta đảm bảo rằng các API tùy chỉnh sẽ tuân theo các quy tắc CORS giống như các API tích hợp của Payload.
