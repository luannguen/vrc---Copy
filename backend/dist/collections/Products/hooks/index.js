"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productHooks = void 0;
const revalidate_1 = require("./revalidate");
exports.productHooks = {
    afterDelete: [revalidate_1.revalidateAfterDelete],
};
