import type { GlobalConfig } from 'payload';

export const HomepageSettings: GlobalConfig = {
  slug: 'homepage-settings',
  label: 'Cài đặt trang chủ',
  admin: {
    description: 'Quản lý nội dung và hiển thị trang chủ website',
    group: 'Nội dung',
  },
  fields: [
    {
      name: 'heroSection',
      label: 'Banner trang chủ',
      type: 'group',
      fields: [
        {
          name: 'enableCarousel',
          label: 'Bật carousel',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Bật/tắt chế độ carousel tự động',
          },
        },
        {
          name: 'autoSlideInterval',
          label: 'Thời gian chuyển slide (giây)',
          type: 'number',
          defaultValue: 6,
          admin: {
            condition: (data) => data.heroSection?.enableCarousel,
          },
        },
        {
          name: 'banners',
          label: 'Danh sách banner',
          type: 'relationship',
          relationTo: 'banners',
          hasMany: true,
          admin: {
            description: 'Chọn banner hiển thị trên trang chủ (theo thứ tự)',
          },
        },
      ],
    },
    {
      name: 'featuredSection',
      label: 'Sản phẩm nổi bật',
      type: 'group',
      fields: [
        {
          name: 'isEnabled',
          label: 'Hiển thị section',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          label: 'Tiêu đề section',
          type: 'text',
          defaultValue: 'Sản phẩm nổi bật',
          admin: {
            condition: (data) => data.featuredSection?.isEnabled,
          },
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'textarea',
          defaultValue: 'Khám phá các giải pháp điện lạnh hàng đầu của chúng tôi',
          admin: {
            condition: (data) => data.featuredSection?.isEnabled,
          },
        },
        {
          name: 'featuredProducts',
          label: 'Sản phẩm nổi bật',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          maxRows: 6,
          admin: {
            condition: (data) => data.featuredSection?.isEnabled,
            description: 'Chọn tối đa 6 sản phẩm hiển thị',
          },
        },
        {
          name: 'viewAllLink',
          label: 'Link "Xem tất cả"',
          type: 'text',
          defaultValue: '/products',
          admin: {
            condition: (data) => data.featuredSection?.isEnabled,
          },
        },
      ],
    },
    {
      name: 'publicationsSection',
      label: 'Bài viết mới nhất',
      type: 'group',
      fields: [
        {
          name: 'isEnabled',
          label: 'Hiển thị section',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          label: 'Tiêu đề section',
          type: 'text',
          defaultValue: 'Bài viết mới nhất',
          admin: {
            condition: (data) => data.publicationsSection?.isEnabled,
          },
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'textarea',
          defaultValue: 'Tham khảo các báo cáo, nghiên cứu và hướng dẫn mới nhất',
          admin: {
            condition: (data) => data.publicationsSection?.isEnabled,
          },
        },
        {
          name: 'displayMode',
          label: 'Chế độ hiển thị',
          type: 'select',
          defaultValue: 'auto',
          options: [
            { label: 'Tự động (bài viết mới nhất)', value: 'auto' },
            { label: 'Chọn thủ công', value: 'manual' },
          ],
          admin: {
            condition: (data) => data.publicationsSection?.isEnabled,
          },
        },
        {
          name: 'numberOfPosts',
          label: 'Số bài viết hiển thị',
          type: 'number',
          defaultValue: 4,
          admin: {
            condition: (data) => data.publicationsSection?.isEnabled && data.publicationsSection?.displayMode === 'auto',
          },
        },
        {
          name: 'selectedPosts',
          label: 'Bài viết được chọn',
          type: 'relationship',
          relationTo: 'posts',
          hasMany: true,
          maxRows: 6,
          admin: {
            condition: (data) => data.publicationsSection?.isEnabled && data.publicationsSection?.displayMode === 'manual',
          },
        },
        {
          name: 'viewAllLink',
          label: 'Link "Xem tất cả"',
          type: 'text',
          defaultValue: '/publications',
          admin: {
            condition: (data) => data.publicationsSection?.isEnabled,
          },
        },
      ],
    },
    {
      name: 'resourcesSection',
      label: 'Công cụ & Tài nguyên',
      type: 'group',
      fields: [
        {
          name: 'isEnabled',
          label: 'Hiển thị section',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'title',
          label: 'Tiêu đề section',
          type: 'text',
          defaultValue: 'Công cụ & Tài nguyên',
          admin: {
            condition: (data) => data.resourcesSection?.isEnabled,
          },
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'textarea',
          defaultValue: 'Truy cập các công cụ tính toán, dữ liệu phân tích và tài nguyên hỗ trợ',
          admin: {
            condition: (data) => data.resourcesSection?.isEnabled,
          },
        },
        {
          name: 'leftPanel',
          label: 'Panel trái',
          type: 'group',
          admin: {
            condition: (data) => data.resourcesSection?.isEnabled,
          },
          fields: [
            {
              name: 'title',
              label: 'Tiêu đề',
              type: 'text',
              defaultValue: 'Dữ liệu & Thống kê năng lượng',
            },
            {
              name: 'description',
              label: 'Mô tả',
              type: 'textarea',
            },
            {
              name: 'features',
              label: 'Tính năng',
              type: 'array',
              fields: [
                {
                  name: 'text',
                  label: 'Nội dung',
                  type: 'text',
                },
              ],
            },
            {
              name: 'linkText',
              label: 'Text liên kết',
              type: 'text',
              defaultValue: 'Xem thống kê',
            },
            {
              name: 'linkUrl',
              label: 'URL liên kết',
              type: 'text',
              defaultValue: '/data/statistics',
            },
          ],
        },
        {
          name: 'rightPanel',
          label: 'Panel phải',
          type: 'group',
          admin: {
            condition: (data) => data.resourcesSection?.isEnabled,
          },
          fields: [
            {
              name: 'title',
              label: 'Tiêu đề',
              type: 'text',
              defaultValue: 'Công cụ tính toán & Thiết kế',
            },
            {
              name: 'description',
              label: 'Mô tả',
              type: 'textarea',
            },
            {
              name: 'features',
              label: 'Tính năng',
              type: 'array',
              fields: [
                {
                  name: 'text',
                  label: 'Nội dung',
                  type: 'text',
                },
              ],
            },
            {
              name: 'linkText',
              label: 'Text liên kết',
              type: 'text',
              defaultValue: 'Khám phá công cụ',
            },
            {
              name: 'linkUrl',
              label: 'URL liên kết',
              type: 'text',
              defaultValue: '/data/tools',
            },
          ],
        },
      ],
    },
    {
      name: 'contactSection',
      label: 'Form liên hệ',
      type: 'group',
      fields: [
        {
          name: 'isEnabled',
          label: 'Hiển thị form liên hệ',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'backgroundColor',
          label: 'Màu nền',
          type: 'select',
          defaultValue: 'gray',
          options: [
            { label: 'Xám nhạt', value: 'gray' },
            { label: 'Trắng', value: 'white' },
            { label: 'Primary', value: 'primary' },
          ],
          admin: {
            condition: (data) => data.contactSection?.isEnabled,
          },
        },
      ],
    },
    {
      name: 'seoSettings',
      label: 'SEO trang chủ',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          label: 'Meta title',
          type: 'text',
          admin: {
            description: 'Tiêu đề hiển thị trên kết quả tìm kiếm',
          },
        },
        {
          name: 'metaDescription',
          label: 'Meta description',
          type: 'textarea',
          admin: {
            description: 'Mô tả hiển thị trên kết quả tìm kiếm',
          },
        },
        {
          name: 'metaKeywords',
          label: 'Meta keywords',
          type: 'text',
          admin: {
            description: 'Từ khóa SEO, phân cách bằng dấu phẩy',
          },
        },
        {
          name: 'ogImage',
          label: 'Hình ảnh chia sẻ mạng xã hội',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Hình ảnh hiển thị khi chia sẻ trang chủ (1200x630px)',
          },
        },
      ],
    },
  ],
};
