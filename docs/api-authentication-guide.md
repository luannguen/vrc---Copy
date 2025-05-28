# Tài liệu hướng dẫn xác thực API

## Tổng quan

Tài liệu này mô tả cách thực hiện xác thực và phân quyền trong hệ thống API, đặc biệt là với các cải tiến mới về bảo mật, xác thực JWT, và phân quyền dựa trên vai trò.

## Phương thức xác thực

Hệ thống hỗ trợ các phương thức xác thực sau:

### 1. Xác thực bằng JWT Token

- **Phương thức**: Sử dụng Bearer token trong header `Authorization`
- **Cách thức hoạt động**:
  - Đăng nhập với tài khoản hợp lệ
  - Nhận JWT token
  - Gửi token trong header `Authorization: Bearer {token}` cho các yêu cầu tiếp theo
- **Cải tiến mới**:
  - Xác nhận chữ ký JWT với khóa bảo mật
  - Kiểm tra thời hạn token (`exp` claim)
  - Phân quyền dựa trên vai trò (`role` hoặc `roles` claim)

### 2. Xác thực bằng Cookie

- **Phương thức**: Sử dụng cookie `payload-token`
- **Cải tiến mới**:
  - Bảo vệ CSRF cho cookie-based authentication
  - Sử dụng token CSRF trong header `x-csrf-token` cho các request không phải GET

### 3. Xác thực bypass cho môi trường phát triển

- **Phương thức**: Sử dụng header `X-API-Test: true`
- **Chú ý**: Phương thức này chỉ hoạt động trong môi trường phát triển, không dùng cho sản xuất
- **Mục đích**: Giúp đơn giản hóa quá trình kiểm thử mà không cần quản lý token

## Cài đặt xác thực trong API Routes

### 1. Sử dụng withCORS Wrapper

Tất cả các API routes có thể áp dụng xác thực bằng wrapper `withCORS`:

```typescript
import { withCORS } from '../_shared/cors';

export const GET = withCORS(
  async (req) => {
    // Logic xử lý API của bạn ở đây
    return NextResponse.json({ data: 'Dữ liệu được bảo vệ' });
  },
  { requireAuth: true }
);
```

### 2. Phân quyền dựa trên vai trò (RBAC)

Có thể giới hạn truy cập dựa trên vai trò người dùng:

```typescript
export const POST = withCORS(
  async (req) => {
    // Logic xử lý API của bạn ở đây
    return NextResponse.json({ success: true });
  },  { 
    requireAuth: true,
    requiredRoles: ['admin', 'editor'] // Người dùng phải có một trong các vai trò này
  }
);

### 3. Sử dụng các Helper Functions

Để triển khai đơn giản hơn, sử dụng các hàm tiện ích:

```typescript
import { createGetHandler, createPostHandler } from '../_shared/api-helpers';

// GET endpoint công khai
export const GET = createGetHandler(async (req) => {
  return NextResponse.json({ data: 'Dữ liệu công khai' });
});

// POST endpoint được bảo vệ
export const POST = createPostHandler(
  async (req) => {
    return NextResponse.json({ success: true });
  },
  { requireAuth: true }
);
```

## Bảo vệ CSRF

Đối với xác thực dựa trên cookie, bảo vệ CSRF được tự động áp dụng cho các request không phải GET.

### Triển khai phía máy chủ

```typescript
import { NextResponse } from 'next/server';
import { setCSRFToken } from '../../../../utilities/csrf';

// Trong endpoint đăng nhập hoặc phiên làm việc
export const POST = createPostHandler(async (req) => {
  // Logic xác thực...
  
  // Tạo response với dữ liệu người dùng
  const response = NextResponse.json({ user });
  
  // Thêm CSRF token vào response
  setCSRFToken(response);
  
  return response;
});
```

### Triển khai phía máy khách

Khi sử dụng xác thực dựa trên cookie, frontend phải gửi kèm CSRF token trong headers:

```javascript
// Lấy CSRF token từ cookies
const getCsrfToken = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf-token='))
    ?.split('=')[1];
};

// Ví dụ fetch với CSRF token
async function fetchWithCsrf(url, options = {}) {
  const csrfToken = getCsrfToken();
  
  return fetch(url, {
    ...options,
    credentials: 'include', // Quan trọng để gửi cookies
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken, // Thêm CSRF token
    },
  });
}
}

// Lấy header xác thực
async function getAuthHeaders() {
  // Trong môi trường phát triển, dùng X-API-Test
  if (process.env.NODE_ENV !== 'production') {
    return {
      'Content-Type': 'application/json',
      'X-API-Test': 'true'
    };
  }
  
  // Cho môi trường sản xuất hoặc nếu muốn dùng token
  const token = await authenticate();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'X-API-Test': 'true'
  };
}
```

### 2. Tài khoản xác thực mặc định

```javascript
const DEFAULT_CREDENTIALS = {
  email: 'luan.nguyenthien@gmail.com',
  password: '123456a@Aa'
};
```

## Quy trình xác thực trong bộ kiểm thử

1. **Khởi tạo**: Bộ kiểm thử gọi `getAuthHeaders()` để lấy headers xác thực
2. **Kiểm tra kết nối**: Thử connect đến endpoint `/api/health` để kiểm tra server
3. **Thực thi kiểm thử**: Dùng headers trong các yêu cầu API
4. **Xử lý lỗi**: Phát hiện và báo cáo lỗi xác thực nếu có

## Cách sử dụng trong code

```javascript
// Lấy headers xác thực
const headers = await getAuthHeaders();

// Sử dụng cho các yêu cầu API
const response = await fetch(`${API_URL}${ENDPOINT}`, {
  method: 'POST', // hoặc 'DELETE', 'PATCH', v.v.
  headers,
  body: JSON.stringify(data) // nếu cần
});
```

## Xử lý lỗi xác thực

Khi gặp lỗi xác thực, bộ kiểm thử sẽ:

1. Hiển thị thông báo lỗi chi tiết
2. Gợi ý kiểm tra server và thông tin đăng nhập
3. Ngừng thực thi các kiểm thử tiếp theo

## Những lưu ý quan trọng

1. **Bảo mật**: Không chia sẻ thông tin đăng nhập trong mã nguồn công khai
2. **Môi trường**: Header `X-API-Test` chỉ nên hoạt động trong môi trường phát triển
3. **Kiểm soát quyền truy cập**: Đảm bảo tài khoản kiểm thử có đủ quyền cho các thao tác cần thiết

## Tùy chỉnh cho các trường hợp đặc biệt

Nếu cần sửa đổi logic xác thực:

1. Chỉnh sửa tệp `auth-helper.js` để thêm logic mới
2. Cập nhật các hàm sử dụng xác thực trong các bộ kiểm thử
3. Đảm bảo xử lý lỗi phù hợp

## Xử lý lỗi

Lỗi xác thực và phân quyền trả về mã trạng thái HTTP phù hợp:

- `401 Unauthorized`: Thiếu hoặc không hợp lệ xác thực
- `403 Forbidden`: Xác thực hợp lệ nhưng không đủ quyền

Ví dụ response:
```json
{
  "success": false,
  "message": "Yêu cầu xác thực",
  "code": "UNAUTHENTICATED"
}
```

## Cải tiến xử lý lỗi API

Chức năng `handleApiError` đã được nâng cấp để nhận diện thông minh các loại lỗi khác nhau:

```typescript
// Xử lý lỗi với nhiều loại lỗi khác nhau
return handleApiError(error, 'Thông báo lỗi tùy chỉnh', statusCode);
```

Các loại lỗi được xử lý:
- Lỗi xác thực (JWT, token hết hạn)
- Lỗi database (Prisma errors)
- Lỗi xác thực dữ liệu (ZodError)
- Lỗi gọi API bên ngoài (AxiosError)

## Structured Logging

Thay thế console.log bằng logger có cấu trúc:

```typescript
import logger from '../../../../utilities/logger';

// Logging cơ bản
logger.info('Thông tin log');
logger.error('Lỗi xảy ra', errorObject);

// Logging theo context
const authLogger = logger.child('auth');
authLogger.debug('Thông tin xác thực chi tiết');
```

## Các thực hành bảo mật tốt nhất

1. Luôn sử dụng HTTPS trong môi trường sản xuất
2. Đặt thời gian hết hạn token phù hợp
3. Sử dụng vai trò cụ thể thay vì quyền admin chung chung
4. Xác thực tất cả đầu vào của người dùng ngay cả sau khi xác thực
5. Ghi log các lỗi xác thực để giám sát bảo mật
6. Sử dụng CSRF protection cho xác thực dựa trên cookie
7. Tránh lưu trữ token JWT trong localStorage (ưu tiên HTTPOnly cookies)
