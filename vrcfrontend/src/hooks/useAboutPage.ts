import { useState, useEffect } from 'react';
import { fixMediaUrl } from '../utils/urlProcessor';

// Media interface từ Payload CMS
interface MediaItem {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  filename: string;
  mimeType: string;
}

interface RichTextContent {
  root: {
    type: string;
    children: Array<{
      type: string;
      children: Array<{ text: string }>;
    }>;
  };
}

interface CoreValue {
  id: string;
  title: string;
  description: RichTextContent;
  icon: string;
}

interface Leader {
  id: string;
  name: string;
  position: string;
  bio: RichTextContent;
  image?: MediaItem;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface AboutPageData {
  heroSection: {
    title: string;
    subtitle: string;
    backgroundImage?: MediaItem;
  };
  companyHistory: {
    title: string;
    description: RichTextContent;
    establishedYear: number;
    experienceYears: number;
  };
  vision: {
    title: string;
    description: RichTextContent;
    icon: string;
  };
  mission: {
    title: string;
    description: RichTextContent;
    icon: string;
  };
  coreValues: CoreValue[];
  leadership: Leader[];
  achievements: Achievement[];
}

const useAboutPage = () => {
  const [data, setData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // VITE_API_URL đã bao gồm /api trong .env
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
        
        const response = await fetch(
          `${API_BASE_URL}/about-page`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }        const aboutData = await response.json();
        
        // Process media URLs to fix potential port issues
        if (aboutData.heroSection?.backgroundImage?.url) {
          aboutData.heroSection.backgroundImage.url = fixMediaUrl(aboutData.heroSection.backgroundImage.url);
        }
        
        // Fix leadership image URLs
        if (aboutData.leadership) {
          aboutData.leadership = aboutData.leadership.map((leader: Leader) => ({
            ...leader,
            image: leader.image ? {
              ...leader.image,
              url: fixMediaUrl(leader.image.url)
            } : leader.image
          }));
        }
        
        setData(aboutData);
      } catch (err) {
        console.error('Error fetching about page data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch about page data');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Helper function to convert rich text to plain text
  const richTextToPlainText = (richText: RichTextContent): string => {
    if (!richText?.root?.children) return '';
    
    return richText.root.children
      .map(child => 
        child.children?.map(textNode => textNode.text).join('') || ''
      )
      .join('\n\n');
  };

  // Helper function to convert rich text to HTML
  const richTextToHTML = (richText: RichTextContent): string => {
    if (!richText?.root?.children) return '';
    
    return richText.root.children
      .map(child => {
        if (child.type === 'paragraph') {
          const text = child.children?.map(textNode => textNode.text).join('') || '';
          return `<p>${text}</p>`;
        }
        return '';
      })
      .join('');
  };

  return {
    data,
    loading,
    error,
    richTextToPlainText,
    richTextToHTML,
  };
};

export default useAboutPage;
