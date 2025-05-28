# Quản lý thông tin công ty trong Admin Dashboard

## Các tính năng đã triển khai

### 1. Global Type: CompanyInfo

Đã tạo một Global Type để quản lý thông tin công ty. Thông tin này có thể được truy cập và cập nhật từ Admin Dashboard.

**Các trường thông tin:**
- Tên công ty đầy đủ và tên viết tắt
- Mô tả ngắn về công ty
- Thông tin liên hệ (địa chỉ, điện thoại, email, hotline, fax, giờ làm việc)
- Liên kết mạng xã hội (Facebook, Twitter, Instagram, LinkedIn, YouTube, Telegram)
- Thông tin bản đồ (Google Maps Embed URL, tọa độ)
- Logo công ty
- Thông tin bổ sung

### 2. API Endpoints

#### Lấy thông tin công ty
- **URL:** `/api/company-info`
- **Method:** GET
- **Response:** JSON chứa toàn bộ thông tin công ty

#### Gửi form liên hệ
- **URL:** `/api/contact`
- **Method:** POST
- **Payload:**
  ```json
  {
    "name": "Họ tên người gửi",
    "email": "email@example.com",
    "phone": "0123456789",
    "subject": "general",
    "message": "Nội dung tin nhắn"
  }
  ```
- **Response:** 
  ```json
  {
    "success": true,
    "message": "Yêu cầu liên hệ đã được gửi thành công",
    "submission": {
      "id": "123456",
      "createdAt": "2025-05-15T10:00:00.000Z"
    }
  }
  ```

### 3. Collection: ContactSubmissions

Đã thiết lập collection để lưu trữ và quản lý các yêu cầu liên hệ từ khách hàng:
- Thông tin người gửi (tên, email, điện thoại)
- Chủ đề yêu cầu
- Nội dung tin nhắn
- Trạng thái xử lý (mới, đang xử lý, đã giải quyết, v.v.)
- Ghi chú nội bộ

## Hướng dẫn sử dụng

### Quản lý thông tin công ty

1. Đăng nhập vào Admin Dashboard
2. Vào mục "Globals" > "Thông tin công ty"
3. Cập nhật các thông tin cần thiết
4. Nhấn "Save" để lưu thay đổi

### Quản lý yêu cầu liên hệ

1. Đăng nhập vào Admin Dashboard
2. Vào mục "Collections" > "Liên hệ"
3. Xem danh sách các yêu cầu liên hệ, lọc theo trạng thái
4. Nhấn vào một yêu cầu để xem chi tiết và cập nhật trạng thái

## Tích hợp với Frontend

Để tích hợp các API này với frontend, chúng tôi đã tạo một tài liệu hướng dẫn riêng: [Hướng dẫn tích hợp Frontend](./frontend-integration-guide.md). Tài liệu này bao gồm:

1. Cách lấy và hiển thị thông tin công ty trên trang Liên hệ
2. Cách gửi form liên hệ đến endpoint API của backend
3. Cấu hình biến môi trường và xử lý CORS
4. Kiểm tra và xử lý sự cố

### Cấu hình CORS

Backend đã được cấu hình để chấp nhận request từ frontend (vrcfrontend) với cấu hình CORS trong `payload.config.ts`:

```typescript
cors: {
  origins: [
    getServerSideURL(),                                    // Backend URL
    process.env.FRONTEND_URL || 'http://localhost:5173',   // Frontend Vite URL
  ].filter(Boolean),
  headers: ['authorization', 'content-type', 'x-custom-header'],
},
```

Đảm bảo thiết lập biến môi trường `FRONTEND_URL` trong backend để cho phép frontend production truy cập.

## Tính năng nâng cao có thể triển khai trong tương lai

1. **Gửi email thông báo khi có liên hệ mới**
   - Tích hợp với dịch vụ email như SendGrid, Mailchimp, v.v.
   - Gửi email thông báo tự động khi có form liên hệ mới

2. **Báo cáo và thống kê liên hệ**
   - Thống kê số lượng liên hệ theo thời gian
   - Phân tích chủ đề liên hệ phổ biến

3. **Quản lý nhiều chi nhánh/văn phòng**
   - Mở rộng model để hỗ trợ nhiều địa điểm/chi nhánh
   - Hiển thị thông tin chi nhánh trên trang Liên hệ
