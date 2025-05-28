# VRC Frontend Multilingual Setup Guide

## ✅ Đã hoàn thành

### 1. Cài đặt Dependencies
```bash
npm install react-i18next i18next i18next-browser-languagedetector --legacy-peer-deps
```

### 2. Cấu hình i18next
- **File**: `src/i18n/config.ts`
- **Ngôn ngữ hỗ trợ**: Tiếng Việt (vi), English (en)
- **Ngôn ngữ mặc định**: Tiếng Việt
- **Lưu trữ**: localStorage

### 3. Translation Files
- **Tiếng Việt**: `src/i18n/locales/vi.json`
- **English**: `src/i18n/locales/en.json`

### 4. Components Created
- **LanguageSwitcher**: Component để chuyển đổi ngôn ngữ
- **MultilingualDemo**: Component demo để test multilingual
- **ExamplePage**: Component example với SEO hooks

### 5. Hooks
- **useMultilingual**: Hook để access i18next functions
- **useMultilingualSEO**: Hook để quản lý SEO đa ngôn ngữ

## 📖 Cách sử dụng

### 1. Basic Translation
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('hero.title' as any)}</h1>
      <p>{t('hero.subtitle' as any)}</p>
    </div>
  );
};
```

### 2. Language Switcher
```tsx
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

// Select variant
<LanguageSwitcher variant="select" />

// Button variant  
<LanguageSwitcher variant="button" />
```

### 3. SEO với Multilingual
```tsx
import { useMultilingualSEO } from '@/hooks/useMultilingualSEO';

const MyPage = () => {
  useMultilingualSEO({
    titleKey: 'pages.home.title',
    descriptionKey: 'pages.home.description'
  });
  
  return <div>...</div>;
};
```

### 4. Programmatic Language Change
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { i18n } = useTranslation();
  
  const changeToEnglish = () => {
    i18n.changeLanguage('en');
  };
  
  return <button onClick={changeToEnglish}>Switch to English</button>;
};
```

## 🎯 Features

### ✅ Hoàn thành
- [x] Cài đặt và cấu hình react-i18next
- [x] Language detection (localStorage, browser)
- [x] Language switching component
- [x] Translation files (vi/en)
- [x] Demo page (`/demo`)
- [x] SEO hooks cho multilingual
- [x] TypeScript support

### 🔄 Có thể mở rộng
- [ ] Thêm ngôn ngữ khác (ja, ko, zh, etc.)
- [ ] Lazy loading translations
- [ ] Namespace splitting
- [ ] RTL language support
- [ ] Tích hợp với backend API để load translations
- [ ] Translation management UI

## 🌐 Translation Keys Structure

```json
{
  "common": { /* Common words, buttons */ },
  "navigation": { /* Menu, breadcrumb */ },
  "header": { /* Site header */ },
  "hero": { /* Hero section */ },
  "footer": { /* Site footer */ },
  "forms": { /* Form labels, validation */ },
  "pages": { /* Page titles, descriptions */ },
  "products": { /* Product-related */ },
  "blog": { /* Blog-related */ },
  "contact": { /* Contact page */ }
}
```

## 🎨 Demo

Truy cập `/demo` để xem multilingual hoạt động:
- Language switcher (select và button)
- Translation examples
- Real-time language switching

## 🔧 Development Notes

1. **TypeScript**: Sử dụng `as any` để tránh strict type checking
2. **Fallback**: Mặc định về tiếng Việt nếu translation không tìm thấy
3. **Performance**: i18next không sử dụng Suspense mode
4. **Storage**: Language preference được lưu trong localStorage

Multilingual setup cho frontend VRC đã hoàn tất! 🎉
