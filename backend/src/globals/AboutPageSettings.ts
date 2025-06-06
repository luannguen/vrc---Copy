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
          localized: true,
          admin: {
            description: 'Tiêu đề lớn hiển thị trên banner',
          },
        },
        {
          name: 'subtitle',
          label: 'Tiêu đề phụ',
          type: 'text',
          localized: true,
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
          localized: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'richText',
          localized: true,
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
        // Thông tin cơ bản
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
          label: 'Tiểu sử ngắn',
          type: 'richText',
          admin: {
            description: 'Mô tả ngắn gọn hiển thị trên card',
          },
        },
        // Thông tin mở rộng cho popup
        {
          name: 'experience',
          label: 'Số năm kinh nghiệm',
          type: 'text',
          admin: {
            description: 'VD: 15 năm, 10+ năm',
          },
        },
        {
          name: 'education',
          label: 'Học vấn',
          type: 'textarea',
          admin: {
            description: 'Thông tin về trình độ học vấn',
          },
        },
        {
          name: 'expertise',
          label: 'Chuyên môn',
          type: 'array',
          fields: [
            {
              name: 'skill',
              label: 'Kỹ năng',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Danh sách các lĩnh vực chuyên môn',
          },
        },
        {
          name: 'achievements',
          label: 'Thành tích cá nhân',
          type: 'array',
          fields: [
            {
              name: 'achievement',
              label: 'Thành tích',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Các thành tích, giải thưởng cá nhân',
          },
        },
        {
          name: 'quote',
          label: 'Câu nói đặc trưng',
          type: 'textarea',
          admin: {
            description: 'Câu quote hoặc triết lý làm việc',
          },
        },
        {
          name: 'email',
          label: 'Email liên hệ',
          type: 'email',
          admin: {
            description: 'Email liên hệ công việc',
          },
        },
        {
          name: 'linkedin',
          label: 'LinkedIn URL',
          type: 'text',
          admin: {
            description: 'Đường dẫn LinkedIn profile',
          },
        },
        {
          name: 'phone',
          label: 'Số điện thoại',
          type: 'text',
          admin: {
            description: 'Số điện thoại liên hệ',
          },
        },
        {
          name: 'detailedBio',
          label: 'Tiểu sử chi tiết',
          type: 'richText',
          admin: {
            description: 'Tiểu sử đầy đủ hiển thị trong popup',
          },
        },
        {
          name: 'projects',
          label: 'Dự án tiêu biểu',
          type: 'array',
          fields: [
            {
              name: 'name',
              label: 'Tên dự án',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              label: 'Mô tả',
              type: 'textarea',
            },
            {
              name: 'year',
              label: 'Năm thực hiện',
              type: 'text',
            },
          ],
          admin: {
            description: 'Các dự án tiêu biểu đã tham gia',
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
