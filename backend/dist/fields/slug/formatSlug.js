"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSlugHook = exports.formatSlug = void 0;
const formatSlug = (val) => val
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
    .toLowerCase();
exports.formatSlug = formatSlug;
const formatSlugHook = (fallback) => ({ data, operation, value }) => {
    if (typeof value === 'string') {
        return (0, exports.formatSlug)(value);
    }
    if (operation === 'create' || !data?.slug) {
        const fallbackData = data?.[fallback] || data?.[fallback];
        if (fallbackData && typeof fallbackData === 'string') {
            return (0, exports.formatSlug)(fallbackData);
        }
    }
    return value;
};
exports.formatSlugHook = formatSlugHook;
