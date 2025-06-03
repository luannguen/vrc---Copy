"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Technologies = void 0;
const authenticated_1 = require("../access/authenticated");
const authenticatedOrPublished_1 = require("../access/authenticatedOrPublished");
const slug_1 = require("../fields/slug");
exports.Technologies = {
    slug: 'technologies',
    labels: {
        singular: 'Công nghệ & Đối tác',
        plural: 'Công nghệ & Đối tác',
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'type', 'status', 'order'],
        group: 'Quản lý Trang Công nghệ',
    },
    access: {
        create: authenticated_1.authenticated,
        read: authenticatedOrPublished_1.authenticatedOrPublished,
        update: authenticated_1.authenticated,
        delete: authenticated_1.authenticated,
    },
    hooks: {
        beforeValidate: [
            ({ data, operation, req }) => {
                console.log('\n🔍 === TECHNOLOGIES BEFORE VALIDATE HOOK ===');
                console.log('Operation:', operation);
                console.log('Data received:', JSON.stringify(data, null, 2));
                console.log('Request URL:', req?.url);
                console.log('Request method:', req?.method);
                console.log('User agent:', req?.headers?.get?.('user-agent'));
                console.log('==========================================\n');
                return data;
            }
        ], beforeChange: [
            ({ data, operation }) => {
                console.log('\n🔧 === TECHNOLOGIES BEFORE CHANGE HOOK ===');
                console.log('Operation:', operation);
                console.log('Final data:', JSON.stringify(data, null, 2));
                console.log('=========================================\n');
                return data;
            }
        ]
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: 'Tên',
            required: true,
        },
        ...(0, slug_1.slugField)('name'),
        {
            name: 'type',
            type: 'select',
            label: 'Loại',
            required: true,
            options: [
                {
                    label: 'Công nghệ',
                    value: 'technology',
                },
                {
                    label: 'Đối tác',
                    value: 'partner',
                },
                {
                    label: 'Nhà cung cấp',
                    value: 'supplier',
                },
            ],
            admin: {
                position: 'sidebar',
            },
        }, {
            name: 'logo',
            type: 'upload',
            label: 'Logo',
            relationTo: 'media',
            required: false, // Temporarily make optional for debugging
        },
        {
            name: 'website',
            type: 'text',
            label: 'Website',
            admin: {
                description: 'URL website của công ty/đối tác (https://example.com)',
            },
        },
        {
            name: 'description',
            type: 'richText',
            label: 'Mô tả',
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
            label: 'Đối tác nổi bật',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Đánh dấu là đối tác nổi bật để hiện trên trang chủ',
            },
        }, {
            name: 'products',
            type: 'relationship',
            label: 'Sản phẩm liên quan',
            relationTo: 'products',
            hasMany: true,
            admin: {
                description: 'Các sản phẩm liên quan đến công nghệ/đối tác này',
                // Workaround for SortHeader error - add specific admin config
                isSortable: false,
            },
        },
        {
            name: 'certifications',
            type: 'array',
            label: 'Chứng chỉ',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Tên chứng chỉ',
                    required: true,
                },
                {
                    name: 'image',
                    type: 'upload',
                    label: 'Hình ảnh chứng chỉ',
                    relationTo: 'media',
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Mô tả',
                },
            ],
        },
        {
            name: 'status',
            type: 'select',
            label: 'Trạng thái',
            required: true,
            options: [
                {
                    label: 'Bản nháp',
                    value: 'draft',
                },
                {
                    label: 'Đã xuất bản',
                    value: 'published',
                },
            ],
            defaultValue: 'draft',
            admin: {
                position: 'sidebar',
            },
        },
    ],
};
