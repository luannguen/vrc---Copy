import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMultilingualAPI } from '../../hooks/useMultilingualAPI';

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

interface ContentFallbackProps {
  content: ContentItem;
  fallbackLanguage?: string;
  showFallbackIndicator?: boolean;
  onFallbackUsed?: (language: string) => void;
  children?: React.ReactNode;
}

interface FallbackChain {
  primary: string;
  secondary: string[];
  default: string;
}

/**
 * ContentFallback component for handling missing translations
 * Provides intelligent fallback chain and content completion
 */
const ContentFallback: React.FC<ContentFallbackProps> = ({
  content,
  fallbackLanguage = 'vi',
  showFallbackIndicator = true,
  onFallbackUsed,
  children
}) => {
  const { i18n, t } = useTranslation();
  const { fetchContent } = useMultilingualAPI();
  const [fallbackContent, setFallbackContent] = useState<ContentItem | null>(null);
  const [usedFallback, setUsedFallback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const currentLanguage = i18n.language || 'vi';

  // Define fallback chains for different languages
  const fallbackChains: Record<string, FallbackChain> = useMemo(() => ({
    en: {
      primary: 'en',
      secondary: ['vi'],
      default: 'vi'
    },
    tr: {
      primary: 'tr',
      secondary: ['en', 'vi'],
      default: 'vi'
    },
    vi: {
      primary: 'vi',
      secondary: ['en'],
      default: 'vi'
    }
  }), []);

  // Check if content is missing or incomplete
  const isContentMissing = useCallback((content: ContentItem | null, language: string): boolean => {
    if (!content) return true;
    
    // Check for common required fields
    const requiredFields = ['title', 'content', 'description', 'name'];
    const hasRequiredContent = requiredFields.some(field => {
      const value = content[field];
      return value && typeof value === 'string' && value.trim().length > 0;
    });

    return !hasRequiredContent;
  }, []);

  // Get content with fallback logic
  const getContentWithFallback = useCallback(async (originalContent: ContentItem): Promise<ContentItem> => {
    const chain = fallbackChains[currentLanguage] || fallbackChains.vi;
    
    // First check if current content is sufficient
    if (!isContentMissing(originalContent, currentLanguage)) {
      return originalContent;
    }

    setIsLoading(true);

    try {
      // Try secondary languages in order
      for (const language of chain.secondary) {
        try {
          if (originalContent?.id) {
            const fallbackData = await fetchContent(
              originalContent.collection || 'pages',
              language
            );

            if (fallbackData && !isContentMissing(fallbackData, language)) {
              setUsedFallback(language);
              onFallbackUsed?.(language);
              return fallbackData;
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch fallback content for ${language}:`, error);
        }
      }

      // If all else fails, use default language
      if (chain.default !== currentLanguage) {
        try {
          if (originalContent?.id) {
            const defaultData = await fetchContent(
              originalContent.collection || 'pages',
              chain.default
            );

            if (defaultData && !isContentMissing(defaultData, chain.default)) {
              setUsedFallback(chain.default);
              onFallbackUsed?.(chain.default);
              return defaultData;
            }
          }
        } catch (error) {
          console.warn(`Failed to fetch default fallback content:`, error);
        }
      }

      // Return original content if no fallback found
      return originalContent;
    } finally {
      setIsLoading(false);
    }
  }, [currentLanguage, fetchContent, isContentMissing, onFallbackUsed, fallbackChains]);

  // Merge content with fallback, preserving existing translations
  const mergeWithFallback = useCallback((original: ContentItem | null, fallback: ContentItem | null): ContentItem | null => {
    if (!original || !fallback) return original || fallback;

    const merged = { ...original };

    // Merge specific fields that might be missing
    const mergeFields = ['title', 'content', 'description', 'name', 'excerpt'];
    
    mergeFields.forEach(field => {
      if ((!merged[field] || (typeof merged[field] === 'string' && (merged[field] as string).trim() === '')) && fallback[field]) {
        merged[field] = fallback[field];
      }
    });

    return merged;
  }, []);

  useEffect(() => {
    if (content) {
      getContentWithFallback(content).then(result => {
        if (result !== content) {
          setFallbackContent(mergeWithFallback(content, result));
        } else {
          setFallbackContent(content);
          setUsedFallback(null);
        }
      });
    }
  }, [content, currentLanguage, getContentWithFallback, mergeWithFallback]);

  const finalContent = fallbackContent || content;

  if (isLoading) {
    return (
      <div className="content-fallback-loading">
        <div className="loading-spinner" />
        <span>{t('content.loading', 'Loading content...')}</span>
      </div>
    );
  }

  return (
    <div className="content-fallback-wrapper">
      {usedFallback && showFallbackIndicator && (
        <div className="fallback-indicator">
          <span className="fallback-badge">
            {t('content.fallback.indicator', 'Content shown in {{language}}', {
              language: t(`language.${usedFallback}`, usedFallback.toUpperCase())
            })}
          </span>
        </div>
      )}
      
      {children ? 
        React.cloneElement(children as React.ReactElement, { content: finalContent }) :
        <ContentRenderer content={finalContent} />
      }
    </div>
  );
};

/**
 * Default content renderer
 */
const ContentRenderer: React.FC<{ content: ContentItem | null }> = ({ content }) => {
  if (!content) return null;

  return (
    <div className="content-renderer">
      {content.title && <h1>{content.title}</h1>}
      {content.description && <p className="description">{content.description}</p>}
      {content.content && (
        <div 
          className="content-body"
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      )}
    </div>
  );
};

export default ContentFallback;
