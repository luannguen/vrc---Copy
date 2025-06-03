import { apiClient } from '@/lib/api';

export interface Project {
  id: string;
  title: string;
  description: string;
  client?: string;
  location?: string;
  completedDate?: string;
  images?: string[];
  technologies?: string[];
  category?: string;
  slug?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  projects: Project[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Get all projects
export const getProjects = async (): Promise<ProjectsResponse> => {
  const response = await apiClient.get<ProjectsResponse>('/projects');
  return response.data;
};

// Get single project by ID
export const getProject = async (id: string): Promise<Project> => {
  const response = await apiClient.get<Project>(`/projects/${id}`);
  return response.data;
};
