import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslationCache } from '../../hooks/useTranslationCache';

interface LazyTranslationProps {
  namespace: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

interface TranslationCache {
  [key: string]: {
    data: Record<string, unknown>;
    timestamp: number;
    language: string;
  };
}

/**
 * LazyTranslation - Loads translation namespaces on demand
 * Improves performance by loading translations only when needed
 */
export const LazyTranslation: React.FC<LazyTranslationProps> = ({
  namespace,
  fallback = <div>Loading translations...</div>,
  onLoad,
  onError,
  children
}) => {
  const { i18n, ready } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadNamespace = useCallback(async () => {
    if (isLoaded || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check if namespace is already loaded
      if (i18n.hasResourceBundle(i18n.language, namespace)) {
        setIsLoaded(true);
        setIsLoading(false);
        onLoad?.();
        return;
      }

      // Load the namespace
      await i18n.loadNamespaces(namespace);
      setIsLoaded(true);
      onLoad?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load translations');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [namespace, i18n, isLoaded, isLoading, onLoad, onError]);

  useEffect(() => {
    if (ready) {
      loadNamespace();
    }
  }, [ready, loadNamespace]);

  if (error) {
    return <div>Error loading translations: {error.message}</div>;
  }

  if (isLoading || !isLoaded) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hook for managing translation caching and preloading
 */
// This hook has been moved to hooks/useTranslationCache.ts

/**
 * Component for preloading translations on route change or user interaction
 */
interface TranslationPreloaderProps {
  namespaces: string[];
  languages?: string[];
  trigger?: 'immediate' | 'hover' | 'click';
  onPreload?: (namespace: string) => void;
  children?: React.ReactNode;
}

export const TranslationPreloader: React.FC<TranslationPreloaderProps> = ({
  namespaces,
  languages = ['vi', 'en', 'tr'],
  trigger = 'immediate',
  onPreload,
  children
}) => {
  const { preloadNamespace } = useTranslationCache();
  const [isPreloading, setIsPreloading] = useState(false);

  const handlePreload = useCallback(async () => {
    if (isPreloading) return;

    setIsPreloading(true);
    
    try {
      const promises: Promise<unknown>[] = [];
      
      for (const namespace of namespaces) {
        for (const language of languages) {
          promises.push(
            preloadNamespace(namespace, language).then(() => {
              onPreload?.(namespace);
            })
          );
        }
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to preload translations:', error);
    } finally {
      setIsPreloading(false);
    }
  }, [namespaces, languages, preloadNamespace, onPreload, isPreloading]);

  useEffect(() => {
    if (trigger === 'immediate') {
      handlePreload();
    }
  }, [trigger, handlePreload]);

  const getTriggerProps = () => {
    switch (trigger) {
      case 'hover':
        return { onMouseEnter: handlePreload };
      case 'click':
        return { onClick: handlePreload };
      default:
        return {};
    }
  };

  if (!children) {
    return null;
  }

  return (
    <div {...getTriggerProps()}>
      {children}
      {isPreloading && (
        <div className="translation-preloader" aria-live="polite">
          Preloading translations...
        </div>
      )}
    </div>
  );
};

export default LazyTranslation;
