"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkGroup = void 0;
const deepMerge_1 = __importDefault(require("@/utilities/deepMerge"));
const link_1 = require("./link");
const linkGroup = ({ appearances, overrides = {} } = {}) => {
    const generatedLinkGroup = {
        name: 'links',
        type: 'array',
        fields: [
            (0, link_1.link)({
                appearances,
            }),
        ],
        admin: {
            initCollapsed: true,
        },
    };
    return (0, deepMerge_1.default)(generatedLinkGroup, overrides);
};
exports.linkGroup = linkGroup;
