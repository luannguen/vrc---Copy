import type { CollectionConfig } from 'payload';

// Reference the user type more generically
interface PayloadUser {
  id: string;
  [key: string]: any;
}

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'name',
    description: 'Các yêu cầu liên hệ từ khách hàng',
    group: 'Liên hệ & Phản hồi',
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
  },  access: {
    read: ({ req: { user } }: { req: { user: PayloadUser | null }}) => {
      return Boolean(user);
    },
    update: ({ req: { user } }: { req: { user: PayloadUser | null }}) => {
      return Boolean(user);
    },
    delete: ({ req: { user } }: { req: { user: PayloadUser | null }}) => {
      return Boolean(user);
    },
    create: () => true, // Cho phép tạo mới không cần đăng nhập (từ form liên hệ)
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Họ tên',
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
    },
    {
      name: 'subject',
      type: 'select',
      label: 'Chủ đề',
      options: [
        {
          label: 'Tư vấn chung',
          value: 'general',
        },
        {
          label: 'Dịch vụ sửa chữa',
          value: 'repair',
        },
        {
          label: 'Bảo trì thiết bị',
          value: 'maintenance',
        },
        {
          label: 'Lắp đặt',
          value: 'installation',
        },
        {
          label: 'Tư vấn kỹ thuật',
          value: 'consulting',
        },
        {
          label: 'Công nghệ Inverter',
          value: 'inverter-technology',
        },
        {
          label: 'Giải pháp thu hồi nhiệt',
          value: 'heat-recovery',
        },
        {
          label: 'Hiệu quả năng lượng',
          value: 'energy-efficiency',
        },
        {
          label: 'Khác',
          value: 'other',
        },
      ],
      defaultValue: 'general',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Nội dung',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      options: [
        {
          label: 'Chưa xử lý',
          value: 'new',
        },
        {
          label: 'Đang xử lý',
          value: 'in-progress',
        },
        {
          label: 'Đã giải quyết',
          value: 'resolved',
        },
        {
          label: 'Cần thêm thông tin',
          value: 'need-info',
        },
        {
          label: 'Đóng',
          value: 'closed',
        },
      ],
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      }
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Ghi chú nội bộ',
      admin: {
        position: 'sidebar',
        description: 'Chỉ admin thấy được các ghi chú này',
      }
    },
  ],
  timestamps: true,
};
