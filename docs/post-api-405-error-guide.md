# Hướng dẫn khắc phục lỗi 405 trong POST API

## Nguyên nhân của lỗi 405 Method Not Allowed

Khi bạn gặp lỗi 405 Method Not Allowed khi thực hiện POST request đến API, có thể do một số nguyên nhân sau:

1. **Cấu hình CORS không đúng:** Headers CORS không được cấu hình đúng hoặc không bao gồm phương thức POST
2. **Preflight request không được xử lý đúng:** Khi browser gửi OPTIONS request trước khi thực hiện POST, server không xử lý đúng
3. **Xác thực thất bại:** Hệ thống xác thực đang từ chối request vì thiếu token hoặc token không hợp lệ
4. **Route handler không đúng:** API route không được định nghĩa đúng trong Next.js

## Các bước khắc phục chi tiết

### 1. Kiểm tra CORS trong browser

Mở DevTools (F12) trong trình duyệt, chọn tab Network và quan sát các request:

- **Request OPTIONS:** Kiểm tra xem có request OPTIONS nào được gửi trước POST không
- **Response Headers của OPTIONS:** Kiểm tra response headers từ server
  - Access-Control-Allow-Origin: Phải là * hoặc domain cụ thể
  - Access-Control-Allow-Methods: Phải bao gồm POST
  - Access-Control-Allow-Headers: Phải bao gồm các header bạn đang sử dụng

### 2. Kiểm tra xác thực

```javascript
// Trước khi gọi API POST
// Đảm bảo đã đăng nhập và có token
const token = localStorage.getItem('token') || sessionStorage.getItem('payloadToken')

// Thêm token vào header
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
}

// Gọi API với headers đúng
fetch('/api/products', {
  method: 'POST',
  headers,
  body: JSON.stringify(productData)
})
```

### 3. Kiểm tra bằng công cụ API

Sử dụng Postman hoặc cURL để kiểm tra API trực tiếp, không qua browser:

```bash
# Gửi OPTIONS request để kiểm tra preflight
curl -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization" \
  -v http://localhost:3000/api/products

# Gửi POST request với dữ liệu và token
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test Product","excerpt":"Test"}' \
  -v http://localhost:3000/api/products
```

### 4. Sửa lỗi trong môi trường development

Để sửa lỗi trong quá trình phát triển, bạn có thể:

1. Tạo file `.env.local` với nội dung:
```
BYPASS_AUTH=true
NODE_ENV=development
```

2. Sử dụng proxy middleware trong frontend:
```javascript
// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  }
}
```

### 5. Kiểm tra logs

Khi gặp lỗi, hãy kiểm tra logs trong terminal nơi bạn chạy server để xem thông tin chi tiết hơn.

## Các thay đổi đã được thực hiện

Để khắc phục vấn đề, chúng tôi đã thực hiện các thay đổi sau:

1. Cải thiện hàm `createCorsHeaders()` để bao gồm các header cần thiết
2. Thêm logging chi tiết cho việc debug
3. Cập nhật handler OPTIONS để xử lý preflight requests tốt hơn
4. Thêm xử lý lỗi chi tiết hơn
5. Tăng cường kiểm tra trong quá trình xác thực

## Kiểm tra sau khi sửa

Sau khi sửa lỗi, chạy test để xác nhận API hoạt động bình thường:

```bash
cd test
node products-api.test.js
```

Nếu vẫn gặp vấn đề, hãy kiểm tra logs và liên hệ đội phát triển để được hỗ trợ thêm.
