"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Posts = void 0;
const richtext_lexical_1 = require("@payloadcms/richtext-lexical");
const authenticated_1 = require("../../access/authenticated");
const authenticatedOrPublished_1 = require("../../access/authenticatedOrPublished");
const config_1 = require("../../blocks/Banner/config");
const config_2 = require("../../blocks/Code/config");
const config_3 = require("../../blocks/MediaBlock/config");
const generatePreviewPath_1 = require("../../utilities/generatePreviewPath");
const populateAuthors_1 = require("./hooks/populateAuthors");
const revalidatePost_1 = require("./hooks/revalidatePost");
const fields_1 = require("@payloadcms/plugin-seo/fields");
const slug_1 = require("@/fields/slug");
exports.Posts = {
    slug: 'posts',
    access: {
        create: authenticated_1.authenticated,
        delete: authenticated_1.authenticated,
        read: authenticatedOrPublished_1.authenticatedOrPublished,
        update: authenticated_1.authenticated,
    },
    // This config controls what's populated by default when a post is referenced
    defaultPopulate: {
        title: true,
        slug: true,
        categories: true,
        meta: {
            image: true,
            description: true,
        },
    },
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'categories', 'status', 'updatedAt'],
        group: 'Tin tức & Bài viết',
        description: 'Quản lý tin tức, bài viết và nội dung liên quan',
        livePreview: {
            url: ({ data, req }) => {
                const path = (0, generatePreviewPath_1.generatePreviewPath)({
                    slug: typeof data?.slug === 'string' ? data.slug : '',
                    collection: 'posts',
                    req,
                });
                return path;
            },
        },
        preview: (data, { req }) => (0, generatePreviewPath_1.generatePreviewPath)({
            slug: typeof data?.slug === 'string' ? data.slug : '',
            collection: 'posts',
            req,
        }),
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            type: 'tabs',
            tabs: [
                {
                    fields: [
                        {
                            name: 'heroImage',
                            type: 'upload',
                            relationTo: 'media',
                        },
                        {
                            name: 'content',
                            type: 'richText',
                            editor: (0, richtext_lexical_1.lexicalEditor)({
                                features: ({ rootFeatures }) => {
                                    return [
                                        ...rootFeatures,
                                        (0, richtext_lexical_1.HeadingFeature)({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                                        (0, richtext_lexical_1.BlocksFeature)({ blocks: [config_1.Banner, config_2.Code, config_3.MediaBlock] }),
                                        (0, richtext_lexical_1.FixedToolbarFeature)(),
                                        (0, richtext_lexical_1.InlineToolbarFeature)(),
                                        (0, richtext_lexical_1.HorizontalRuleFeature)(),
                                    ];
                                },
                            }),
                            label: false,
                            required: true,
                        },
                    ],
                    label: 'Content',
                }, {
                    fields: [
                        {
                            name: 'relatedPosts',
                            type: 'relationship',
                            admin: {
                                position: 'sidebar',
                                description: 'Chọn các bài viết liên quan',
                            },
                            hasMany: true,
                            relationTo: 'posts',
                            filterOptions: ({ id }) => {
                                return {
                                    id: {
                                        not_in: [id || ''],
                                    },
                                };
                            },
                        },
                        {
                            name: 'categories',
                            type: 'relationship',
                            admin: {
                                position: 'sidebar',
                                description: 'Chọn danh mục cho bài viết',
                            },
                            hasMany: true,
                            relationTo: 'news-categories',
                        },
                        {
                            name: 'tags',
                            type: 'relationship',
                            admin: {
                                position: 'sidebar',
                                description: 'Chọn các thẻ cho bài viết (để phân loại và tìm kiếm)',
                            },
                            hasMany: true,
                            relationTo: 'categories',
                            filterOptions: {
                                type: {
                                    equals: 'tag',
                                },
                            },
                        },
                    ],
                    label: 'Meta',
                }, {
                    name: 'meta',
                    label: 'SEO',
                    fields: [
                        (0, fields_1.OverviewField)({
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                            imagePath: 'meta.image',
                        }),
                        (0, fields_1.MetaTitleField)({
                            hasGenerateFn: true,
                        }),
                        (0, fields_1.MetaImageField)({
                            relationTo: 'media',
                        }),
                        (0, fields_1.MetaDescriptionField)({}),
                        (0, fields_1.PreviewField)({
                            hasGenerateFn: true,
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                        }),
                    ],
                },
            ],
        },
        {
            name: 'publishedAt',
            type: 'date',
            admin: {
                date: {
                    pickerAppearance: 'dayAndTime',
                },
                position: 'sidebar',
            },
            hooks: {
                beforeChange: [
                    ({ siblingData, value }) => {
                        if (siblingData._status === 'published' && !value) {
                            return new Date();
                        }
                        return value;
                    },
                ],
            },
        },
        {
            name: 'authors',
            type: 'relationship',
            admin: {
                position: 'sidebar',
            },
            hasMany: true,
            relationTo: 'users',
        },
        // This field is only used to populate the user data via the `populateAuthors` hook
        // This is because the `user` collection has access control locked to protect user privacy
        // GraphQL will also not return mutated user data that differs from the underlying schema
        {
            name: 'populatedAuthors',
            type: 'array',
            access: {
                update: () => false,
            },
            admin: {
                disabled: true,
                readOnly: true,
            },
            fields: [
                {
                    name: 'id',
                    type: 'text',
                },
                {
                    name: 'name',
                    type: 'text',
                },
            ],
        },
        ...(0, slug_1.slugField)(),
    ],
    hooks: {
        afterChange: [revalidatePost_1.revalidatePost],
        afterRead: [populateAuthors_1.populateAuthors],
        afterDelete: [revalidatePost_1.revalidateDelete],
    },
    versions: {
        drafts: {
            autosave: {
                interval: 100, // We set this interval for optimal live preview
            },
            schedulePublish: true,
        },
        maxPerDoc: 50,
    },
};
