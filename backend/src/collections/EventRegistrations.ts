import type { CollectionConfig } from 'payload';

export const EventRegistrations: CollectionConfig = {
  slug: 'event-registrations',
  admin: {
    useAsTitle: 'fullName',
    description: 'Đăng ký tham gia sự kiện',
    group: 'Sự kiện',
    defaultColumns: ['fullName', 'email', 'eventTitle', 'participationType', 'status', 'createdAt'],
    components: {
      beforeList: ['@/components/admin/EventRegistrationDashboard'],
    },
  },
  access: {
    read: ({ req: { user } }) => {
      return Boolean(user);
    },
    update: ({ req: { user } }) => {
      return Boolean(user);
    },
    delete: ({ req: { user } }) => {
      return Boolean(user);
    },
    create: () => true, // Cho phép tạo mới không cần đăng nhập (từ form đăng ký)
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Họ và tên',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
      required: true,
    },
    {
      name: 'organization',
      type: 'text',
      label: 'Tổ chức/Công ty',
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Chức vụ',
    },
    {
      name: 'eventTitle',
      type: 'text',
      label: 'Tên sự kiện',
      required: true,
    },
    {
      name: 'eventId',
      type: 'text',
      label: 'ID Sự kiện',
      admin: {
        position: 'sidebar',
        description: 'ID của sự kiện (có thể là ID nội bộ hoặc ID bên ngoài)',
      }
    },
    {
      name: 'participationType',
      type: 'select',
      label: 'Loại tham gia',
      options: [
        {
          label: 'Tham dự trực tiếp',
          value: 'in-person',
        },
        {
          label: 'Tham gia online',
          value: 'online',
        },
        {
          label: 'Cả hai',
          value: 'hybrid',
        },
      ],
      required: true,
      defaultValue: 'in-person',
    },
    {
      name: 'dietaryRequirements',
      type: 'select',
      label: 'Yêu cầu ăn uống',
      options: [
        {
          label: 'Không có yêu cầu đặc biệt',
          value: 'none',
        },
        {
          label: 'Chay',
          value: 'vegetarian',
        },
        {
          label: 'Thuần chay (Vegan)',
          value: 'vegan',
        },
        {
          label: 'Không gluten',
          value: 'gluten-free',
        },
        {
          label: 'Khác',
          value: 'other',
        },
      ],
      defaultValue: 'none',
    },
    {
      name: 'dietaryNote',
      type: 'textarea',
      label: 'Ghi chú về ăn uống',
      admin: {
        condition: (data) => data.dietaryRequirements === 'other',
      },
    },
    {
      name: 'accessibilityNeeds',
      type: 'textarea',
      label: 'Nhu cầu hỗ trợ đặc biệt',
    },
    {
      name: 'interests',
      type: 'textarea',
      label: 'Chủ đề quan tâm',
    },
    {
      name: 'experience',
      type: 'select',
      label: 'Kinh nghiệm trong lĩnh vực',
      options: [
        {
          label: 'Mới bắt đầu',
          value: 'beginner',
        },
        {
          label: 'Trung bình',
          value: 'intermediate',
        },
        {
          label: 'Chuyên gia',
          value: 'expert',
        },
      ],
      defaultValue: 'beginner',
    },
    {
      name: 'heardAbout',
      type: 'select',
      label: 'Biết đến sự kiện qua',
      options: [
        {
          label: 'Website VRC',
          value: 'website',
        },
        {
          label: 'Social media',
          value: 'social-media',
        },
        {
          label: 'Email',
          value: 'email',
        },
        {
          label: 'Bạn bè/Đồng nghiệp',
          value: 'word-of-mouth',
        },
        {
          label: 'Khác',
          value: 'other',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      options: [
        {
          label: 'Chờ xác nhận',
          value: 'pending',
        },
        {
          label: 'Đã xác nhận',
          value: 'confirmed',
        },
        {
          label: 'Đã tham gia',
          value: 'attended',
        },
        {
          label: 'Vắng mặt',
          value: 'absent',
        },
        {
          label: 'Đã hủy',
          value: 'cancelled',
        },
      ],
      defaultValue: 'pending',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'confirmationSent',
      type: 'checkbox',
      label: 'Đã gửi email xác nhận',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'reminderSent',
      type: 'checkbox',
      label: 'Đã gửi email nhắc nhở',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Ghi chú nội bộ',
      admin: {
        position: 'sidebar',
        description: 'Chỉ admin thấy được các ghi chú này',
      }
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        // Log registration events
        if (operation === 'create') {
          console.log(`New event registration: ${doc.fullName} for ${doc.eventTitle}`);
        }
      },
    ],
  },
};
