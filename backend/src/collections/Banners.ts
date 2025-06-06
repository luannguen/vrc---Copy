import type { CollectionConfig } from 'payload';

export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: {
    singular: 'Banner',
    plural: 'Banner trang chủ',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive', 'sortOrder', 'status', 'updatedAt'],
    group: 'Nội dung',
    description: 'Quản lý banner carousel trên trang chủ',
  },
  access: {
    read: () => true, // Public access for frontend
    create: ({ req: { user } }) => !!user, // Only authenticated users can create
    update: ({ req: { user } }) => !!user, // Only authenticated users can update
    delete: ({ req: { user } }) => !!user, // Only authenticated users can delete
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Tiêu đề chính của banner',
      },
    },
    {
      name: 'subtitle',
      label: 'Phụ đề',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Mô tả ngắn gọn xuất hiện dưới tiêu đề',
      },
    },
    {
      name: 'image',
      label: 'Hình ảnh banner',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Hình ảnh nền cho banner (khuyến nghị: 1920x600px)',
      },
    },
    {
      name: 'link',
      label: 'Liên kết',
      type: 'text',
      admin: {
        description: 'URL đích khi click vào banner (ví dụ: /products, /services)',
      },
    },
    {
      name: 'buttonText',
      label: 'Văn bản nút',
      type: 'text',
      defaultValue: 'Tìm hiểu thêm',
      localized: true,
      admin: {
        description: 'Văn bản hiển thị trên nút call-to-action',
      },
    },
    {
      name: 'isActive',
      label: 'Kích hoạt',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bật/tắt hiển thị banner này',
      },
    },
    {
      name: 'sortOrder',
      label: 'Thứ tự sắp xếp',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Số thứ tự hiển thị (số nhỏ hơn sẽ hiển thị trước)',
      },
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Nháp', value: 'draft' },
        { label: 'Xuất bản', value: 'published' },
        { label: 'Hết hạn', value: 'expired' },
      ],
      admin: {
        description: 'Trạng thái xuất bản của banner',
      },
    },
    {
      name: 'scheduleSettings',
      label: 'Cài đặt lên lịch',
      type: 'group',
      admin: {
        description: 'Tùy chọn lên lịch hiển thị banner',
      },
      fields: [
        {
          name: 'startDate',
          label: 'Ngày bắt đầu',
          type: 'date',
          admin: {
            description: 'Ngày bắt đầu hiển thị banner (để trống nếu hiển thị ngay)',
          },
        },
        {
          name: 'endDate',
          label: 'Ngày kết thúc',
          type: 'date',
          admin: {
            description: 'Ngày ngừng hiển thị banner (để trống nếu hiển thị vô thời hạn)',
          },
        },
      ],
    },
    {
      name: 'targeting',
      label: 'Cài đặt mục tiêu',
      type: 'group',
      admin: {
        description: 'Tùy chọn hiển thị banner cho nhóm đối tượng cụ thể',
      },
      fields: [
        {
          name: 'deviceTypes',
          label: 'Loại thiết bị',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Máy tính', value: 'desktop' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Điện thoại', value: 'mobile' },
          ],
          admin: {
            description: 'Chọn loại thiết bị hiển thị banner (để trống = tất cả thiết bị)',
          },
        },
        {
          name: 'userRoles',
          label: 'Vai trò người dùng',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Khách vãng lai', value: 'guest' },
            { label: 'Khách hàng cá nhân', value: 'individual' },
            { label: 'Khách hàng doanh nghiệp', value: 'business' },
            { label: 'Đối tác', value: 'partner' },
          ],
          admin: {
            description: 'Chọn nhóm người dùng hiển thị banner (để trống = tất cả)',
          },
        },
      ],
    },
    {
      name: 'analytics',
      label: 'Thống kê',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Thống kê hiệu suất banner',
      },
      fields: [
        {
          name: 'viewCount',
          label: 'Lượt xem',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'clickCount',
          label: 'Lượt click',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'clickThroughRate',
          label: 'Tỷ lệ click (%)',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Tỷ lệ click/view * 100',
          },
        },
      ],
    },
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      admin: {
        description: 'Tối ưu hóa SEO cho banner',
      },
      fields: [
        {
          name: 'altText',
          label: 'Alt text cho hình ảnh',
          type: 'text',
          localized: true,
          admin: {
            description: 'Mô tả hình ảnh cho accessibility và SEO',
          },
        },
        {
          name: 'keywords',
          label: 'Từ khóa',
          type: 'text',
          localized: true,
          admin: {
            description: 'Từ khóa liên quan đến banner (cách nhau bởi dấu phẩy)',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-calculate click-through rate
        if (data.analytics?.viewCount && data.analytics?.clickCount) {
          data.analytics.clickThroughRate =
            Math.round((data.analytics.clickCount / data.analytics.viewCount) * 100 * 100) / 100;
        }
        return data;
      },
    ],
  },
};

export default Banners;
