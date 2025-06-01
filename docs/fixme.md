# VRC PAYLOAD CMS - FIXME & TROUBLESHOOTING GUIDE

**Last Updated: June 1, 2025**

**Recent Fixes Applied:**

- ✅ **About Page Media URL Fix**: Fixed hardcoded placeholder causing 500 errors by implementing proper API data usage and URL processing
- ✅ **CORS Logo Loading Fix**: Resolved logo display issues in Header and Footer components by adding CORS headers for static media files
- ✅ **Component API Standardization**: Unified Logo and Footer components to use the same API calling pattern with useCompanyInfo() hook
- ✅ **PayloadCMS Admin Panel Save Fix - Tools Collection**: Fixed form data parsing in custom API handlers to handle `_payload` field wrapper
- ✅ **Product Delete from Admin Edit View**: Fixed URL parameter extraction causing delete failures
- ✅ **Related Products Cleanup**: Enhanced beforeDelete hook with improved query logic
- ✅ **Admin Response Format**: Fixed formatAdminResponse to distinguish collection vs single document responses
- ✅ **React Hydration Mismatch - PostHero Component**: Fixed dynamic styling issues causing SSR/client differences
- ✅ **PayloadImageWrapper - Iframe Detection**: Replaced useEffect with CSS-based detection to prevent hydration mismatch
- ✅ **Remove fix-iframe-height.ts Script**: Eliminated problematic iframe height fixing script that caused DOM differences
- ✅ **CSS Styling Improvements**: Added `.hero-image-container` and `.payload-image-wrapper` classes for consistent rendering
- ✅ **Hydration Mismatch Issues**: Fixed Payload CMS GitHub issue #11066 with `suppressHydrationWarning: true` in config
- ✅ **PayloadImageWrapper Component**: Enhanced with hydration-safe iframe detection using data attributes
- ✅ **localAvatar.ts TypeScript Errors**: Fixed undefined username and color array access issues
- ✅ **CSS Iframe Detection**: Implemented fallback styles for iframe contexts before hydration completes
- ✅ **Tools Admin Integration**: Implemented complete CRUD API for Tools collection with routing conflict resolution
- ✅ **Lexical Rich Text Format Fix - About Page**: Fixed parsing error with Rich Text in seed API and admin interface
- ✅ **FormSubmissions Admin Group Integration**: Integrated built-in FormSubmissions into "Liên hệ & Phản hồi" group with ContactSubmissions for better admin organization

## ABOUT PAGE MEDIA URL FIX

### Vấn đề

Trang `/about` hiển thị lỗi `GET http://localhost:8081/api/placeholder/500/400 500 (Internal Server Error)` và không thể hiển thị hình ảnh background trong company history section.

### Nguyên nhân

1. **Hardcoded Placeholder URL**: Sử dụng `/api/placeholder/500/400` thay vì dữ liệu thực từ API
2. **Thiếu URL Processing**: `useAboutPage` hook không áp dụng `fixMediaUrl` utility như các components khác
3. **Không sử dụng API Data**: Background image không được lấy từ `heroSection.backgroundImage` data
4. **Port Mismatch**: Frontend chạy trên port 8081 nhưng API backend trên port 3000

### Giải pháp đã áp dụng

**1. Thay thế hardcoded placeholder với API data**

File: `vrcfrontend/src/pages/About.tsx`

```tsx
// OLD - Hardcoded placeholder causing 500 error
<img 
  src="/api/placeholder/500/400"
  alt="VRC Company History" 
  className="rounded-lg shadow-lg w-full h-auto"
/>

// NEW - Sử dụng data từ API với fallback an toàn
<img 
  src={data.heroSection?.backgroundImage?.url || "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=400&fit=crop&crop=center"}
  alt={data.heroSection?.backgroundImage?.alt || "VRC Company History"} 
  className="rounded-lg shadow-lg w-full h-auto"
/>
```

**2. Cập nhật useAboutPage hook để xử lý media URLs**

File: `vrcfrontend/src/hooks/useAboutPage.ts`

```typescript
import { fixMediaUrl } from '../utils/urlProcessor';

// Process media URLs to fix potential port issues
if (aboutData.heroSection?.backgroundImage?.url) {
  aboutData.heroSection.backgroundImage.url = fixMediaUrl(aboutData.heroSection.backgroundImage.url);
}

// Fix leadership image URLs
if (aboutData.leadership) {
  aboutData.leadership = aboutData.leadership.map((leader: Leader) => ({
    ...leader,
    image: leader.image ? {
      ...leader.image,
      url: fixMediaUrl(leader.image.url)
    } : leader.image
  }));
}
```

### Kết quả

- ✅ Không còn lỗi 500 từ placeholder URL
- ✅ Background image sử dụng data thực từ API về company history
- ✅ Leadership images được process đúng URL với `fixMediaUrl`
- ✅ Fallback an toàn từ Unsplash thay vì broken placeholder
- ✅ Áp dụng cùng pattern như các components khác (tuân thủ CORS Logo Loading Fix)
- ✅ Runtime logs xác nhận không còn errors

### Test Commands Đã Thực Hiện

```bash
# Test About page không còn lỗi 500 - ✅ PASSED
curl -I http://localhost:8081/about
# Result: HTTP/1.1 200 OK

# Test API endpoint hoạt động với heroSection data - ✅ PASSED  
curl -s http://localhost:3000/api/about-page | Select-String -Pattern "heroSection"
# Result: Trả về data với backgroundImage.url = "/api/media/file/tu-van-thiet-ke-he-thong-lanh-1.jpg"

# Test runtime errors - ✅ PASSED
# Console Ninja: No runtime errors detected
```

**Pattern này tuân thủ theo CORS Logo Loading Fix guidelines:**
- ✅ Sử dụng `fixMediaUrl` utility để xử lý URLs 
- ✅ Áp dụng pattern thống nhất cho tất cả media components
- ✅ Có fallback mechanism an toàn (Unsplash images)
- ✅ Fix URL để sử dụng đúng backend domain (port 3000 thay vì 8081)

## CORS LOGO LOADING FIX

### Vấn đề

Logo từ backend không hiển thị được trong Header và Footer components khi nhúng trên frontend, mặc dù có thể truy cập trực tiếp qua URL `http://localhost:3000/media/logo.svg` trong browser.

### Nguyên nhân

1. **CORS Headers Missing for Static Media**: Static media files không có CORS headers
2. **Inconsistent API Calling Pattern**: Logo và Footer components sử dụng patterns khác nhau để gọi API
3. **TypeScript Type Issues**: API service có type `any` gây warnings

### Giải pháp đã áp dụng

**1. Cập nhật Middleware CORS Configuration**

File: `backend/src/middleware.ts`

```typescript
export const config = {
  matcher: [
    '/api/:path*',
    '/media/:path*',  // ← Thêm matcher cho static media files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}

export function middleware(request: NextRequest) {
  // Handle CORS for both API and media requests
  if (request.nextUrl.pathname.startsWith('/api/') || request.nextUrl.pathname.startsWith('/media/')) {
    // Đã thêm CORS headers cho media files
    response.headers.set('access-control-allow-origin', '*')
    response.headers.set('access-control-allow-methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    response.headers.set('access-control-allow-headers', 'Content-Type, Authorization, X-Requested-With, Accept, x-api-key, x-custom-header, cache-control')
  }
  // ...existing code...
}
```

**2. Chuẩn hóa API Calling Pattern**

- Cả Logo và Footer components đều sử dụng `useCompanyInfo()` hook
- Cả hai đều sử dụng `getLogoUrl()` function thống nhất
- Cả hai đều có error handling và fallback mechanism

**3. Fix TypeScript Types**

File: `vrcfrontend/src/lib/api.ts`

```typescript
// Thay thế 'any' bằng 'unknown' để type safety
class ApiService {
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers,
      });

      let data: unknown;
      // ...existing code...
      return data as T; // ← Type casting an toàn hơn
    } catch (error) {
      // Enhanced error handling
    }
  }
}
```

### Kết quả

- ✅ CORS headers đã được cấu hình cho `/media/*` endpoints
- ✅ Logo hiển thị chính xác trong cả Header và Footer
- ✅ Components sử dụng pattern API calling thống nhất
- ✅ TypeScript warnings đã được resolve
- ✅ Test curl xác nhận CORS headers hoạt động: `access-control-allow-origin: *`

### Test Commands

```bash
# Test CORS headers for logo
curl -I -H "Origin: http://localhost:5173" http://localhost:3000/media/logo.svg
# Expected: access-control-allow-origin: * in response headers
```

## ZALO CHAT WIDGET INTEGRATION - COMPLETED

### Tính năng mới

✅ **Zalo Official Account (OA) Chat Widget**: Tích hợp widget chat Zalo OA vào Header và Footer
✅ **Backend Schema Update**: Thêm trường `oaId` vào CompanyInfo schema cho Zalo OA ID
✅ **Frontend Components**: Tạo ZaloChatWidget component với Zalo Social SDK
✅ **Conditional Logic**: Hiển thị chat widget button khi có OA ID, fallback về traditional link khi không có
✅ **Responsive Design**: Widget responsive cho mobile và desktop
✅ **State Management**: Quản lý state mở/đóng widget trong Header và Footer

### Files Modified

- `backend/src/globals/CompanyInfo.ts` - Added `oaId` field to Zalo configuration
- `vrcfrontend/src/services/headerInfoService.ts` - Enhanced SocialLinks interface
- `vrcfrontend/src/components/ZaloChatWidget.tsx` - **NEW** Chat widget component
- `vrcfrontend/src/styles/zalo-chat-widget.css` - **NEW** Widget styling
- `vrcfrontend/src/components/Header.tsx` - Integrated chat widget
- `vrcfrontend/src/components/Footer.tsx` - Integrated chat widget

### Usage Guide

1. **Admin Setup**: In Payload CMS admin, go to Company Info > Social Media > Zalo > Enter OA ID
2. **Frontend Display**: Widget appears as chat bubble icon in header/footer when OA ID is configured
3. **User Experience**: Click icon opens chat overlay, click backdrop or X button to close

### Technical Implementation

- **SDK Integration**: Dynamically loads Zalo Social SDK from `https://sp.zalo.me/plugins/sdk.js`
- **Widget Initialization**: Uses `ZaloSocialSDK.init()` and `ZaloSocialSDK.openChatWidget()`
- **Error Handling**: Graceful fallback to traditional phone number link if OA ID not available
- **Performance**: SDK loaded only when widget is opened to optimize page load

## LEXICAL RICH TEXT FORMAT FIX - ABOUT PAGE

### Vấn đề
Admin panel hiển thị lỗi `parseEditorState: type "undefined" + not found` khi cố gắng phân tích nội dung Rich Text từ API seed About page trong Lexical editor.

### Nguyên nhân
1. **Cấu trúc Rich Text không đúng**: Định dạng Rich Text trong seed API About page không khớp với cấu trúc chuẩn của Lexical
2. **Thuộc tính `format` không hợp lệ**: Sử dụng `format: undefined` thay vì giá trị hợp lệ (`''` hoặc một trong các giá trị căn chỉnh)
3. **Thiếu Type Assertion**: Không có type assertion để đảm bảo tính tương thích với các giá trị enum hợp lệ

### Giải pháp đã áp dụng

**1. Sửa hàm `createRichText` trong seed API**

File: `backend/src/app/api/seed-about-page/route.ts`

```typescript
// Helper function to create proper Rich Text format
const createRichText = (text: string) => {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          version: 1,
          children: [
            {
              type: 'text',
              text: text,
              version: 1,
            },
          ],
        },
      ],
      direction: null,
      format: '' as "" | "left" | "start" | "center" | "right" | "end" | "justify" | undefined,
      indent: 0,
      version: 1,
    }
  };
};
```

### Kết quả
- ✅ Không còn lỗi TypeScript trong codebase
- ✅ Lexical editor có thể phân tích cấu trúc Rich Text từ API
- ✅ Admin panel có thể chỉnh sửa nội dung About page
- ✅ API seed-about-page hoạt động chính xác

## FORM SUBMISSIONS DUAL COLLECTION ISSUE - JUNE 1, 2025

### Vấn đề

Contact form submissions đang được lưu vào 2 collections khác nhau:
1. **`form-submissions`** (built-in từ formBuilderPlugin) - Payload CMS native collection
2. **`contact-submissions`** (custom collection) - Collection riêng với Vietnamese interface

Admin users muốn thấy tất cả contact submissions trong `contact-submissions` collection nhưng dữ liệu đang được phân tán.

### Nguyên nhân

1. **Dual API Architecture**: `/api/contact-form` ban đầu chỉ lưu vào `form-submissions`
2. **Plugin Integration**: FormSubmissions được tạo tự động bởi formBuilderPlugin
3. **Admin Interface**: ContactSubmissions có UI và fields tốt hơn cho Vietnamese context
4. **Data Separation**: Dữ liệu bị tách ra 2 nơi khác nhau

### Giải pháp tạm thời (CÁCH 1) - ĐÃ ÁP DỤNG

**File:** `backend/src/app/api/contact-form/route.ts`

Cập nhật API để lưu dữ liệu vào CẢ HAI collections:

```typescript
// Create form submission (original - for formBuilderPlugin)
const formSubmission = await payload.create({
  collection: 'form-submissions',
  data: {
    form: formToUse,
    submissionData,
  },
});

// ALSO create contact submission (for admin convenience)
const contactSubmission = await payload.create({
  collection: 'contact-submissions',
  data: {
    name,
    email,
    phone: phone || '',
    subject: subject || 'general',
    message,
    status: 'new',
  }
});
```

### Ưu điểm của giải pháp hiện tại

1. **✅ Immediate Solution**: Admin có thể thấy dữ liệu ngay trong `contact-submissions`
2. **✅ Backward Compatibility**: FormSubmissions vẫn hoạt động bình thường
3. **✅ Vietnamese Interface**: ContactSubmissions có labels và options tiếng Việt
4. **✅ No Breaking Changes**: Existing workflows không bị ảnh hưởng

### Vấn đề cần xem xét

1. **❌ Data Duplication**: Cùng một submission được lưu 2 lần
2. **❌ Sync Issues**: Nếu chỉnh sửa một collection, collection kia không được update
3. **❌ Storage Overhead**: Database size tăng do duplicate data
4. **❌ Maintenance**: Phải maintain 2 collections cùng lúc

### Các giải pháp tối ưu hơn (TODO)

**CÁCH 2: Migration Script + Single Collection**
```bash
# Migrate all form-submissions to contact-submissions
# Then update API to only use contact-submissions
# Remove form-submissions from admin interface
```

**CÁCH 3: Custom Admin View**
```typescript
// Create custom admin component that aggregates both collections
// Display unified view without data duplication
// Smart mapping between FormSubmissions and ContactSubmissions
```

**CÁCH 4: FormBuilder Plugin Override**
```typescript
// Override formBuilderPlugin to use custom ContactSubmissions
// Maintain single source of truth
// Leverage plugin features with custom collection
```

### Quyết định

- **Hiện tại**: Sử dụng CÁCH 1 (dual collection) cho immediate needs
- **Tương lai**: Evaluate CÁCH 3 (custom admin view) để tránh data duplication
- **Priority**: Medium (hoạt động được nhưng cần tối ưu hóa)

### Related Files

- `backend/src/app/api/contact-form/route.ts` - API endpoint with dual save
- `backend/src/collections/ContactSubmissions.ts` - Custom collection
- `backend/src/plugins/index.ts` - FormBuilder plugin config
- `docs/form-submissions-integration-guide.md` - Integration documentation

---