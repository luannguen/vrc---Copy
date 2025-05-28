import { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';
import { authenticatedOrPublished } from '../access/authenticatedOrPublished';
import { slugField } from '../fields/slug';

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Dự án',
    plural: 'Dự án',
  },  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'status', 'updatedAt'],
    group: 'Dự án',
    description: 'Quản lý dự án và thông tin liên quan',
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
      label: 'Tên dự án',
      required: true,
    },
    ...slugField('title'),
    {
      name: 'client',
      type: 'text',
      label: 'Khách hàng',
      admin: {
        description: 'Tên công ty hoặc tổ chức khách hàng',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Địa điểm',
      admin: {
        description: 'Vị trí địa lý của dự án',
      },
    },
    {
      name: 'timeframe',
      type: 'group',
      label: 'Thời gian dự án',
      fields: [
        {          name: 'startDate',
          type: 'date',
          label: 'Ngày bắt đầu',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {          name: 'endDate',
          type: 'date',
          label: 'Ngày kết thúc',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'isOngoing',
          type: 'checkbox',
          label: 'Đang thực hiện',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Tóm tắt dự án',
      admin: {
        description: 'Mô tả ngắn gọn hiển thị trong danh sách dự án',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung chi tiết',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      label: 'Hình ảnh chính',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Thư viện ảnh',
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
        },
      ],
    },
    {
      name: 'services',
      type: 'select',
      label: 'Dịch vụ liên quan',
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
      ],
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },    {
      name: 'categories',
      type: 'relationship',
      label: 'Danh mục dự án',
      relationTo: 'project-categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Chọn danh mục cho dự án này',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Dự án nổi bật',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Đánh dấu là dự án nổi bật để hiện trên trang chủ',
      },
    },
    {
      name: 'testimonial',
      type: 'group',
      label: 'Đánh giá khách hàng',
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          label: 'Lời đánh giá',
        },
        {
          name: 'author',
          type: 'text',
          label: 'Người đánh giá',
        },
        {
          name: 'position',
          type: 'text',
          label: 'Chức vụ',
        },
      ],
      admin: {
        description: 'Đánh giá của khách hàng về dự án (nếu có)',
      },
    },
    {      name: 'relatedProjects',
      type: 'relationship',
      label: 'Dự án liên quan',
      relationTo: ['projects'],
      hasMany: true,
      admin: {
        description: 'Chọn các dự án liên quan để hiển thị phía dưới',
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
