⚠️ **CẢNH BÁO QUAN TRỌNG - ĐỌC KỸ TRƯỚC KHI THỰC HIỆN:**


> **📌 SERVER LUÔN DUY TRÌ**: Backend server đang chạy tại `http://localhost:3000` và sẽ duy trì suốt quá trình phát triển. **KHÔNG CẦN khởi động lại server** cho bất kỳ bước nào.


1. **KHÔNG chạy lại các API seed đã tồn tại** - có thể gây lỗi dữ liệu
2. **Chỉ seed khi khởi tạo dự án mới** từ đầu hoàn toàn  
3. **Kiểm tra kỹ trước khi POST** đến bất kỳ endpoint seed nào
4. **CÁC API SEED KHÁC ĐÃ HOẠT ĐỘNG ỔN ĐỊNH** - đã được tinh chỉnh, không cần chạy lại
5. **CHỈ SEED KHI TẠO DỰ ÁN MỚI** - khi setup từ đầu hoàn toàn, không phải maintenance


---


## ⚙️ **CẤU HÌNH SERVER - QUAN TRỌNG**


### **🌐 Port Configuration (từ .env)**
```properties
# Backend (Payload CMS + API)
BASE_URL=http://localhost:3000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000


# Frontend (VRC Website)  
FRONTEND_URL=http://localhost:8081


# API URL for frontend consumption
REACT_APP_API_URL=http://localhost:3000


### **🔍 Verification Commands**
```bash
# Check backend health
curl http://localhost:3000/api/health


## 🚀 **CÁCH THỰC HIỆN TỪNG BƯỚC NHỎ**


### **⚠️ NGUYÊN TẮC AN TOÀN**


1. **🔒 BACKUP TRƯỚC KHI LÀM**
   ```bash
   # Backup database trước mọi thay đổi
   cp -r backend/database backend/database_backup_$(date +%Y%m%d_%H%M%S)
   ```


2. **🧪 TEST TỪNG BƯỚC NHỎ**
   - Sau mỗi file tạo → test compile
   - Sau mỗi API → test với curl/Postman
   - Sau mỗi component → test UI rendering


3. **📝 VALIDATE DỮ LIỆU**
   - Kiểm tra required fields
   - Validate relationships
   - Test edge cases (empty data, long content)


4. **🔄 INCREMENTAL DEVELOPMENT**
   - Làm 1 field/1 section tại 1 thời điểm
   - Không làm nhiều features cùng lúc
5. **🛠️ SỬA LỖI NGAY KHI PHÁT HIỆN**


### **🛡️ SEED API AN TOÀN**


```bash
# 1. Kiểm tra server trước
curl http://localhost:3000/api/health
### **⚠️ LƯU Ý QUAN TRỌNG**


**❌ TUYỆT ĐỐI KHÔNG LÀM:**
- Seed khi đã có data (gây duplicate)
- Sửa payload.config.ts khi server đang chạy
- Delete toàn bộ collection có data
- Hard reset database trong production


**✅ PHẢI LÀM:**
- Kiểm tra data tồn tại trước khi seed
- Backup trước mọi thay đổi quan trọng
- Test API với small data trước
- Verify TypeScript types sau khi generate


---
### Cho Developer  
- ✅ Consistent API pattern với existing code
- ✅ Type-safe với PayloadCMS generated types
- ✅ Scalable collection structure
- ✅ Standard CRUD operations


### Cho Business
- ✅ Content marketing hiệu quả
- ✅ SEO-friendly news system
- ✅ Professional news presentation
- ✅ Easy content updates không cần developer


---
**⚠️ Payload Requirements**:
- Sử dụng đúng Payload field types: `text`, `richText`, `upload`, `relationship`, `select`
- Implement proper `slug` generation với `slugify`
- Relationship fields phải reference đúng collection names
- Admin UI fields phải có `label` và `description` rõ ràng


---
**⚠️ Code Quality Requirements**:
- Sử dụng TypeScript cho tất cả các file
- Tuân thủ quy tắc đặt tên và cấu trúc thư mục
- Sử dụng linter và formatter (ESLint, Prettier)
- Viết tài liệu rõ ràng cho từng API và component
- tuân thủ quy tắc của Payload CMS
- Sử dụng `async/await` cho tất cả các API calls
- Xử lý lỗi đầy đủ với try/catch
- Viết unit tests cho các API quan trọng
- Sử dụng `dotenv` để quản lý biến môi trường
- Sử dụng `cors` để cấu hình CORS cho frontend
- Sử dụng `helmet` để bảo mật HTTP headers
- Sử dụng `compression` để nén response
- Sử dụng `morgan` để log HTTP requests
- Sử dụng `body-parser` để parse request body
- Sử dụng `express-rate-limit` để giới hạn tần suất request
- Sử dụng `express-validator` để validate request body
- Sử dụng `multer` để xử lý file upload
- Sử dụng `jsonwebtoken` để xác thực người dùng
- Sử dụng `bcrypt` để mã hóa mật khẩu


**⚠️ Data Quality Requirements**:
- Đảm bảo dữ liệu đầu vào hợp lệ và đầy đủ
- Kiểm tra dữ liệu trùng lặp trước khi lưu
- Sử dụng các công cụ kiểm tra dữ liệu tự động
- Sử dụng các công cụ phân tích dữ liệu để phát hiện lỗi
- Sử dụng các công cụ giám sát hiệu suất để phát hiện vấn đề


**⚠️ Frontend Code Quality**:
- Sử dụng React hooks cho state management
- Sử dụng `axios` cho API calls
- Sử dụng `react-router` cho routing
- Sử dụng `redux` cho state management (nếu cần)
- Sử dụng `styled-components` hoặc `CSS modules` cho styling  
- Sử dụng `react-query` hoặc `swr` cho data fetching
- Sử dụng `react-hook-form` cho form handling
- Sử dụng `yup` hoặc `joi` cho validation schema
- Sử dụng `react-testing-library` cho unit tests
- Sử dụng `jest` cho testing framework
- Sử dụng `eslint` và `prettier` cho code quality
- Sử dụng `react-icons` cho icons
- Sử dụng `react-toastify` cho thông báo  
- Sử dụng `react-i18next` cho localization
- Sử dụng `react-helmet` cho SEO
- Sử dụng `react-lazyload` cho lazy loading
- Sử dụng `react-slick` hoặc `swiper` cho carousel


## **⚠️ LƯU Ý QUAN TRỌNG VỀ CODE QUALITY**
- **Tuân thủ quy tắc đặt tên**: Sử dụng camelCase cho biến và hàm, PascalCase cho class và component.
- **Sử dụng TypeScript**: Tất cả các file phải sử dụng TypeScript để đảm bảo type safety.
- **Viết tài liệu rõ ràng**: Mỗi API và component phải có mô tả chi tiết về chức năng, tham số và trả về.


### **🔄 Consistent Error Patterns**
- **Sử dụng try/catch**: Mọi API call phải được bao quanh bởi try/catch để xử lý lỗi.
- **Trả về lỗi rõ ràng**: Sử dụng `res.status(400).json({ error: 'Error message' })` cho lỗi client, `res.status(500).json({ error: 'Internal server error' })` cho lỗi server.
- **Sử dụng custom error classes**: Tạo các class lỗi tùy chỉnh để dễ dàng quản lý và log lỗi.
- **Log lỗi đầy đủ**: Sử dụng `console.error` hoặc một logger như `winston` để log lỗi chi tiết.
- **Trả về mã lỗi HTTP chuẩn**: Sử dụng các mã lỗi HTTP chuẩn như 400, 401, 403, 404, 500 để phản hồi lỗi.
- **Sử dụng `http-errors`**: Sử dụng package này để tạo các lỗi HTTP chuẩn với thông điệp rõ ràng.
- **Trả về lỗi dạng JSON**: Tất cả các lỗi phải được trả về dưới dạng JSON với cấu trúc `{ error: 'Error message' }`.
- **Sử dụng `express-validator`**: Để validate dữ liệu đầu vào và trả về lỗi chi tiết nếu không hợp lệ.
- **Sử dụng `cors`**: Để cấu hình CORS cho phép frontend truy cập API.


### **📋 Payload CMS Tôn trọng cấu trúc**
- **Sử dụng đúng field types**: Chỉ sử dụng các field types đã được định nghĩa trong Payload CMS như `text`, `richText`, `upload`, `relationship`, `select`.
- **Định nghĩa rõ ràng các mối quan hệ**: Sử dụng `relationship` field để liên kết các collection với nhau.
- **Sử dụng `slug` cho các collection cần SEO**: Đảm bảo rằng các collection có slug được định nghĩa rõ ràng và sử dụng `slugify` để tạo slug từ tên.
- **Sử dụng `adminUI` fields**: Định nghĩa rõ ràng các trường trong admin UI với `label` và `description` để người dùng dễ hiểu.
- **Sử dụng `hooks` để xử lý logic phức tạp**: Nếu cần thực hiện các thao tác phức tạp, hãy sử dụng hooks của Payload CMS để xử lý logic đó.
### **📦 Cấu trúc Thư mục Backend**
```plaintext


### **API Route Patterns:**
- **GET**: Lấy dữ liệu (ví dụ: `/api/news`, `/api/users`)
- **POST**: Tạo mới dữ liệu (ví dụ: `/api/news`, `/api/users`)
- **PUT/PATCH**: Cập nhật dữ liệu (ví dụ: `/api/news/:id`, `/api/users/:id`)
- **DELETE**: Xóa dữ liệu (ví dụ: `/api/news/:id`, `/api/users/:id`)


### giai đoạn phát triển
#### **1. Phân tích yêu cầu tích hợp API**
- **Xác định các API cần thiết**: Dựa trên yêu cầu dự án, xác định các API cần thiết để tích hợp.
- **Phân loại API**: Chia thành các nhóm như CRUD, authentication, data fetching, v.v.
- **Xác định các endpoint**: Đặt tên endpoint rõ ràng, dễ hiểu và tuân thủ quy tắc RESTful.
- **Xác định các phương thức HTTP**: Sử dụng GET, POST, PUT, DELETE một cách hợp lý.
- **Xác định các tham số và body**: Định nghĩa rõ ràng các tham số cần thiết cho từng endpoint, bao gồm query params, path params và request body.
- **Xác định các response**: Định nghĩa rõ ràng cấu trúc response cho từng endpoint, bao gồm status code và body.
- **Xác định các lỗi có thể xảy ra**: Định nghĩa rõ ràng các lỗi có thể xảy ra cho từng endpoint, bao gồm status code và message.
- **Xác định các yêu cầu bảo mật**: Đảm bảo các API được bảo vệ bằng authentication và authorization nếu cần thiết.
- **Xác định các yêu cầu hiệu suất**: Đảm bảo các API có thể xử lý lượng dữ liệu lớn và có thời gian phản hồi nhanh.
- **Xác định các yêu cầu bảo trì**: Đảm bảo các API dễ dàng bảo trì và mở rộng trong tương lai.
- **Xác định các yêu cầu kiểm thử**: Đảm bảo các API có thể được kiểm thử dễ dàng, bao gồm unit tests và integration tests.
### **2. phân tích frontend** và **backend** có sẵn
- **Xem xét cấu trúc thư mục**: Đảm bảo cấu trúc thư mục rõ ràng, dễ hiểu và tuân thủ quy tắc đặt tên.
- **Xem xét các file cấu hình**: Đảm bảo các file cấu hình như `.env`, `tsconfig.json`, `package.json` được cấu hình đúng.
- **Xem xét các package đã cài đặt**: Đảm bảo các package cần thiết đã được cài đặt và cấu hình đúng.
- **Xem xét các API đã có**: Đảm bảo các API đã có hoạt động ổn định và tuân thủ quy tắc đặt tên.
- **Xem xét các component đã có**: Đảm bảo các component đã có hoạt động ổn định và tuân thủ quy tắc đặt tên.
- **Xem xét các state management đã có**: Đảm bảo các state management đã có hoạt động ổn định và tuân thủ quy tắc đặt tên.
- **Xem xét các form đã có**: Đảm bảo các form đã có hoạt động ổn định và tuân thủ quy tắc đặt tên.
- **Xem xét các validation đã có**: Đảm bảo các validation đã có hoạt động ổn định và tuân thủ quy tắc đặt tên.
- **Xem xét các unit tests đã có**: Đảm bảo các unit tests đã có hoạt động ổn định và tuân thủ quy tắc đặt tên.
- **Xem xét các integration tests đã có**: Đảm bảo các integration tests đã có hoạt động ổn định và tuân thủ quy tắc đặt tên.
### **3. đánh giá và lên kế hoạch**
- **Đánh giá các API đã có**: Xem xét các API đã có, xác định các API cần thiết để tích hợp.
- **Lên kế hoạch tích hợp API**: Xác định các bước cần thực hiện để tích hợp API, bao gồm các endpoint, phương thức HTTP, tham số và body.
- **Lên kế hoạch kiểm thử API**: Xác định các bước cần thực hiện để kiểm thử API, bao gồm unit tests và integration tests.
### **4. thực hiện tích hợp API cho frontend**
- **Tạo các service để gọi API**: Tạo các service trong frontend để gọi các API đã được xác định.
- **Kết nối các component với API**: Kết nối các component trong frontend với các API đã được xác định thông qua các service.
- **Xử lý dữ liệu trả về từ API**: Xử lý dữ liệu trả về từ API và cập nhật state của các component tương ứng.
- **Xử lý lỗi khi gọi API**: Xử lý các lỗi có thể xảy ra khi gọi API và thông báo cho người dùng nếu cần thiết.
### **5. seed lai dữ liệu cho API nếu chưa có hoặc chưa phù hợp**
- **Tạo dữ liệu mẫu**: Tạo dữ liệu mẫu cho các API nếu chưa có dữ liệu. dữ liệu mẫu này được hardcode trong code vrcfrontend.
- **Cập nhật dữ liệu mẫu**: Cập nhật dữ liệu mẫu cho các API nếu dữ liệu hiện tại chưa phù hợp.
- **Sử dụng các công cụ seed dữ liệu của Payload CMS để tự động tạo dữ liệu mẫu cho các API.**
- **Kiểm tra dữ liệu mẫu**: Kiểm tra dữ liệu mẫu đã được tạo ra có đúng định dạng và phù hợp với yêu cầu của API hay không.
### **6. kiểm thử API**


### **7. hoàn thiện và tối ưu hóa**
- **Tối ưu hóa hiệu suất**: Kiểm tra và tối ưu hóa hiệu suất của các API, bao gồm caching, pagination, v.v.
- **Tối ưu hóa bảo mật**: Đảm bảo các API được bảo vệ bằng authentication và authorization nếu cần thiết.
- **Tối ưu hóa bảo trì**: Đảm bảo các API dễ dàng bảo trì và mở rộng trong tương lai.
### **8. tài liệu hóa API**
- **Viết tài liệu API**: Sử dụng Swagger hoặc Postman để viết tài liệu cho các API đã tích hợp.
- **Cập nhật tài liệu khi có thay đổi**: Đảm bảo tài liệu luôn được cập nhật khi có thay đổi về API.

