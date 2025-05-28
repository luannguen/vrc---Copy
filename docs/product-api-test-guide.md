# Hướng dẫn kiểm thử API Sản phẩm

Tài liệu này hướng dẫn cách thực hiện kiểm thử cho API xóa sản phẩm, bao gồm cả xóa một sản phẩm và xóa hàng loạt.

## Nội dung

1. [Chuẩn bị môi trường](#chuẩn-bị-môi-trường)
2. [Tạo sản phẩm kiểm thử](#tạo-sản-phẩm-kiểm-thử)
3. [Chạy bộ kiểm thử](#chạy-bộ-kiểm-thử)
4. [Hiểu kết quả kiểm thử](#hiểu-kết-quả-kiểm-thử)
5. [Xử lý sự cố thường gặp](#xử-lý-sự-cố-thường-gặp)

## Chuẩn bị môi trường

1. **Khởi động server dev**:
   ```
   cd backend
   npm run dev
   ```
   Server sẽ chạy ở cổng 3000 theo mặc định.

2. **Đăng nhập vào hệ thống**:
   - Các bộ kiểm thử sử dụng tài khoản `luan.nguyenthien@gmail.com` với mật khẩu `123456a@Aa`
   - Đảm bảo tài khoản này tồn tại trong hệ thống

## Tạo sản phẩm kiểm thử

Trước khi chạy bộ kiểm thử, bạn cần tạo một số sản phẩm trong hệ thống:

1. **Đăng nhập vào giao diện Admin**: Truy cập `http://localhost:3000/admin`

2. **Tạo sản phẩm mới**:
   - Chọn mục "Sản phẩm" từ menu
   - Nhấn nút "Tạo mới"
   - Điền thông tin bắt buộc:
     - Tên sản phẩm
     - Hình ảnh chính (bắt buộc phải có)
     - Trạng thái (draft hoặc published)
   - Lưu sản phẩm

3. **Tạo nhiều sản phẩm để kiểm thử hàng loạt**:
   - Tạo ít nhất 3-5 sản phẩm để phục vụ việc kiểm thử xóa hàng loạt

4. **Tạo sản phẩm có mối quan hệ**:
   - Tạo 2 sản phẩm
   - Chỉnh sửa sản phẩm thứ nhất
   - Trong trường "Sản phẩm liên quan", thêm sản phẩm thứ hai
   - Lưu lại thay đổi

## Chạy bộ kiểm thử

Chúng ta có hai bộ kiểm thử:

1. **Kiểm thử cơ bản** kiểm tra các chức năng xóa cơ bản:
   ```
   cd e:\Download\vrc
   node test/test-product-delete.js
   ```

2. **Kiểm thử nâng cao** kiểm tra các tình huống phức tạp:
   ```
   cd e:\Download\vrc
   node test/test-product-delete-advanced.js
   ```

> **Lưu ý**: Các bộ kiểm thử đã được thiết lập để không thực sự xóa sản phẩm trong cơ sở dữ liệu, mà chỉ kiểm tra hoạt động của API. Điều này giúp bảo vệ dữ liệu và cho phép chạy kiểm thử nhiều lần.

## Hiểu kết quả kiểm thử

Khi chạy các bộ kiểm thử, bạn sẽ thấy:

- **Danh sách sản phẩm hiện có**: Hiển thị các sản phẩm được tìm thấy trong cơ sở dữ liệu
- **Phân tích cấu trúc sản phẩm**: Hiển thị chi tiết về một sản phẩm mẫu
- **Tổng kết kết quả**: Báo cáo về các kiểm thử đã thực hiện

Các bộ kiểm thử hoạt động ở chế độ mô phỏng, không thực sự xóa dữ liệu.

## Xử lý sự cố thường gặp

1. **Không thể kết nối đến API**:
   - Đảm bảo server đang chạy ở cổng 3000
   - Kiểm tra lỗi CORS trong console trình duyệt
   - Kiểm tra firewall hoặc proxy mạng

2. **Lỗi xác thực**:
   - Kiểm tra thông tin đăng nhập trong file `auth-helper.js`
   - Đảm bảo tài khoản đã được tạo trong hệ thống

3. **Không tìm thấy sản phẩm nào**:
   - Tạo sản phẩm thông qua giao diện Admin như hướng dẫn ở trên
   - Kiểm tra trạng thái của sản phẩm (draft/published)

4. **Lỗi khi tạo hoặc xóa sản phẩm**:
   - Kiểm tra logs của server để biết thêm chi tiết
   - Đảm bảo rằng người dùng có quyền tạo và xóa sản phẩm

---

## Thông tin bổ sung

Các bộ kiểm thử được thiết kế để gửi header `X-API-Test: true` để bypass xác thực trong môi trường phát triển. Trong môi trường sản xuất, cần phải đăng nhập và sử dụng token JWT cho xác thực.

Nếu cần thực hiện kiểm thử thực tế (thực sự xóa sản phẩm), hãy sửa đổi các tệp kiểm thử để bỏ chế độ mô phỏng và thêm logic để tạo sản phẩm kiểm thử riêng thay vì sử dụng sản phẩm hiện có.
