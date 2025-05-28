import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'

// Custom translations cho VRC specific terms
export const customTranslations = {
  vi: {
    general: {
      company: 'Công ty',
      products: 'Sản phẩm',
      services: 'Dịch vụ',
      about: 'Giới thiệu',
      contact: 'Liên hệ',
      news: 'Tin tức',
      events: 'Sự kiện',
      technologies: 'Công nghệ',
    },
    fields: {
      name: 'Tên',
      title: 'Tiêu đề',
      description: 'Mô tả',
      content: 'Nội dung',
      image: 'Hình ảnh',
      price: 'Giá',
      category: 'Danh mục',
      featured: 'Nổi bật',
      published: 'Đã xuất bản',
      draft: 'Bản nháp',
      excerpt: 'Tóm tắt',
      slug: 'Đường dẫn',
      metadata: 'Metadata',
      seo: 'SEO',
    },
    admin: {
      dashboard: 'Bảng điều khiển',
      collections: 'Bộ sưu tập',
      globals: 'Toàn cục',
      media: 'Phương tiện',
      users: 'Người dùng',
    }
  },
  en: {
    general: {
      company: 'Company',
      products: 'Products',
      services: 'Services',
      about: 'About',
      contact: 'Contact',
      news: 'News',
      events: 'Events',
      technologies: 'Technologies',
    },
    fields: {
      name: 'Name',
      title: 'Title', 
      description: 'Description',
      content: 'Content',
      image: 'Image',
      price: 'Price',
      category: 'Category',
      featured: 'Featured',
      published: 'Published',
      draft: 'Draft',
      excerpt: 'Excerpt',
      slug: 'Slug',
      metadata: 'Metadata',
      seo: 'SEO',
    },
    admin: {
      dashboard: 'Dashboard',
      collections: 'Collections',
      globals: 'Globals', 
      media: 'Media',
      users: 'Users',
    }
  }
}

// Example multilingual payload config structure
// Note: This is just an example - you would merge these into your existing payload.config.ts
export const multilingualConfigExample = {
  // I18n for admin interface
  i18n: {
    supportedLanguages: { en, vi },
    fallbackLanguage: 'vi',
    translations: customTranslations,
  },
  
  // Localization for content data
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
  
  // ... merge with your existing config: db, secret, collections, etc.
}
