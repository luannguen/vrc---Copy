/**
 * Custom hook for footer data
 */

import { useState, useEffect } from 'react';
import { footerService, type FooterCompanyInfo } from '@/services/footerService';

export const useFooterData = () => {
  const [data, setData] = useState<FooterCompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const footerData = await footerService.getFooterData();
        setData(footerData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch footer data'));
        console.error('Footer data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  return { data, isLoading, error };
};

export const useLogoUrl = () => {
  const [logoUrl, setLogoUrl] = useState<string>('/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogoUrl = async () => {
      try {
        setIsLoading(true);
        const url = await footerService.getLogoUrl();
        setLogoUrl(url);
      } catch (err) {
        console.error('Logo URL fetch error:', err);
        // Keep fallback URL
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogoUrl();
  }, []);

  return { logoUrl, isLoading };
};
