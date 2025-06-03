"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCategories = void 0;
const anyone_1 = require("../access/anyone");
const authenticated_1 = require("../access/authenticated");
const slug_1 = require("@/fields/slug");
exports.ServiceCategories = {
    slug: 'service-categories',
    access: {
        create: authenticated_1.authenticated,
        delete: authenticated_1.authenticated,
        read: anyone_1.anyone,
        update: authenticated_1.authenticated,
    },
    labels: {
        plural: 'Danh mục dịch vụ',
        singular: 'Danh mục dịch vụ',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug'],
        group: 'Dịch vụ',
        description: 'Quản lý danh mục phân loại dịch vụ.',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            label: 'Tên danh mục',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            label: 'Mô tả',
            admin: {
                position: 'sidebar',
            },
        },
        ...(0, slug_1.slugField)(),
    ],
};
