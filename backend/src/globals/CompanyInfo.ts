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
      localized: true,
      admin: {
        description: 'Tên đầy đủ của công ty (hiển thị trên trang Liên hệ)'
      }
    },
    {
      name: 'companyShortName',
      label: 'Tên viết tắt',
      type: 'text',
      localized: true,
      admin: {
        description: 'Tên viết tắt hoặc thương hiệu của công ty (VRC)'
      }
    },
    {
      name: 'companyDescription',
      label: 'Mô tả ngắn',
      type: 'textarea',
      localized: true,
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
          localized: true,
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
          localized: true,
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
              name: 'oaId',
              label: 'Zalo Official Account ID',
              type: 'text',
              admin: {
                description: 'Nhập Zalo OA ID để kích hoạt chat widget (ví dụ: 1234567890). Lấy từ trang quản lý Zalo OA.'
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
            description: 'URL iframe của Google Maps để nhúng bản đồ (lấy từ Google Maps > Share > Embed a map)'
          }
        },
        {
          name: 'latitude',
          label: 'Vĩ độ (Latitude)',
          type: 'number',
          admin: {
            description: 'Tọa độ vĩ độ của địa điểm (ví dụ: 10.771594)'
          }
        },
        {
          name: 'longitude',
          label: 'Kinh độ (Longitude)',
          type: 'number',
          admin: {
            description: 'Tọa độ kinh độ của địa điểm (ví dụ: 106.699168)'
          }
        },
        {
          name: 'mapZoom',
          label: 'Mức zoom bản đồ',
          type: 'number',
          defaultValue: 15,
          min: 1,
          max: 20,
          admin: {
            description: 'Mức zoom của bản đồ (1-20, 15 là mặc định)'
          }
        },
        {
          name: 'showMapControls',
          label: 'Hiển thị điều khiển bản đồ',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Cho phép zoom, pan và các điều khiển khác trên bản đồ'
          }
        }
      ]
    },    {
      name: 'additionalInfo',
      label: 'Thông tin bổ sung',
      type: 'richText',
      editor: defaultLexical,
      localized: true,
    },
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
