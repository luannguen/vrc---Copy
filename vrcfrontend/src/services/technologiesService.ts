import { apiClient } from '@/lib/api';

export interface Technology {
  id: string;
  name: string;
  description: any; // Lexical richtext content
  type?: 'technology' | 'partner' | 'supplier';
  category?: string;
  logo?: {
    id: string;
    filename: string;
    alt?: string;
    url: string;
    thumbnailURL?: string;
  };
  website?: string;
  specifications?: Record<string, any>;
  images?: string[];
  slug?: string;
  featured?: boolean;
  order?: number;
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TechnologiesResponse {
  technologies: Technology[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Get all technologies
export const getTechnologies = async (): Promise<TechnologiesResponse> => {
  const response = await apiClient.get<TechnologiesResponse>('/technologies');
  return response.data;
};

// Get single technology by ID
export const getTechnology = async (id: string): Promise<Technology> => {
  const response = await apiClient.get<Technology>(`/technologies/${id}`);
  return response.data;
};
