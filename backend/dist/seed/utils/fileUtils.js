"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageDimensions = getImageDimensions;
exports.ensureDirectoryExists = ensureDirectoryExists;
exports.generateUniqueFilename = generateUniqueFilename;
exports.getMimeType = getMimeType;
exports.uploadFileToPayloadMedia = uploadFileToPayloadMedia;
exports.uploadFileWithCache = uploadFileWithCache;
/**
 * Tiện ích xử lý hình ảnh và file
 * Cung cấp các hàm nâng cao để làm việc với file hình ảnh
 */
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pathConfig_1 = require("./pathConfig");
// Import image-size một cách chính xác
const image_size_1 = __importDefault(require("image-size"));
/**
 * Lấy kích thước của hình ảnh
 * Sử dụng thư viện image-size để lấy kích thước thật của hình ảnh
 *
 * @param filePath Đường dẫn đến file hình ảnh
 * @returns Kích thước hình ảnh (width, height) hoặc giá trị mặc định
 */
function getImageDimensions(filePath) {
    try {
        // Kiểm tra file tồn tại trước khi đọc
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        // Sử dụng Buffer để xử lý file và lấy kích thước
        const fileBuffer = fs.readFileSync(filePath);
        const dimensions = (0, image_size_1.default)(fileBuffer);
        // Nếu đọc được kích thước thật
        if (dimensions && dimensions.width && dimensions.height) {
            return {
                width: dimensions.width,
                height: dimensions.height
            };
        }
        // Fallback nếu không đọc được kích thước
        const fileExt = path.extname(filePath).toLowerCase();
        if (fileExt === '.svg') {
            return { width: 512, height: 512 }; // Default for SVG icons
        }
        else if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
            return { width: 1920, height: 1080 }; // Default for photos
        }
        else {
            return { width: 800, height: 600 }; // Default for other images
        }
    }
    catch (error) {
        console.error(`Error getting image dimensions for ${filePath}:`, error);
        // Fallback khi có lỗi
        const fileExt = path.extname(filePath).toLowerCase();
        if (fileExt === '.svg') {
            return { width: 512, height: 512 };
        }
        else if (['.jpg', '.jpeg', '.png'].includes(fileExt)) {
            return { width: 1920, height: 1080 };
        }
        else {
            return { width: 800, height: 600 };
        }
    }
}
/**
 * Tạo thư mục nếu không tồn tại
 *
 * @param dirPath Đường dẫn thư mục cần tạo
 */
function ensureDirectoryExists(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dirPath}`);
        }
    }
    catch (error) {
        console.error(`Error creating directory: ${dirPath}`, error);
    }
}
/**
 * Tạo tên file duy nhất với timestamp
 *
 * @param originalFilename Tên file ban đầu
 * @returns Tên file duy nhất với timestamp
 */
function generateUniqueFilename(originalFilename) {
    const fileExt = path.extname(originalFilename);
    const baseName = path.basename(originalFilename, fileExt);
    return `${baseName}-${Date.now()}${fileExt}`;
}
/**
 * Lấy MIME type từ phần mở rộng file
 *
 * @param extension Phần mở rộng file (không bao gồm dấu chấm)
 * @returns MIME type tương ứng
 */
function getMimeType(extension) {
    const types = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp',
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'ppt': 'application/vnd.ms-powerpoint',
        'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    };
    return types[extension.toLowerCase()] || 'application/octet-stream';
}
/**
 * Đường dẫn đến các file fallback mặc định
 */
const DEFAULT_FILES = {
    IMAGE: path.join(pathConfig_1.PATHS.FRONTEND_ASSETS.IMAGES, 'projects-overview.jpg'),
    LOGO: path.join(pathConfig_1.PATHS.FRONTEND_ASSETS.SVG, 'logo.svg'),
    DOCUMENT: path.join(pathConfig_1.PATHS.FRONTEND_PUBLIC, 'placeholder.svg'),
};
/**
 * Cache đã upload để tránh upload trùng lặp
 */
const uploadedFileCache = {};
/**
 * Tải file lên thư mục media của Payload CMS với thông tin đầy đủ
 *
 * @param payload Payload instance
 * @param sourceFilePath Đường dẫn đến file nguồn
 * @param altText Alt text cho file media
 * @returns ID của media đã tải lên hoặc null nếu có lỗi
 */
async function uploadFileToPayloadMedia(payload, sourceFilePath, altText) {
    try {
        // Kiểm tra file tồn tại
        if (!fs.existsSync(sourceFilePath)) {
            console.error(`File not found: ${sourceFilePath}`);
            return null;
        }
        // Kiểm tra payload đã khởi tạo
        if (!payload) {
            console.error('Payload instance is not initialized');
            return null;
        }
        const fileName = path.basename(sourceFilePath);
        const fileExt = path.extname(fileName).toLowerCase();
        // Tạo tên file duy nhất
        const uniqueFileName = generateUniqueFilename(fileName);
        // Đảm bảo thư mục media tồn tại
        ensureDirectoryExists(pathConfig_1.PATHS.BACKEND_MEDIA);
        // Đường dẫn đích trong thư mục media
        const destinationPath = path.join(pathConfig_1.PATHS.BACKEND_MEDIA, uniqueFileName);
        // Lấy kích thước file và hình ảnh
        const fileSizeBytes = fs.statSync(sourceFilePath).size;
        const dimensions = getImageDimensions(sourceFilePath);
        // Sao chép file
        try {
            fs.copyFileSync(sourceFilePath, destinationPath);
            console.log(`Copied file from ${sourceFilePath} to ${destinationPath}`);
        }
        catch (copyError) {
            console.error(`Error copying file from ${sourceFilePath} to ${destinationPath}:`, copyError);
            return null;
        }
        // Tạo bản ghi media
        try {
            const mediaDoc = await payload.create({
                collection: 'media',
                data: {
                    alt: altText || 'Image upload from seed',
                    filename: uniqueFileName,
                    url: `/media/${uniqueFileName}`,
                    mimeType: getMimeType(fileExt.slice(1)),
                    filesize: fileSizeBytes,
                    width: dimensions.width,
                    height: dimensions.height,
                }
            });
            if (mediaDoc?.id) {
                console.log(`Created media record for ${uniqueFileName} with ID: ${mediaDoc.id}`);
                return mediaDoc.id;
            }
        }
        catch (createError) {
            console.error(`Error creating media record for ${uniqueFileName}:`, createError);
            return null;
        }
        return null; // Đảm bảo luôn có giá trị trả về
    }
    catch (error) {
        console.error(`Error uploading file: ${sourceFilePath}`, error);
        return null;
    }
}
/**
 * Upload file với cache để tránh upload trùng lặp
 * Bao gồm xử lý fallback cho các file không tồn tại
 *
 * @param payload Payload instance
 * @param sourceFilePath Đường dẫn file nguồn
 * @param altText Alt text cho media
 * @returns ID của media đã tải lên
 */
async function uploadFileWithCache(payload, sourceFilePath, altText) {
    try {
        // Kiểm tra cache trước
        if (uploadedFileCache[sourceFilePath]) {
            console.log(`Using cached media ID for ${sourceFilePath}: ${uploadedFileCache[sourceFilePath]}`);
            return uploadedFileCache[sourceFilePath] || null;
        }
        // Kiểm tra file tồn tại
        if (!fs.existsSync(sourceFilePath)) {
            console.warn(`File not found: ${sourceFilePath}, using fallback file`);
            // Sử dụng file fallback dựa vào loại file
            let fallbackFile = DEFAULT_FILES.IMAGE;
            // Xác định loại file dựa vào phần mở rộng
            const fileExt = path.extname(sourceFilePath).toLowerCase();
            if (fileExt === '.svg') {
                fallbackFile = DEFAULT_FILES.LOGO;
            }
            else if (['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'].includes(fileExt)) {
                fallbackFile = DEFAULT_FILES.DOCUMENT;
            }
            // Nếu file fallback tồn tại, sử dụng nó thay thế
            if (fs.existsSync(fallbackFile)) {
                console.log(`Using fallback file: ${fallbackFile}`);
                sourceFilePath = fallbackFile;
            }
            else {
                console.error(`Fallback file not found: ${fallbackFile}`);
                return null;
            }
        }
        // Upload file và lưu vào cache
        const mediaId = await uploadFileToPayloadMedia(payload, sourceFilePath, altText);
        if (mediaId) {
            uploadedFileCache[sourceFilePath] = mediaId;
        }
        return mediaId;
    }
    catch (error) {
        console.error(`Error in uploadFileWithCache for ${sourceFilePath}:`, error);
        return null;
    }
}
