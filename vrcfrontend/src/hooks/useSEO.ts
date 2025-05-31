import { useEffect } from 'react';
import { useHomepageSEO } from './useHomepageSettings';

/**
 * Hook to apply SEO settings from homepage settings API
 */
export const useHomepageSEOConfig = () => {
  const { seo, isLoading, error } = useHomepageSEO();

  // Fallback SEO data
  const fallbackSEO = {
    metaTitle: "VRC - Giải pháp điều hòa không khí tiên tiến",
    metaDescription: "VRC cung cấp giải pháp điều hòa không khí tiên tiến với công nghệ Inverter, hệ thống thu hồi nhiệt và tư vấn tiết kiệm năng lượng chuyên nghiệp.",
    ogImage: {
      url: "/images/og-homepage.jpg",
      alt: "VRC - Giải pháp điều hòa không khí"
    }
  };

  const seoData = seo || fallbackSEO;

  useEffect(() => {
    if (!isLoading && seoData) {
      // Update document title
      document.title = seoData.metaTitle;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', seoData.metaDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = seoData.metaDescription;
        document.head.appendChild(meta);
      }

      // Update Open Graph meta tags
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', seoData.metaTitle);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:title');
        meta.content = seoData.metaTitle;
        document.head.appendChild(meta);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', seoData.metaDescription);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.content = seoData.metaDescription;
        document.head.appendChild(meta);
      }

      if (seoData.ogImage?.url) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', seoData.ogImage.url);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'og:image');
          meta.content = seoData.ogImage.url;
          document.head.appendChild(meta);
        }

        const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
        if (ogImageAlt) {
          ogImageAlt.setAttribute('content', seoData.ogImage.alt);
        } else {
          const meta = document.createElement('meta');
          meta.setAttribute('property', 'og:image:alt');
          meta.content = seoData.ogImage.alt;
          document.head.appendChild(meta);
        }
      }

      // Twitter Card meta tags
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        const meta = document.createElement('meta');
        meta.name = 'twitter:card';
        meta.content = 'summary_large_image';
        document.head.appendChild(meta);
      }

      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', seoData.metaTitle);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'twitter:title';
        meta.content = seoData.metaTitle;
        document.head.appendChild(meta);
      }

      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', seoData.metaDescription);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'twitter:description';
        meta.content = seoData.metaDescription;
        document.head.appendChild(meta);
      }

      if (seoData.ogImage?.url) {
        const twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (twitterImage) {
          twitterImage.setAttribute('content', seoData.ogImage.url);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'twitter:image';
          meta.content = seoData.ogImage.url;
          document.head.appendChild(meta);
        }
      }
    }
  }, [seoData, isLoading]);

  if (error) {
    console.warn('SEO API error, using fallback data:', error);
  }

  return {
    seoData,
    isLoading,
    error
  };
};
