"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slugField = void 0;
const formatSlug_1 = require("./formatSlug");
const slugField = (fieldToUse = 'title', overrides = {}) => {
    const { slugOverrides, checkboxOverrides } = overrides;
    const checkBoxField = {
        name: 'slugLock',
        type: 'checkbox',
        defaultValue: true,
        admin: {
            hidden: true,
            position: 'sidebar',
        },
        ...checkboxOverrides,
    };
    // @ts-expect-error - ts mismatch Partial<TextField> with TextField
    const slugField = {
        name: 'slug',
        type: 'text',
        index: true,
        label: 'Slug',
        ...(slugOverrides || {}),
        hooks: {
            // Kept this in for hook or API based updates
            beforeValidate: [(0, formatSlug_1.formatSlugHook)(fieldToUse)],
        },
        admin: {
            position: 'sidebar',
            ...(slugOverrides?.admin || {}),
            components: {
                Field: {
                    path: '@/fields/slug/SlugComponent#SlugComponent',
                    clientProps: {
                        fieldToUse,
                        checkboxFieldPath: checkBoxField.name,
                    },
                },
            },
        },
    };
    return [slugField, checkBoxField];
};
exports.slugField = slugField;
