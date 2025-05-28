import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const ServiceCategories: CollectionConfig = {
  slug: 'service-categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    plural: 'Danh mục dịch vụ',
    singular: 'Danh mục dịch vụ',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Dịch vụ',
    description: 'Quản lý danh mục phân loại dịch vụ.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Tên danh mục',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
}
