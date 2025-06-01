/**
 * Custom hook for managing news posts
 * Handles fetching posts with pagination and category filtering
 */
import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

// Types based on actual API response
export interface PostData {
  id: string;
  title: string;
  slug: string;
  content: {
    root: {
      children?: unknown[];
      [key: string]: unknown;
    };
  };
  heroImage?: {
    id: string;
    url?: string;
    thumbnailURL?: string;
    alt?: string;
    filename?: string;
    width?: number;
    height?: number;
    sizes?: {
      thumbnail?: { url?: string; width?: number; height?: number };
      small?: { url?: string; width?: number; height?: number };
      medium?: { url?: string; width?: number; height?: number };
      large?: { url?: string; width?: number; height?: number };
      xlarge?: { url?: string; width?: number; height?: number };
      og?: { url?: string; width?: number; height?: number };
    };
  };
  publishedAt: string;
  authors?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  populatedAuthors?: Array<{ 
    id: string; 
    name: string; 
  }>;
  _status: string;
  meta?: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: {
      id: string;
      url?: string;
      alt?: string;
    };
  };
  categories?: Array<{
    id: string;
    title: string;
    slug: string;
    description?: string;
  }>;
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    meta?: {
      description?: string;
      image?: string;
    };
  }>;
  createdAt: string;
  updatedAt: string;
}

interface PostsApiResponse {
  success: boolean;
  data: PostData[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UseNewsPostsOptions {
  initialPage?: number;
  postsPerPage?: number;
  selectedCategory?: string | null;
}

export const useNewsPosts = (options: UseNewsPostsOptions = {}) => {
  const {
    initialPage = 1,
    postsPerPage = 9,
    selectedCategory = null
  } = options;

  const [posts, setPosts] = useState<PostData[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalDocs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  // Fetch posts based on current filters
  const fetchPosts = async (page: number = currentPage, categoryFilter: string | null = selectedCategory) => {
    try {
      setLoading(true);
      setError(null);

      console.log('🚀 Fetching posts - Page:', page, 'Category:', categoryFilter);

      // Build URL with proper Payload CMS query format
      let url = `/posts?page=${page}&limit=${postsPerPage}&where[_status][equals]=published`;
      if (categoryFilter) {
        url += `&where[categories][in]=${categoryFilter}`;
      }

      console.log('📡 API URL:', url);

      const response = await apiService.get(url) as PostsApiResponse;
      console.log('📡 API Response:', response);

      // Handle the actual API response structure
      if (response.success && response.data) {
        console.log('✅ Posts loaded successfully:', response.data.length, 'posts');
        setPosts(response.data);
        setPagination({
          totalDocs: response.totalDocs,
          totalPages: response.totalPages,
          hasNextPage: response.hasNextPage,
          hasPrevPage: response.hasPrevPage
        });
      } else {
        throw new Error('API response indicated failure or no data');
      }
    } catch (err) {
      console.error('❌ Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      setPosts([]);
      setPagination({
        totalDocs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
    } finally {
      setLoading(false);
    }
  };

  // Change page
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Filter by category
  const filterByCategory = (categoryId: string | null) => {
    setCurrentPage(1); // Reset to first page when filtering
    fetchPosts(1, categoryId);
  };

  // Refresh current page
  const refresh = () => {
    fetchPosts(currentPage, selectedCategory);
  };  // Fetch posts when page changes
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🚀 Fetching posts - Page:', currentPage, 'Category:', selectedCategory);

        // Build URL with proper Payload CMS query format
        let url = `/posts?page=${currentPage}&limit=${postsPerPage}&where[_status][equals]=published`;
        if (selectedCategory) {
          url += `&where[categories][in]=${selectedCategory}`;
        }

        console.log('📡 API URL:', url);

        const response = await apiService.get(url) as PostsApiResponse;
        console.log('📡 API Response:', response);

        // Handle the actual API response structure
        if (response.success && response.data) {
          console.log('✅ Posts loaded successfully:', response.data.length, 'posts');
          setPosts(response.data);
          setPagination({
            totalDocs: response.totalDocs,
            totalPages: response.totalPages,
            hasNextPage: response.hasNextPage,
            hasPrevPage: response.hasPrevPage
          });
        } else {
          throw new Error('API response indicated failure or no data');
        }
      } catch (err) {
        console.error('❌ Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        setPosts([]);
        setPagination({
          totalDocs: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false
        });
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [currentPage, selectedCategory, postsPerPage]);

  return {
    posts,
    loading,
    error,
    pagination,
    currentPage,
    goToPage,
    filterByCategory,
    refresh
  };
};
