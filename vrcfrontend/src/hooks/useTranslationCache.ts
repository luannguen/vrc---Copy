import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface TranslationCacheEntry {
  data: Record<string, unknown>;
  timestamp: number;
  language: string;
  hits: number;
  lastAccess: number;
}

interface TranslationCache {
  [key: string]: TranslationCacheEntry;
}

interface CacheOptions {
  maxAge?: number; // Cache expiry time in milliseconds
  maxSize?: number; // Maximum number of cache entries
  persistToStorage?: boolean; // Whether to persist cache to localStorage
}

/**
 * Advanced hook for managing translation caching and preloading
 * Features: LRU cache, persistence, statistics, smart preloading
 */
export const useTranslationCache = (options: CacheOptions = {}) => {
  const { i18n } = useTranslation();
  const [cache, setCache] = useState<TranslationCache>({});
  const [cacheStats, setCacheStats] = useState({
    hits: 0,
    misses: 0,
    evictions: 0
  });

  const {
    maxAge = 10 * 60 * 1000, // 10 minutes default
    maxSize = 50, // 50 entries default
    persistToStorage = true
  } = options;

  // Load cache from localStorage on initialization
  useEffect(() => {
    if (persistToStorage) {
      try {
        const stored = localStorage.getItem('translation-cache');
        if (stored) {
          const parsedCache = JSON.parse(stored);
          setCache(parsedCache);
        }
      } catch (error) {
        console.warn('Failed to load translation cache from storage:', error);
      }
    }
  }, [persistToStorage]);

  // Save cache to localStorage when it changes
  useEffect(() => {
    if (persistToStorage && Object.keys(cache).length > 0) {
      try {
        localStorage.setItem('translation-cache', JSON.stringify(cache));
      } catch (error) {
        console.warn('Failed to save translation cache to storage:', error);
      }
    }
  }, [cache, persistToStorage]);

  // Clean expired entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setCache(currentCache => {
        const now = Date.now();
        const cleanedCache: TranslationCache = {};
        let evicted = 0;

        Object.entries(currentCache).forEach(([key, entry]) => {
          if (now - entry.timestamp < maxAge) {
            cleanedCache[key] = entry;
          } else {
            evicted++;
          }
        });

        if (evicted > 0) {
          setCacheStats(prev => ({ ...prev, evictions: prev.evictions + evicted }));
        }

        return cleanedCache;
      });
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, [maxAge]);

  // LRU cache implementation
  const evictLRU = useCallback((currentCache: TranslationCache) => {
    const entries = Object.entries(currentCache);
    if (entries.length <= maxSize) return currentCache;

    // Sort by last access time (oldest first)
    entries.sort(([, a], [, b]) => a.lastAccess - b.lastAccess);
    
    const newCache: TranslationCache = {};
    const keepCount = Math.floor(maxSize * 0.8); // Keep 80% of max size

    entries.slice(-keepCount).forEach(([key, entry]) => {
      newCache[key] = entry;
    });

    setCacheStats(prev => ({ 
      ...prev, 
      evictions: prev.evictions + (entries.length - keepCount) 
    }));

    return newCache;
  }, [maxSize]);

  const preloadNamespace = useCallback(async (namespace: string, language?: string) => {
    const lang = language || i18n.language;
    const cacheKey = `${namespace}-${lang}`;
    const now = Date.now();

    // Check cache first
    const cached = cache[cacheKey];
    const isExpired = cached && (now - cached.timestamp) > maxAge;

    if (cached && !isExpired) {
      // Update cache stats and last access
      setCache(currentCache => ({
        ...currentCache,
        [cacheKey]: {
          ...cached,
          hits: cached.hits + 1,
          lastAccess: now
        }
      }));
      setCacheStats(prev => ({ ...prev, hits: prev.hits + 1 }));
      return cached.data;
    }

    try {
      // Cache miss - load the namespace
      setCacheStats(prev => ({ ...prev, misses: prev.misses + 1 }));
      
      await i18n.loadNamespaces(namespace);
      
      const resourceBundle = i18n.getResourceBundle(lang, namespace);
      const newEntry: TranslationCacheEntry = {
        data: resourceBundle || {},
        timestamp: now,
        language: lang,
        hits: 1,
        lastAccess: now
      };

      setCache(currentCache => {
        const updatedCache = {
          ...currentCache,
          [cacheKey]: newEntry
        };
        
        // Apply LRU eviction if needed
        return evictLRU(updatedCache);
      });

      return resourceBundle;
    } catch (error) {
      console.error(`Failed to preload namespace ${namespace}:`, error);
      throw error;
    }
  }, [i18n, cache, maxAge, evictLRU]);

  const preloadMultipleNamespaces = useCallback(async (
    namespaces: string[], 
    languages?: string[]
  ) => {
    const langs = languages || [i18n.language];
    const promises: Promise<unknown>[] = [];

    namespaces.forEach(namespace => {
      langs.forEach(language => {
        promises.push(preloadNamespace(namespace, language));
      });
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Failed to preload multiple namespaces:', error);
      throw error;
    }
  }, [preloadNamespace, i18n.language]);

  const clearCache = useCallback(() => {
    setCache({});
    setCacheStats({ hits: 0, misses: 0, evictions: 0 });
    if (persistToStorage) {
      localStorage.removeItem('translation-cache');
    }
  }, [persistToStorage]);

  const getCacheStats = useCallback(() => {
    const entries = Object.values(cache);
    const totalSize = JSON.stringify(cache).length;
    const hitRate = cacheStats.hits + cacheStats.misses > 0 
      ? (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) * 100 
      : 0;

    return {
      totalEntries: entries.length,
      cacheSize: totalSize,
      hitRate: Math.round(hitRate * 100) / 100,
      ...cacheStats,
      entries: Object.entries(cache).map(([key, entry]) => ({
        key,
        language: entry.language,
        timestamp: entry.timestamp,
        age: Date.now() - entry.timestamp,
        hits: entry.hits,
        lastAccess: entry.lastAccess
      })).sort((a, b) => b.hits - a.hits) // Sort by most used
    };
  }, [cache, cacheStats]);

  const warmupCache = useCallback(async (commonNamespaces: string[] = [
    'common', 'navigation', 'forms', 'errors'
  ]) => {
    const languages = ['vi', 'en', 'tr'];
    try {
      await preloadMultipleNamespaces(commonNamespaces, languages);
      console.log('Translation cache warmed up successfully');
    } catch (error) {
      console.error('Failed to warm up translation cache:', error);
    }
  }, [preloadMultipleNamespaces]);
  return {
    preloadNamespace,
    preloadMultipleNamespaces,
    clearCache,
    getCacheStats,
    warmupCache,
    cache
  };
};
