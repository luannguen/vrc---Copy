# Hướng dẫn xử lý lỗi không thể xóa sản phẩm trong Admin UI

Nếu bạn gặp lỗi "Method Not Allowed" hoặc không thể xóa sản phẩm từ giao diện Admin, hãy làm theo các bước sau:

## 1. Sử dụng API xóa sản phẩm trực tiếp

API này đã được tạo để xử lý các trường hợp đặc biệt khi không thể xóa sản phẩm qua giao diện Admin.

### Sử dụng PowerShell:

```powershell
# Thay thế YOUR_PRODUCT_ID bằng ID sản phẩm cần xóa
Invoke-RestMethod -Uri "http://localhost:3000/api/force-delete-products?id=YOUR_PRODUCT_ID" -Method DELETE
```

### Sử dụng cURL:

```bash
# Thay thế YOUR_PRODUCT_ID bằng ID sản phẩm cần xóa
curl -X DELETE "http://localhost:3000/api/force-delete-products?id=YOUR_PRODUCT_ID"
```

## 2. Sử dụng script PowerShell

Chúng tôi đã cung cấp một script PowerShell để dễ dàng xóa sản phẩm:

```powershell
# Đi đến thư mục dự án
cd path\to\backend

# Chạy script (thay thế YOUR_PRODUCT_ID bằng ID sản phẩm cần xóa)
.\tools\delete-product.ps1 YOUR_PRODUCT_ID
```

## 3. Nếu sự cố vẫn tiếp diễn

Nếu bạn vẫn không thể xóa sản phẩm, có thể có vấn đề với cấu hình Payload hoặc cơ sở dữ liệu. Hãy thử:

1. Khởi động lại máy chủ
2. Kiểm tra logs để biết thêm chi tiết về lỗi
3. Sửa đổi file `src/collections/Products.ts` để tạm thời vô hiệu hóa các hooks xác thực nếu cần thiết

## 4. Cách tìm ID sản phẩm

Để tìm ID của sản phẩm cần xóa:

```powershell
# Liệt kê tất cả sản phẩm
Invoke-RestMethod -Uri "http://localhost:3000/api/products" -Method GET

# Tìm sản phẩm theo tên
Invoke-RestMethod -Uri "http://localhost:3000/api/products?search=TÊN_SẢN_PHẨM" -Method GET
```

## 5. Phòng ngừa vấn đề trong tương lai

Để tránh các vấn đề tương tự trong tương lai:

1. Đảm bảo xử lý đúng các tham chiếu giữa các sản phẩm
2. Thêm xác thực đầy đủ khi tạo hoặc sửa đổi sản phẩm
3. Kiểm tra logs thường xuyên để phát hiện các lỗi tiềm ẩn
