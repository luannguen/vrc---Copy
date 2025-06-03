"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navigation = void 0;
const authenticated_1 = require("../access/authenticated");
const authenticatedOrPublished_1 = require("../access/authenticatedOrPublished");
exports.Navigation = {
    slug: 'navigation',
    labels: {
        singular: 'Menu Item',
        plural: 'Navigation',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'type', 'status', 'order'],
        group: 'Nội dung',
    },
    access: {
        create: authenticated_1.authenticated,
        read: authenticatedOrPublished_1.authenticatedOrPublished,
        update: authenticated_1.authenticated,
        delete: authenticated_1.authenticated,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Tên menu',
            required: true,
        },
        {
            name: 'type',
            type: 'select',
            label: 'Loại menu',
            required: true,
            options: [
                {
                    label: 'Menu chính',
                    value: 'main',
                },
                {
                    label: 'Menu phụ',
                    value: 'secondary',
                },
                {
                    label: 'Menu footer',
                    value: 'footer',
                },
            ],
            defaultValue: 'main',
        },
        {
            name: 'order',
            type: 'number',
            label: 'Thứ tự',
            admin: {
                description: 'Số càng nhỏ thì hiển thị càng trước',
            },
            defaultValue: 0,
        },
        {
            name: 'items',
            type: 'array',
            label: 'Danh sách menu',
            fields: [
                {
                    name: 'label',
                    type: 'text',
                    label: 'Tên hiển thị',
                    required: true,
                },
                {
                    name: 'link',
                    type: 'text',
                    label: 'Đường dẫn',
                    required: true,
                },
                {
                    name: 'target',
                    type: 'select',
                    label: 'Cách mở liên kết',
                    options: [
                        {
                            label: 'Trang hiện tại',
                            value: '_self',
                        },
                        {
                            label: 'Trang mới',
                            value: '_blank',
                        },
                    ],
                    defaultValue: '_self',
                },
                {
                    name: 'icon',
                    type: 'text',
                    label: 'Icon (tùy chọn)',
                    admin: {
                        description: 'Nhập tên icon từ thư viện icon (ví dụ: home, phone, etc.)',
                    },
                },
                {
                    name: 'childItems',
                    type: 'array',
                    label: 'Menu con',
                    admin: {
                        description: 'Menu con (dropdown)',
                    },
                    fields: [
                        {
                            name: 'label',
                            type: 'text',
                            label: 'Tên hiển thị',
                            required: true,
                        },
                        {
                            name: 'link',
                            type: 'text',
                            label: 'Đường dẫn',
                            required: true,
                        },
                        {
                            name: 'target',
                            type: 'select',
                            label: 'Cách mở liên kết',
                            options: [
                                {
                                    label: 'Trang hiện tại',
                                    value: '_self',
                                },
                                {
                                    label: 'Trang mới',
                                    value: '_blank',
                                },
                            ],
                            defaultValue: '_self',
                        },
                    ],
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
