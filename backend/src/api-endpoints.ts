/**
 * This file lists all the API endpoints that have been created for the VRC project.
 * It serves as documentation for developers to easily find and use the available APIs.
 */

/**
 * Company Information API
 * 
 * GET /api/company-info
 * 
 * Returns the company information stored in the CompanyInfo global.
 * This includes contact details, social media links, and map information.
 * 
 * Example response:
 * {
 *   "companyName": "Tổng công ty Kỹ thuật lạnh Việt Nam (VRC)",
 *   "companyDescription": "Tiên phong trong lĩnh vực kỹ thuật lạnh tại Việt Nam",
 *   "contactSection": {
 *     "address": "123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh",
 *     "phone": "+84 (28) 1234 5678",
 *     "email": "info@vrcorp.vn",
 *     "hotline": "1800 1234",
 *     "workingHours": "8:00 - 17:30, Thứ 2 - Thứ 6"
 *   },
 *   ...
 * }
 */

/**
 * Contact Form Submission API
 * 
 * POST /api/contact
 * 
 * Accepts a contact form submission and stores it in the ContactSubmissions collection.
 * 
 * Request body:
 * {
 *   "name": "Nguyễn Văn A",        // Required
 *   "email": "example@email.com",   // Required
 *   "phone": "0123456789",          // Optional
 *   "subject": "general",           // Optional, defaults to "general"
 *   "message": "Nội dung liên hệ"   // Required
 * }
 * 
 * Example response (success):
 * {
 *   "success": true,
 *   "message": "Yêu cầu liên hệ đã được gửi thành công",
 *   "submission": {
 *     "id": "1234567890abcdef",
 *     "createdAt": "2023-05-15T12:34:56.789Z"
 *   }
 * }
 * 
 * Example response (error):
 * {
 *   "success": false,
 *   "message": "Vui lòng cung cấp đầy đủ thông tin: Họ tên, Email và Nội dung"
 * }
 */
