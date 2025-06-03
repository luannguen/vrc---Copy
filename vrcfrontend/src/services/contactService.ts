import { apiClient } from '@/lib/api';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  company?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  id?: string;
}

// Submit contact form
export const submitContactForm = async (data: ContactFormData): Promise<ContactResponse> => {
  const response = await apiClient.post<ContactResponse>('/contact', data);
  return response.data;
};
