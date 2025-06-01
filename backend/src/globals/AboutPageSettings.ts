import type { GlobalConfig } from 'payload';

export const AboutPageSettings: GlobalConfig = {
  slug: 'about-page-settings',
  label: 'Trang giới thiệu',
  admin: {
    description: 'Quản lý nội dung trang giới thiệu công ty',
    group: 'Nội dung',
  },
  fields: [
    {
      name: 'heroSection',
      label: 'Banner giới thiệu',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề chính',
          type: 'text',
          required: true,
          admin: {
            description: 'Tiêu đề lớn hiển thị trên banner',
          },
        },
        {
          name: 'subtitle',
          label: 'Tiêu đề phụ',
          type: 'text',
          admin: {
            description: 'Mô tả ngắn dưới tiêu đề chính',
          },
        },
        {
          name: 'backgroundImage',
          label: 'Hình ảnh nền',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Hình ảnh nền cho banner',
          },
        },
      ],
    },
    {
      name: 'companyHistory',
      label: 'Lịch sử công ty',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'richText',
          admin: {
            description: 'Nội dung chi tiết về lịch sử phát triển',
          },
        },
        {
          name: 'establishedYear',
          label: 'Năm thành lập',
          type: 'number',
          admin: {
            description: 'Năm công ty được thành lập',
          },
        },
        {
          name: 'experienceYears',
          label: 'Số năm kinh nghiệm',
          type: 'number',
          admin: {
            description: 'Tổng số năm kinh nghiệm hoạt động',
          },
        },
      ],
    },
    {
      name: 'vision',
      label: 'Tầm nhìn',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'richText',
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'text',
          admin: {
            description: 'Tên icon (ví dụ: target, vision)',
          },
        },
      ],
    },
    {
      name: 'mission',
      label: 'Sứ mệnh',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'richText',
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'text',
          admin: {
            description: 'Tên icon (ví dụ: mission, goal)',
          },
        },
      ],
    },
    {
      name: 'coreValues',
      label: 'Giá trị cốt lõi',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'richText',
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'text',
          admin: {
            description: 'Tên icon cho giá trị này',
          },
        },
      ],
      admin: {
        description: 'Các giá trị cốt lõi của công ty',
      },
    },
    {
      name: 'leadership',
      label: 'Ban lãnh đạo',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Họ và tên',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          label: 'Chức vụ',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          label: 'Ảnh đại diện',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'bio',
          label: 'Tiểu sử',
          type: 'richText',
          admin: {
            description: 'Thông tin chi tiết về thành viên',
          },
        },
      ],
      admin: {
        description: 'Danh sách các thành viên ban lãnh đạo',
      },
    },
    {
      name: 'achievements',
      label: 'Thành tích',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'text',
          admin: {
            description: 'Tên icon cho thành tích này',
          },
        },
      ],
      admin: {
        description: 'Các thành tích nổi bật của công ty',
      },
    },
  ],
};

export default AboutPageSettings;
