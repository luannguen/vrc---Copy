// filepath: e:\Download\vrc\backend\src\seed\utils\pathConfig.ts
/**
 * Cấu hình đường dẫn tuyệt đối cho dự án
 * Giúp giảm thiểu rủi ro khi cấu trúc thư mục thay đổi
 */
import path from 'path';
import fs from 'fs';

// Xác định đường dẫn gốc của dự án
// Sử dụng __dirname thay vì process.cwd() để đảm bảo đường dẫn luôn đúng
// __dirname là thư mục chứa file hiện tại (backend/src/seed/utils)
const PROJECT_ROOT = path.resolve(__dirname, '../../../..');

// Cấu hình các đường dẫn tuyệt đối
export const PATHS = {
  FRONTEND_ROOT: path.join(PROJECT_ROOT, 'vrcfrontend'),
  FRONTEND_PUBLIC: path.join(PROJECT_ROOT, 'vrcfrontend', 'public'),
  FRONTEND_ASSETS: {
    SVG: path.join(PROJECT_ROOT, 'vrcfrontend', 'public', 'assets', 'svg'),
    IMAGES: path.join(PROJECT_ROOT, 'vrcfrontend', 'public', 'assets', 'images'),
    UPLOADS: path.join(PROJECT_ROOT, 'vrcfrontend', 'public', 'lovable-uploads')
  },
  BACKEND_MEDIA: path.join(PROJECT_ROOT, 'backend', 'media')
};

// Hàm tiện ích để lấy đường dẫn tuyệt đối
export function getAbsolutePath(relativePath: string): string {
  return path.join(PROJECT_ROOT, relativePath);
}

// Hàm kiểm tra xem đường dẫn có tồn tại không
export function pathExists(pathToCheck: string): boolean {
  try {
    // Using the fs import at the top of the file
    return fs.existsSync(pathToCheck);
  } catch (error) {
    console.error(`Error checking if path exists: ${pathToCheck}`, error);
    return false;
  }
}

// Hàm lấy các đường dẫn để tìm hình ảnh
export function getImageSearchPaths(): string[] {
  return [
    // SVG logos
    PATHS.FRONTEND_ASSETS.SVG,
    // Image files 
    PATHS.FRONTEND_ASSETS.IMAGES,
    // Lovable uploads
    PATHS.FRONTEND_ASSETS.UPLOADS,
    // Public directory
    PATHS.FRONTEND_PUBLIC
  ];
}
