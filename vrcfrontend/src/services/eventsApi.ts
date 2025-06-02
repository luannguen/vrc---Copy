import { Event, EventsResponse, EventCategory, EventCategoriesResponse, EventsApiParams } from '@/types/events';

const API_BASE_URL = 'http://localhost:3000/api';

// API service class for Events using Payload CMS built-in APIs
export class EventsApi {
  private static getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      // For development, we use X-API-Test bypass 
      // In production, this should be replaced with proper authentication
      'X-API-Test': 'true',
    };
  }

  // Get all events with optional filtering
  static async getEvents(params?: EventsApiParams): Promise<EventsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.status) queryParams.append('status', params.status);
      if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
      if (params?.eventType) queryParams.append('eventType', params.eventType);

      const url = `${API_BASE_URL}/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get single event by ID
  static async getEvent(id: string): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch event: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }
  // Get all event categories
  static async getEventCategories(): Promise<EventCategoriesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/event-categories`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch event categories: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching event categories:', error);
      throw error;
    }
  }
}

// Utility functions for API data transformation
export class EventsUtils {
  // Transform API event to frontend format
  static transformEvent(apiEvent: Event): Event {
    return {
      ...apiEvent,
      // Ensure dates are properly formatted
      startDate: apiEvent.startDate,
      endDate: apiEvent.endDate || apiEvent.startDate,
      // Extract summary from content if not provided
      summary: apiEvent.summary || this.extractSummaryFromContent(apiEvent.content),
      // Default values
      participants: apiEvent.participants || 0,
      tags: apiEvent.tags || [],
    };
  }

  // Extract summary from Lexical content
  static extractSummaryFromContent(content?: Record<string, unknown>): string {
    if (!content) return '';
    
    try {
      // This is a simplified extraction - would need to be enhanced based on Lexical structure
      const contentStr = JSON.stringify(content);
      // Remove HTML tags and get first 150 characters
      const text = contentStr.replace(/<[^>]*>/g, '').substring(0, 150);
      return text + (text.length >= 150 ? '...' : '');
    } catch {
      return '';
    }
  }

  // Format date for display
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  }

  // Get event status badge text
  static getStatusText(status: string): string {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'past':
        return 'Đã kết thúc';
      case 'published':
        return 'Đã xuất bản';
      case 'draft':
        return 'Bản nháp';
      default:
        return status;
    }
  }

  // Get featured image URL with fallback
  static getImageUrl(event: Event, size: 'thumbnail' | 'card' | 'tablet' | 'original' = 'card'): string {
    if (!event.featuredImage) {
      return '/assets/images/default-event.jpg'; // Default image
    }

    if (size === 'original') {
      return event.featuredImage.url;
    }

    const sizeImage = event.featuredImage.sizes?.[size];
    return sizeImage?.url || event.featuredImage.url;
  }
}
