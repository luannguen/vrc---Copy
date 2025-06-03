"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.technologyImageMap = exports.companyLogoMap = void 0;
exports.uploadMediaFromFrontend = uploadMediaFromFrontend;
exports.uploadCompanyLogo = uploadCompanyLogo;
exports.uploadTechnologyImage = uploadTechnologyImage;
exports.getDefaultMediaId = getDefaultMediaId;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pathConfig_1 = require("./pathConfig");
const fileUtils_1 = require("./fileUtils");
const progressUtils_1 = require("./progressUtils");
/**
 * Maps company names to their respective logo filenames
 * Sử dụng logo mặc định vì các logo riêng không có sẵn
 */
exports.companyLogoMap = {
    'Daikin': 'logo.svg',
    'Carrier': 'logo.svg',
    'Mitsubishi Electric': 'logo.svg',
    'Trane': 'logo.svg',
    'LG Electronics': 'logo.svg',
    'York': 'logo.svg',
    'Danfoss': 'logo.svg',
    'Emerson': 'logo.svg',
    // Default logo for any missing mappings
    'default': 'logo.svg',
};
/**
 * Maps technology names to their respective image filenames
 * Sử dụng hình ảnh có sẵn thay vì các hình ảnh riêng
 */
exports.technologyImageMap = {
    'Inverter DC': 'service-overview.jpg',
    'Smart Control System': 'projects-overview.jpg',
    'Green Refrigerant': 'service-overview.jpg',
    // Default technology image
    'default': 'service-overview.jpg',
};
/**
 * Cache of uploaded media IDs to prevent duplicate uploads
 */
const _mediaCache = {};
/**
 * Upload an image from the frontend to the backend media collection
 * Triển khai đầy đủ phương pháp upload file thực sự
 *
 * @param payload Payload instance
 * @param imagePath Path to the image file in the frontend
 * @param alt Alt text for the image
 * @returns The ID of the uploaded media
 */
async function uploadMediaFromFrontend(payload, imagePath, alt) {
    try {
        // Sử dụng hàm tiện ích mới để upload file với cache
        return await (0, fileUtils_1.uploadFileWithCache)(payload, imagePath, alt);
    }
    catch (error) {
        console.error(`Error uploading media from ${imagePath}:`, error);
        return null;
    }
}
/**
 * Get MIME type for a file extension
 */
function _getMimeType(extension) {
    const types = {
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp',
    };
    return types[extension.toLowerCase()] || 'application/octet-stream';
}
/**
 * Upload company logo from frontend
 *
 * @param payload Payload instance
 * @param companyName The company name to find the appropriate logo
 * @returns The ID of the uploaded logo
 */
async function uploadCompanyLogo(payload, companyName) {
    // Initialize progress bar for logo upload
    progressUtils_1.progressManager.initProgressBar(1, `Uploading logo for ${companyName}`);
    // Get logo filename with null check, ensure it's always a string
    const logoFilename = exports.companyLogoMap[companyName] ?? exports.companyLogoMap['default'] ?? 'logo.svg';
    // Check frontend asset directories for the logo using absolute paths
    const possiblePaths = [
        // Common locations - using absolute paths
        path_1.default.join(pathConfig_1.PATHS.FRONTEND_ASSETS.SVG, logoFilename),
        path_1.default.join(pathConfig_1.PATHS.FRONTEND_ASSETS.IMAGES, logoFilename),
        path_1.default.join(pathConfig_1.PATHS.FRONTEND_ASSETS.UPLOADS, logoFilename),
        // Use default logo if specific logo not found
        path_1.default.join(pathConfig_1.PATHS.FRONTEND_ASSETS.SVG, 'logo.svg'),
    ];
    // Find the first path that exists
    for (const imagePath of possiblePaths) {
        if (fs_1.default.existsSync(imagePath)) {
            const mediaId = await uploadMediaFromFrontend(payload, imagePath, `Logo of ${companyName}`);
            progressUtils_1.progressManager.increment();
            progressUtils_1.progressManager.complete();
            return mediaId;
        }
    }
    // If no logo is found, use any available image
    const fallbackImage = path_1.default.join(process.cwd(), '../vrcfrontend/public/assets/svg/logo.svg');
    if (fs_1.default.existsSync(fallbackImage)) {
        const mediaId = await uploadMediaFromFrontend(payload, fallbackImage, `Generic logo for ${companyName}`);
        progressUtils_1.progressManager.increment();
        progressUtils_1.progressManager.complete();
        return mediaId;
    }
    console.error(`Could not find any suitable logo for ${companyName}`);
    progressUtils_1.progressManager.complete(); // Complete progress bar even if failed
    return null;
}
/**
 * Upload a technology image from frontend
 */
async function uploadTechnologyImage(payload, technologyName) {
    // Initialize progress bar for technology image upload
    progressUtils_1.progressManager.initProgressBar(1, `Uploading image for technology: ${technologyName}`);
    // Ensure we always have a string by providing a fallback
    const imageFilename = exports.technologyImageMap[technologyName] ?? exports.technologyImageMap['default'] ?? 'technology-default.jpg';
    // Check frontend asset directories with absolute paths
    const possiblePaths = [
        path_1.default.join(pathConfig_1.PATHS.FRONTEND_ASSETS.IMAGES, imageFilename),
        // Project and service images can be reused for technologies
        path_1.default.join(pathConfig_1.PATHS.FRONTEND_ASSETS.IMAGES, 'projects-overview.jpg'),
        path_1.default.join(pathConfig_1.PATHS.FRONTEND_ASSETS.IMAGES, 'service-overview.jpg'),
    ];
    for (const imagePath of possiblePaths) {
        if (fs_1.default.existsSync(imagePath)) {
            const mediaId = await uploadMediaFromFrontend(payload, imagePath, `Image for ${technologyName}`);
            progressUtils_1.progressManager.increment();
            progressUtils_1.progressManager.complete();
            return mediaId;
        }
    }
    console.error(`Could not find any suitable image for technology: ${technologyName}`);
    progressUtils_1.progressManager.complete(); // Complete progress bar even if failed
    return null;
}
/**
 * Get or create a default media item
 * This is a fallback if no suitable image can be found
 */
async function getDefaultMediaId(payload) {
    try {
        // Initialize progress bar for getting default media
        progressUtils_1.progressManager.initProgressBar(1, 'Getting default media');
        // Try to use an existing media item first
        const media = await payload.find({
            collection: 'media',
            limit: 1,
        });
        if (media?.docs && media.docs.length > 0 && media.docs[0]?.id) {
            progressUtils_1.progressManager.increment();
            progressUtils_1.progressManager.complete();
            return media.docs[0].id;
        }
        // If no media exists, upload the default logo using absolute path
        const defaultLogoPath = path_1.default.join(pathConfig_1.PATHS.FRONTEND_ASSETS.SVG, 'logo.svg');
        if (fs_1.default.existsSync(defaultLogoPath)) {
            const mediaId = await uploadMediaFromFrontend(payload, defaultLogoPath, 'Default logo');
            progressUtils_1.progressManager.increment();
            progressUtils_1.progressManager.complete();
            return mediaId;
        }
        progressUtils_1.progressManager.complete(); // Complete progress bar even if failed
        return null;
    }
    catch (error) {
        console.error('Error fetching default media:', error);
        progressUtils_1.progressManager.complete(); // Complete progress bar on error
        return null;
    }
}
