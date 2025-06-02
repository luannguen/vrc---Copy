// Event types based on backend API response structure
export interface EventImage {
  id: string;
  alt: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  sizes: {
    thumbnail?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
    card?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
    tablet?: {
      url: string;
      width: number;
      height: number;
      mimeType: string;
      filesize: number;
      filename: string;
    };
  };
  url: string;
}

export interface EventCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order?: number;
  updatedAt: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  content?: Record<string, unknown>; // Lexical editor content
  summary?: string;
  featuredImage?: EventImage;
  startDate: string;
  endDate?: string;
  location?: string;
  organizer?: string;
  participants?: number;
  categories?: EventCategory[];
  tags?: string[];
  status: 'draft' | 'published' | 'upcoming' | 'ongoing' | 'past';
  featured?: boolean;
  eventType?: string;
  updatedAt: string;
  createdAt: string;
}

export interface EventsResponse {
  success: boolean;
  message: string;
  data: {
    events: Event[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

export interface EventCategoriesResponse {
  docs: EventCategory[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage?: number;
  nextPage?: number;
}

export interface EventsApiParams {
  limit?: number;
  page?: number;
  status?: string;
  featured?: boolean;
  eventType?: string;
  category?: string; // Added for category filtering
}

// New interfaces for category filtering
export interface EventCategoryCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Static category structure (fallback)
export interface StaticCategoryCount {
  name: string;
  count: number;
}

// Union type for category display
export type CategoryDisplay = EventCategoryCount | StaticCategoryCount;

export interface EventCategoryCountResponse {
  success: boolean;
  data: EventCategoryCount[];
  totalEvents: number;
}

export interface FilteredEventsResponse {
  success: boolean;
  data: {
    events: Event[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}
