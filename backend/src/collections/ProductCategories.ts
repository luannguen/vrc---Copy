import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from '@/fields/slug'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,  },
  labels: {
    plural: 'Danh mục sản phẩm',
    singular: 'Danh mục sản phẩm',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'parent', 'showInMenu', 'orderNumber'],
    group: 'Sản phẩm',
    description: 'Quản lý danh mục phân loại sản phẩm.',
    listSearchableFields: ['title', 'description', 'slug'],
    components: {
      // Define custom components for the collection UI
      // Note: In Payload, view components should follow specific structure
      views: {
        edit: {
          // Edit view customizations here
        },
        list: {
          // List view customizations here
        }
      }
    }
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
        description: 'Mô tả ngắn gọn về danh mục này',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      label: 'Danh mục cha',
      relationTo: 'product-categories',
      admin: {
        position: 'sidebar',
        description: 'Chọn danh mục cha (nếu có) để tạo cấu trúc phân cấp',
        condition: (data) => {
          // Không cho phép chọn chính nó làm danh mục cha
          return !data.id;
        },
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      label: 'Hình ảnh đại diện',
      relationTo: 'media',
      admin: {
        description: 'Hình ảnh hiển thị cho danh mục này',
      },
    },
    {
      name: 'showInMenu',
      type: 'checkbox',
      label: 'Hiển thị trong menu',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Hiển thị danh mục này trong menu chính',
        style: {
          marginTop: '15px',
          padding: '10px',
          backgroundColor: 'var(--theme-elevation-50)',
          borderRadius: '4px',
        },
      },
    },
    {
      name: 'orderNumber',
      type: 'number',
      label: 'Thứ tự hiển thị',
      admin: {
        position: 'sidebar',
        description: 'Số thấp hơn sẽ hiển thị trước',
        style: {
          marginBottom: '15px',
        },
      },
      defaultValue: 999,
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Kiểm tra và ngăn chặn cyclic dependencies khi chọn danh mục cha
        if (data.parent && data.id && operation === 'update') {
          let currentParent = data.parent;
          const visitedIds = new Set([data.id]);
          
          while (currentParent) {
            if (visitedIds.has(currentParent)) {
              // Phát hiện cycle, xóa trường parent
              data.parent = null;
              break;
            }
            
            visitedIds.add(currentParent);
            
            try {
              const parentDoc = await req.payload.findByID({
                collection: 'product-categories',
                id: currentParent,
              });
                // Sử dụng any để tránh lỗi type do thiếu các type definitions
              currentParent = (parentDoc as any).parent;
            } catch (_error) {
              currentParent = null;
            }
          }
        }
        
        return data;
      },
    ],
  },
}
