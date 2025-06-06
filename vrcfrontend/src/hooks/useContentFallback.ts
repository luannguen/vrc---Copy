import { useTranslation } from 'react-i18next';
import { useMultilingualAPI } from './useMultilingualAPI';

interface ContentItem {
  id?: string;
  title?: string;
  content?: string;
  description?: string;
  name?: string;
  excerpt?: string;
  collection?: string;
  [key: string]: unknown;
}

/**
 * Hook for content fallback functionality
 * Handles missing translations by falling back to other languages
 */
export const useContentFallback = () => {
  const { i18n } = useTranslation();
  const { fetchContent } = useMultilingualAPI();

  const getContentWithFallback = async (
    contentId: string,
    collection: string = 'pages',
    preferredLanguage?: string
  ) => {
    const language = preferredLanguage || i18n.language || 'vi';
    const fallbackChain = ['vi', 'en', 'tr'].filter(lang => lang !== language);

    try {
      // Try preferred language first
      const primaryContent = await fetchContent(collection, language);
      if (primaryContent && !isContentMissing(primaryContent)) {
        return { content: primaryContent, language, usedFallback: false };
      }

      // Try fallback languages
      for (const fallbackLang of fallbackChain) {
        try {
          const fallbackContent = await fetchContent(collection, fallbackLang);
          if (fallbackContent && !isContentMissing(fallbackContent)) {
            return { 
              content: fallbackContent, 
              language: fallbackLang, 
              usedFallback: true 
            };
          }
        } catch (error) {
          console.warn(`Fallback failed for ${fallbackLang}:`, error);
        }
      }

      throw new Error('No content available in any language');
    } catch (error) {
      console.error('Content fallback failed:', error);
      return { content: null, language, usedFallback: false };
    }
  };

  const isContentMissing = (content: ContentItem | null): boolean => {
    if (!content) return true;
    
    const requiredFields = ['title', 'content', 'description', 'name'];
    return !requiredFields.some(field => {
      const value = content[field];
      return value && typeof value === 'string' && value.trim().length > 0;
    });
  };

  const mergeContentFields = (
    primary: ContentItem | null,
    fallback: ContentItem | null
  ): ContentItem | null => {
    if (!primary && !fallback) return null;
    if (!primary) return fallback;
    if (!fallback) return primary;

    const merged = { ...primary };
    const mergeFields = ['title', 'content', 'description', 'name', 'excerpt'];
    
    mergeFields.forEach(field => {
      const primaryValue = primary[field];
      const fallbackValue = fallback[field];
      
      if ((!primaryValue || (typeof primaryValue === 'string' && primaryValue.trim() === '')) && fallbackValue) {
        merged[field] = fallbackValue;
      }
    });

    return merged;
  };

  return {
    getContentWithFallback,
    isContentMissing,
    mergeContentFields
  };
};
