"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories = void 0;
const anyone_1 = require("../access/anyone");
const authenticated_1 = require("../access/authenticated");
const slug_1 = require("@/fields/slug");
exports.Categories = {
    slug: 'categories',
    access: {
        create: authenticated_1.authenticated,
        delete: authenticated_1.authenticated,
        read: anyone_1.anyone,
        update: authenticated_1.authenticated,
    },
    labels: {
        plural: 'Danh mục & Thẻ',
        singular: 'Danh mục/Thẻ',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'type', 'slug'],
        group: 'Danh mục & Phân loại',
        description: 'Quản lý tất cả các danh mục và thẻ trong hệ thống.',
        listSearchableFields: ['title', 'type', 'slug'],
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Tên danh mục/thẻ',
            required: true,
            admin: {
                description: 'Nhập tên của danh mục hoặc thẻ',
            },
        },
        {
            name: 'type',
            type: 'select',
            label: 'Loại',
            options: [
                { label: 'Danh mục sản phẩm', value: 'category' },
                { label: 'Thẻ/Tag sản phẩm', value: 'tag' },
                { label: 'Danh mục tin tức', value: 'news_category' },
                { label: 'Danh mục dịch vụ', value: 'service_category' },
                { label: 'Danh mục sự kiện', value: 'event_category' },
                { label: 'Danh mục dự án', value: 'project_category' }
            ],
            defaultValue: 'category',
            required: true,
            admin: {
                position: 'sidebar',
                description: 'Chọn loại danh mục hoặc thẻ phù hợp với mục đích sử dụng.',
                style: {
                    backgroundColor: '#f7f7f7',
                    marginBottom: '20px',
                    padding: '10px',
                },
            },
        },
        ...(0, slug_1.slugField)(),
    ],
};
