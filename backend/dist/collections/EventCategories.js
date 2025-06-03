"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCategories = void 0;
const authenticated_1 = require("../access/authenticated");
const slug_1 = require("../fields/slug");
exports.EventCategories = {
    slug: 'event-categories',
    labels: {
        singular: 'Danh mục sự kiện',
        plural: 'Danh mục sự kiện',
    }, admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug'],
        group: 'Sự kiện',
    },
    access: {
        create: authenticated_1.authenticated,
        read: () => true, // Public read access
        update: authenticated_1.authenticated,
        delete: authenticated_1.authenticated,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: 'Tên danh mục',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Mô tả',
        },
        {
            name: 'icon',
            type: 'text',
            label: 'Icon (CSS class hoặc Unicode)',
        },
        {
            name: 'featured',
            type: 'checkbox',
            label: 'Hiển thị nổi bật',
            defaultValue: false,
        },
        {
            name: 'order',
            type: 'number',
            label: 'Thứ tự sắp xếp',
            defaultValue: 0,
            admin: {
                description: 'Số thấp hơn hiển thị trước',
            },
        },
        ...(0, slug_1.slugField)('name'),
    ],
    timestamps: true,
};
