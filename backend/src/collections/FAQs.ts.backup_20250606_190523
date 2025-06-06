import { CollectionConfig } from 'payload';
import { authenticated } from '../access/authenticated';

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'status', 'order'],
    group: 'Nội dung',
    description: 'Quản lý câu hỏi thường gặp',
  },
  access: {
    create: authenticated,
    read: () => true, // Allow public read access
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      label: 'Câu hỏi',
      required: true,
      admin: {
        description: 'Câu hỏi của khách hàng',
      },
    },
    {
      name: 'answer',
      type: 'textarea',
      label: 'Trả lời',
      required: true,
      admin: {
        description: 'Câu trả lời chi tiết',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Danh mục',
      required: true,
      options: [
        {
          label: 'Tổng quan',
          value: 'general',
        },
        {
          label: 'Dịch vụ',
          value: 'services',
        },
        {
          label: 'Sản phẩm',
          value: 'products',
        },
        {
          label: 'Dự án',
          value: 'projects',
        },
        {
          label: 'Công nghệ',
          value: 'technology',
        },
        {
          label: 'Hỗ trợ kỹ thuật',
          value: 'technical-support',
        },
        {
          label: 'Thanh toán',
          value: 'payment',
        },
        {
          label: 'Bảo hành',
          value: 'warranty',
        },
        {
          label: 'Khác',
          value: 'other',
        },
      ],
      admin: {
        description: 'Phân loại câu hỏi theo danh mục',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Thẻ',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Thẻ',
          required: true,
        },
      ],
      admin: {
        description: 'Thẻ để dễ dàng tìm kiếm và phân loại',
      },
    },
    // Testing both relationship fields - temporarily commented out
    /*
    {
      name: 'relatedServices',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Dịch vụ liên quan',
      admin: {
        description: 'Dịch vụ liên quan đến câu hỏi này',
      },
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Sản phẩm liên quan',
      admin: {
        description: 'Sản phẩm liên quan đến câu hỏi này',
      },
    },
    */
    {
      name: 'isPopular',
      type: 'checkbox',
      label: 'Câu hỏi phổ biến',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Đánh dấu đây là câu hỏi được hỏi nhiều nhất',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Thứ tự hiển thị',
      defaultValue: 99,
      admin: {
        position: 'sidebar',
        description: 'Số càng nhỏ thì hiển thị càng trước',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Nổi bật',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Hiển thị trong danh sách nổi bật',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Trạng thái',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Nháp',
          value: 'draft',
        },
        {
          label: 'Đã xuất bản',
          value: 'published',
        },
        {
          label: 'Đã ẩn',
          value: 'hidden',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'searchKeywords',
      type: 'text',
      label: 'Từ khóa tìm kiếm',
      admin: {
        description: 'Từ khóa để tăng khả năng tìm kiếm (cách nhau bằng dấu phẩy)',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      label: 'Lượt xem',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Số lượt xem câu hỏi này',
      },
    },
    {
      name: 'helpfulCount',
      type: 'number',
      label: 'Lượt hữu ích',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Số lượt đánh giá hữu ích',
      },
    },
    {
      name: 'language',
      type: 'select',
      label: 'Ngôn ngữ',
      required: true,
      defaultValue: 'vi',
      options: [
        {
          label: 'Tiếng Việt',
          value: 'vi',
        },
        {
          label: 'English',
          value: 'en',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Tự động tạo từ khóa tìm kiếm từ câu hỏi và câu trả lời
        if (!data.searchKeywords) {
          const keywords: string[] = [];
          if (data.question) {
            keywords.push(...data.question.split(' ').filter((word: string) => word.length > 2));
          }
          if (data.answer && typeof data.answer === 'string') {
            keywords.push(...data.answer.split(' ').filter((word: string) => word.length > 2));
          }
          data.searchKeywords = [...new Set(keywords)].join(', ');
        }
        return data;
      },
    ],
  },
};
