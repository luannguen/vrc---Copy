import { apiClient } from '@/lib/api';

export interface Technology {
  id: string;
  name: string;
  description: string;
  category?: string;
  specifications?: Record<string, any>;
  images?: string[];
  slug?: string;
  featured?: boolean;
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
