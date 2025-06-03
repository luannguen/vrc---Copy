"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultLexical = void 0;
const richtext_lexical_1 = require("@payloadcms/richtext-lexical");
exports.defaultLexical = (0, richtext_lexical_1.lexicalEditor)({
    features: [
        (0, richtext_lexical_1.ParagraphFeature)(),
        (0, richtext_lexical_1.UnderlineFeature)(),
        (0, richtext_lexical_1.BoldFeature)(),
        (0, richtext_lexical_1.ItalicFeature)(),
        (0, richtext_lexical_1.LinkFeature)({
            enabledCollections: ['pages', 'posts'],
            fields: ({ defaultFields }) => {
                const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
                    if ('name' in field && field.name === 'url')
                        return false;
                    return true;
                });
                return [
                    ...defaultFieldsWithoutUrl,
                    {
                        name: 'url',
                        type: 'text',
                        admin: {
                            condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
                        },
                        label: ({ t }) => t('fields:enterURL'),
                        required: true,
                        validate: ((value, options) => {
                            if (options?.siblingData?.linkType === 'internal') {
                                return true; // no validation needed, as no url should exist for internal links
                            }
                            return value ? true : 'URL is required';
                        }),
                    },
                ];
            },
        }),
    ],
});
