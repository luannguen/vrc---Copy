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

/**
 * FAQs API
 *
 * GET /api/custom/faqs
 *
 * Returns a paginated list of published FAQs with filtering options.
 *
 * Query parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - category: string (optional) - Filter by category
 * - featured: boolean (optional) - Filter featured FAQs
 * - popular: boolean (optional) - Filter popular FAQs
 * - search: string (optional) - Search in question and keywords
 * - tags: string|array (optional) - Filter by tags
 * - language: string (default: 'vi') - Language filter
 * - sort: string (default: 'order') - Sort field
 *
 * Example response:
 * {
 *   "success": true,
 *   "message": "FAQs retrieved successfully",
 *   "data": {
 *     "docs": [...],
 *     "totalDocs": 25,
 *     "limit": 10,
 *     "page": 1,
 *     "totalPages": 3
 *   }
 * }
 */

/**
 * GET /api/custom/faqs/categories
 *
 * Returns available FAQ categories with document counts.
 *
 * Query parameters:
 * - language: string (default: 'vi') - Language filter
 *
 * Example response:
 * {
 *   "success": true,
 *   "message": "FAQ categories retrieved successfully",
 *   "data": [
 *     {
 *       "value": "services",
 *       "label": "Dịch vụ",
 *       "count": 8
 *     },
 *     ...
 *   ]
 * }
 */

/**
 * GET /api/custom/faqs/popular
 *
 * Returns popular FAQs (marked as popular in admin).
 *
 * Query parameters:
 * - limit: number (default: 5)
 * - language: string (default: 'vi')
 *
 * Example response:
 * {
 *   "success": true,
 *   "message": "Popular FAQs retrieved successfully",
 *   "data": [...]
 * }
 */

/**
 * GET /api/custom/faqs/featured
 *
 * Returns featured FAQs.
 *
 * Query parameters:
 * - limit: number (default: 6)
 * - language: string (default: 'vi')
 *
 * Example response:
 * {
 *   "success": true,
 *   "message": "Featured FAQs retrieved successfully",
 *   "data": [...]
 * }
 */

/**
 * GET /api/custom/faqs/search
 *
 * Search FAQs by keyword.
 *
 * Query parameters:
 * - q: string (required) - Search query
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - language: string (default: 'vi')
 * - category: string (optional) - Filter by category
 * - sort: string (default: '-helpfulCount')
 *
 * Example response:
 * {
 *   "success": true,
 *   "message": "Search completed successfully",
 *   "data": {...},
 *   "query": "search term"
 * }
 */
