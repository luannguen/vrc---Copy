import { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';
import { authenticatedOrPublished } from '../access/authenticatedOrPublished';

export const TechnologySections: CollectionConfig = {
  slug: 'technology-sections',
  labels: {
    singular: 'Phần trang Công nghệ',
    plural: 'Các phần trang Công nghệ',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'status', 'order'],
    group: 'Quản lý Trang Công nghệ',
    description: 'Quản lý nội dung các phần của trang Công nghệ & Đối tác',
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
      label: 'Tiêu đề',
      required: true,
    },
    {
      name: 'section',
      type: 'select',
      label: 'Phần trang',
      required: true,
      options: [
        {
          label: 'Hero Banner',
          value: 'hero',
        },
        {
          label: 'Giới thiệu công nghệ',
          value: 'overview',
        },
        {
          label: 'Danh mục thiết bị',
          value: 'equipment-categories',
        },
        {
          label: 'Đối tác công nghệ',
          value: 'partners',
        },
        {
          label: 'Lời kêu gọi hành động (CTA)',
          value: 'cta',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Phụ đề/Mô tả ngắn',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
      admin: {
        description: 'Nội dung chi tiết của phần này',
      },
    },
    {
      name: 'image',
      type: 'upload',
      label: 'Hình ảnh',
      relationTo: 'media',
      admin: {
        description: 'Hình ảnh minh họa cho phần này',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Tính năng/Điểm nổi bật',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tiêu đề tính năng',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (Lucide icon name)',
          admin: {
            description: 'Tên icon từ thư viện Lucide React (vd: CheckCircle, Cpu, Server)',
          },
        },
      ],
      admin: {
        condition: (data) => ['hero', 'overview'].includes(data.section),
      },
    },
    {
      name: 'equipmentItems',
      type: 'array',
      label: 'Danh sách thiết bị',
      fields: [
        {
          name: 'category',
          type: 'text',
          label: 'Danh mục thiết bị',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Các thiết bị',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Tên thiết bị',
              required: true,
            },
          ],
        },
      ],
      admin: {
        condition: (data) => data.section === 'equipment-categories',
      },
    },
    {
      name: 'partnerLogos',
      type: 'array',
      label: 'Logo đối tác',
      fields: [
        {
          name: 'partnerName',
          type: 'text',
          label: 'Tên đối tác',
          required: true,
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          required: true,
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website',
          admin: {
            description: 'URL website của đối tác (không bắt buộc)',
          },
        },
      ],
      admin: {
        condition: (data) => data.section === 'partners',
      },
    },
    {
      name: 'ctaButtons',
      type: 'array',
      label: 'Nút hành động',
      maxRows: 3,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Văn bản nút',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Liên kết',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Kiểu nút',
          options: [
            { label: 'Chính', value: 'default' },
            { label: 'Phụ', value: 'outline' },
            { label: 'Thứ cấp', value: 'secondary' },
          ],
          defaultValue: 'default',
        },
      ],
      admin: {
        condition: (data) => ['hero', 'cta'].includes(data.section),
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Màu nền',
      options: [
        { label: 'Trắng', value: 'white' },
        { label: 'Xám nhạt', value: 'muted' },
        { label: 'Primary', value: 'primary' },
        { label: 'Accent', value: 'accent' },
      ],
      defaultValue: 'white',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự hiển thị',
      defaultValue: 1,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      options: [
        {
          label: 'Nháp',
          value: 'draft',
        },
        {
          label: 'Xuất bản',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  versions: {
    drafts: true,
  },
};
