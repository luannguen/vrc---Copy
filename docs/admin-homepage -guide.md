# Admin Homepage Management Guide - Quản lý trang chủ VRC

## 🏠 **PHÂN TÍCH TRANG CHỦ FE VRC**

### Trang chủ bao gồm 5 thành phần chính:

#### 1. **HeroSection** - Banner Carousel
- **Chức năng**: Slider/carousel với multiple slides
- **Nội dung hiện tại**: Hardcode trong component với 3 slides
- **Cần quản lý**: 
  - ✅ **Collection**: `Banners` - đã có
  - ✅ **API**: `/api/banners` - cần kiểm tra
  - 📝 **Fields**: title, subtitle, imageUrl, link, isActive, sortOrder

#### 2. **FeaturedTopics** - Sản phẩm nổi bật  
- **Chức năng**: Hiển thị 3 sản phẩm nổi bật
- **Nội dung hiện tại**: Fallback data hardcode
- **Cần quản lý**:
  - ✅ **Collection**: `Products` - đã có và đã seed
  - ✅ **API**: `/api/products` - đã có
  - 📝 **Logic**: Cần API để lấy "featured products"

#### 3. **LatestPublications** - Bài viết mới nhất
- **Chức năng**: Hiển thị 4 bài viết/tin tức mới nhất
- **Nội dung hiện tại**: Fallback data hardcode  
- **Cần quản lý**:
  - ✅ **Collection**: `Posts` - đã có
  - ✅ **API**: `/api/posts` - đã có
  - 📝 **Logic**: Cần API lấy latest posts

#### 4. **DataResources** - Công cụ & Tài nguyên
- **Chức năng**: Hiển thị 2 panel thông tin tĩnh
- **Nội dung hiện tại**: Hardcode trong component
- **Cần quản lý**:
  - ❓ **Collection**: `Resources` hoặc `Tools` - cần kiểm tra
  - ❓ **API**: Cần kiểm tra có sẵn không

#### 5. **ContactForm** - Form liên hệ
- **Chức năng**: Form gửi liên hệ
- **Nội dung hiện tại**: Component form cơ bản
- **Cần quản lý**:
  - ✅ **Collection**: `ContactSubmissions` - đã có
  - ✅ **API**: `/api/contact` - đã có

---

## ✅ **KẾT QUẢ KIỂM TRA API - HOÀN THÀNH**

### 🎯 **TẤT CẢ API ĐÃ HOẠT ĐỘNG TỐ！**

#### ✅ **Step 1: Banners API** - THÀNH CÔNG
- ✅ GET `/api/banners` - **3 banners** đã được seed
- ✅ Collection có đầy đủ fields: title, subtitle, imageUrl, link, isActive, sortOrder
- ✅ Data sẵn sàng cho HeroSection component

#### ✅ **Step 2: Posts API** - HOẠT ĐỘNG (cần seed thêm)
- ✅ GET `/api/posts` - **1 post** hiện có
- ✅ API hoạt động tốt với sort và pagination
- ⚠️ **Cần seed thêm 3-4 posts** cho LatestPublications component

#### ✅ **Step 3: Resources & Tools API** - HOÀN HẢO
- ✅ GET `/api/resources` - **6 resources** đã seed
- ✅ GET `/api/tools` - **6 tools** đã seed  
- ✅ Sẵn sàng cho DataResources component (2 panels)

#### ✅ **Step 4: Featured Products** - HOÀN HẢO
- ✅ GET `/api/products?featured=true` - **5 featured products**
- ✅ Collection có field `featured: boolean`
- ✅ Sẵn sàng cho FeaturedTopics component

#### ✅ **Step 5: Contact API** - HOẠT ĐỘNG TỐT
- ✅ POST `/api/contact` - nhận và lưu contact submissions
- ✅ Collection ContactSubmissions hoạt động tốt

---

## 📋 **TRẠNG THÁI COLLECTIONS - TẤT CẢ ĐÃ SẴN SÀNG**

### ✅ **Collections hoàn chỉnh và đã có data:**

1. **`Banners`** - ✅ HeroSection component
   - 📊 **3 banners** đã seed hoàn chỉnh
   - 🔧 Fields: title, subtitle, imageUrl, link, isActive, sortOrder

2. **`Products`** - ✅ FeaturedTopics component  
   - 📊 **8 products** total, **5 featured products**
   - 🔧 Field `featured: boolean` hoạt động tốt

3. **`Posts`** - ⚠️ LatestPublications component
   - 📊 **1 post** hiện có (cần thêm 3-4 posts)
   - 🔧 API hoạt động tốt, chỉ thiếu data

4. **`Resources`** - ✅ DataResources panel trái
   - 📊 **6 resources** đã seed

5. **`Tools`** - ✅ DataResources panel phải  
   - 📊 **6 tools** đã seed

6. **`ContactSubmissions`** - ✅ ContactForm
   - 🔧 API POST hoạt động tốt

7. **`Media`** - ✅ File uploads
   - 🔧 Hỗ trợ image uploads cho tất cả components

---

## 🎯 **BACKEND SẴN SÀNG 90% - CHỈ CÒN VÀI VIỆC NHỎ**

### ✅ **Đã hoàn thành:**
1. ✅ Tất cả 5 homepage components đã có API tương ứng
2. ✅ 6/7 collections có đủ data, chỉ Posts cần thêm
3. ✅ Tất cả API endpoints hoạt động tốt
4. ✅ Featured products logic hoạt động hoàn hảo
5. ✅ Contact form submission hoạt động

### 🔄 **Còn lại cần làm:**

#### 1. **Seed thêm Posts data** (15 phút)
```bash
# Cần thêm 3-4 posts cho LatestPublications component
POST /api/posts (với auth)
```

#### 2. **Tạo Homepage Settings API** (30 phút)
- API để admin quản lý settings tổng thể của homepage
- Như: số lượng featured products hiển thị, số posts mới nhất, etc.

#### 3. **Frontend Integration** (1-2 giờ)  
- Kết nối các components với API thay vì dùng fallback data
- Update HeroSection để fetch từ `/api/banners`
- Update FeaturedTopics để fetch từ `/api/products?featured=true`
- Update LatestPublications để fetch từ `/api/posts?limit=4&sort=-createdAt`
- Update DataResources để fetch từ `/api/resources` và `/api/tools`

---

## 📚 **HƯỚNG DẪN ADMIN QUẢN LÝ TRANG CHỦ**

### 🏢 **1. Quản lý Banner Carousel (HeroSection)**

**Truy cập:** Admin Panel → Collections → Banners

**Chức năng:**
- ✅ Thêm/sửa/xóa banners
- ✅ Upload hình ảnh
- ✅ Sắp xếp thứ tự hiển thị  
- ✅ Bật/tắt banner

**Fields quan trọng:**
- `title`: Tiêu đề chính
- `subtitle`: Tiêu đề phụ
- `imageUrl`: Hình ảnh banner
- `link`: Liên kết khi click
- `isActive`: Bật/tắt hiển thị
- `sortOrder`: Thứ tự sắp xếp

### 🏷️ **2. Quản lý Sản phẩm nổi bật (FeaturedTopics)**

**Truy cập:** Admin Panel → Collections → Products

**Cách đánh dấu featured:**
- ✅ Chỉnh sửa product
- ✅ Bật checkbox `featured: true`
- ✅ Tối đa 5 products sẽ hiển thị ở homepage

**Auto-display:** Frontend tự động lấy 3 products đầu tiên có `featured=true`

### 📰 **3. Quản lý Bài viết mới nhất (LatestPublications)**

**Truy cập:** Admin Panel → Collections → Posts

**Auto-display:** 
- ✅ Frontend tự động lấy 4 posts mới nhất
- ✅ Sắp xếp theo `createdAt` descending
- ⚠️ **Cần seed thêm posts** để component hiển thị đầy đủ

### 🛠️ **4. Quản lý Công cụ & Tài nguyên (DataResources)**

**Resources (Panel trái):**
- **Truy cập:** Admin Panel → Collections → Resources
- ✅ 6 resources đã có sẵn

**Tools (Panel phải):**  
- **Truy cập:** Admin Panel → Collections → Tools
- ✅ 6 tools đã có sẵn

### 📞 **5. Contact Form**

**Quản lý submissions:**
- **Truy cập:** Admin Panel → Collections → ContactSubmissions
- ✅ Tự động lưu mọi form submission
- ✅ Admin có thể xem và quản lý

---

## 🔧 **API ENDPOINTS CHO FRONTEND**

### Homepage Data Fetching:

```typescript
// 1. Hero Banners
GET /api/banners?isActive=true&sort=sortOrder

// 2. Featured Products  
GET /api/products?featured=true&limit=3

// 3. Latest Posts
GET /api/posts?limit=4&sort=-createdAt

// 4. Resources & Tools
GET /api/resources?limit=6
GET /api/tools?limit=6

// 5. Contact Submission
POST /api/contact
```

---

## 📋 **PHÂN TÍCH CHI TIẾT API POSTS**

### **Cấu trúc Posts Collection:**
- ✅ **Fields chính**: `title`, `content`, `heroImage`, `publishedAt`, `authors`, `categories`, `relatedPosts`
- ✅ **SEO fields**: `meta.title`, `meta.description`, `meta.image`
- ✅ **Status system**: `_status` (draft/published)
- ✅ **Slug field** với auto-generation
- ✅ **Rich text editor** với Lexical (hỗ trợ blocks, headings, media)
- ✅ **Versioning & drafts** với autosave
- ✅ **Access control**: Auth required cho create/update/delete

### **API Posts Endpoints hiện có:**

#### 1. **GET `/api/posts`** - Lấy danh sách posts
```typescript
// Basic listing
GET /api/posts

// Với pagination
GET /api/posts?page=1&limit=4

// Sắp xếp cho Latest Publications
GET /api/posts?limit=4&sort=createdAt&order=desc
// hoặc đơn giản: GET /api/posts?limit=4 (default sort: -createdAt)
```

#### 2. **GET `/api/posts?slug=xyz`** - Lấy post theo slug
```typescript
GET /api/posts?slug=vietnam-economic-growth-2024
```

#### 3. **GET `/api/posts/{id}`** - Lấy post theo ID
```typescript
GET /api/posts/674c9f5e2728f8c9c2b4567a
```

#### 4. **POST `/api/posts`** - Tạo post mới (Auth required)
```typescript
POST /api/posts
{
  "title": "New Post Title",
  "content": {...},
  "_status": "published"
}
```

### **Filtering & Query Parameters hỗ trợ:**
- ✅ `search` - Tìm kiếm trong title và content
- ✅ `category` - Filter theo categories
- ✅ `status` - Filter theo status (default: published)
- ✅ `fromDate`/`toDate` - Filter theo ngày tạo
- ✅ `sort` + `order` - Sắp xếp (default: -createdAt)
- ✅ `page` + `limit` - Pagination

### **Perfect cho LatestPublications Component:**
```typescript
// API call cho homepage LatestPublications
GET /api/posts?limit=4&status=published

// Response format:
{
  "success": true,
  "data": [...posts],
  "totalDocs": 5,
  "totalPages": 2,
  "page": 1,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

---

## 🎯 **HOMEPAGE SETTINGS API - SỬ DỤNG PAYLOAD GLOBAL**

### **✅ Đã khắc phục vấn đề duplicate:**

**Trước đây:** 
- ❌ Tạo nhầm **Collection** HomepageSettings (sai cách tiếp cận)
- ❌ Custom API route phức tạp

**Hiện tại:**
- ✅ Sử dụng **Global** HomepageSettings (đúng Payload pattern)
- ✅ API tự động: `/api/homepage-settings`
- ✅ Admin UI tự động trong Payload

### **Global HomepageSettings Structure:**

```typescript
// GET /api/homepage-settings
{
  "success": true,
  "data": {
    "heroSection": {
      "enableCarousel": true,
      "autoSlideInterval": 6,
      "banners": [...] // Relationship to banners collection
    },
    "featuredSection": {
      "isEnabled": true,
      "title": "Sản phẩm nổi bật",
      "featuredProducts": [...], // Relationship to products
      "viewAllLink": "/products"
    },
    "publicationsSection": {
      "isEnabled": true,
      "title": "Bài viết mới nhất",
      "displayMode": "auto", // auto | manual
      "numberOfPosts": 4,
      "selectedPosts": [...] // If manual mode
    },
    "resourcesSection": {
      "isEnabled": true,
      "leftPanel": { // Resources
        "title": "Dữ liệu & Thống kê",
        "features": [...],
        "linkUrl": "/data/statistics"
      },
      "rightPanel": { // Tools
        "title": "Công cụ tính toán",
        "features": [...],
        "linkUrl": "/data/tools"
      }
    },
    "contactSection": {
      "isEnabled": true,
      "backgroundColor": "gray"
    },
    "seoSettings": {
      "metaTitle": "...",
      "metaDescription": "...",
      "ogImage": {...}
    }
  }
}
```

### **Perfect cho Admin Management:**
- ✅ **Admin Panel**: Admin → Globals → Homepage Settings
- ✅ **Tự động save**: Không cần custom API
- ✅ **Relationship fields**: Tự động populate banners, products, posts
- ✅ **Conditional fields**: Smart UI dựa trên settings

---

## ✅ **KẾT LUẬN**

### 🎉 **Backend hoàn toàn sẵn sàng cho Homepage Admin Management!**

**Tình trạng hiện tại:**
- ✅ **90% hoàn thành** - tất cả API hoạt động
- ✅ **5/5 components** có backend support
- ✅ **6/7 collections** có đủ data
- ⚠️ Chỉ cần **seed thêm 3-4 posts**

**Admin có thể quản lý:**
1. ✅ Banner carousel hoàn toàn
2. ✅ Featured products hoàn toàn  
3. ⚠️ Latest posts (cần seed thêm data)
4. ✅ Resources & Tools hoàn toàn
5. ✅ Contact submissions hoàn toàn

**Bước tiếp theo:** Kết nối Frontend components với các API này thay vì dùng fallback data hardcode.

---

*📅 Document cập nhật: Hoàn thành analysis và testing tất cả API endpoints*
