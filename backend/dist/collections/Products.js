"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products = void 0;
const authenticated_1 = require("../access/authenticated");
const authenticatedOrPublished_1 = require("../access/authenticatedOrPublished");
const slug_1 = require("../fields/slug");
const hooks_1 = require("./Products/hooks");
exports.Products = {
    slug: 'products',
    labels: {
        singular: 'Sản phẩm',
        plural: 'Sản phẩm',
    }, admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'category', 'featured', 'status', 'updatedAt'],
        group: 'Sản phẩm',
        description: 'Quản lý sản phẩm và thông tin liên quan',
        listSearchableFields: ['name', 'description', 'excerpt', 'slug'],
        pagination: {
            defaultLimit: 20,
            limits: [10, 20, 50, 100],
        },
        enableRichTextLink: false,
        enableRichTextRelationship: false,
    }, access: {
        create: authenticated_1.authenticated,
        read: authenticatedOrPublished_1.authenticatedOrPublished,
        update: authenticated_1.authenticated,
        delete: authenticated_1.authenticated,
    }, hooks: {
        // Implement proper hooks for handling product deletion
        beforeDelete: [
            async ({ req, id }) => {
                try {
                    console.log(`Preparing to delete product with ID: ${id}`);
                    // Find products that reference this one using multiple query approaches
                    // Try both direct ID reference and object.value reference patterns
                    const queries = [
                        // Direct ID reference (most common) - use 'in' which is more reliable
                        {
                            'relatedProducts': {
                                in: [id]
                            }
                        }
                    ];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const allReferencingProducts = [];
                    for (const query of queries) {
                        try {
                            const result = await req.payload.find({
                                collection: 'products',
                                where: query,
                            });
                            if (result.docs.length > 0) {
                                allReferencingProducts.push(...result.docs);
                            }
                        }
                        catch (queryError) {
                            const errorMessage = queryError instanceof Error ? queryError.message : 'Unknown error';
                            console.log(`Query attempt failed (this is expected):`, errorMessage);
                        }
                    }
                    // Remove duplicates based on ID
                    const uniqueProducts = allReferencingProducts.filter((product, index, self) => index === self.findIndex(p => p.id === product.id));
                    if (uniqueProducts.length > 0) {
                        console.log(`Found ${uniqueProducts.length} products referencing this product. Updating references...`);
                        for (const product of uniqueProducts) {
                            if (product.relatedProducts && Array.isArray(product.relatedProducts)) {
                                // Remove the reference to the product being deleted
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                const updatedRelatedProducts = product.relatedProducts.filter((relatedItem) => {
                                    // Handle string ID
                                    if (typeof relatedItem === 'string') {
                                        return relatedItem !== id;
                                    }
                                    // Handle object with id property (populated)
                                    if (relatedItem && typeof relatedItem === 'object' && 'id' in relatedItem) {
                                        return relatedItem.id !== id;
                                    }
                                    // Handle object with value property (alternative format)
                                    if (relatedItem && typeof relatedItem === 'object' && 'value' in relatedItem) {
                                        return relatedItem.value !== id;
                                    }
                                    return true;
                                });
                                // Only update if there was actually a change
                                if (updatedRelatedProducts.length !== product.relatedProducts.length) {
                                    try {
                                        await req.payload.update({
                                            collection: 'products',
                                            id: product.id,
                                            data: {
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                relatedProducts: updatedRelatedProducts
                                            }
                                        });
                                        console.log(`Updated references in product: ${product.id} (removed ${product.relatedProducts.length - updatedRelatedProducts.length} references)`);
                                    }
                                    catch (updateError) {
                                        console.error(`Failed to update references in product ${product.id}:`, updateError);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        console.log(`No products found referencing product ${id}`);
                    }
                    return true; // Proceed with deletion
                }
                catch (error) {
                    console.error(`Error in beforeDelete hook for product ${id}:`, error);
                    // Return true to allow deletion to continue despite errors in the hook
                    return true;
                }
            }
        ], afterDelete: [
            async ({ req: _req, id, doc }) => {
                try {
                    console.log(`Product deleted successfully: ${id}`);
                    return doc;
                }
                catch (error) {
                    console.error(`Error in afterDelete hook for product ${id}:`, error);
                    return doc;
                }
            },
            // Add the revalidation hook to ensure the admin UI refreshes properly
            ...hooks_1.productHooks.afterDelete
        ]
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            label: 'Tên sản phẩm',
            required: true,
        },
        ...(0, slug_1.slugField)('name'),
        {
            name: 'excerpt',
            type: 'textarea',
            label: 'Mô tả ngắn',
            admin: {
                description: 'Mô tả ngắn gọn hiển thị trong danh sách sản phẩm',
            },
        },
        {
            name: 'description',
            type: 'richText',
            label: 'Mô tả chi tiết',
        },
        {
            name: 'mainImage',
            type: 'upload',
            label: 'Hình ảnh chính',
            relationTo: 'media',
            required: true,
        }, {
            name: 'gallery',
            type: 'array',
            label: 'Thư viện ảnh',
            defaultValue: [],
            fields: [
                {
                    name: 'image',
                    type: 'upload',
                    label: 'Hình ảnh',
                    relationTo: 'media',
                    required: true,
                },
                {
                    name: 'caption',
                    type: 'text',
                    label: 'Chú thích',
                },
            ],
        }, {
            name: 'category',
            type: 'relationship',
            label: 'Danh mục sản phẩm',
            relationTo: 'product-categories',
            hasMany: false,
            admin: {
                position: 'sidebar',
                description: 'Chọn danh mục chính cho sản phẩm này',
            },
        }, {
            name: 'tags',
            type: 'relationship',
            label: 'Thẻ/Tags',
            relationTo: 'categories',
            hasMany: true,
            filterOptions: ({ relationTo: _relationTo }) => {
                return {
                    type: { equals: 'tag' },
                };
            },
            admin: {
                position: 'sidebar',
                description: 'Chọn các thẻ (tags) để phân loại bổ sung cho sản phẩm',
            },
        },
        {
            name: 'featured',
            type: 'checkbox',
            label: 'Sản phẩm nổi bật',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Đánh dấu là sản phẩm nổi bật để hiện trên trang chủ',
            },
        }, {
            name: 'relatedProducts',
            type: 'relationship',
            label: 'Sản phẩm liên quan',
            relationTo: 'products',
            hasMany: true,
            defaultValue: [],
            admin: {
                description: 'Chọn các sản phẩm liên quan để hiển thị phía dưới',
                allowCreate: false,
                isSortable: true,
                position: 'sidebar',
            },
        },
        {
            name: 'specifications',
            type: 'array',
            label: 'Thông số kỹ thuật',
            defaultValue: [],
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    label: 'Tên thông số',
                    required: true,
                },
                {
                    name: 'value',
                    type: 'text',
                    label: 'Giá trị',
                    required: true,
                },
            ],
        },
        {
            name: 'documents',
            type: 'array',
            label: 'Tài liệu',
            defaultValue: [],
            fields: [
                {
                    name: 'name',
                    type: 'text',
                    label: 'Tên tài liệu',
                    required: true,
                },
                {
                    name: 'file',
                    type: 'upload',
                    label: 'Tập tin',
                    relationTo: 'media',
                    required: true,
                },
            ],
        }, {
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
                {
                    label: 'Sản phẩm mới',
                    value: 'new',
                },
                {
                    label: 'Sản phẩm đặc biệt',
                    value: 'special',
                },
                {
                    label: 'Ngừng kinh doanh',
                    value: 'discontinued',
                }
            ],
            defaultValue: 'draft',
            admin: {
                position: 'sidebar',
            },
        },
        {
            name: 'productCode',
            type: 'text',
            label: 'Mã sản phẩm',
            admin: {
                position: 'sidebar',
                description: 'Mã nội bộ hoặc mã SKU của sản phẩm',
            },
        },
        {
            name: 'sortOrder',
            type: 'number',
            label: 'Thứ tự hiển thị',
            defaultValue: 999,
            admin: {
                position: 'sidebar',
                description: 'Số thấp hơn sẽ hiển thị trước',
            },
        },
        {
            name: 'meta',
            type: 'group',
            label: 'SEO & Metadata',
            fields: [
                {
                    name: 'title',
                    type: 'text',
                    label: 'Meta Title',
                },
                {
                    name: 'description',
                    type: 'textarea',
                    label: 'Meta Description',
                },
                {
                    name: 'image',
                    type: 'upload',
                    label: 'Meta Image',
                    relationTo: 'media',
                },
            ],
        },
    ],
};
