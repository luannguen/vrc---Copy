# Hướng dẫn sử dụng chế độ Preview

Tài liệu này hướng dẫn cách sử dụng chế độ Preview để xem trước nội dung trước khi xuất bản.

## Giới thiệu

Chế độ Preview cho phép người dùng xem trước nội dung (bài viết, trang, sản phẩm) trước khi xuất bản công khai. Tính năng này đặc biệt hữu ích cho việc kiểm tra định dạng và nội dung trước khi hiển thị cho người dùng cuối.

## Cấu hình môi trường

### 1. Cài đặt biến môi trường

Tạo hoặc cập nhật file `.env` trong thư mục gốc của dự án:

```
PREVIEW_SECRET=your-secure-random-string
```

Trong môi trường phát triển, bạn có thể sử dụng các mã bí mật dự phòng:
- `dev-preview`
- `test-preview`

### 2. Sử dụng chế độ Preview

#### a. Từ Admin Dashboard

1. Mở bài viết hoặc trang cần xem trước
2. Nhấn vào nút "Xem trước" hoặc "Preview"

#### b. Truy cập trực tiếp URL Preview

URL cấu trúc:
```
/next/preview?path=/posts/ten-bai-viet&collection=posts&slug=ten-bai-viet&previewSecret=your-secret
```

Trong đó:
- `path`: Đường dẫn đến trang khi được hiển thị (vd: `/posts/ten-bai-viet`)
- `collection`: Loại nội dung (`posts`, `pages`, `products`, vv)
- `slug`: Định danh slug của nội dung
- `previewSecret`: Mã bí mật (từ biến môi trường hoặc mã dự phòng trong môi trường phát triển)

## Xử lý sự cố

### 1. Lỗi "Invalid preview secret"

- **Nguyên nhân**: Sai mã bí mật hoặc thiếu mã bí mật
- **Giải pháp**:
  - Kiểm tra `PREVIEW_SECRET` trong file `.env`
  - Trong môi trường phát triển, thử sử dụng `dev-preview` hoặc `test-preview` 
  - Đảm bảo mã bí mật được truyền đúng trong URL (không có khoảng trắng hoặc ký tự đặc biệt)

### 2. Lỗi "Path parameter is required for preview"

- **Nguyên nhân**: Thiếu tham số `path` trong URL
- **Giải pháp**: Đảm bảo URL có tham số `path` và bắt đầu bằng `/`

### 3. Lỗi "Insufficient search params"

- **Nguyên nhân**: Thiếu một trong các tham số bắt buộc
- **Giải pháp**: Đảm bảo URL có đầy đủ các tham số: `path`, `collection`, `slug`, và `previewSecret`

## Ví dụ URL Preview

### Xem trước bài viết:
```
http://localhost:3000/next/preview?path=/posts/example-post&collection=posts&slug=example-post&previewSecret=dev-preview
```

### Xem trước sản phẩm:
```
http://localhost:3000/next/preview?path=/products/example-product&collection=products&slug=example-product&previewSecret=dev-preview
```

## Kiểm tra phiên bản hiện tại

Trong phiên bản hiện tại của hệ thống, chúng tôi đã đơn giản hóa quy trình xem trước:

1. Không yêu cầu đăng nhập để xem trước (chỉ cần mã bí mật hợp lệ)
2. Hỗ trợ các mã bí mật dự phòng để dễ dàng kiểm thử
3. Ghi nhật ký chi tiết giúp gỡ lỗi

## Kiểm tra Preview API

Sử dụng đoạn mã sau để kiểm tra API Preview:

```javascript
const testPreview = async () => {
  const previewUrl = new URL('/next/preview', 'http://localhost:3000');
  previewUrl.searchParams.append('path', '/posts/example-post');
  previewUrl.searchParams.append('collection', 'posts');
  previewUrl.searchParams.append('slug', 'example-post');
  previewUrl.searchParams.append('previewSecret', 'dev-preview');
  
  console.log('Testing preview URL:', previewUrl.toString());
  
  try {
    const response = await fetch(previewUrl);
    console.log('Status:', response.status);
    console.log('Response:', await response.text());
  } catch (error) {
    console.error('Error:', error);
  }
};

testPreview();
```
