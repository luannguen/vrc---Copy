import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface MultilingualSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  article?: boolean;
  noindex?: boolean;
  canonical?: string;
  alternateLanguages?: Record<string, string>;
  children?: React.ReactNode;
}

/**
 * MultilingualSEO component for comprehensive SEO management
 * Handles meta tags, hreflang, and language-specific optimizations
 */
const MultilingualSEO: React.FC<MultilingualSEOProps> = ({
  title,
  description,
  keywords = [],
  image,
  article = false,
  noindex = false,
  canonical,
  alternateLanguages = {},
  children
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const currentLanguage = i18n.language || 'vi';

  // Base URL configuration
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://vrcorp.vn/';
  
  // Language configurations
  const languages = {
    vi: { code: 'vi-VN', dir: 'ltr', name: 'Vietnamese' },
    en: { code: 'en-US', dir: 'ltr', name: 'English' },
    tr: { code: 'tr-TR', dir: 'ltr', name: 'Turkish' }
  };

  const currentLangConfig = languages[currentLanguage as keyof typeof languages] || languages.vi;

  // Generate meta tags
  const generateMetaTags = () => {
    const siteName = t('seo.siteName', 'VRC - Vacuum Refrigeration Company');
    const defaultTitle = t('seo.defaultTitle', 'VRC - Giải pháp điện lạnh hàng đầu Việt Nam');
    const defaultDescription = t('seo.defaultDescription', 'VRC cung cấp giải pháp điện lạnh toàn diện với hơn 20 năm kinh nghiệm. Chuyên về hệ thống điều hòa, làm lạnh công nghiệp và dịch vụ bảo trì chuyên nghiệp.');

    const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const finalDescription = description || defaultDescription;
    const finalImage = image || `${baseUrl}/images/og-default.jpg`;
    const fullUrl = `${baseUrl}${location.pathname}`;

    return {
      title: finalTitle,
      description: finalDescription,
      image: finalImage,
      url: fullUrl,
      siteName,
      canonical: canonical || fullUrl
    };
  };

  const meta = generateMetaTags();

  // Generate hreflang links
  const generateHreflangLinks = () => {
    const links: Array<{ rel: string; hrefLang: string; href: string }> = [];

    // Add current page
    links.push({
      rel: 'alternate',
      hrefLang: currentLangConfig.code,
      href: `${baseUrl}/${currentLanguage}${location.pathname}`
    });

    // Add other languages
    Object.entries(languages).forEach(([lang, config]) => {
      if (lang !== currentLanguage) {
        const alternatePath = alternateLanguages[lang] || location.pathname;
        links.push({
          rel: 'alternate',
          hrefLang: config.code,
          href: `${baseUrl}/${lang}${alternatePath}`
        });
      }
    });

    // Add x-default
    links.push({
      rel: 'alternate',
      hrefLang: 'x-default',
      href: `${baseUrl}/vi${location.pathname}`
    });

    return links;
  };

  const hreflangLinks = generateHreflangLinks();

  // JSON-LD structured data
  const generateJsonLd = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: meta.siteName,
      url: baseUrl,
      description: meta.description,
      inLanguage: currentLangConfig.code,
      publisher: {
        '@type': 'Organization',
        name: 'VRC - Vacuum Refrigeration Company',
        logo: `${baseUrl}/images/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+84-123-456-789',
          contactType: 'customer service',
          availableLanguage: ['vi', 'en', 'tr']
        }
      }
    };

    if (article) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description: meta.description,
        image: meta.image,
        url: meta.url,
        datePublished: new Date().toISOString(),
        author: {
          '@type': 'Organization',
          name: meta.siteName
        },
        publisher: baseSchema.publisher,
        inLanguage: currentLangConfig.code
      };
    }

    return baseSchema;
  };

  const jsonLd = generateJsonLd();
  return (
    <Helmet>
      {/* HTML attributes */}
      <html lang={currentLanguage} dir={currentLangConfig.dir} />
      
      {/* Basic meta tags */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <link rel="canonical" href={meta.canonical} />

      {/* Language and region */}
      <meta httpEquiv="content-language" content={currentLanguage} />
      <meta name="language" content={currentLangConfig.name} />

      {/* Open Graph */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:url" content={meta.url} />
      <meta property="og:site_name" content={meta.siteName} />
      <meta property="og:locale" content={currentLangConfig.code.replace('-', '_')} />

      {/* Alternative locales for Open Graph */}
      {Object.entries(languages).map(([lang, config]) => (
        lang !== currentLanguage && (
          <meta 
            key={lang}
            property="og:locale:alternate" 
            content={config.code.replace('-', '_')} 
          />
        )
      ))}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.image} />

      {/* Hreflang tags */}
      {hreflangLinks.map((link, index) => (
        <link
          key={index}
          rel={link.rel}
          hrefLang={link.hrefLang}
          href={link.href}
        />
      ))}

      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>

      {/* Additional children */}
      {children}
    </Helmet>
  );
};

export default MultilingualSEO;
