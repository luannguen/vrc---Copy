# Hướng dẫn triển khai đa ngôn ngữ cho VRC

## 1. Cài đặt package

```bash
cd backend
pnpm install @payloadcms/translations
```

## 2. Cập nhật Payload Config

### payload.config.ts
```typescript
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'

export default buildConfig({
  // I18n cho giao diện admin
  i18n: {
    supportedLanguages: { en, vi },
    fallbackLanguage: 'vi',
  },
  
  // Localization cho nội dung
  localization: {
    locales: [
      {
        label: 'Tiếng Việt',
        code: 'vi',
      },
      {
        label: 'English', 
        code: 'en',
      }
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
  
  // ... existing config
})
```

## 3. Cập nhật Collections để hỗ trợ đa ngôn ngữ

### Ví dụ: Products Collection
```typescript
export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: {
      vi: 'Sản phẩm',
      en: 'Product',
    },
    plural: {
      vi: 'Sản phẩm', 
      en: 'Products',
    },
  },
  admin: {
    group: {
      vi: 'Sản phẩm',
      en: 'Products',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: {
        vi: 'Tên sản phẩm',
        en: 'Product Name',
      },
      localized: true, // Cho phép dịch field này
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        vi: 'Mô tả',
        en: 'Description',
      },
      localized: true,
    },
    {
      name: 'price', 
      type: 'number',
      label: {
        vi: 'Giá',
        en: 'Price',
      },
      // Giá không cần localized
    },
    // ... other fields
  ],
}
```

## 4. Cập nhật Frontend

### API Calls với locale
```typescript
// Lấy dữ liệu tiếng Việt
const response = await fetch('/api/products?locale=vi')

// Lấy dữ liệu tiếng Anh  
const response = await fetch('/api/products?locale=en')

// Fallback tiếng Việt nếu không có tiếng Anh
const response = await fetch('/api/products?locale=en&fallback-locale=vi')
```

### React Hook cho đa ngôn ngữ
```typescript
export const useProducts = (locale: string = 'vi') => {
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(`/api/products?locale=${locale}`)
      const data = await response.json()
      setProducts(data.docs)
    }
    
    fetchProducts()
  }, [locale])
  
  return { products }
}
```

## 5. Collections cần cập nhật

### Prioritized Collections (Ưu tiên cao):
1. **Posts** - Tin tức, bài viết
2. **Products** - Sản phẩm  
3. **Services** - Dịch vụ
4. **Pages** - Trang nội dung
5. **Events** - Sự kiện

### Categories Collections:
1. **Categories** - Danh mục bài viết
2. **ProductCategories** - Danh mục sản phẩm
3. **ServiceCategories** - Danh mục dịch vụ
4. **NewsCategories** - Danh mục tin tức

### Globals:
1. **Header** - Menu navigation
2. **Footer** - Footer links
3. **CompanyInfo** - Thông tin công ty

## 6. Phân giai đoạn triển khai

### Phase 1: Setup cơ bản (1-2 tuần)
- Cài đặt i18n và localization config
- Cập nhật 2-3 collections quan trọng nhất
- Test API với locale parameters

### Phase 2: Content Collections (2-3 tuần)
- Cập nhật Posts, Products, Services
- Migrate existing data
- Cập nhật frontend hooks

### Phase 3: Categories & Globals (1-2 tuần)  
- Cập nhật các categories
- Cập nhật Header, Footer globals
- Frontend language switcher

### Phase 4: Polish & Testing (1 tuần)
- Custom translations cho admin UI
- SEO metadata cho multiple locales
- Comprehensive testing

## 7. Advantages với Payload

✅ **Native support** - Không cần plugin
✅ **Field-level localization** - Control từng field
✅ **API auto-handling** - API tự động xử lý locale
✅ **Admin UI multilingual** - Giao diện admin đa ngôn ngữ
✅ **Fallback mechanism** - Tự động fallback khi thiếu translation
✅ **SEO friendly** - Metadata cho từng ngôn ngữ

## 8. Considerations

⚠️ **Database size** - Sẽ tăng do lưu multiple versions
⚠️ **Content management** - Cần train editors
⚠️ **Development time** - Initial setup và migration
⚠️ **Cache strategy** - Cần update cache cho multiple locales
