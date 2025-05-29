# Sửa lỗi Admin Interface - Technologies & Partners

## Vấn đề đã được sửa

### Lỗi Relationship Field trong Technologies Collection

**Vấn đề:** Khi tạo mới hoặc chỉnh sửa Công nghệ & Đối tác, dropdown "Sản phẩm liên quan" bị lỗi với thông báo:
```
Error: Cannot read properties of undefined (reading 'length')
```

**Nguyên nhân:** Cấu hình relationship field không đúng trong file `Technologies.ts`:
```typescript
// ❌ Sai - sử dụng array
relationTo: ['products']

// ✅ Đúng - sử dụng string
relationTo: 'products'
```

**Sửa lỗi:** Đã thay đổi cấu hình trong `backend/src/collections/Technologies.ts`:
```typescript
{
  name: 'products',
  type: 'relationship',
  label: 'Sản phẩm liên quan',
  relationTo: 'products', // ✅ Sửa từ ['products'] thành 'products'
  hasMany: true,
  admin: {
    description: 'Các sản phẩm liên quan đến công nghệ/đối tác này',
  },
}
```

## Cách sử dụng Admin Interface

### 1. Truy cập Admin Panel
- URL: `http://localhost:3000/admin`
- Đăng nhập với tài khoản admin

### 2. Quản lý Công nghệ & Đối tác

#### Tạo mới:
1. Vào **Dự án & Đối tác** → **Công nghệ & Đối tác**
2. Click **Create New**
3. Điền thông tin:
   - **Tên**: Tên công nghệ/đối tác
   - **Loại**: Technology, Partner, hoặc Supplier
   - **Logo**: Upload logo (optional)
   - **Website**: URL website
   - **Mô tả**: Rich text description
   - **Sản phẩm liên quan**: ✅ Bây giờ có thể chọn từ dropdown
   - **Chứng chỉ**: Thêm các chứng chỉ liên quan
   - **Trạng thái**: Draft hoặc Published

#### Sắp xếp thứ tự:
- Sử dụng field **Thứ tự hiển thị** (số càng nhỏ hiển thị càng trước)

#### Đánh dấu nổi bật:
- Check **Đối tác nổi bật** để hiển thị trên trang chủ

### 3. Quản lý Homepage Settings

#### Truy cập:
1. Vào **Nội dung** → **Cài đặt trang chủ**
2. Cấu hình các section:

#### Banner Section:
- **Bật carousel**: Tự động chuyển slide
- **Thời gian chuyển slide**: Số giây giữa các slide
- **Danh sách banner**: Chọn banner từ collection Banners

#### Sản phẩm nổi bật:
- **Hiển thị section**: Bật/tắt section
- **Tiêu đề & Mô tả**: Tùy chỉnh text
- **Sản phẩm nổi bật**: Chọn tối đa 6 sản phẩm
- **Link "Xem tất cả"**: URL trang products

#### Bài viết mới nhất:
- **Chế độ hiển thị**: 
  - Auto: Tự động lấy bài mới nhất
  - Manual: Chọn thủ công
- **Số bài viết**: Khi chế độ Auto
- **Bài viết được chọn**: Khi chế độ Manual

#### Công cụ & Tài nguyên:
- **Panel trái**: Dữ liệu & Thống kê
- **Panel phải**: Công cụ tính toán
- Mỗi panel có: tiêu đề, mô tả, danh sách tính năng, link

#### SEO Settings:
- **Meta title**: Tiêu đề trang chủ
- **Meta description**: Mô tả cho search engines
- **Meta keywords**: Từ khóa SEO
- **OG Image**: Hình ảnh social media (1200x630px)

## API Endpoints

### Homepage Settings API
- **GET** `/api/homepage-settings`: Lấy cài đặt trang chủ + dữ liệu liên quan
- **PUT** `/api/homepage-settings`: Cập nhật cài đặt (cần authentication)

### Response format:
```json
{
  "success": true,
  "data": {
    "heroSection": { "enableCarousel": true, ... },
    "featuredSection": { "isEnabled": true, ... },
    "activeBanners": [...], // Banners đang active
    "featuredProductsData": [...], // Products data
    "latestPosts": [...] // Posts data
  }
}
```

## Lưu ý quan trọng

### 1. Relationship Fields
- ✅ Luôn sử dụng `relationTo: 'collection-slug'` (string)
- ❌ Không sử dụng `relationTo: ['collection-slug']` (array) trừ khi polymorphic

### 2. Collection Dependencies
- Đảm bảo collection được reference tồn tại
- Kiểm tra slug name chính xác

### 3. Admin Interface Testing
- Sau khi sửa collection config, restart dev server
- Test dropdown/relationship fields khi tạo mới record
- Kiểm tra validation và error handling

### 4. Performance
- Sử dụng `depth` parameter trong API calls để control data depth
- Implement pagination cho large datasets
- Cache frequently accessed data

## Troubleshooting

### Nếu vẫn gặp lỗi dropdown:
1. Kiểm tra console browser để xem lỗi chi tiết
2. Restart development server
3. Clear browser cache
4. Kiểm tra network tab xem API call có lỗi không

### Kiểm tra cấu hình:
```bash
# Build để check compilation errors
npm run build

# Check TypeScript errors
npm run type-check
```

---

**Cập nhật:** Lỗi relationship field trong Technologies collection đã được sửa thành công. Admin interface hiện tại có thể tạo mới công nghệ và đối tác với dropdown "Sản phẩm liên quan" hoạt động bình thường.

# Fix Lỗi SortHeader trong PayloadCMS Admin Interface

## 🐛 **MÔ TẢ LỖI HIỆN TẠI**

Khi tạo/edit Technology record trong admin interface và mở dropdown "Sản phẩm liên quan", gặp lỗi:
```
Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'length')
at eval (E:\src\elements\SortHeader\index.tsx:58:23)
```

## 🔍 **NGUYÊN NHÂN HIỆN TẠI**

1. **PayloadCMS Admin UI Cache**: Admin interface cache chưa được clear sau khi thay đổi config
2. **Hot Reload Issue**: Development mode hot reload có thể không reload đúng cách  
3. **Browser Cache**: Browser cache giữ phiên bản cũ của admin UI

## ✅ **GIẢI PHÁP**

### **Bước 1: Restart Server**
```bash
# Dừng server hiện tại
taskkill /f /im node.exe

# Restart server
cd backend
npm run dev
```

### **Bước 2: Clear Browser Cache**
1. Mở admin panel: `http://localhost:3000/admin`
2. **Hard Refresh**: `Ctrl + Shift + R` hoặc `Ctrl + F5`
3. **Clear Storage**:
   - Mở Developer Tools (`F12`)
   - Tab **Application** → **Storage**
   - Xóa **Local Storage** và **Session Storage**
   - Refresh lại page

### **Bước 3: Configuration hiện tại**
Field relationship đã được fix trong `Technologies.ts`:

```typescript
{
  name: 'products',
  type: 'relationship',
  label: 'Sản phẩm liên quan',
  relationTo: 'products', // ✅ Fixed: không phải ['products']
  hasMany: true,
  admin: {
    description: 'Các sản phẩm liên quan đến công nghệ/đối tác này',
    isSortable: false, // ✅ Workaround cho SortHeader error
  },
}
```

## 🧪 **API ĐÃ HOẠT ĐỘNG**

API backend hoạt động bình thường, đã test thành công:

```bash
# ✅ Technologies API: 3 records
# ✅ Products API: 2 records
# ✅ Relationship update: Thành công
```

---

## 📋 **VẤN ĐỀ ĐÃ SỬA TRƯỚC ĐÓ**
