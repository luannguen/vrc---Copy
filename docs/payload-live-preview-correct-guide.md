# Payload Live Preview - Correct Implementation Guide

## Hiểu đúng về Live Preview trong Payload

Sau khi đọc tài liệu chính thức, chúng ta hiểu rằng:

### 1. Live Preview hoạt động như thế nào?

- **Iframe trong Admin Panel**: Live Preview chạy trong iframe của admin panel, không phải trực tiếp trên frontend
- **Window PostMessage**: Admin panel gửi events qua `window.postMessage` khi document thay đổi
- **RefreshRouteOnSave**: Component này **chỉ return null** và lắng nghe events để refresh route

### 2. Lỗi trong approach trước đây

- ❌ **Tạo quá nhiều UI components** không cần thiết
- ❌ **CSS không có tác dụng** vì component không render UI
- ❌ **Hiểu sai cách hoạt động** của live preview
- ❌ **Z-index conflicts** do không hiểu bản chất

### 3. Cách implement đúng

#### Basic Implementation (Recommended)
```tsx
import { LivePreviewListener } from '@/components/LivePreviewListener'

// Trong page component
{draft && <LivePreviewListener />}
```

#### With Visual Indicator (Optional)
```tsx
import { LivePreviewListenerWithIndicator } from '@/components/LivePreviewListener'

// Trong page component
{draft && (
  <LivePreviewListenerWithIndicator 
    showIndicator={true}
    indicatorPosition="top-right"
    indicatorText="Live Preview Active"
  />
)}
```

### 4. Key Components

#### LivePreviewListener
- Standard Payload component
- Return null, chỉ lắng nghe window.postMessage
- Refresh route khi nhận events từ admin panel

#### LivePreviewListenerWithIndicator
- Extends standard component
- Thêm visual indicator nhỏ gọn
- Không can thiệp vào layout chính

### 5. Admin Panel Configuration

Live preview được config trong `payload.config.ts`:

```ts
admin: {
  livePreview: {
    url: 'http://localhost:3000',
    collections: ['posts', 'pages'],
    breakpoints: [
      {
        label: 'Mobile',
        name: 'mobile',
        width: 375,
        height: 667,
      },
    ],
  },
}
```

### 6. Package Requirements

```bash
npm install @payloadcms/live-preview-react
```

### 7. Environment Variables

```env
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3000/api
```

### 8. Best Practices

1. **Keep it simple**: Chỉ dùng standard components
2. **Minimal UI**: Nếu cần visual indicator, giữ nhỏ gọn
3. **No layout interference**: Không làm ảnh hưởng đến layout chính
4. **Draft mode only**: Chỉ hiển thị trong draft mode

### 9. Example Usage

#### Posts Page
```tsx
import { draftMode } from 'next/headers'
import { LivePreviewListenerWithIndicator } from '@/components/LivePreviewListener'

export default async function Post({ params }) {
  const { isEnabled: draft } = await draftMode()
  const post = await getPost(params.slug)

  return (
    <article>
      {draft && (
        <LivePreviewListenerWithIndicator 
          showIndicator={true}
          indicatorPosition="top-right"
          indicatorText={`Previewing: ${post.title}`}
        />
      )}
      
      <PostContent post={post} />
    </article>
  )
}
```

#### Pages Page
```tsx
import { draftMode } from 'next/headers'
import { LivePreviewListenerWithIndicator } from '@/components/LivePreviewListener'

export default async function Page({ params }) {
  const { isEnabled: draft } = await draftMode()
  const page = await getPage(params.slug)

  return (
    <main>
      {draft && (
        <LivePreviewListenerWithIndicator 
          showIndicator={true}
          indicatorPosition="bottom-right"
          indicatorText={`Previewing: ${page.title}`}
        />
      )}
      
      <PageContent page={page} />
    </main>
  )
}
```

### 10. Visual Indicator Positions

- `top-left`
- `top-right` 
- `bottom-left`
- `bottom-right`

### 11. Troubleshooting

#### Live Preview không hoạt động
1. Kiểm tra config trong payload.config.ts
2. Kiểm tra NEXT_PUBLIC_PAYLOAD_URL
3. Kiểm tra draft mode có enabled không
4. Kiểm tra CSP headers

#### Indicator không hiển thị
1. Chỉ hiển thị trong draft mode
2. Kiểm tra z-index conflicts
3. Kiểm tra responsive breakpoints

### 12. Limitations

- Chỉ hoạt động trong iframe của admin panel
- Không thể custom CSS của admin panel từ frontend
- Visual indicator chỉ mang tính thông báo, không có chức năng admin

### 13. Summary

Live Preview trong Payload là một tính năng đơn giản nhưng mạnh mẽ. Key là hiểu đúng cách hoạt động và không over-engineer. Component chính chỉ cần lắng nghe events và refresh route, không cần UI phức tạp.
