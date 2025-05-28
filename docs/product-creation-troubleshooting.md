# Hướng dẫn xử lý lỗi khi tạo Sản phẩm

## Vấn đề

Khi tạo sản phẩm mới qua Admin Dashboard, người dùng có thể gặp lỗi liên quan đến trường **Hình ảnh chính** (mainImage) với thông báo:

```
The following field is invalid: Hình ảnh chính
```

hoặc

```
Vui lòng tải lên hình ảnh chính cho sản phẩm
```

## Nguyên nhân

1. **Trường bắt buộc**: Hình ảnh chính được đánh dấu là trường bắt buộc trong schema của Products
2. **Định dạng không hợp lệ**: File được tải lên có thể không đúng định dạng hỗ trợ
3. **Vấn đề với collection Media**: Có thể có vấn đề khi lưu trữ file vào collection Media
4. **Quy trình tải lên chưa hoàn tất**: Người dùng có thể đã chọn file nhưng chưa đợi quá trình tải lên hoàn tất

## Giải pháp

### 1. Đảm bảo tải lên hình ảnh chính

Khi tạo sản phẩm mới, bạn **phải** tải lên ít nhất một hình ảnh cho trường "Hình ảnh chính":

1. Nhấp vào nút "Tải lên" trong trường Hình ảnh chính
2. Chọn một file hình ảnh từ máy tính của bạn
3. **Quan trọng**: Đợi cho đến khi quá trình tải lên hoàn tất - bạn sẽ thấy hình ảnh được hiển thị trong khung xem trước
4. Chỉ sau khi hình ảnh đã hiển thị trong khung xem trước, mới nhấn nút "Lưu" hoặc "Tạo"

> **Lưu ý**: Việc tải lên hình ảnh và lưu sản phẩm là hai quy trình riêng biệt. Bạn cần đảm bảo hình ảnh đã được tải lên đầy đủ trước khi lưu sản phẩm.

### 2. Kiểm tra định dạng và kích thước file

- **Định dạng hỗ trợ**: JPG, JPEG, PNG, GIF, WebP
- **Kích thước tối đa**: 5MB (khuyến nghị)
- **Độ phân giải tối thiểu**: Không có yêu cầu cụ thể, nhưng khuyến nghị ít nhất 800x800px cho chất lượng hiển thị tốt

### 3. Giải pháp cho lỗi liên tục

Nếu vẫn gặp lỗi khi tải lên hình ảnh, hãy thử các giải pháp sau:

#### Cách 1: Xóa cache trình duyệt
```
1. Mở DevTools (F12 hoặc chuột phải > Inspect)
2. Chọn tab Application > Storage
3. Click "Clear site data"
4. Làm mới trang (F5) và đăng nhập lại
```

#### Cách 2: Tải lên qua Media Collection trước
```
1. Đi đến phần "Media" trong menu điều hướng bên trái
2. Nhấn "Tạo mới" để tải lên một hình ảnh mới
3. Điền thông tin Alt và Caption (nếu cần)
4. Lưu hình ảnh
5. Quay lại form tạo sản phẩm và chọn hình ảnh này từ thư viện Media
```

#### Cách 3: Kiểm tra kích thước và định dạng hình ảnh
```
1. Giảm kích thước hình ảnh xuống dưới 1MB
2. Chuyển đổi sang định dạng JPG hoặc PNG đơn giản
3. Đảm bảo tên file không chứa ký tự đặc biệt
```

#### Cách 4: Kiểm tra console lỗi
```
1. Mở DevTools (F12)
2. Chuyển đến tab Console
3. Kiểm tra các thông báo lỗi đỏ
4. Báo cáo lỗi chi tiết cho đội kỹ thuật
```

## Các cập nhật đã thực hiện

Chúng tôi đã cải thiện hệ thống để xử lý tốt hơn các lỗi khi tạo sản phẩm:

1. **Cải thiện thông báo lỗi**: Hiển thị thông báo lỗi chi tiết và hướng dẫn cụ thể về cách khắc phục
2. **Thêm hooks validate**: Kiểm tra tốt hơn trường hợp hình ảnh không hợp lệ hoặc thiếu
3. **Nâng cao API endpoint**: Xử lý tốt hơn các trường hợp đặc biệt với các thông báo lỗi rõ ràng
4. **Cải thiện UI**: Thêm hướng dẫn trực quan và thông báo cho trường Hình ảnh chính

## Quy trình làm việc tối ưu

Để tạo sản phẩm mới một cách hiệu quả, hãy làm theo các bước sau:

1. Chuẩn bị tất cả hình ảnh sản phẩm trước (hình ảnh chính và bộ sưu tập)
2. Tải trước các hình ảnh vào Media Collection nếu cần
3. Điền đầy đủ thông tin cơ bản của sản phẩm (tên, mô tả, danh mục, v.v.)
4. Tải lên hình ảnh chính và đợi cho đến khi hiển thị trong khung xem trước
5. Điền các thông tin tùy chọn khác (thông số kỹ thuật, sản phẩm liên quan, v.v.)
6. Lưu sản phẩm

## Dành cho nhà phát triển

Nếu cần kiểm tra API mà không muốn tải lên hình ảnh, bạn có thể sử dụng header `X-API-Test: true` để bỏ qua một số validation trong môi trường phát triển. Tuy nhiên, đây chỉ là giải pháp tạm thời cho việc kiểm thử.

```javascript
// Ví dụ gọi API với fetch
fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Test': 'true',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  },
  body: JSON.stringify({
    name: 'Test Product',
    excerpt: 'Mô tả ngắn cho sản phẩm',
    description: '<p>Mô tả chi tiết sản phẩm</p>',
    status: 'draft'
  })
})
  },
  body: JSON.stringify({
    name: 'Test Product',
    // Không cần mainImage khi sử dụng X-API-Test
  })
})
```

## Liên hệ hỗ trợ

Nếu bạn vẫn gặp vấn đề khi tạo sản phẩm sau khi đã thử các giải pháp trên, vui lòng liên hệ đội phát triển qua email [support@example.com] hoặc tạo một issue trên hệ thống quản lý dự án.
