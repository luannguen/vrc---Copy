import type { CollectionConfig } from 'payload'
import { authenticated } from '../access/authenticated'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'

export const AdminGuides: CollectionConfig = {
  slug: 'admin-guides',
  labels: {
    singular: 'Hướng dẫn Admin',
    plural: 'Hướng dẫn Admin',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'difficulty', 'featured', 'status', 'updatedAt'],
    group: 'Hệ thống',
    description: 'Quản lý tài liệu hướng dẫn sử dụng admin dashboard',
    listSearchableFields: ['title', 'summary', 'content', 'tags'],
    pagination: {
      defaultLimit: 20,
      limits: [10, 20, 50, 100],
    },
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề hướng dẫn',
      required: true,
      localized: true,
      admin: {
        description: 'Tiêu đề chính của hướng dẫn',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Tóm tắt',
      required: true,
      localized: true,
      admin: {
        description: 'Mô tả ngắn gọn về nội dung hướng dẫn',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Danh mục',
      required: true,
      options: [
        {
          label: 'Getting Started',
          value: 'getting-started',
        },
        {
          label: 'Collections',
          value: 'collections',
        },
        {
          label: 'Globals',
          value: 'globals',
        },
        {
          label: 'Dashboard',
          value: 'dashboard',
        },
        {
          label: 'Settings',
          value: 'settings',
        },
        {
          label: 'Media',
          value: 'media',
        },
        {
          label: 'Development',
          value: 'development',
        },
        {
          label: 'Advanced',
          value: 'advanced',
        },
        {
          label: 'Troubleshooting',
          value: 'troubleshooting',
        },
      ],
      admin: {
        description: 'Phân loại hướng dẫn theo chức năng',
      },
    },
    {
      name: 'difficulty',
      type: 'select',
      label: 'Độ khó',
      required: true,
      defaultValue: 'beginner',
      options: [
        {
          label: 'Cơ bản',
          value: 'beginner',
        },
        {
          label: 'Trung bình',
          value: 'intermediate',
        },
        {
          label: 'Nâng cao',
          value: 'advanced',
        },
      ],
      admin: {
        description: 'Mức độ khó của hướng dẫn',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung chi tiết',
      required: true,
      localized: true,
      admin: {
        description: 'Nội dung hướng dẫn chi tiết với định dạng rich text',
      },
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Các bước thực hiện',
      admin: {
        description: 'Danh sách các bước thực hiện theo thứ tự',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'stepTitle',
          type: 'text',
          label: 'Tiêu đề bước',
          required: true,
          localized: true,
        },
        {
          name: 'stepDescription',
          type: 'richText',
          label: 'Mô tả chi tiết',
          required: true,
          localized: true,
        },
        {
          name: 'codeExample',
          type: 'code',
          label: 'Ví dụ code',
          admin: {
            language: 'javascript',
            description: 'Code ví dụ cho bước này (nếu có)',
          },
        },
        {
          name: 'screenshot',
          type: 'upload',
          label: 'Ảnh minh họa',
          relationTo: 'media',
          admin: {
            description: 'Ảnh chụp màn hình minh họa cho bước này',
          },
        },
        {
          name: 'tips',
          type: 'textarea',
          label: 'Tips & Lưu ý',
          localized: true,
          admin: {
            description: 'Mẹo và lưu ý quan trọng cho bước này',
          },
        },
      ],
    },
    {
      name: 'screenshots',
      type: 'array',
      label: 'Ảnh minh họa',
      admin: {
        description: 'Thư viện ảnh minh họa cho hướng dẫn',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          label: 'Hình ảnh',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Chú thích',
          localized: true,
        },
        {
          name: 'altText',
          type: 'text',
          label: 'Alt text',
          required: true,
          admin: {
            description: 'Mô tả ảnh cho accessibility',
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Thẻ tìm kiếm',
      admin: {
        description: 'Các từ khóa để tìm kiếm hướng dẫn',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'relatedGuides',
      type: 'relationship',
      label: 'Hướng dẫn liên quan',
      relationTo: 'admin-guides',
      hasMany: true,
      admin: {
        description: 'Các hướng dẫn liên quan khác',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Hiển thị nổi bật',
      defaultValue: false,
      admin: {
        description: 'Hiển thị trong danh sách hướng dẫn nổi bật',
        position: 'sidebar',
      },
    },
    {
      name: 'estimatedTime',
      type: 'number',
      label: 'Thời gian ước tính (phút)',
      min: 1,
      max: 120,
      admin: {
        description: 'Thời gian dự kiến để hoàn thành hướng dẫn (tính bằng phút)',
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự sắp xếp',
      admin: {
        description: 'Số thứ tự để sắp xếp hướng dẫn (số nhỏ hơn hiển thị trước)',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Bản nháp',
          value: 'draft',
        },
        {
          label: 'Đã xuất bản',
          value: 'published',
        },
        {
          label: 'Đã ẩn',
          value: 'hidden',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'lastReviewed',
      type: 'date',
      label: 'Lần review cuối',
      admin: {
        description: 'Ngày review và cập nhật nội dung lần cuối',
        position: 'sidebar',
      },
    },
    {
      name: 'version',
      type: 'text',
      label: 'Phiên bản Payload',
      admin: {
        description: 'Phiên bản Payload CMS mà hướng dẫn này áp dụng',
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-generate order if not provided
        if (operation === 'create' && !data.order) {
          data.order = Math.floor(Date.now() / 1000)
        }

        // Auto-update lastReviewed when content changes
        if (data.content || data.steps) {
          data.lastReviewed = new Date().toISOString()
        }

        // Auto-set version if not provided
        if (!data.version) {
          data.version = '3.39.1'
        }

        return data
      },
    ],
  },
  timestamps: true,
}
