import { apiClient } from '@/lib/api';

export interface Technology {
  id: string;
  name: string;
  description: {
    root: {
      type: string;
      children: Array<{
        type: string;
        children: Array<{
          type: string;
          text: string;
          version: number;
        }>;
        version: number;
      }>;
      direction: string;
      format: string;
      indent: number;
      version: number;
    };
  }; // Lexical richtext content
  type?: 'technology' | 'partner' | 'supplier';
  category?: string;
  logo?: {
    id: string;
    filename: string;
    alt?: string;
    url: string;
    thumbnailURL?: string;
    sizes?: Record<string, unknown>;
  };
  website?: string;
  specifications?: Record<string, unknown>;
  images?: string[];
  slug?: string;
  slugLock?: boolean;
  featured?: boolean;
  order?: number;
  status?: string;
  certifications?: unknown[];
  createdAt: string;
  updatedAt: string;
}

export interface TechnologiesApiResponse {
  success: boolean;
  message: string;
  data: {
    docs: Technology[];
    totalDocs: number;
    totalPages: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
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
  const response = await apiClient.get<TechnologiesApiResponse>('/technologies');
  return {
    technologies: response.data.data.docs,
    meta: {
      total: response.data.data.totalDocs,
      page: response.data.data.page,
      limit: response.data.data.limit,
    }
  };
};

// Get single technology by ID
export const getTechnology = async (id: string): Promise<Technology> => {
  const response = await apiClient.get<Technology>(`/technologies/${id}`);
  return response.data;
};

// Utility function to extract plain text from Lexical content
export const extractTextFromLexicalContent = (content: Technology['description']): string => {
  if (!content || !content.root || !content.root.children) {
    return '';
  }
  
  return content.root.children
    .map(child => {
      if (child.children) {
        return child.children
          .map(grandChild => grandChild.text || '')
          .join('');
      }
      return '';
    })
    .join(' ')
    .trim();
};
