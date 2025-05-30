import { apiClient } from '@/lib/api';

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  author?: string;
  publishDate: string;
  tags?: string[];
  category?: string;
  slug?: string;
  published?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Get all posts
export const getPosts = async (): Promise<PostsResponse> => {
  const response = await apiClient.get<PostsResponse>('/api/posts');
  return response.data;
};

// Get single post by ID
export const getPost = async (id: string): Promise<Post> => {
  const response = await apiClient.get<Post>(`/api/posts/${id}`);
  return response.data;
};
