import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface HreflangTagsProps {
  currentPath: string;
  alternateLanguages?: Record<string, string>;
}

/**
 * HreflangTags component for multilingual SEO
 * Generates proper hreflang tags for search engines to understand language variations
 */
const HreflangTags: React.FC<HreflangTagsProps> = ({ 
  currentPath, 
  alternateLanguages = {} 
}) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language || 'vi';

  // Define language configurations
  const languages = {
    vi: {
      code: 'vi-VN',
      url: '/vi',
      name: 'Vietnamese'
    },
    en: {
      code: 'en-US', 
      url: '/en',
      name: 'English'
    },
    tr: {
      code: 'tr-TR',
      url: '/tr', 
      name: 'Turkish'
    }
  };

  // Get base URL from environment or default
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://vrc.com.vn';

  // Generate hreflang links
  const generateHreflangLinks = () => {
    const links: React.ReactElement[] = [];

    // Add current page link
    const currentLangConfig = languages[currentLanguage as keyof typeof languages];
    if (currentLangConfig) {
      links.push(
        <link
          key={`hreflang-${currentLanguage}`}
          rel="alternate"
          hrefLang={currentLangConfig.code}
          href={`${baseUrl}${currentLangConfig.url}${currentPath}`}
        />
      );
    }

    // Add alternate language links
    Object.entries(languages).forEach(([lang, config]) => {
      if (lang !== currentLanguage) {
        const alternatePath = alternateLanguages[lang] || currentPath;
        links.push(
          <link
            key={`hreflang-${lang}`}
            rel="alternate"
            hrefLang={config.code}
            href={`${baseUrl}${config.url}${alternatePath}`}
          />
        );
      }
    });

    // Add x-default link (fallback to Vietnamese)
    links.push(
      <link
        key="hreflang-x-default"
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}/vi${currentPath}`}
      />
    );

    return links;
  };

  return (
    <Helmet>
      {generateHreflangLinks()}
    </Helmet>
  );
};

export default HreflangTags;
