# Vấn đề khi xây dựng API trong Payload CMS và Next.js

Tài liệu này ghi lại các vấn đề phổ biến khi xây dựng API tùy chỉnh trong Payload CMS với Next.js, và cách khắc phục chúng để tránh lặp lại trong tương lai.

## 1. Vấn đề CORS (Cross-Origin Resource Sharing)

### Vấn đề:
Khi tạo các API tùy chỉnh trong Payload CMS và Next.js, các yêu cầu từ nguồn gốc khác (như frontend riêng biệt) có thể bị chặn bởi chính sách CORS của trình duyệt.

```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

### Nguyên nhân:
- Payload CMS có cấu hình CORS riêng trong `payload.config.ts`
- API routes tùy chỉnh trong Next.js không tự động kế thừa cấu hình CORS này
- Khi mở trang web từ giao thức `file:///` (không thông qua server), các yêu cầu đến server HTTP bị chặn

### Giải pháp:
1. **Cấu hình CORS cho API tùy chỉnh**:
```typescript
// Helper function tạo headers CORS
function createCorsHeaders() {
  const headers = new Headers()
  headers.append('Access-Control-Allow-Origin', '*') // Trong môi trường phát triển
  // Với production, chỉ định cụ thể: headers.append('Access-Control-Allow-Origin', 'https://yourdomain.com')
  headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return headers
}

// Thêm handlers cho OPTIONS (CORS preflight requests)
export function OPTIONS() {
  const headers = createCorsHeaders()
  return new NextResponse(null, {
    status: 204,
    headers,
  })
}

// Thêm headers vào mỗi response
return NextResponse.json(data, {
  status: 200,
  headers: createCorsHeaders(),
})
```

2. **Luôn truy cập trang web thông qua server**:
- Không mở file HTML trực tiếp từ hệ thống file (tránh giao thức `file:///`)
- Đặt các file test trong thư mục `public` để truy cập thông qua server
- Sử dụng đường dẫn tương đối (ví dụ: `/api/...`) thay vì đường dẫn tuyệt đối

3. **Đồng bộ cấu hình CORS**:
- Đảm bảo cấu hình CORS trong API tùy chỉnh khớp với cấu hình trong `payload.config.ts`
- Trong sản phẩm chính thức, giới hạn origin thay vì sử dụng `*`

## 2. Vòng lặp vô hạn trong Payload Global Access Control

### Vấn đề:
Gọi `findGlobal` bên trong function access control của chính global đó sẽ gây vòng lặp vô hạn và khiến API không hoạt động.

### Nguyên nhân:
```typescript
// Đoạn code gây vòng lặp vô hạn
access: {
  read: async ({ req }) => {
    // Không làm thế này!
    const companyInfo = await req.payload.findGlobal({
      slug: 'company-info',
    });
    
    if (companyInfo.requireAuth) {
      return Boolean(req.user);
    }
    return true;
  }
}
```

Khi:
1. Access control kiểm tra quyền truy cập
2. Nó gọi `findGlobal` để lấy thông tin global
3. Việc lấy thông tin global lại gọi access control
4. Lặp lại vô hạn

### Giải pháp:
1. **Tách kiểm tra xác thực khỏi access control**:
```typescript
// Đúng
access: {
  read: ({ req }) => {
    // Always allow access from admin dashboard
    const referrer = req.headers?.get?.('referer') || '';
    if (referrer.includes('/admin')) {
      return true;
    }
    
    // Cho phép truy cập public, xử lý xác thực ở mức API endpoint
    return true;
  }
}
```

2. **Xử lý xác thực trong API endpoint**:
```typescript
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })
    const companyInfo = await payload.findGlobal({
      slug: 'company-info',
    })
    
    // Xử lý xác thực ở đây, không phải trong access control
    if (companyInfo?.requireAuth) {
      // Kiểm tra token hoặc cookie xác thực
      // ...
    }
    
    return NextResponse.json(companyInfo)
  } catch (error) {
    // Xử lý lỗi
  }
}
```

## 3. Khởi tạo Payload trong API routes tùy chỉnh

### Vấn đề:
Việc import trực tiếp `payload` có thể gây lỗi trong API routes của Next.js vì cách Next.js xử lý server components.

### Nguyên nhân:
- Next.js App Router có các quy tắc riêng về server components và API routes
- Import trực tiếp `payload` có thể gây lỗi nếu instance chưa được khởi tạo

### Giải pháp:
Sử dụng `getPayload` thay vì import trực tiếp:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Khởi tạo Payload đúng cách
    const payload = await getPayload({
      config,
    })
    
    // Sau đó sử dụng instance payload
    const data = await payload.findGlobal({ ... })
    
    // ...
  } catch (error) {
    // Xử lý lỗi
  }
}
```

## 4. Xử lý lỗi và gỡ lỗi API

### Vấn đề:
Khó khăn trong việc gỡ lỗi API khi không có thông báo lỗi rõ ràng.

### Giải pháp:
1. **Log lỗi chi tiết**:
```typescript
try {
  // API logic
} catch (error) {
  console.error('Detailed API error:', error)
  
  return NextResponse.json(
    {
      success: false,
      message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
      // Trong môi trường dev, có thể bao gồm chi tiết lỗi
      ...(process.env.NODE_ENV !== 'production' && { error: error.message }),
    },
    { status: 500 }
  )
}
```

2. **Tạo trang test API riêng biệt**:
- Đặt trong thư mục `public` của backend
- Bao gồm các tùy chọn test với nhiều tham số khác nhau
- Hiển thị response đầy đủ cho việc gỡ lỗi

3. **Kiểm tra API bằng công cụ như curl hoặc Postman**:
```bash
# Kiểm tra API đơn giản
curl http://localhost:3000/api/globals/company-info

# Kiểm tra với header xác thực
curl -H "Authorization: Bearer your-token" http://localhost:3000/api/company-info
```

## 5. Đường dẫn API và cấu trúc tệp

### Vấn đề:
Next.js App Router có cấu trúc thư mục và tệp riêng để xác định routes, dễ gây nhầm lẫn.

### Cấu trúc đúng:
```
src/
  app/
    (payload)/          # Nhóm route cho Payload
      api/              # API endpoints
        [collection]/   # Dynamic route cho collections của Payload
          [...slug]/    # Catch-all route
          route.ts      # Xử lý request
        company-info/   # API tùy chỉnh
          route.ts      # Xử lý request
```

### Quy tắc:
1. Mỗi file `route.ts` định nghĩa một API endpoint
2. Tên thư mục xác định đường dẫn URL 
3. Thư mục trong dấu ngoặc đơn `(name)` là nhóm route, không ảnh hưởng đến URL
4. File `layout.ts` có thể được sử dụng để áp dụng middleware cho nhóm routes

## 6. Populate quan hệ (relations) trong Payload

### Vấn đề:
Các trường quan hệ (như logo) không được tự động tải đầy đủ khi truy vấn dữ liệu.

### Giải pháp:
Sử dụng tham số `depth` khi truy vấn:

```typescript
// Tải dữ liệu với quan hệ cấp 1 (vd: logo)
const data = await payload.findGlobal({
  slug: 'company-info',
  depth: 1, // Tải các quan hệ cấp 1
})

// Tải dữ liệu với quan hệ sâu hơn
const data = await payload.findGlobal({
  slug: 'company-info',
  depth: 2, // Tải cả quan hệ của quan hệ (cấp 2)
})
```

## Tổng kết

Khi xây dựng API tùy chỉnh trong Payload CMS với Next.js, hãy:

1. **Luôn cấu hình CORS đúng cách** cho các API tùy chỉnh
2. **Tránh vòng lặp vô hạn** trong access control
3. **Sử dụng `getPayload`** thay vì import trực tiếp `payload`
4. **Xử lý lỗi chi tiết** để dễ dàng gỡ lỗi
5. **Hiểu rõ cấu trúc route** của Next.js App Router
6. **Sử dụng `depth` parameter** khi cần tải quan hệ

Tuân thủ các nguyên tắc này sẽ giúp tránh các vấn đề phổ biến và tăng hiệu quả khi phát triển API trong hệ thống Payload CMS và Next.js.
