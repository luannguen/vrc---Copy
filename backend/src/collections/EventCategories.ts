import { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';
import { authenticatedOrPublished } from '../access/authenticatedOrPublished';
import { slugField } from '../fields/slug';

export const EventCategories: CollectionConfig = {
  slug: 'event-categories',
  labels: {
    singular: 'Danh mục sự kiện',
    plural: 'Danh mục sự kiện',
  },  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
    group: 'Sự kiện',
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Tên danh mục',
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
      label: 'Icon (CSS class hoặc Unicode)',
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Hiển thị nổi bật',
      defaultValue: false,
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự sắp xếp',
      defaultValue: 0,
      admin: {
        description: 'Số thấp hơn hiển thị trước',
      },
    },
    ...slugField('name'),
  ],
  timestamps: true,
};
