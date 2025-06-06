import { en } from '@payloadcms/translations/languages/en'
import { vi } from '@payloadcms/translations/languages/vi'

// Define types for better TypeScript support
type FieldTranslation = {
  [key: string]: string
}

type GeneralTranslation = {
  [key: string]: string
}

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
      projects: 'Dự án',
      resources: 'Tài nguyên',
      tools: 'Công cụ',
      banners: 'Banner',
      faqs: 'Câu hỏi thường gặp',
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
      status: 'Trạng thái',
      date: 'Ngày',
      tags: 'Thẻ',
      author: 'Tác giả',
      specifications: 'Thông số kỹ thuật',
      details: 'Chi tiết',
      overview: 'Tổng quan',
    },
    admin: {
      dashboard: 'Bảng điều khiển',
      collections: 'Bộ sưu tập',
      globals: 'Toàn cục',
      media: 'Phương tiện',
      users: 'Người dùng',
      createNew: 'Tạo mới',
      edit: 'Chỉnh sửa',
      delete: 'Xóa',
      save: 'Lưu',
      cancel: 'Hủy',
      search: 'Tìm kiếm',
      filter: 'Lọc',
      sort: 'Sắp xếp',
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
      projects: 'Projects',
      resources: 'Resources',
      tools: 'Tools',
      banners: 'Banners',
      faqs: 'Frequently Asked Questions',
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
      status: 'Status',
      date: 'Date',
      tags: 'Tags',
      author: 'Author',
      specifications: 'Specifications',
      details: 'Details',
      overview: 'Overview',
    },
    admin: {
      dashboard: 'Dashboard',
      collections: 'Collections',
      globals: 'Globals',
      media: 'Media',
      users: 'Users',
      createNew: 'Create New',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
    }
  },
  tr: {
    general: {
      company: 'Şirket',
      products: 'Ürünler',
      services: 'Hizmetler',
      about: 'Hakkında',
      contact: 'İletişim',
      news: 'Haberler',
      events: 'Etkinlikler',
      technologies: 'Teknolojiler',
      projects: 'Projeler',
      resources: 'Kaynaklar',
      tools: 'Araçlar',
      banners: 'Banner\'lar',
      faqs: 'Sık Sorulan Sorular',
    },
    fields: {
      name: 'Ad',
      title: 'Başlık',
      description: 'Açıklama',
      content: 'İçerik',
      image: 'Resim',
      price: 'Fiyat',
      category: 'Kategori',
      featured: 'Öne Çıkan',
      published: 'Yayınlanan',
      draft: 'Taslak',
      excerpt: 'Özet',
      slug: 'Slug',
      metadata: 'Metadata',
      seo: 'SEO',
      status: 'Durum',
      date: 'Tarih',
      tags: 'Etiketler',
      author: 'Yazar',
      specifications: 'Özellikler',
      details: 'Detaylar',
      overview: 'Genel Bakış',
    },
    admin: {
      dashboard: 'Kontrol Paneli',
      collections: 'Koleksiyonlar',
      globals: 'Genel',
      media: 'Medya',
      users: 'Kullanıcılar',
      createNew: 'Yeni Oluştur',
      edit: 'Düzenle',
      delete: 'Sil',
      save: 'Kaydet',
      cancel: 'İptal',
      search: 'Ara',
      filter: 'Filtrele',
      sort: 'Sırala',
    }
  }
}

// Multilingual configuration for Payload CMS
export const multilingualConfig = {
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
      },
      {
        label: 'Türkçe',
        code: 'tr',
      }
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
}

// Helper function to get localized field labels
export const getLocalizedLabels = (fieldName: string) => ({
  vi: (customTranslations.vi.fields as any)[fieldName] || fieldName,
  en: (customTranslations.en.fields as any)[fieldName] || fieldName,
  tr: (customTranslations.tr.fields as any)[fieldName] || fieldName,
})

// Helper function to get localized collection labels
export const getLocalizedCollectionLabels = (collectionName: string) => ({
  singular: {
    vi: (customTranslations.vi.general as any)[collectionName] || collectionName,
    en: (customTranslations.en.general as any)[collectionName] || collectionName,
    tr: (customTranslations.tr.general as any)[collectionName] || collectionName,
  },
  plural: {
    vi: (customTranslations.vi.general as any)[collectionName] || collectionName,
    en: (customTranslations.en.general as any)[collectionName] || collectionName,
    tr: (customTranslations.tr.general as any)[collectionName] || collectionName,
  },
})

export default multilingualConfig
