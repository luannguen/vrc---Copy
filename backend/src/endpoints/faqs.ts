import { APIError } from 'payload';
import { Endpoint } from 'payload';
import type { Where } from 'payload';

// Interface for category count
interface CategoryCount {
  value: string;
  count: number;
  label?: string;
}

// GET /api/custom/faqs - Lấy danh sách FAQs với filter
export const getFAQsEndpoint: Endpoint = {
  path: '/faqs',
  method: 'get',
  handler: async (req) => {
    try {
      const { payload, query } = req;

      // Lấy query parameters
      const {
        page = 1,
        limit = 10,
        category,
        featured,
        popular,
        search,
        tags,
        language = 'vi',
        sort = 'order',
      } = query;

      // Build where clause
      const where: Where = {
        status: { equals: 'published' },
        language: { equals: language },
      };

      if (category) {
        where.category = { equals: category };
      }

      if (featured === 'true') {
        where.featured = { equals: true };
      }

      if (popular === 'true') {
        where.isPopular = { equals: true };
      }

      if (search) {
        where.or = [
          { question: { contains: search } },
          { searchKeywords: { contains: search } },
        ];
      }

      if (tags) {
        where['tags.tag'] = { in: Array.isArray(tags) ? tags : [tags] };
      }

      // Thực hiện query
      const result = await payload.find({
        collection: 'faqs',
        where,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: sort as string,
      });

      return Response.json({
        success: true,
        message: 'FAQs retrieved successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error getting FAQs:', error);
      throw new APIError('Failed to get FAQs', 500);
    }
  },
};

// GET /api/custom/faqs/categories - Lấy danh sách categories
export const getFAQCategoriesEndpoint: Endpoint = {
  path: '/faqs/categories',
  method: 'get',
  handler: async (req) => {
    try {
      const { payload, query } = req;
      const { language = 'vi' } = query;

      // Lấy unique categories từ FAQs đã publish
      const result = await payload.find({
        collection: 'faqs',
        where: {
          status: { equals: 'published' },
          language: { equals: language },
        },
        limit: 1000, // Lấy nhiều để đảm bảo có tất cả categories
      });

      // Nhóm theo category và đếm số lượng
      const categoryCounts: Record<string, CategoryCount> = {};

      result.docs.forEach((faq) => {
        const category = faq.category;
        if (!categoryCounts[category]) {
          categoryCounts[category] = {
            value: category,
            count: 0,
          };
        }
        categoryCounts[category].count++;
      });

      // Convert to array và thêm label
      const categoryLabels: Record<string, string> = {
        general: 'Tổng quan',
        services: 'Dịch vụ',
        products: 'Sản phẩm',
        projects: 'Dự án',
        technology: 'Công nghệ',
        'technical-support': 'Hỗ trợ kỹ thuật',
        payment: 'Thanh toán',
        warranty: 'Bảo hành',
        other: 'Khác',
      };

      const categories = Object.values(categoryCounts).map((cat: CategoryCount) => ({
        ...cat,
        label: categoryLabels[cat.value] || cat.value,
      }));

      return Response.json({
        success: true,
        message: 'FAQ categories retrieved successfully',
        data: categories,
      });
    } catch (error) {
      console.error('Error getting FAQ categories:', error);
      throw new APIError('Failed to get FAQ categories', 500);
    }
  },
};

// GET /api/custom/faqs/popular - Lấy FAQs phổ biến
export const getPopularFAQsEndpoint: Endpoint = {
  path: '/faqs/popular',
  method: 'get',
  handler: async (req) => {
    try {
      const { payload, query } = req;
      const { limit = 5, language = 'vi' } = query;

      const result = await payload.find({
        collection: 'faqs',
        where: {
          status: { equals: 'published' },
          language: { equals: language },
          isPopular: { equals: true },
        },
        limit: parseInt(limit as string),
        sort: '-helpfulCount',
      });

      return Response.json({
        success: true,
        message: 'Popular FAQs retrieved successfully',
        data: result.docs,
      });
    } catch (error) {
      console.error('Error getting popular FAQs:', error);
      throw new APIError('Failed to get popular FAQs', 500);
    }
  },
};

// GET /api/custom/faqs/featured - Lấy FAQs nổi bật
export const getFeaturedFAQsEndpoint: Endpoint = {
  path: '/faqs/featured',
  method: 'get',
  handler: async (req) => {
    try {
      const { payload, query } = req;
      const { limit = 6, language = 'vi' } = query;

      const result = await payload.find({
        collection: 'faqs',
        where: {
          status: { equals: 'published' },
          language: { equals: language },
          featured: { equals: true },
        },
        limit: parseInt(limit as string),
        sort: 'order',
      });

      return Response.json({
        success: true,
        message: 'Featured FAQs retrieved successfully',
        data: result.docs,
      });
    } catch (error) {
      console.error('Error getting featured FAQs:', error);
      throw new APIError('Failed to get featured FAQs', 500);
    }
  },
};

// GET /api/custom/faqs/search - Tìm kiếm FAQs
export const searchFAQsEndpoint: Endpoint = {
  path: '/faqs/search',
  method: 'get',
  handler: async (req) => {
    try {
      const { payload, query } = req;
      const {
        q,
        page = 1,
        limit = 10,
        language = 'vi',
        category,
        sort = '-helpfulCount',
      } = query;

      if (!q) {
        throw new APIError('Search query is required', 400);
      }

      const where: Where = {
        status: { equals: 'published' },
        language: { equals: language },
        or: [
          { question: { contains: q } },
          { searchKeywords: { contains: q } },
          { 'tags.tag': { contains: q } },
        ],
      };

      if (category) {
        where.category = { equals: category };
      }

      const result = await payload.find({
        collection: 'faqs',
        where,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        sort: sort as string,
      });

      return Response.json({
        success: true,
        message: 'Search completed successfully',
        data: result,
        query: q,
      });
    } catch (error) {
      console.error('Error searching FAQs:', error);
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Failed to search FAQs', 500);
    }
  },
};
