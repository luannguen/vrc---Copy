/**
 * Custom hook for managing news categories and their post counts
 * Handles fetching categories and calculating accurate post counts for each category
 */
import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

// Types
export interface NewsCategory {
  id: string;
  title: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithCount extends NewsCategory {
  count: number;
}

interface CategoryApiResponse {
  docs: NewsCategory[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  pagingCounter: number;
  prevPage: number | null;
  nextPage: number | null;
}

interface PostCountResponse {
  success: boolean;
  data: unknown[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const useNewsCategories = () => {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [totalAllPosts, setTotalAllPosts] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Fetch total published posts count
  const fetchTotalPosts = async (): Promise<number> => {
    try {
      const response = await apiService.get('/posts?where[_status][equals]=published&limit=1') as PostCountResponse;
      return response.totalDocs || 0;
    } catch (err) {
      console.error('❌ Error fetching total posts:', err);
      return 0;
    }
  };  // Fetch post count for a specific category
  const fetchCategoryPostCount = async (categoryId: string): Promise<number> => {
    try {
      const response = await apiService.get(
        `/posts?where[categories][in]=${categoryId}&where[_status][equals]=published&limit=1`
      ) as PostCountResponse;
      
      // Use the actual totalDocs returned by the API
      return response.totalDocs || 0;
    } catch (err) {
      console.error(`❌ Error fetching posts count for category ${categoryId}:`, err);
      return 0;
    }
  };
  // Initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await apiService.get('/news-categories') as CategoryApiResponse;
        console.log('🏷️ Categories loaded:', categoriesResponse.docs);

        // Fetch total posts count
        const totalPosts = await fetchTotalPosts();
        setTotalAllPosts(totalPosts);
        console.log('📊 Total published posts:', totalPosts);

        // Fetch post count for each category in parallel
        const categoriesWithCounts = await Promise.all(
          categoriesResponse.docs.map(async (category) => {
            const count = await fetchCategoryPostCount(category.id);
            console.log(`🏷️ Category "${category.title}" has ${count} posts`);
            return { ...category, count };
          })
        );

        setCategories(categoriesWithCounts);
        console.log('🏷️ Categories with counts:', categoriesWithCounts);
      } catch (err) {
        console.error('❌ Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  // Refresh categories data
  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResponse = await apiService.get('/news-categories') as CategoryApiResponse;

      // Fetch total posts count
      const totalPosts = await fetchTotalPosts();
      setTotalAllPosts(totalPosts);

      // Fetch post count for each category in parallel
      const categoriesWithCounts = await Promise.all(
        categoriesResponse.docs.map(async (category) => {
          const count = await fetchCategoryPostCount(category.id);
          return { ...category, count };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (err) {
      console.error('❌ Error refreshing categories:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh categories');
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    totalAllPosts,
    loading,
    error,
    refresh
  };
};
