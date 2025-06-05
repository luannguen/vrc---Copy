/**
 * FAQ Hook
 * Custom hook for managing FAQ state and API calls
 */

import { useState, useEffect, useCallback } from 'react';
import { faqService } from '../services/faqService';
import { FAQ, FAQError, FAQQueryParams } from '../types/FAQ';

/**
 * FAQ Hook return type
 */
export interface UseFAQReturn {
  faqs: FAQ[];
  loading: boolean;
  error: FAQError | null;
  retry: () => void;
  loadFAQs: (params?: FAQQueryParams) => Promise<void>;
  clearError: () => void;
}

/**
 * Hook options
 */
export interface UseFAQOptions {
  initialParams?: FAQQueryParams;
  autoLoad?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

/**
 * Custom hook for FAQ management
 */
export const useFAQ = (options: UseFAQOptions = {}): UseFAQReturn => {  const {
    initialParams = { status: 'published', sort: 'order' },
    autoLoad = true,
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  // State management
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FAQError | null>(null);
  const [currentParams, setCurrentParams] = useState<FAQQueryParams>(initialParams);
  /**
   * Load FAQs with retry logic
   */
  const loadFAQs = useCallback(async (params: FAQQueryParams = currentParams): Promise<void> => {
    const controller = new AbortController();
    
    setLoading(true);
    setError(null);
    setCurrentParams(params);

    let attempts = 0;
    const maxAttempts = retryAttempts + 1;

    const attemptLoad = async (): Promise<void> => {
      try {
        attempts++;
        console.log(`🔄 Loading FAQs (attempt ${attempts}/${maxAttempts})...`);
        
        const faqData = await faqService.getFAQs(params, controller.signal);
        
        if (controller.signal.aborted) {
          return;
        }

        setFAQs(faqData);
        setError(null);
        console.log(`✅ Successfully loaded ${faqData.length} FAQs`);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        console.error(`❌ Attempt ${attempts} failed:`, err);
        
        const faqError = err as FAQError;
        
        // If we haven't reached max attempts and it's a network error, retry
        if (attempts < maxAttempts && (faqError.status === 408 || faqError.status >= 500)) {
          console.log(`⏳ Retrying in ${retryDelay}ms...`);
          setTimeout(attemptLoad, retryDelay * attempts); // Exponential backoff
          return;
        }
        
        // Final failure
        setError(faqError);
        console.error('💥 All retry attempts failed');
      }
    };

    await attemptLoad();
    setLoading(false);
  }, [currentParams, retryAttempts, retryDelay]);

  /**
   * Retry function
   */
  const retry = useCallback(() => {
    loadFAQs(currentParams);
  }, [loadFAQs, currentParams]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);  /**
   * Auto-load on mount
   */
  useEffect(() => {
    if (autoLoad) {
      loadFAQs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    faqs,
    loading,
    error,
    retry,
    loadFAQs,
    clearError,
  };
};

/**
 * Hook for loading FAQs by category
 */
export const useFAQByCategory = (category: string, options: Omit<UseFAQOptions, 'initialParams'> = {}) => {
  return useFAQ({
    ...options,
    initialParams: { category, status: 'published', sort: 'order' },
  });
};

/**
 * Hook for loading specific FAQ by ID
 */
export const useFAQById = (id: string) => {
  const [faq, setFAQ] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<FAQError | null>(null);

  const loadFAQ = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const faqData = await faqService.getFAQById(id);
      setFAQ(faqData);
    } catch (err) {
      setError(err as FAQError);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadFAQ();
  }, [loadFAQ]);

  return {
    faq,
    loading,
    error,
    retry: loadFAQ,
  };
};
