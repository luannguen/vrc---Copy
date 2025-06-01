import type { GlobalConfig } from 'payload';
import { defaultLexical } from '../fields/defaultLexical';

export const CompanyInfo: GlobalConfig = {
  slug: 'company-info',
  label: 'Thông tin công ty',
  admin: {
    description: 'Quản lý thông tin liên hệ và giới thiệu về công ty',
    group: 'Cấu hình',
  },
  fields: [
    {
      name: 'requireAuth',
      label: 'Yêu cầu xác thực',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Nếu bật, API thông tin công ty sẽ yêu cầu đăng nhập để truy cập',
        position: 'sidebar',
      }
    },
    {
      name: 'companyName',
      label: 'Tên công ty',
      type: 'text',
      required: true,
      admin: {
        description: 'Tên đầy đủ của công ty (hiển thị trên trang Liên hệ)'
      }
    },
    {
      name: 'companyShortName',
      label: 'Tên viết tắt',
      type: 'text',
      admin: {
        description: 'Tên viết tắt hoặc thương hiệu của công ty (VRC)'
      }
    },
    {
      name: 'companyDescription',
      label: 'Mô tả ngắn',
      type: 'textarea',
      admin: {
        description: 'Mô tả ngắn gọn về công ty hiển thị trên trang Liên hệ'
      }
    },
    {
      name: 'contactSection',
      label: 'Thông tin Liên hệ',
      type: 'group',
      fields: [
        {
          name: 'address',
          label: 'Địa chỉ',
          type: 'text',
          required: true,
        },
        {
          name: 'phone',
          label: 'Số điện thoại',
          type: 'text',
        },
        {
          name: 'email',
          label: 'Email',
          type: 'email',
        },
        {
          name: 'hotline',
          label: 'Hotline',
          type: 'text',
        },
        {
          name: 'workingHours',
          label: 'Giờ làm việc',
          type: 'text',
        },
        {
          name: 'fax',
          label: 'Số Fax',
          type: 'text',
        },
      ]
    },    {
      name: 'socialMedia',
      label: 'Mạng xã hội',
      type: 'group',
      fields: [
        {
          name: 'facebook',
          label: 'Facebook',
          type: 'group',
          fields: [
            {
              name: 'url',
              label: 'Facebook URL',
              type: 'text',
            },
            {
              name: 'enabled',
              label: 'Hiển thị trên trang chủ',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'zalo',
          label: 'Zalo',
          type: 'group',
          fields: [
            {
              name: 'url',
              label: 'Số điện thoại Zalo',
              type: 'text',
              admin: {
                description: 'Nhập số điện thoại Zalo (ví dụ: 0987654321 hoặc 84987654321). Hệ thống sẽ tự động tạo link zalo.me'
              }
            },
            {
              name: 'enabled',
              label: 'Hiển thị trên trang chủ',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'twitter',
          label: 'Twitter/X',
          type: 'group',
          fields: [
            {
              name: 'url',
              label: 'Twitter/X URL',
              type: 'text',
            },
            {
              name: 'enabled',
              label: 'Hiển thị trên trang chủ',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'instagram',
          label: 'Instagram',
          type: 'group',
          fields: [
            {
              name: 'url',
              label: 'Instagram URL',
              type: 'text',
            },
            {
              name: 'enabled',
              label: 'Hiển thị trên trang chủ',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'linkedin',
          label: 'LinkedIn',
          type: 'group',
          fields: [
            {
              name: 'url',
              label: 'LinkedIn URL',
              type: 'text',
            },
            {
              name: 'enabled',
              label: 'Hiển thị trên trang chủ',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'youtube',
          label: 'YouTube',
          type: 'group',
          fields: [
            {
              name: 'url',
              label: 'YouTube URL',
              type: 'text',
            },
            {
              name: 'enabled',
              label: 'Hiển thị trên trang chủ',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
        {
          name: 'telegram',
          label: 'Telegram',
          type: 'group',
          fields: [
            {
              name: 'url',
              label: 'Telegram URL',
              type: 'text',
            },
            {
              name: 'enabled',
              label: 'Hiển thị trên trang chủ',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        }
      ]
    },
    {
      name: 'maps',
      label: 'Bản đồ',
      type: 'group',
      fields: [
        {
          name: 'googleMapsEmbed',
          label: 'Google Maps Embed URL',
          type: 'text',
          admin: {
            description: 'URL iframe của Google Maps (src từ thẻ iframe)'
          }
        },
        {
          name: 'latitude',
          label: 'Vĩ độ',
          type: 'text',
        },
        {
          name: 'longitude',
          label: 'Kinh độ',
          type: 'text',
        }
      ]
    },    {
      name: 'additionalInfo',
      label: 'Thông tin bổ sung',
      type: 'richText',
      editor: defaultLexical,    },
    {
      name: 'logo',
      label: 'Logo công ty',
      type: 'upload',
      relationTo: 'media',
    }
  ],  access: {
    read: ({ req }) => {
      // Always allow access from admin dashboard
      const referrer = req.headers?.get?.('referer') || '';
      if (referrer.includes('/admin')) {
        return true;
      }

      // For API access, we can't check requireAuth field here
      // because it would cause an infinite loop
      // The actual authentication check will be done in the API endpoint
      return true;
    },
    update: ({ req: { user } }) => {
      return Boolean(user);
    },
  },
};
