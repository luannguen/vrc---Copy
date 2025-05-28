import type { CollectionConfig } from 'payload'

const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'sku', 'price', 'status', 'updatedAt'],
    preview: (doc) => {
      if (doc?.slug) {
        return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/products/${doc.slug}`;
      }
      return null;
    },
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      label: 'Product Description',
      type: 'richText',
      localized: true,
    },
    {
      name: 'sku',
      label: 'SKU',
      type: 'text',
      unique: true,
      admin: {
        description: 'Stock Keeping Unit, must be unique.',
      },
    },
    {
      name: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'currency',
      label: 'Currency',
      type: 'select',
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' },
      ],
      defaultValue: 'USD',
      required: true,
    },
    {
      name: 'images',
      label: 'Product Images',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'image',
          label: 'Image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'altText',
          label: 'Alt Text',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'categories',
      label: 'Categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'relatedProducts',
      label: 'Related Products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        };
      },
      admin: {
        position: 'sidebar',
        description: 'Select products that are related to this one.',
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          (args) => {
            if (args.operation === 'create' || args.operation === 'update') {
              const data = args.data || {};
              const originalDoc = args.originalDoc || {};
              
              if (data.name && (!data.slug || data.slug === '' || (originalDoc?.name !== data.name && !data.slugUpdatedManually))) {
                data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                data.slugUpdatedManually = false;
              }
            }
            return args.data;
          }
        ],
      },
    },
    {
        name: 'slugUpdatedManually',
        type: 'checkbox',
        admin: {
            hidden: true,
        }
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO',
          fields: [
            {
              name: 'metaTitle',
              label: 'Meta Title',
              type: 'text',
              localized: true,
            },
            {
              name: 'metaDescription',
              label: 'Meta Description',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'metaKeywords',
              label: 'Meta Keywords',
              type: 'text',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
};

export default Products;
