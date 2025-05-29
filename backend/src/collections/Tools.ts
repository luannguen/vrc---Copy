import { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';
import { authenticatedOrPublished } from '../access/authenticatedOrPublished';
import { slugField } from '../fields/slug';

export const Tools: CollectionConfig = {
  slug: 'tools',
  labels: {
    singular: 'Công cụ',
    plural: 'Công cụ',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'featured', 'status', 'updatedAt'],
    group: 'Công cụ & Tài nguyên',
    description: 'Quản lý các công cụ tính toán và thiết kế HVAC',
    listSearchableFields: ['name', 'description', 'excerpt', 'slug'],
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
  fields: [    {
      name: 'name',
      label: 'Tên công cụ',
      type: 'text',
      required: true,
      admin: {
        description: 'Tên hiển thị của công cụ',
      },
    },
    ...slugField('name'),
    {
      name: 'category',
      label: 'Danh mục',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Tính toán tải lạnh',
          value: 'cooling-load',
        },
        {
          label: 'So sánh hiệu suất',
          value: 'efficiency-comparison',
        },
        {
          label: 'Phân tích tiết kiệm năng lượng',
          value: 'energy-savings',
        },
        {
          label: 'Tư vấn giải pháp',
          value: 'solution-advisor',
        },
        {
          label: 'Tiêu chuẩn ngành',
          value: 'standards',
        },
        {
          label: 'Hướng dẫn thiết kế',
          value: 'guidelines',
        },
      ],
      admin: {
        description: 'Phân loại công cụ theo chức năng',
      },
    },
    {
      name: 'excerpt',
      label: 'Mô tả ngắn',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Mô tả ngắn gọn về chức năng của công cụ',
      },
    },
    {
      name: 'description',
      label: 'Mô tả chi tiết',
      type: 'richText',
      required: true,
      admin: {
        description: 'Mô tả chi tiết về cách sử dụng và lợi ích của công cụ',
      },
    },
    {
      name: 'icon',
      label: 'Icon',
      type: 'select',
      required: true,
      options: [
        { label: 'Calculator', value: 'calculator' },
        { label: 'BarChart3', value: 'bar-chart-3' },
        { label: 'Thermometer', value: 'thermometer' },
        { label: 'Settings', value: 'settings' },
        { label: 'FileText', value: 'file-text' },
        { label: 'BookOpen', value: 'book-open' },
        { label: 'Gauge', value: 'gauge' },
        { label: 'LineChart', value: 'line-chart' },
      ],
      admin: {
        description: 'Icon hiển thị cho công cụ (sử dụng Lucide icons)',
      },
    },
    {
      name: 'toolType',
      label: 'Loại công cụ',
      type: 'select',
      required: true,
      options: [
        { label: 'Công cụ tính toán', value: 'calculator' },
        { label: 'Công cụ so sánh', value: 'comparison' },
        { label: 'Công cụ phân tích', value: 'analysis' },
        { label: 'Tư vấn', value: 'advisor' },
        { label: 'Tài liệu tham khảo', value: 'reference' },
      ],
      admin: {
        description: 'Phân loại loại hình công cụ',
      },
    },
    {
      name: 'url',
      label: 'URL công cụ',
      type: 'text',
      required: true,
      admin: {
        description: 'Đường dẫn đến trang công cụ (ví dụ: /data/tools/cooling-load-calculator)',
      },
    },
    {
      name: 'features',
      label: 'Tính năng chính',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'feature',
          label: 'Tính năng',
          type: 'text',
          required: true,
        },
      ],
      admin: {
        description: 'Danh sách các tính năng chính của công cụ',
      },
    },
    {
      name: 'inputs',
      label: 'Thông số đầu vào',
      type: 'array',
      fields: [
        {
          name: 'parameter',
          label: 'Tham số',
          type: 'text',
          required: true,
        },
        {
          name: 'unit',
          label: 'Đơn vị',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'text',
        },
        {
          name: 'required',
          label: 'Bắt buộc',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      admin: {
        description: 'Các thông số đầu vào cần thiết cho công cụ',
      },
    },
    {
      name: 'outputs',
      label: 'Kết quả đầu ra',
      type: 'array',
      fields: [
        {
          name: 'result',
          label: 'Kết quả',
          type: 'text',
          required: true,
        },
        {
          name: 'unit',
          label: 'Đơn vị',
          type: 'text',
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'text',
        },
      ],
      admin: {
        description: 'Các kết quả mà công cụ sẽ tính toán',
      },
    },
    {
      name: 'difficulty',
      label: 'Độ khó',
      type: 'select',
      options: [
        { label: 'Dễ', value: 'easy' },
        { label: 'Trung bình', value: 'medium' },
        { label: 'Khó', value: 'hard' },
      ],
      defaultValue: 'easy',
      admin: {
        description: 'Mức độ phức tạp của công cụ',
      },
    },
    {
      name: 'estimatedTime',
      label: 'Thời gian ước tính',
      type: 'text',
      admin: {
        description: 'Thời gian ước tính để hoàn thành tính toán (ví dụ: 5-10 phút)',
      },
    },
    {
      name: 'relatedTools',
      label: 'Công cụ liên quan',
      type: 'relationship',
      relationTo: 'tools',
      hasMany: true,
      admin: {
        description: 'Các công cụ khác có liên quan',
      },
    },
    {
      name: 'tutorial',
      label: 'Hướng dẫn sử dụng',
      type: 'richText',
      admin: {
        description: 'Hướng dẫn chi tiết cách sử dụng công cụ',
      },
    },
    {
      name: 'examples',
      label: 'Ví dụ minh họa',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Tiêu đề ví dụ',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Mô tả',
          type: 'textarea',
        },
        {
          name: 'inputData',
          label: 'Dữ liệu đầu vào',
          type: 'json',
          admin: {
            description: 'Dữ liệu mẫu dưới dạng JSON',
          },
        },
        {
          name: 'expectedOutput',
          label: 'Kết quả mong đợi',
          type: 'json',
          admin: {
            description: 'Kết quả mong đợi dưới dạng JSON',
          },
        },
      ],
      admin: {
        description: 'Các ví dụ minh họa cách sử dụng công cụ',
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
      name: 'featured',
      label: 'Nổi bật',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Hiển thị công cụ trong danh sách nổi bật',
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
        { label: 'Bảo trì', value: 'maintenance' },
        { label: 'Ngừng hoạt động', value: 'deprecated' },
      ],
      admin: {
        description: 'Trạng thái hiển thị của công cụ',
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
      name: 'viewCount',
      label: 'Lượt xem',
      type: 'number',
      defaultValue: 0,
      admin: {
        readOnly: true,
        description: 'Số lượt sử dụng công cụ',
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
