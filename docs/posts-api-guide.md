# API Endpoints cho Bài Viết (Posts)

Tài liệu này mô tả chi tiết các endpoints API cho việc truy vấn và quản lý bài viết trong hệ thống.

## 1. Danh sách API Endpoints

### 1.1 Lấy danh sách bài viết

```
GET /api/posts
```

**Query Parameters:**
- `page` (số trang, mặc định: 1)
- `limit` (số bài viết mỗi trang, mặc định: 10)
- `search` (tìm kiếm theo tiêu đề)

**Phản hồi thành công (200):**
```json
{
  "success": true,
  "data": [...],
  "totalDocs": 50,
  "totalPages": 5,
  "page": 1,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

### 1.2 Lấy bài viết theo ID

```
GET /api/posts/{id}
GET /api/posts?id={id}
```

**Phản hồi thành công (200):**
```json
{
  "success": true,
  "data": {
    "id": "6829983123491d83db5b9f4e",
    "title": "Tiêu đề bài viết",
    "slug": "tieu-de-bai-viet",
    ...
  }
}
```

**Phản hồi lỗi (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy bài viết với ID: 6829983123491d83db5b9f4e"
}
```

### 1.3 Lấy bài viết theo slug

```
GET /api/posts?slug={slug}
```

**Phản hồi thành công (200):**
```json
{
  "success": true,
  "data": {
    "id": "6829983123491d83db5b9f4e",
    "title": "Tiêu đề bài viết",
    "slug": "tieu-de-bai-viet",
    ...
  }
}
```

**Phản hồi lỗi (404):**
```json
{
  "success": false,
  "message": "Không tìm thấy bài viết với slug: tieu-de-bai-viet"
}
```

## 2. Xử lý lỗi chung

Các lỗi chung sẽ có định dạng:

```json
{
  "success": false,
  "message": "Thông báo lỗi",
  "error": "Chi tiết lỗi nếu có"
}
```

**Mã lỗi phổ biến:**
- `400` - Bad Request: Yêu cầu không hợp lệ
- `401` - Unauthorized: Chưa xác thực
- `403` - Forbidden: Không có quyền truy cập
- `404` - Not Found: Không tìm thấy tài nguyên
- `500` - Internal Server Error: Lỗi server

## 3. Chế độ xem trước (Preview)

Để xem trước bài viết, sử dụng endpoint:

```
GET /next/preview?path=/posts/{slug}&collection=posts&slug={slug}&previewSecret={secret}
```

**Query Parameters:**
- `path`: Đường dẫn tương đối đến bài viết (bắt đầu bằng `/`)
- `collection`: Bộ sưu tập (luôn là `posts`)
- `slug`: Slug của bài viết
- `previewSecret`: Chuỗi bí mật được định nghĩa trong `.env`

**Lưu ý:**
- Trong môi trường phát triển, có thể dùng `previewSecret=dev-preview`
- Trong môi trường sản xuất, cần đăng nhập và sử dụng `previewSecret` từ biến môi trường

## 4. Khắc phục sự cố

### 4.1 Lỗi 400 (Bad Request)
- Kiểm tra định dạng của ID và các tham số truy vấn
- Đảm bảo ID có đúng định dạng MongoDB (24 ký tự hexadecimal)

### 4.2 Lỗi 403 (Forbidden) cho Preview
- Kiểm tra xem đã đăng nhập chưa (cookie payload-token)
- Đảm bảo PREVIEW_SECRET chính xác trong .env
- Trong môi trường phát triển, có thể dùng `previewSecret=dev-preview`
