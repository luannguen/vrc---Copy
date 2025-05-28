import { CollectionConfig } from 'payload';
import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';
import { slugField } from '../../fields/slug';

// Example: Products collection với multilingual support
export const ProductsMultilingual: CollectionConfig = {
  slug: 'products',
  
  // Multilingual labels
  labels: {
    singular: {
      vi: 'Sản phẩm',
      en: 'Product',
    },
    plural: {
      vi: 'Sản phẩm',
      en: 'Products',
    },
  },

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'featured', 'status', 'updatedAt'],
    
    // Multilingual admin group
    group: {
      vi: 'Sản phẩm',
      en: 'Products',
    },
    
    description: {
      vi: 'Quản lý sản phẩm và thông tin liên quan',
      en: 'Manage products and related information',
    },
    
    listSearchableFields: ['name', 'description', 'excerpt', 'slug'],
    pagination: {
      defaultLimit: 20,
      limits: [10, 20, 50, 100],
    },
  },

  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },

  fields: [
    // Localized product name
    {
      name: 'name',
      type: 'text',
      label: {
        vi: 'Tên sản phẩm',
        en: 'Product Name',
      },
      admin: {
        placeholder: {
          vi: 'Nhập tên sản phẩm...',
          en: 'Enter product name...',
        },
      },
      localized: true, // This field will be translated
      required: true,
    },

    // Localized description
    {
      name: 'description',
      type: 'textarea',
      label: {
        vi: 'Mô tả sản phẩm',
        en: 'Product Description',
      },
      admin: {
        placeholder: {
          vi: 'Mô tả chi tiết về sản phẩm...',
          en: 'Detailed product description...',
        },
      },
      localized: true,
    },

    // Localized content (rich text)
    {
      name: 'content',
      type: 'richText',
      label: {
        vi: 'Nội dung chi tiết',
        en: 'Detailed Content',
      },
      localized: true,
    },

    // Localized excerpt
    {
      name: 'excerpt',
      type: 'textarea',
      label: {
        vi: 'Tóm tắt',
        en: 'Excerpt',
      },
      admin: {
        placeholder: {
          vi: 'Tóm tắt ngắn gọn...',
          en: 'Brief summary...',
        },
      },
      localized: true,
    },

    // Non-localized fields (same for all languages)
    {
      name: 'price',
      type: 'number',
      label: {
        vi: 'Giá (VNĐ)',
        en: 'Price (VND)',
      },
      admin: {
        placeholder: {
          vi: 'Nhập giá sản phẩm...',
          en: 'Enter product price...',
        },
      },
      // price is NOT localized - same for all languages
    },

    {
      name: 'sku',
      type: 'text',
      label: {
        vi: 'Mã sản phẩm',
        en: 'SKU',
      },
      admin: {
        placeholder: {
          vi: 'VD: SP001',
          en: 'e.g., SP001',
        },
      },
      // SKU is NOT localized
    },

    // Category relationship
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      label: {
        vi: 'Danh mục',
        en: 'Category',
      },
      admin: {
        placeholder: {
          vi: 'Chọn danh mục sản phẩm',
          en: 'Select product category',
        },
      },
      required: true,
    },

    // Featured image
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: {
        vi: 'Hình ảnh chính',
        en: 'Featured Image',
      },
    },

    // Gallery
    {
      name: 'gallery',
      type: 'array',
      label: {
        vi: 'Thư viện ảnh',
        en: 'Image Gallery',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: {
            vi: 'Hình ảnh',
            en: 'Image',
          },
        },
        {
          name: 'caption',
          type: 'text',
          label: {
            vi: 'Chú thích',
            en: 'Caption',
          },
          localized: true, // Caption can be translated
        },
      ],
    },

    // Features array
    {
      name: 'features',
      type: 'array',
      label: {
        vi: 'Tính năng',
        en: 'Features',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            vi: 'Tiêu đề tính năng',
            en: 'Feature Title',
          },
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: {
            vi: 'Mô tả tính năng',
            en: 'Feature Description',
          },
          localized: true,
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          label: {
            vi: 'Biểu tượng',
            en: 'Icon',
          },
        },
      ],
    },

    // Specifications group
    {
      type: 'group',
      name: 'specifications',
      label: {
        vi: 'Thông số kỹ thuật',
        en: 'Technical Specifications',
      },
      fields: [
        {
          name: 'dimensions',
          type: 'text',
          label: {
            vi: 'Kích thước',
            en: 'Dimensions',
          },
        },
        {
          name: 'weight',
          type: 'text',
          label: {
            vi: 'Trọng lượng',
            en: 'Weight',
          },
        },
        {
          name: 'power',
          type: 'text',
          label: {
            vi: 'Công suất',
            en: 'Power',
          },
        },
        {
          name: 'warranty',
          type: 'text',
          label: {
            vi: 'Bảo hành',
            en: 'Warranty',
          },
          localized: true, // Warranty terms might be different
        },
      ],
    },

    // Status flags
    {
      name: 'featured',
      type: 'checkbox',
      label: {
        vi: 'Sản phẩm nổi bật',
        en: 'Featured Product',
      },
      defaultValue: false,
    },

    {
      name: 'inStock',
      type: 'checkbox',
      label: {
        vi: 'Còn hàng',
        en: 'In Stock',
      },
      defaultValue: true,
    },

    // Slug field (localized)
    {
      ...slugField(),
      localized: true, // Different slug for each language
    },

    // SEO fields (localized)
    {
      type: 'group',
      name: 'seo',
      label: {
        vi: 'Tối ưu SEO',
        en: 'SEO Optimization',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: {
            vi: 'Tiêu đề Meta',
            en: 'Meta Title',
          },
          localized: true,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: {
            vi: 'Mô tả Meta',
            en: 'Meta Description',
          },
          localized: true,
        },
        {
          name: 'keywords',
          type: 'text',
          label: {
            vi: 'Từ khóa',
            en: 'Keywords',
          },
          localized: true,
        },
      ],
    },

    // Related products
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: {
        vi: 'Sản phẩm liên quan',
        en: 'Related Products',
      },
      admin: {
        position: 'sidebar',
      },
    },

    // Timestamps (auto-generated, not localized)
    {
      name: 'publishedDate',
      type: 'date',
      label: {
        vi: 'Ngày xuất bản',
        en: 'Published Date',
      },
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          if (!data.publishedDate) {
            data.publishedDate = new Date().toISOString();
          }
        }
        return data;
      },
    ],
  },

  timestamps: true,
};
