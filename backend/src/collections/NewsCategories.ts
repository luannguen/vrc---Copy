import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const NewsCategories: CollectionConfig = {
  slug: 'news-categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    plural: 'Danh mục tin tức',
    singular: 'Danh mục tin tức',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
    group: 'Tin tức & Bài viết',
    description: 'Quản lý danh mục phân loại tin tức và bài viết.',
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
