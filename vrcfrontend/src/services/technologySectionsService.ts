import { apiClient } from '@/lib/api';
import { 
  TechnologySection, 
  TechnologySectionsResponse, 
  TechnologySectionsByType 
} from '@/types/technology-sections';

// Get all technology sections with optional sorting and pagination
export const getTechnologySections = async (params?: {
  sort?: string;
  limit?: number;
  page?: number;
}): Promise<TechnologySectionsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.sort) queryParams.append('sort', params.sort);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  const response = await apiClient.get<TechnologySectionsResponse>(
    `/technology-sections${queryParams.toString() ? '?' + queryParams.toString() : ''}`
  );
  return response.data;
};

// Get single technology section by ID
export const getTechnologySection = async (id: string): Promise<TechnologySection> => {
  const response = await apiClient.get<TechnologySection>(`/technology-sections/${id}`);
  return response.data;
};

// Get technology sections organized by section type for easy frontend consumption
export const getTechnologySectionsByType = async (): Promise<TechnologySectionsByType> => {
  const response = await getTechnologySections({ sort: 'order' });
  
  const sectionsByType: TechnologySectionsByType = {};
  
  response.docs.forEach(section => {
    sectionsByType[section.section] = section;
  });
  
  return sectionsByType;
};

// Get specific section by type
export const getTechnologySectionByType = async (
  sectionType: 'hero' | 'overview' | 'equipment-categories' | 'partners' | 'cta'
): Promise<TechnologySection | null> => {
  const sections = await getTechnologySectionsByType();
  return sections[sectionType] || null;
};

// Helper function to extract plain text from Lexical content
export const extractTextFromLexicalContent = (content?: any): string => {
  if (!content?.root?.children) return '';
  
  return content.root.children
    .map((child: any) => 
      child.children?.map((textNode: any) => textNode.text || '').join('') || ''
    )
    .join(' ')
    .trim();
};
