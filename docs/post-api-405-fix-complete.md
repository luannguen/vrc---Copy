# Hướng dẫn khắc phục lỗi POST /api/posts 405 Method Not Allowed

## Tóm tắt vấn đề

Khi thực hiện các thao tác liên quan đến bài viết trong admin interface, đặc biệt là khi chọn bài viết liên quan (relatedPosts), hệ thống gặp lỗi 405 Method Not Allowed đối với phương thức POST đến /api/posts. Điều này xảy ra vì hệ thống thiếu endpoint để xử lý POST request đến API posts.

## Nguyên nhân

Trong Next.js App Router, cần phải triển khai đầy đủ các handlers cho các phương thức HTTP (GET, POST, PATCH, DELETE, OPTIONS) tại các tệp route.ts để API hoạt động đúng. Vấn đề cụ thể là:

1. Thiếu handler cho phương thức POST đến /api/posts
2. Thiếu xử lý CORS cho các requests đến API

## Giải pháp

Đã tạo file `src/app/api/posts/route.ts` với các handlers đầy đủ cho tất cả các phương thức:

1. **GET** - Lấy danh sách hoặc chi tiết bài viết
2. **POST** - Tạo bài viết mới
3. **PATCH** - Cập nhật bài viết
4. **DELETE** - Xóa bài viết (hỗ trợ cả soft delete và hard delete)
5. **OPTIONS** - Xử lý CORS preflight requests

Đồng thời tạo tiện ích xử lý CORS trong `src/utilities/cors.ts` để đảm bảo các API requests từ frontend đều được xử lý đúng.

## Các chức năng chính đã triển khai

1. **Xác thực người dùng:** Sử dụng x-payload-user header để duy trì phiên đăng nhập
2. **Xử lý CORS:** Hỗ trợ đầy đủ các origins cho phép và các headers cần thiết
3. **Xử lý lỗi:** Log chi tiết lỗi và trả về thông báo lỗi có ý nghĩa
4. **Soft vs Hard Delete:** Hỗ trợ cả hai loại xóa bài viết

## Cách kiểm tra

Đã tạo file kiểm tra `test/test-post-api-all-methods.js` để kiểm tra tất cả các phương thức của API:

```javascript
// Kiểm tra tạo bài viết mới
fetch('http://localhost:3000/api/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Test Post', content: [...] })
})
```

## Lưu ý triển khai

- Đảm bảo API tuân theo chuẩn RESTful
- Xử lý đúng CORS headers để tránh lỗi preflight
- Cung cấp thông báo lỗi rõ ràng và có ý nghĩa
- Kiểm tra kỹ các quyền truy cập để đảm bảo bảo mật

## Tài liệu tham khảo

- [Payload CMS API Document](https://payloadcms.com/docs/rest-api/overview)
- [Next.js App Router API Routes](https://nextjs.org/docs/app/building-your-application/routing/router-handlers)
- [Payload CMS Frontend Usage Guide](https://payloadcms.com/docs/local-api/overview)
