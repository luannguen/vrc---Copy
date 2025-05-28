import type { CollectionConfig } from 'payload'

type _SlugifyArgs = {
  data: {
    name?: string;
    slug?: string;
    slugUpdatedManually?: boolean;
    [key: string]: any;
  };
  operation: 'create' | 'update' | 'delete';
  originalDoc?: {
    name?: string;
    [key: string]: any;
  };
};

const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt'],
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
      label: 'Category Name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      label: 'Category Description',
      type: 'textarea',
      localized: true,
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
    }
  ],
  timestamps: true,
};

export default ProductCategories;
