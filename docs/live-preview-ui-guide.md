# Live Preview UI Components Guide

## Tổng quan

Hệ thống Live Preview đã được nâng cấp với các giao diện đẹp và chuyên nghiệp cho tính năng xem trước khi tạo mới và cập nhật nội dung trong Payload CMS.

## Các Component Có Sẵn

### 1. EnhancedLivePreview
Giao diện đầy đủ với status bar hiện đại ở đầu trang.

**Sử dụng:**
```tsx
import { EnhancedLivePreview } from '@/components/LivePreviewListener'

<EnhancedLivePreview 
  customTitle={`Previewing: ${post.title}`}
  showStatus={true}
  showTitle={true}
  className="custom-class"
/>
```

**Props:**
- `className?: string` - CSS class tùy chỉnh
- `showStatus?: boolean` - Hiển thị trạng thái kết nối (default: true)
- `showTitle?: boolean` - Hiển thị tiêu đề (default: true)
- `customTitle?: string` - Tiêu đề tùy chỉnh (default: 'Live Preview Mode')

**Đặc điểm:**
- Status bar gradient đẹp ở đầu trang
- Hiển thị trạng thái kết nối real-time
- Responsive design
- Animation mượt mà

### 2. MinimalistLivePreview
Giao diện tối giản với indicator nhỏ gọn.

**Sử dụng:**
```tsx
import { MinimalistLivePreview } from '@/components/LivePreviewListener'

<MinimalistLivePreview 
  position="top-right" 
  variant="pill"
  className="custom-class"
/>
```

**Props:**
- `className?: string` - CSS class tùy chỉnh
- `position?: 'top' | 'bottom' | 'top-right' | 'top-left'` - Vị trí hiển thị (default: 'top-right')
- `variant?: 'pill' | 'badge' | 'minimal'` - Kiểu hiển thị (default: 'pill')

**Variants:**
- **pill**: Hình thuốc với text và thời gian
- **badge**: Hình huy hiệu nhỏ với text "LIVE"
- **minimal**: Chỉ hiển thị dot indicator

### 3. LivePreviewPanel
Panel floating với nhiều thông tin và controls.

**Sử dụng:**
```tsx
import { LivePreviewPanel } from '@/components/LivePreviewListener'

<LivePreviewPanel 
  documentTitle={page.title}
  documentType="Page"
  showMetrics={true}
  showActions={true}
/>
```

**Props:**
- `className?: string` - CSS class tùy chỉnh
- `documentTitle?: string` - Tên tài liệu (default: 'Document')
- `documentType?: string` - Loại tài liệu (default: 'Content')
- `showMetrics?: boolean` - Hiển thị metrics (default: true)
- `showActions?: boolean` - Hiển thị actions (default: true)

**Đặc điểm:**
- Panel floating ở góc phải dưới
- Có thể collapse/expand
- Hiển thị metrics (số lần refresh, thời gian update)
- Button refresh thủ công

### 4. LivePreviewToast
Toast notifications khi có sự kiện.

**Sử dụng:**
```tsx
import { LivePreviewToast } from '@/components/LivePreviewListener'

<LivePreviewToast 
  position="bottom-right"
  duration={3000}
  showOnConnect={true}
  showOnUpdate={true}
/>
```

**Props:**
- `className?: string` - CSS class tùy chỉnh
- `position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'` - Vị trí (default: 'bottom-right')
- `duration?: number` - Thời gian hiển thị toast (ms, default: 3000)
- `showOnConnect?: boolean` - Hiển thị toast khi kết nối (default: true)
- `showOnUpdate?: boolean` - Hiển thị toast khi update (default: true)

## Cách Sử dụng Trong Dự Án

### 1. Cho Posts (Bài viết)
```tsx
// Trong src/app/(frontend)/posts/[slug]/page.tsx
{draft && (
  <EnhancedLivePreview 
    customTitle={`Previewing: ${post.title}`}
    showStatus={true}
    showTitle={true}
  />
)}
```

### 2. Cho Pages (Trang)
```tsx
// Trong src/app/(frontend)/[slug]/page.tsx
{draft && (
  <LivePreviewPanel 
    documentTitle={page.title || 'Page'}
    documentType="Page"
    showMetrics={true}
    showActions={true}
  />
)}
```

### 3. Cho Admin Interface
```tsx
// Sử dụng trong các component admin
<MinimalistLivePreview 
  position="top-right" 
  variant="badge"
/>
```

## Tùy Chỉnh CSS

Tất cả components đều sử dụng CSS-in-JS với styled-jsx, có thể override bằng cách:

```tsx
<EnhancedLivePreview 
  className="my-custom-preview"
/>

<style jsx global>{`
  .my-custom-preview .live-preview-status-bar {
    background: linear-gradient(135deg, #your-color-1, #your-color-2);
  }
`}</style>
```

## Dark Mode Support

Tất cả components đều hỗ trợ dark mode tự động thông qua `@media (prefers-color-scheme: dark)`.

## Responsive Design

Các components đều được thiết kế responsive:
- Desktop: Hiển thị đầy đủ thông tin
- Tablet: Điều chỉnh spacing và font size
- Mobile: Ẩn một số thông tin không cần thiết, tối ưu cho touch

## Performance Notes

- Tất cả components sử dụng `'use client'` directive
- Lazy loading cho animations
- Debounced refresh để tránh spam requests
- Memory cleanup khi unmount

## Backward Compatibility

Component gốc `LivePreviewListener` vẫn được giữ để tương thích với code cũ:

```tsx
import { LivePreviewListener } from '@/components/LivePreviewListener'

// Vẫn hoạt động như cũ
{draft && <LivePreviewListener />}
```

## Recommendations

### Cho Posts/Articles:
- Sử dụng `EnhancedLivePreview` để có trải nghiệm tốt nhất
- Hiển thị title của bài viết trong preview

### Cho Pages:
- Sử dụng `LivePreviewPanel` để có control panel chi tiết
- Hoặc `MinimalistLivePreview` nếu muốn đơn giản

### Cho Admin Interface:
- Sử dụng `MinimalistLivePreview` với variant="badge"
- Position phù hợp để không che admin UI

### Cho Development/Testing:
- Sử dụng `LivePreviewToast` để debug và theo dõi events
