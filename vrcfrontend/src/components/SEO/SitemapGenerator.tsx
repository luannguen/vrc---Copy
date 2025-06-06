import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSitemapGenerator } from '../../hooks/useSitemapGenerator';
import { useMultilingualAPI } from '../../hooks/useMultilingualAPI';

interface SitemapDataItem {
  id: string;
  slug: string;
  collection: string;
  updatedAt: string;
  title?: string;
  content?: string;
  [key: string]: unknown;
}

interface SitemapGeneratorProps {
  onGenerated?: (sitemaps: Record<string, string>) => void;
  autoGenerate?: boolean;
  showUI?: boolean;
  baseUrl?: string;
}

/**
 * SitemapGenerator component for generating multilingual sitemaps
 * Handles automatic sitemap generation and provides UI for manual generation
 */
const SitemapGenerator: React.FC<SitemapGeneratorProps> = ({
  onGenerated,
  autoGenerate = false,
  showUI = true,
  baseUrl = 'https://vrc.com.vn'
}) => {
  const { t, i18n } = useTranslation();
  const { sitemaps, isGenerating, generateSitemaps, downloadSitemap } = useSitemapGenerator();
  const { fetchContent } = useMultilingualAPI();
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [sitemapData, setSitemapData] = useState<SitemapDataItem[]>([]);

  const languages = useMemo(() => ['vi', 'en', 'tr'], []);
  const currentLanguage = i18n.language || 'vi';

  // Fetch content for sitemap generation
  const fetchSitemapData = useCallback(async () => {
    try {
      const collections = ['pages', 'posts', 'projects', 'services', 'events'];
      const allData: SitemapDataItem[] = [];

      for (const collection of collections) {
        try {
          const data = await fetchContent(collection, currentLanguage);
          if (data?.docs) {
            allData.push(...data.docs.map((item: Record<string, unknown>) => ({
              ...item,
              collection,
              slug: item.slug || item.id,
              updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
            })));
          }
        } catch (error) {
          console.warn(`Failed to fetch ${collection} for sitemap:`, error);
        }
      }

      setSitemapData(allData);      return allData;
    } catch (error) {
      console.error('Failed to fetch sitemap data:', error);
      return [];
    }
  }, [fetchContent, currentLanguage]);

  // Generate comprehensive sitemap XML
  const generateAdvancedSitemap = useCallback(async (language: string) => {
    const data = await fetchSitemapData();
    
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/gioi-thieu', priority: '0.8', changefreq: 'monthly' },
      { url: '/dich-vu', priority: '0.9', changefreq: 'weekly' },
      { url: '/du-an', priority: '0.9', changefreq: 'weekly' },
      { url: '/tin-tuc', priority: '0.8', changefreq: 'daily' },
      { url: '/su-kien', priority: '0.7', changefreq: 'weekly' },
      { url: '/lien-he', priority: '0.6', changefreq: 'monthly' }
    ];

    let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // Add static pages
    staticPages.forEach(page => {
      sitemapContent += `
  <url>
    <loc>${baseUrl}/${language}${page.url === '/' ? '' : page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

      // Add alternate language links
      languages.forEach(lang => {
        if (lang !== language) {
          sitemapContent += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}/${lang}${page.url === '/' ? '' : page.url}" />`;
        }
      });

      sitemapContent += `
  </url>`;
    });

    // Add dynamic content
    data.forEach(item => {
      const urlPath = getUrlPath(item.collection, item.slug);
      const lastmod = new Date(item.updatedAt).toISOString().split('T')[0];
      
      sitemapContent += `
  <url>
    <loc>${baseUrl}/${language}${urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>`;

      // Add alternate language links for dynamic content
      languages.forEach(lang => {
        if (lang !== language) {
          sitemapContent += `
    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}/${lang}${urlPath}" />`;
        }
      });

      sitemapContent += `
  </url>`;
    });

    sitemapContent += `
</urlset>`;    return sitemapContent;
  }, [fetchSitemapData, baseUrl, languages]);

  // Get URL path based on collection type
  const getUrlPath = (collection: string, slug: string) => {
    const pathMap: Record<string, string> = {
      posts: '/tin-tuc',
      projects: '/du-an', 
      services: '/dich-vu',
      events: '/su-kien',
      pages: ''
    };

    const basePath = pathMap[collection] || '';
    return `${basePath}/${slug}`;  };

  // Generate sitemap index file
  const generateSitemapIndex = useCallback((sitemaps: Record<string, string>) => {
    let indexContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    languages.forEach(language => {
      indexContent += `
  <sitemap>
    <loc>${baseUrl}/sitemap-${language}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`;
    });

    indexContent += `
</sitemapindex>`;

    return indexContent;
  }, [languages, baseUrl]);

  // Handle sitemap generation
  const handleGenerate = useCallback(async () => {
    try {
      const generatedSitemaps: Record<string, string> = {};
      
      for (const language of languages) {
        const sitemap = await generateAdvancedSitemap(language);
        generatedSitemaps[language] = sitemap;
      }

      // Generate sitemap index
      const sitemapIndex = generateSitemapIndex(generatedSitemaps);
      generatedSitemaps['index'] = sitemapIndex;

      await generateSitemaps({
        baseUrl,
        languages
      });

      setLastGenerated(new Date());
      onGenerated?.(generatedSitemaps);

      console.log('Advanced sitemaps generated successfully');    } catch (error) {
      console.error('Failed to generate advanced sitemaps:', error);
    }
  }, [languages, generateAdvancedSitemap, generateSitemapIndex, generateSitemaps, baseUrl, onGenerated]);

  // Auto-generate on mount if enabled
  useEffect(() => {
    if (autoGenerate) {
      handleGenerate();
    }
  }, [autoGenerate, handleGenerate]);

  if (!showUI) {
    return null;
  }

  return (
    <div className="sitemap-generator">
      <div className="sitemap-header">
        <h3>{t('admin.sitemap.title', 'Sitemap Generator')}</h3>
        <p className="text-sm text-gray-600">
          {t('admin.sitemap.description', 'Generate multilingual sitemaps for SEO optimization')}
        </p>
      </div>

      <div className="sitemap-controls">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="btn btn-primary"
        >
          {isGenerating ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              {t('admin.sitemap.generating', 'Generating...')}
            </>
          ) : (
            t('admin.sitemap.generate', 'Generate Sitemaps')
          )}
        </button>

        {lastGenerated && (
          <span className="text-sm text-gray-500 ml-3">
            {t('admin.sitemap.lastGenerated', 'Last generated')}: {lastGenerated.toLocaleString()}
          </span>
        )}
      </div>

      {Object.keys(sitemaps).length > 0 && (
        <div className="sitemap-results mt-4">
          <h4>{t('admin.sitemap.results', 'Generated Sitemaps')}</h4>
          <div className="sitemap-list">
            {Object.entries(sitemaps).map(([type, content]) => (
              <div key={type} className="sitemap-item">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <strong>
                      {type === 'index' 
                        ? t('admin.sitemap.index', 'Sitemap Index')
                        : t(`admin.sitemap.language.${type}`, type.toUpperCase())
                      }
                    </strong>
                    <div className="text-sm text-gray-600">
                      {content.split('\n').length - 1} {t('admin.sitemap.entries', 'entries')}
                    </div>
                  </div>
                  <div className="sitemap-actions">
                    <button
                      onClick={() => downloadSitemap(type)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      {t('admin.sitemap.download', 'Download')}
                    </button>
                    <a
                      href={`${baseUrl}/sitemap${type !== 'index' ? `-${type}` : ''}.xml`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-secondary ml-2"
                    >
                      {t('admin.sitemap.view', 'View')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="sitemap-info mt-4">
        <h5>{t('admin.sitemap.info.title', 'Sitemap Information')}</h5>
        <ul className="text-sm text-gray-600">
          <li>{t('admin.sitemap.info.multilingual', 'Supports multilingual content (VI, EN, TR)')}</li>
          <li>{t('admin.sitemap.info.hreflang', 'Includes hreflang annotations for language alternatives')}</li>
          <li>{t('admin.sitemap.info.dynamic', 'Automatically includes dynamic content from CMS')}</li>
          <li>{t('admin.sitemap.info.priority', 'Optimized priority and change frequency settings')}</li>
        </ul>
      </div>
    </div>
  );
};

export default SitemapGenerator;
