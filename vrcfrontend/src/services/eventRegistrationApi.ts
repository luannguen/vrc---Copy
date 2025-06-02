// API service for event registration
export interface EventRegistrationData {
  fullName: string;
  email: string;
  phone: string;
  organization?: string;
  jobTitle?: string;
  eventId: string;
  eventTitle: string;
  participationType: string;
  dietaryRequirements?: string;
  accessibilityNeeds?: string;
  marketingConsent: boolean;
  privacyConsent: boolean;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  registration?: any;
  error?: string;
}

export class EventRegistrationService {  private static readonly BASE_URL = '/api/event-registrations';
  
  // Get API base URL from environment variables for development/debugging
  // In development: Use empty string for relative paths (proxy handles routing)
  // In production: Use full backend URL
  private static getApiBaseUrl(): string {
    return import.meta.env.NODE_ENV === 'development' 
      ? '' 
      : (import.meta.env.VITE_API_URL || 'http://localhost:3000');
  }
  /**
   * Create a new event registration
   */
  static async createRegistration(data: EventRegistrationData): Promise<RegistrationResponse> {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          // Try to parse response as JSON (if it's an API error)
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorResult.message || errorMessage;
        } catch (parseError) {
          // If JSON parsing fails, it's likely an HTML error page (404, 500, etc.)
          console.warn('Failed to parse error response as JSON:', parseError);
          if (response.status === 404) {
            errorMessage = 'API endpoint not found. The event registration service may not be available.';
          } else {
            errorMessage = `Server error (${response.status}). Please try again later.`;
          }
        }
        
        throw new Error(errorMessage);
      }

      // Parse successful response
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Event registration error:', error);
      
      // Re-throw with more user-friendly message if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng và thử lại.');
      }
      
      throw error;
    }
  }
  /**
   * Get registration by ID
   */
  static async getRegistration(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorResult.message || errorMessage;
        } catch (parseError) {
          console.warn('Failed to parse error response as JSON:', parseError);
          if (response.status === 404) {
            errorMessage = 'Registration not found.';
          } else {
            errorMessage = `Server error (${response.status}). Please try again later.`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result.registration;
      
    } catch (error) {
      console.error('Failed to fetch registration:', error);
      throw error;
    }
  }
  /**
   * Update registration
   */
  static async updateRegistration(id: string, data: Partial<EventRegistrationData>): Promise<RegistrationResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorResult.message || errorMessage;
        } catch (parseError) {
          console.warn('Failed to parse error response as JSON:', parseError);
          if (response.status === 404) {
            errorMessage = 'Registration not found.';
          } else {
            errorMessage = `Server error (${response.status}). Please try again later.`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Registration update error:', error);
      throw error;
    }
  }
  /**
   * Send confirmation email
   */
  static async confirmRegistration(id: string): Promise<RegistrationResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/${id}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorResult = await response.json();
          errorMessage = errorResult.error || errorResult.message || errorMessage;
        } catch (parseError) {
          console.warn('Failed to parse error response as JSON:', parseError);
          if (response.status === 404) {
            errorMessage = 'Registration not found.';
          } else {
            errorMessage = `Server error (${response.status}). Please try again later.`;
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Registration confirmation error:', error);
      throw error;
    }
  }
}

export default EventRegistrationService;
