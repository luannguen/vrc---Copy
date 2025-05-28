import { apiClient } from '@/lib/api';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  features?: string[];
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesResponse {
  services: Service[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Get all services
export const getServices = async (): Promise<ServicesResponse> => {
  const response = await apiClient.get<ServicesResponse>('/api/services');
  return response.data;
};

// Get single service by ID
export const getService = async (id: string): Promise<Service> => {
  const response = await apiClient.get<Service>(`/api/services/${id}`);
  return response.data;
};
