import type { GlobalConfig } from 'payload';

export const ProjectsPageSettings: GlobalConfig = {
  slug: 'projects-page-settings',
  label: 'Cài đặt trang dự án',
  admin: {
    description: 'Quản lý nội dung và hiển thị trang dự án',
    group: 'Nội dung',
  },
  fields: [
    {
      name: 'heroSection',
      label: 'Banner trang dự án',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề chính',
          type: 'text',
          required: true,
          defaultValue: 'Dự án tiêu biểu',
        },
        {
          name: 'subtitle',
          label: 'Mô tả',
          type: 'textarea',
          required: true,
          defaultValue: 'Những công trình thực tế đã được VRC thiết kế, cung cấp thiết bị và thi công lắp đặt trên khắp cả nước.',
        },
        {
          name: 'backgroundImage',
          label: 'Hình nền',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Hình nền cho banner trang dự án. Kích thước khuyến nghị: 1920x600px',
          },
        },
      ],
    },
    {
      name: 'categorySection',
      label: 'Phần danh mục dự án',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề phần',
          type: 'text',
          defaultValue: 'Danh mục dự án',
        },
        {
          name: 'description',
          label: 'Mô tả phần',
          type: 'textarea',
          defaultValue: 'VRC tự hào thực hiện các dự án đa dạng với quy mô khác nhau, từ hệ thống điều hòa không khí trung tâm cho tòa nhà thương mại đến các hệ thống làm lạnh công nghiệp phức tạp.',
        },
        {
          name: 'enableCategories',
          label: 'Hiển thị danh mục',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Bật/tắt hiển thị phần danh mục dự án',
          },
        },
      ],
    },
    {
      name: 'featuredSection',
      label: 'Dự án nổi bật',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề phần',
          type: 'text',
          defaultValue: 'Dự án nổi bật',
        },
        {
          name: 'showFeaturedProjects',
          label: 'Hiển thị dự án nổi bật',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Bật/tắt hiển thị phần dự án nổi bật',
          },
        },
        {
          name: 'featuredProjectsLimit',
          label: 'Số lượng dự án hiển thị',
          type: 'number',
          defaultValue: 3,
          min: 1,
          max: 10,
          admin: {
            description: 'Số lượng dự án nổi bật hiển thị trên trang chính',
          },
        },
      ],
    },
    {
      name: 'statsSection',
      label: 'Thống kê thành tựu',
      type: 'group',
      fields: [
        {
          name: 'enableStats',
          label: 'Hiển thị thống kê',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Bật/tắt hiển thị phần thống kê thành tựu',
          },
        },
        {
          name: 'stats',
          label: 'Danh sách thống kê',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              name: 'value',
              label: 'Số liệu',
              type: 'text',
              required: true,
              admin: {
                description: 'VD: 500+ hoặc 20 năm',
              },
            },
            {
              name: 'label',
              label: 'Nhãn',
              type: 'text',
              required: true,
              admin: {
                description: 'VD: Dự án đã hoàn thành',
              },
            },
          ],
          defaultValue: [
            { value: '500+', label: 'Dự án đã hoàn thành' },
            { value: '20+', label: 'Năm kinh nghiệm' },
            { value: '50+', label: 'Đối tác lớn' },
            { value: '100+', label: 'Kỹ sư & nhân viên' },
          ],
        },
      ],
    },
    {
      name: 'ctaSection',
      label: 'Call to Action',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề CTA',
          type: 'text',
          defaultValue: 'Bạn có dự án cần tư vấn?',
        },
        {
          name: 'description',
          label: 'Mô tả CTA',
          type: 'textarea',
          defaultValue: 'Hãy liên hệ với đội ngũ kỹ sư của chúng tôi để được tư vấn giải pháp tối ưu cho dự án của bạn.',
        },
        {
          name: 'primaryButton',
          label: 'Nút chính',
          type: 'group',
          fields: [
            {
              name: 'text',
              label: 'Văn bản nút',
              type: 'text',
              defaultValue: 'Liên hệ tư vấn',
              required: true,
            },
            {
              name: 'link',
              label: 'Đường dẫn',
              type: 'text',
              defaultValue: '/contact',
              required: true,
              admin: {
                description: 'Đường dẫn tương đối hoặc tuyệt đối. VD: /contact hoặc https://example.com',
              },
            },
          ],
        },
        {
          name: 'secondaryButton',
          label: 'Nút phụ',
          type: 'group',
          fields: [
            {
              name: 'text',
              label: 'Văn bản nút',
              type: 'text',
              defaultValue: 'Xem dịch vụ',
            },
            {
              name: 'link',
              label: 'Đường dẫn',
              type: 'text',
              defaultValue: '/services',
              admin: {
                description: 'Đường dẫn tương đối hoặc tuyệt đối. VD: /services hoặc https://example.com',
              },
            },
          ],
        },
      ],
    },
  ],
};
