import { CollectionConfig } from 'payload';

export const FAQsMinimal: CollectionConfig = {
  slug: 'faqs-minimal',
  labels: {
    singular: 'FAQ Minimal',
    plural: 'FAQs Minimal',
  },
  admin: {
    useAsTitle: 'question',
  },
  access: {
    read: () => true, // Allow public read access
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Products',
          value: 'products',
        },
        {
          label: 'Services',
          value: 'services',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        {
          label: 'Published',
          value: 'published',
        },
        {
          label: 'Draft',
          value: 'draft',
        },
      ],
    },
  ],
};
