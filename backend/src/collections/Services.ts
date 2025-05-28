import { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';
import { authenticatedOrPublished } from '../access/authenticatedOrPublished';
import { slugField } from '../fields/slug';

export const Services: CollectionConfig = {
  slug: 'services',
  labels: {
    singular: 'Dịch vụ',
    plural: 'Dịch vụ',
  },  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'order'],
    group: 'Dịch vụ',
    description: 'Quản lý dịch vụ và thông tin liên quan',
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
      label: 'Tên dịch vụ',
      required: true,
    },
    ...slugField('title'),
    {
      name: 'type',
      type: 'select',
      label: 'Loại dịch vụ',
      required: true,
      options: [
        {
          label: 'Tư vấn',
          value: 'consulting',
        },
        {
          label: 'Lắp đặt',
          value: 'installation',
        },
        {
          label: 'Bảo trì',
          value: 'maintenance',
        },
        {
          label: 'Sửa chữa',
          value: 'repair',
        },
        {
          label: 'Hỗ trợ kỹ thuật',
          value: 'support',
        },
        {
          label: 'Khác',
          value: 'other',
        },
      ],
      defaultValue: 'other',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Tóm tắt',
      admin: {
        description: 'Mô tả ngắn gọn hiển thị trong danh sách dịch vụ',
      },
    },
    {
      name: 'icon',
      type: 'upload',
      label: 'Icon',
      relationTo: 'media',
      admin: {
        description: 'Icon đại diện cho dịch vụ',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      label: 'Hình ảnh chính',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung chi tiết',
    },
    {
      name: 'features',
      type: 'array',
      label: 'Tính năng',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Tên tính năng',
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
          label: 'Icon (tùy chọn)',
          admin: {
            description: 'Nhập tên icon từ thư viện icon (ví dụ: check, star, etc.)',
          },
        },
      ],
    },
    {
      name: 'benefits',
      type: 'array',
      label: 'Lợi ích',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Lợi ích',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Mô tả',
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Giá dịch vụ',
      fields: [
        {
          name: 'showPricing',
          type: 'checkbox',
          label: 'Hiển thị giá',
          defaultValue: false,
        },
        {
          name: 'priceType',
          type: 'select',
          label: 'Loại giá',
          options: [
            {
              label: 'Giá cố định',
              value: 'fixed',
            },
            {
              label: 'Giá theo giờ',
              value: 'hourly',
            },
            {
              label: 'Giá tùy chỉnh',
              value: 'custom',
            },
          ],
          defaultValue: 'custom',
          admin: {
            condition: (data, siblingData) => siblingData?.showPricing,
          },
        },
        {
          name: 'price',
          type: 'number',
          label: 'Giá (VND)',
          admin: {
            condition: (data, siblingData) => siblingData?.showPricing && siblingData?.priceType !== 'custom',
          },
        },
        {
          name: 'customPrice',
          type: 'text',
          label: 'Giá tùy chỉnh',
          admin: {
            description: 'Ví dụ: "Liên hệ để có giá tốt nhất", "Từ 5 triệu đồng"',
            condition: (data, siblingData) => siblingData?.showPricing && siblingData?.priceType === 'custom',
          },
        },
        {
          name: 'currency',
          type: 'select',
          label: 'Đơn vị tiền tệ',
          options: [
            {
              label: 'VND',
              value: 'VND',
            },
            {
              label: 'USD',
              value: 'USD',
            },
          ],
          defaultValue: 'VND',
          admin: {
            condition: (data, siblingData) => siblingData?.showPricing && siblingData?.priceType !== 'custom',
          },
        },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      label: 'Câu hỏi thường gặp',
      fields: [
        {
          name: 'question',
          type: 'text',
          label: 'Câu hỏi',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Trả lời',
          required: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự hiển thị',
      defaultValue: 99,
      admin: {
        position: 'sidebar',
        description: 'Số càng nhỏ thì hiển thị càng trước',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Dịch vụ nổi bật',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Đánh dấu là dịch vụ nổi bật để hiện trên trang chủ',
      },
    },    {      name: 'relatedServices',
      type: 'relationship',
      label: 'Dịch vụ liên quan',
      relationTo: 'services',
      hasMany: true,
      admin: {
        description: 'Chọn các dịch vụ liên quan để hiển thị phía dưới',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      required: true,
      options: [
        {
          label: 'Bản nháp',
          value: 'draft',
        },
        {
          label: 'Đã xuất bản',
          value: 'published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'meta',      type: 'group',
      label: 'SEO & Metadata',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'image',
          type: 'upload',
          label: 'Meta Image',
          relationTo: 'media',
        },
      ],
    },
  ],
};
