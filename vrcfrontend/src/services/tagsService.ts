import { apiClient } from '@/lib/api';

export interface Tag {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagsResponse {
  tags: Tag[];
  total: number;
}

/**
 * Fetch all tags from the API
 */
export const getTags = async (): Promise<TagsResponse> => {
  try {
    const response = await apiClient.get<TagsResponse>('/tags');
    return response.data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

/**
 * Get news-related tags only (filtered list)
 */
export const getNewsTags = async (): Promise<Tag[]> => {
  try {
    const response = await getTags();
    
    // Filter for news-related tags
    const newsTagSlugs = [
      'dien-lanh', 'trien-lam', 'hoi-thao', 'cong-nghe', 
      'tiet-kiem-nang-luong', 'bao-tri', 'inverter', 
      'hop-tac-quoc-te', 'nghien-cuu', 'phat-trien-ben-vung',
      'cong-nghiep', 'thuong-mai', 'hvac', 'he-thong-lanh',
      'dao-tao', 'dieu-hoa', 'cong-nghe-lam-lanh', 'cong-nghe-moi',
      'ky-thuat-vien', 'chat-lam-lanh'
    ];
    
    return response.tags.filter(tag => newsTagSlugs.includes(tag.slug));
  } catch (error) {
    console.error('Error fetching news tags:', error);
    throw error;
  }
};
