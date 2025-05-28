# Giải quyết React Hydration Errors trong Next.js & Payload CMS

## Vấn đề 

React Hydration Errors xảy ra khi HTML được tạo bởi server khác với HTML được yêu cầu tạo bởi client sau khi hydration. Điều này thường xảy ra với các component truy cập DOM, browser APIs, hoặc có trạng thái khác nhau giữa server và client.

Thông báo lỗi thường gặp:
```
Text content does not match server-rendered HTML.
Hydration failed because the initial UI does not match what was rendered on the server.
There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering.
```

## Các nguyên nhân phổ biến

1. **Truy cập trực tiếp đến Browser APIs** (`window`, `document`, `localStorage`, v.v.)
2. **Random data** (`Math.random()`, `Date.now()`, `new Date()`)
3. **Extension browser** tự động inject attributes vào HTML
4. **Sử dụng conditional rendering** dựa vào client-side logic
5. **Truy cập DOM** trực tiếp trong quá trình render

## Giải pháp đã áp dụng

### 1. Component HydrationSafeWrapper

```tsx
// HydrationSafeWrapper.tsx
'use client'

import React, { useEffect, useState } from 'react'

export default function HydrationSafeWrapper({
  children,
  fallback = null,
  skipIfServer = true,
}) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted ? <>{children}</> : (skipIfServer ? null : <>{fallback}</>);
}
```

### 2. Sử dụng Dynamic Import với `ssr: false`

```tsx
// DynamicComponent.tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(
  () => import('./Component'),
  { ssr: false }
);

export default DynamicComponent;
```

### 3. Hoãn truy cập DOM trong useEffect

```tsx
// Ví dụ SidebarCustomization
useEffect(() => {
  if (!isMounted) return;
  
  // Truy cập DOM chỉ khi component đã mount
  const sidebar = document.querySelector('.sidebar');
  // ...
}, [isMounted]);
```

## Cấu trúc giải pháp

1. **Component gốc** - `Component.tsx`
   - Chứa logic cốt lõi
   - Sử dụng `isMounted` state để kiểm soát truy cập DOM

2. **Dynamic Wrapper** - `DynamicComponent.tsx`  
   - Import component gốc với `ssr: false`
   - Đảm bảo component chỉ được render ở client-side

3. **Registration** - `payload.config.ts`
   - Sử dụng Dynamic Wrapper thay vì component gốc

## Danh sách các component đã tối ưu

- ✅ `DynamicLogout` (Wraps `Logout`)
- ✅ `DynamicAdminStyleCustomization` (Wraps `AdminStyleCustomization`)
- ✅ `DynamicSidebarCustomization` (Wraps `SidebarCustomization`)

## Best Practices

1. **Không truy cập DOM trong quá trình render**
   - Luôn đặt logic DOM trong `useEffect` và kiểm tra `isMounted`

2. **Sử dụng `dynamic` import cho các component phụ thuộc vào browser**
   - `{ ssr: false }` để tránh render trên server

3. **Tách biệt UI và logic truy cập DOM**
   - Tách component thành các phần UI thuần túy và phần tương tác DOM

4. **Sử dụng `suppressHydrationWarning` một cách có chọn lọc**
   - Chỉ áp dụng cho các phần tử cụ thể không quan trọng, không dùng cho toàn bộ app

5. **Chuẩn bị fallback UI**
   - Hiển thị UI phù hợp khi component chưa mount

## Debugging

Nếu vẫn gặp hydration errors:

1. Sử dụng Chrome DevTools, tab Console để xem lỗi chi tiết
2. Tắt tạm các browser extensions
3. Kiểm tra console.log giữa server và client rendering có sự khác nhau không
4. Sử dụng React DevTools để debug component life cycle

## Resources

- [Next.js Docs - Handling Hydration Errors](https://nextjs.org/docs/messages/react-hydration-error)
- [React Docs - Hydration](https://react.dev/reference/react-dom/hydrate)
