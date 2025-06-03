"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATHS = void 0;
exports.getAbsolutePath = getAbsolutePath;
exports.pathExists = pathExists;
exports.getImageSearchPaths = getImageSearchPaths;
// filepath: e:\Download\vrc\backend\src\seed\utils\pathConfig.ts
/**
 * Cấu hình đường dẫn tuyệt đối cho dự án
 * Giúp giảm thiểu rủi ro khi cấu trúc thư mục thay đổi
 */
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const url_1 = require("url");
// Xác định đường dẫn gốc của dự án cho ES modules
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const PROJECT_ROOT = path_1.default.resolve(__dirname, '../../../..');
// Cấu hình các đường dẫn tuyệt đối
exports.PATHS = {
    FRONTEND_ROOT: path_1.default.join(PROJECT_ROOT, 'vrcfrontend'),
    FRONTEND_PUBLIC: path_1.default.join(PROJECT_ROOT, 'vrcfrontend', 'public'),
    FRONTEND_ASSETS: {
        SVG: path_1.default.join(PROJECT_ROOT, 'vrcfrontend', 'public', 'assets', 'svg'),
        IMAGES: path_1.default.join(PROJECT_ROOT, 'vrcfrontend', 'public', 'assets', 'images'),
        UPLOADS: path_1.default.join(PROJECT_ROOT, 'vrcfrontend', 'public', 'lovable-uploads')
    },
    BACKEND_MEDIA: path_1.default.join(PROJECT_ROOT, 'backend', 'media')
};
// Hàm tiện ích để lấy đường dẫn tuyệt đối
function getAbsolutePath(relativePath) {
    return path_1.default.join(PROJECT_ROOT, relativePath);
}
// Hàm kiểm tra xem đường dẫn có tồn tại không
function pathExists(pathToCheck) {
    try {
        // Using the fs import at the top of the file
        return fs_1.default.existsSync(pathToCheck);
    }
    catch (error) {
        console.error(`Error checking if path exists: ${pathToCheck}`, error);
        return false;
    }
}
// Hàm lấy các đường dẫn để tìm hình ảnh
function getImageSearchPaths() {
    return [
        // SVG logos
        exports.PATHS.FRONTEND_ASSETS.SVG,
        // Image files
        exports.PATHS.FRONTEND_ASSETS.IMAGES,
        // Lovable uploads
        exports.PATHS.FRONTEND_ASSETS.UPLOADS,
        // Public directory
        exports.PATHS.FRONTEND_PUBLIC
    ];
}
