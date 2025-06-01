# VRC PAYLOAD CMS - FIXME & TROUBLESHOOTING GUIDE

**Last Updated: June 1, 2025**

**Recent Fixes Applied:**

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