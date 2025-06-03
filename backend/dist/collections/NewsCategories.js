"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsCategories = void 0;
const anyone_1 = require("../access/anyone");
const authenticated_1 = require("../access/authenticated");
const slug_1 = require("@/fields/slug");
exports.NewsCategories = {
    slug: 'news-categories',
    access: {
        create: authenticated_1.authenticated,
        delete: authenticated_1.authenticated,
        read: anyone_1.anyone,
        update: authenticated_1.authenticated,
    },
    labels: {
        plural: 'Danh mục tin tức',
        singular: 'Danh mục tin tức',
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'slug'],
        group: 'Tin tức & Bài viết',
        description: 'Quản lý danh mục phân loại tin tức và bài viết.',
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
