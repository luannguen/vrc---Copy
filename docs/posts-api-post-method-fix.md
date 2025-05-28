# API POST Method Fix - Hướng dẫn chi tiết

## Vấn đề đã khắc phục

Khi làm việc với endpoint `/api/posts` trong giao diện quản trị, đặc biệt là khi chọn "relatedPosts", hệ thống gặp lỗi 405 Method Not Allowed:

```
POST /api/posts 405 in 12ms
```

Điều này xảy ra vì handler cho phương thức POST chưa được triển khai trong API endpoint.

## Giải pháp

Trong cấu trúc Next.js App Router với Payload CMS, chúng ta cần triển khai các phương thức HTTP cụ thể cho từng API endpoint. Trong file `src/app/(payload)/api/posts/route.ts` đã có sẵn các handlers cho các phương thức khác (GET, DELETE, OPTIONS, PATCH), nhưng thiếu handler cho POST.

### Bước triển khai

1. Đã thêm handler cho phương thức POST trong file `src/app/(payload)/api/posts/route.ts`
   - Xử lý xác thực yêu cầu
   - Hỗ trợ response format riêng cho admin panel 
   - Xử lý lỗi đầy đủ

2. Handler mới xử lý:
   - Kiểm tra nguồn yêu cầu (admin panel hoặc client)
   - Kiểm tra xác thực (bỏ qua cho admin panel)
   - Parse dữ liệu JSON
   - Tạo bài viết qua Payload API
   - Trả về response phù hợp với nguồn yêu cầu

### Cải thiện

1. **CORS Support**: Đảm bảo trả về các header CORS phù hợp
2. **Error Handling**: Xử lý lỗi chi tiết và định dạng phù hợp cho admin panel
3. **Logging**: Thêm logging để dễ dàng debug các vấn đề

## Kiểm tra

Có thể kiểm tra API thông qua các phương pháp sau:

1. Sử dụng admin panel để tạo bài viết mới và chọn các bài viết liên quan
2. Gửi trực tiếp yêu cầu POST tới endpoint `/api/posts` với data hợp lệ

## Các file đã sửa

- `src/app/(payload)/api/posts/route.ts`: Thêm POST handler

## Tài liệu tham khảo

- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Payload API Documentation](https://payloadcms.com/docs/rest-api/overview)
