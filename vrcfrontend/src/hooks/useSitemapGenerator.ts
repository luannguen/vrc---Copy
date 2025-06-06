import { useState } from 'react';

export interface SitemapOptions {
  baseUrl?: string;
  languages?: string[];
}

/**
 * Hook to use sitemap generation
 */
export const useSitemapGenerator = () => {
  const [sitemaps, setSitemaps] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSitemaps = async (options?: SitemapOptions) => {
    setIsGenerating(true);
    
    try {
      // This would typically be done server-side or in a build process
      // For demo purposes, we'll simulate the generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const baseUrl = options?.baseUrl || 'https://vrc.com.vn';
      const languages = options?.languages || ['vi', 'en', 'tr'];
      
      const mockSitemaps: Record<string, string> = {};
      
      // Generate mock sitemaps for each language
      languages.forEach(lang => {
        mockSitemaps[lang] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/${lang}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
      });
      
      setSitemaps(mockSitemaps);
      console.log('Sitemaps generated successfully');
      
    } catch (error) {
      console.error('Failed to generate sitemaps:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSitemap = (type: string = 'main') => {
    const sitemap = sitemaps[type];
    if (!sitemap) {
      console.warn(`Sitemap '${type}' not found`);
      return;
    }

    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sitemap${type !== 'main' ? `-${type}` : ''}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSitemapUrl = (type: string = 'main', baseUrl: string = 'https://vrc.com.vn') => {
    return `${baseUrl}/sitemap${type !== 'main' ? `-${type}` : ''}.xml`;
  };

  return {
    sitemaps,
    isGenerating,
    generateSitemaps,
    downloadSitemap,
    getSitemapUrl
  };
};
