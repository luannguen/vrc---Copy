// React hooks for Services API
import { useState, useEffect } from 'react';
import { servicesApi, Service, ServicesResponse, ServiceResponse } from '@/api/services';

// Hook để lấy tất cả dịch vụ
export const useServices = (params?: {
  type?: string;
  featured?: boolean;
  limit?: number;
  page?: number;
}) => {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesApi.getAll(params);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
        console.error('Error in useServices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.type, params?.featured, params?.limit, params?.page]); // Re-fetch when individual params change

  return { data, loading, error, refetch: () => setLoading(true) };
};

// Hook để lấy dịch vụ theo slug
export const useService = (slug: string) => {
  const [data, setData] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchService = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesApi.getBySlug(slug);
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch service');
        console.error('Error in useService:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  return { data, loading, error };
};

// Hook để lấy dịch vụ theo type
export const useServicesByType = (type: string, limit?: number) => {
  const [data, setData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!type) {
      setLoading(false);
      return;
    }

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await servicesApi.getByType(type, limit);
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services by type');
        console.error('Error in useServicesByType:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [type, limit]);

  return { data, loading, error };
};

// Hook để lấy dịch vụ nổi bật
export const useFeaturedServices = (limit?: number) => {
  return useServices({ featured: true, limit });
};
