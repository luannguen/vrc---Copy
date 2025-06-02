import { useState, useEffect, useCallback } from 'react';
import { Event, EventsResponse, EventCategory, EventCategoriesResponse, EventsApiParams, EventCategoryCountResponse, FilteredEventsResponse, EventCategoryCount } from '@/types/events';
import { EventsApi, EventsUtils } from '@/services/eventsApi';

// Custom hook for fetching events
export function useEvents(params?: EventsApiParams) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: EventsResponse = await EventsApi.getEvents(params);
      
      // Transform API events to frontend format
      const transformedEvents = response.data.events.map(EventsUtils.transformEvent);
      
      setEvents(transformedEvents);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchEvents,
  };
}

// Custom hook for fetching single event
export function useEvent(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await EventsApi.getEvent(id);
        const transformedEvent = EventsUtils.transformEvent(response);
        
        setEvent(transformedEvent);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return {
    event,
    loading,
    error,
  };
}

// Custom hook for fetching event categories
export function useEventCategories() {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response: EventCategoriesResponse = await EventsApi.getEventCategories();
        
        // Remove duplicates and sort by order
        const uniqueCategories = response.data.docs
          .filter((category, index, self) => 
            index === self.findIndex(c => c.name === category.name)
          )
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}

// Custom hook for fetching filtered events with category support
export function useFilteredEvents(params?: EventsApiParams) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
    limit: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchFilteredEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: FilteredEventsResponse = await EventsApi.getFilteredEvents(params);
      
      // Transform API events to frontend format
      const transformedEvents = response.data.events.map(EventsUtils.transformEvent);
      
      setEvents(transformedEvents);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching filtered events:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch filtered events');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchFilteredEvents();
  }, [fetchFilteredEvents]);

  return {
    events,
    loading,
    error,
    pagination,
    refetch: fetchFilteredEvents,
  };
}

// Custom hook for fetching event counts by category
export function useEventCategoryCounts() {
  const [categoryCounts, setCategoryCounts] = useState<EventCategoryCount[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategoryCounts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: EventCategoryCountResponse = await EventsApi.getEventCountsByCategory();
      
      setCategoryCounts(response.data);
      setTotalEvents(response.totalEvents);
    } catch (err) {
      console.error('Error fetching category counts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch category counts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategoryCounts();
  }, [fetchCategoryCounts]);

  return {
    categoryCounts,
    totalEvents,
    loading,
    error,
    refetch: fetchCategoryCounts,
  };
}

// Hook for managing events filters
export function useEventsFilters() {
  const [filters, setFilters] = useState<EventsApiParams>({
    limit: 10,
    page: 1,
  });
  const updateFilter = (key: keyof EventsApiParams, value: string | number | boolean | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));
  };

  const updatePage = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page,
    }));
  };

  const resetFilters = () => {
    setFilters({
      limit: 10,
      page: 1,
    });
  };

  return {
    filters,
    updateFilter,
    updatePage,
    resetFilters,
  };
}
