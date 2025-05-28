import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    plural: 'Danh mục & Thẻ',
    singular: 'Danh mục/Thẻ',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'slug'],
    group: 'Danh mục & Phân loại',
    description: 'Quản lý tất cả các danh mục và thẻ trong hệ thống.',
    listSearchableFields: ['title', 'type', 'slug'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên danh mục/thẻ',
      required: true,
      admin: {
        description: 'Nhập tên của danh mục hoặc thẻ',
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Loại',
      options: [
        { label: 'Danh mục sản phẩm', value: 'category' },
        { label: 'Thẻ/Tag sản phẩm', value: 'tag' },
        { label: 'Danh mục tin tức', value: 'news_category' },
        { label: 'Danh mục dịch vụ', value: 'service_category' },
        { label: 'Danh mục sự kiện', value: 'event_category' },
        { label: 'Danh mục dự án', value: 'project_category' }
      ],
      defaultValue: 'category',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Chọn loại danh mục hoặc thẻ phù hợp với mục đích sử dụng.',
        style: {
          backgroundColor: '#f7f7f7',
          marginBottom: '20px',
          padding: '10px',
        },
      },
    },
    ...slugField(),
  ],
}
