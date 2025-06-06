import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useMultilingualProducts = (locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['products', currentLocale],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/products?locale=${currentLocale}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useMultilingualPosts = (locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['posts', currentLocale],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/posts?locale=${currentLocale}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMultilingualServices = (locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['services', currentLocale],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/services?locale=${currentLocale}`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMultilingualGlobal = (slug: string, locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['global', slug, currentLocale],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/globals/${slug}?locale=${currentLocale}`);
      if (!response.ok) throw new Error(`Failed to fetch global ${slug}`);
      return response.json();
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useMultilingualPages = (locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['pages', currentLocale],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/pages?locale=${currentLocale}`);
      if (!response.ok) throw new Error('Failed to fetch pages');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMultilingualCategories = (locale?: string) => {
  const { i18n } = useTranslation();
  const currentLocale = locale || i18n.language;
  
  return useQuery({
    queryKey: ['categories', currentLocale],
    queryFn: async () => {
      const response = await fetch(`${API_BASE}/api/categories?locale=${currentLocale}`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });
};

// General API hook for fetching various content types
export const useMultilingualAPI = () => {
  const { i18n } = useTranslation();

  const fetchContent = async (collection: string, locale?: string) => {
    const currentLocale = locale || i18n.language;
    
    try {
      const response = await fetch(`${API_BASE}/api/${collection}?locale=${currentLocale}`);
      if (!response.ok) throw new Error(`Failed to fetch ${collection}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error);
      throw error;
    }
  };

  const fetchGlobal = async (slug: string, locale?: string) => {
    const currentLocale = locale || i18n.language;
    
    try {
      const response = await fetch(`${API_BASE}/api/globals/${slug}?locale=${currentLocale}`);
      if (!response.ok) throw new Error(`Failed to fetch global ${slug}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching global ${slug}:`, error);
      throw error;
    }
  };

  return {
    fetchContent,
    fetchGlobal
  };
};
