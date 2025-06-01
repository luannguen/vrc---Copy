import { useState, useEffect } from 'react';

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
  image?: any;
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
    backgroundImage?: any;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/about-page`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const aboutData = await response.json();
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
