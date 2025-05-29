import { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';
import { authenticatedOrPublished } from '../access/authenticatedOrPublished';
import { slugField } from '../fields/slug';

export const Resources: CollectionConfig = {
  slug: 'resources',
  labels: {
    singular: 'Tài nguyên',
    plural: 'Tài nguyên',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'status', 'updatedAt'],
    group: 'Công cụ & Tài nguyên',
    description: 'Quản lý tài liệu và tài nguyên HVAC',
    listSearchableFields: ['title', 'description', 'excerpt', 'slug'],
    pagination: {
      defaultLimit: 20,
      limits: [10, 20, 50, 100],
    },
  },
  access: {
    create: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      label: 'Tiêu đề',
      type: 'text',
      required: true,
      admin: {
        description: 'Tiêu đề của tài nguyên',
      },
    },
    ...slugField('title'),
    {
      name: 'category',
      label: 'Danh mục',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Tiêu chuẩn ngành',
          value: 'standards',
        },
        {
          label: 'Hướng dẫn thiết kế',
          value: 'guidelines',
        },
        {
          label: 'Báo cáo nghiên cứu',
          value: 'research',
        },
        {
          label: 'Tài liệu kỹ thuật',
          value: 'technical-docs',
        },
        {
          label: 'Video hướng dẫn',
          value: 'video-tutorials',
        },
        {
          label: 'Webinar',
          value: 'webinars',
        },
        {
          label: 'Case Studies',
          value: 'case-studies',
        },
        {
          label: 'White Papers',
          value: 'white-papers',
        },
      ],
      admin: {
        description: 'Phân loại tài nguyên theo chủ đề',
      },
    },
    {
      name: 'resourceType',
      label: 'Loại tài nguyên',
      type: 'select',
      required: true,
      options: [
        { label: 'Tài liệu PDF', value: 'pdf' },
        { label: 'Video', value: 'video' },
        { label: 'Link ngoài', value: 'external-link' },
        { label: 'Bài viết', value: 'article' },
        { label: 'Infographic', value: 'infographic' },
        { label: 'Spreadsheet', value: 'spreadsheet' },
        { label: 'Presentation', value: 'presentation' },
      ],
      admin: {
        description: 'Định dạng của tài nguyên',
      },
    },
    {
      name: 'excerpt',
      label: 'Mô tả ngắn',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Tóm tắt ngắn gọn về nội dung tài nguyên',
      },
    },
    {
      name: 'description',
      label: 'Mô tả chi tiết',
      type: 'richText',
      required: true,
      admin: {
        description: 'Mô tả chi tiết về nội dung và giá trị của tài nguyên',
      },
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'select',
      required: true,
      options: [
        { label: 'FileText', value: 'file-text' },
        { label: 'BookOpen', value: 'book-open' },
        { label: 'Video', value: 'video' },
        { label: 'Link', value: 'link' },
        { label: 'Download', value: 'download' },
        { label: 'Globe', value: 'globe' },
        { label: 'FileImage', value: 'file-image' },
        { label: 'PresentationChart', value: 'presentation-chart' },
      ],
      admin: {
        description: 'Icon hiển thị cho tài nguyên (sử dụng Lucide icons)',
      },
    },
    {
      name: 'file',
      label: 'File tài nguyên',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload file tài nguyên (PDF, video, image, etc.)',
        condition: (data) => ['pdf', 'video', 'infographic', 'spreadsheet', 'presentation'].includes(data.resourceType),
      },
    },
    {
      name: 'externalUrl',
      label: 'Đường dẫn ngoài',
      type: 'text',
      admin: {
        description: 'URL đến tài nguyên bên ngoài',
        condition: (data) => data.resourceType === 'external-link',
      },
    },
    {
      name: 'content',
      label: 'Nội dung bài viết',
      type: 'richText',
      admin: {
        description: 'Nội dung chi tiết của bài viết',
        condition: (data) => data.resourceType === 'article',
      },
    },
    {
      name: 'videoUrl',
      label: 'URL Video',
      type: 'text',
      admin: {
        description: 'URL video (YouTube, Vimeo, etc.)',
        condition: (data) => data.resourceType === 'video',
      },
    },
    {
      name: 'duration',
      label: 'Thời lượng',
      type: 'text',
      admin: {
        description: 'Thời lượng video hoặc thời gian đọc ước tính',
        condition: (data) => ['video', 'article'].includes(data.resourceType),
      },
    },
    {
      name: 'fileSize',
      label: 'Kích thước file',
      type: 'text',
      admin: {
        description: 'Kích thước file (ví dụ: 2.5 MB)',
        condition: (data) => ['pdf', 'spreadsheet', 'presentation'].includes(data.resourceType),
      },
    },
    {
      name: 'language',
      label: 'Ngôn ngữ',
      type: 'select',
      defaultValue: 'vi',
      options: [
        { label: 'Tiếng Việt', value: 'vi' },
        { label: 'Tiếng Anh', value: 'en' },
        { label: 'Song ngữ', value: 'bilingual' },
      ],
      admin: {
        description: 'Ngôn ngữ của tài nguyên',
      },
    },
    {
      name: 'difficulty',
      label: 'Độ khó',
      type: 'select',
      options: [
        { label: 'Cơ bản', value: 'beginner' },
        { label: 'Trung bình', value: 'intermediate' },
        { label: 'Nâng cao', value: 'advanced' },
        { label: 'Chuyên gia', value: 'expert' },
      ],
      defaultValue: 'beginner',
      admin: {
        description: 'Mức độ khó của tài nguyên',
      },
    },
    {
      name: 'targetAudience',
      label: 'Đối tượng mục tiêu',
      type: 'array',
      fields: [
        {
          name: 'audience',
          label: 'Đối tượng',
          type: 'select',
          options: [
            { label: 'Kỹ sư HVAC', value: 'hvac-engineers' },
            { label: 'Kiến trúc sư', value: 'architects' },
            { label: 'Nhà thầu', value: 'contractors' },
            { label: 'Chủ đầu tư', value: 'owners' },
            { label: 'Sinh viên', value: 'students' },
            { label: 'Nhà phân phối', value: 'distributors' },
            { label: 'Tư vấn', value: 'consultants' },
          ],
          required: true,
        },
      ],
      admin: {
        description: 'Đối tượng mà tài nguyên hướng đến',
      },
    },
    {
      name: 'tags',
      label: 'Thẻ',
      type: 'array',
      fields: [
        {
          name: 'tag',
          label: 'Thẻ',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Các thẻ để tìm kiếm và phân loại',
      },
    },
    {
      name: 'relatedResources',
      label: 'Tài nguyên liên quan',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
      admin: {
        description: 'Các tài nguyên khác có liên quan',
      },
    },
    {
      name: 'relatedTools',
      label: 'Công cụ liên quan',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
      admin: {
        description: 'Các công cụ có liên quan đến tài nguyên này',
      },
    },
    {
      name: 'featured',
      label: 'Nổi bật',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Hiển thị tài nguyên trong danh sách nổi bật',
      },
    },
    {
      name: 'downloadCount',
      label: 'Lượt tải xuống',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Số lượt tải xuống tài nguyên',
      },
    },
    {
      name: 'viewCount',
      label: 'Lượt xem',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Số lượt xem tài nguyên',
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
        { label: 'Cập nhật', value: 'updated' },
        { label: 'Ngừng hoạt động', value: 'deprecated' },
      ],
      admin: {
        description: 'Trạng thái hiển thị của tài nguyên',
      },
    },
    {
      name: 'publishedAt',
      label: 'Ngày xuất bản',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'lastUpdated',
      label: 'Cập nhật lần cuối',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Ngày cập nhật nội dung lần cuối',
      },
    },
    {
      name: 'seoTitle',
      label: 'SEO Title',
      type: 'text',
      admin: {
        description: 'Tiêu đề tối ưu SEO (tùy chọn)',
      },
    },
    {
      name: 'seoDescription',
      label: 'SEO Description',
      type: 'textarea',
      admin: {
        description: 'Mô tả tối ưu SEO (tùy chọn)',
      },
    },
  ],
  timestamps: true,
};
