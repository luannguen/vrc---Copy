import { apiClient } from '@/lib/api';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  eventType?: string;
  registrationRequired?: boolean;
  maxAttendees?: number;
  images?: string[];
  slug?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Get all events
export const getEvents = async (): Promise<EventsResponse> => {
  const response = await apiClient.get<EventsResponse>('/api/events');
  return response.data;
};

// Get single event by ID
export const getEvent = async (id: string): Promise<Event> => {
  const response = await apiClient.get<Event>(`/api/events/${id}`);
  return response.data;
};
