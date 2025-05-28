import { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';
import { authenticatedOrPublished } from '../access/authenticatedOrPublished';
import { slugField } from '../fields/slug';

export const Events: CollectionConfig = {
  slug: 'events',
  labels: {
    singular: 'Sự kiện',
    plural: 'Sự kiện',
  },  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'categories', 'startDate', 'location', 'status'],
    group: 'Sự kiện',
    description: 'Quản lý sự kiện và thông tin liên quan',
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
      label: 'Tên sự kiện',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Tóm tắt',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      label: 'Hình ảnh',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      label: 'Ngày bắt đầu',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Ngày kết thúc',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Địa điểm',
      required: true,
    },
    {
      name: 'organizer',
      type: 'text',
      label: 'Đơn vị tổ chức',
      required: true,
    },    {
      name: 'categories',
      type: 'relationship',
      label: 'Danh mục sự kiện',
      relationTo: 'event-categories' as any,
      hasMany: true,
      required: true,
      admin: {
        description: 'Chọn một hoặc nhiều danh mục cho sự kiện',
      },
    },
    // Giữ lại trường cũ để đảm bảo tương thích với dữ liệu hiện có
    {
      name: 'eventType',
      type: 'select',
      label: 'Loại sự kiện (cũ)',
      options: [
        {
          label: 'Triển lãm',
          value: 'exhibition',
        },
        {
          label: 'Hội thảo',
          value: 'workshop',
        },
        {
          label: 'Đào tạo',
          value: 'training',
        },
        {
          label: 'Hội nghị',
          value: 'conference',
        },
        {
          label: 'Khác',
          value: 'other',
        },
      ],
      admin: {
        description: 'Trường này được giữ lại để tương thích với dữ liệu cũ. Vui lòng sử dụng Danh mục sự kiện ở trên.',
        position: 'sidebar',
      },
    },
    {
      name: 'participants',
      type: 'number',
      label: 'Số lượng người tham dự dự kiến',
      min: 0,
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Thẻ',
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      options: [
        {
          label: 'Sắp diễn ra',
          value: 'upcoming',
        },
        {
          label: 'Đang diễn ra',
          value: 'ongoing',
        },
        {
          label: 'Đã kết thúc',
          value: 'past',
        },
      ],
      defaultValue: 'upcoming',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Sự kiện nổi bật',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishStatus',
      type: 'select',
      label: 'Trạng thái xuất bản',
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
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField('title'),
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-determine event status based on dates
        const now = new Date();
        const startDate = new Date(data.startDate);
        const endDate = new Date(data.endDate);
        
        let status = 'upcoming';
        if (now >= startDate && now <= endDate) {
          status = 'ongoing';
        } else if (now > endDate) {
          status = 'past';
        }
        
        return { 
          ...data, 
          status 
        };
      },
    ],
  },
};
