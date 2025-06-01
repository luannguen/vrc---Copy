import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Tag {
  id: string;
  title: string;
  slug: string;
}

interface TagsListProps {
  className?: string;
}

export const TagsList: React.FC<TagsListProps> = ({ className = '' }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/tags`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter out old tags and only show Vietnamese news tags
        const newsTags = data.tags.filter((tag: Tag) => {
          const newsTagSlugs = [
            'dien-lanh', 'trien-lam', 'hoi-thao', 'cong-nghe', 
            'tiet-kiem-nang-luong', 'bao-tri', 'inverter', 
            'hop-tac-quoc-te', 'nghien-cuu', 'phat-trien-ben-vung'
          ];
          return newsTagSlugs.includes(tag.slug);
        });
        
        setTags(newsTags);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch tags');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
        <h3 className="font-semibold text-lg mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse px-3 py-1 rounded-full h-7 w-20"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
        <h3 className="font-semibold text-lg mb-3">Tags</h3>
        <p className="text-red-500 text-sm">Không thể tải tags: {error}</p>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
        <h3 className="font-semibold text-lg mb-3">Tags</h3>
        <p className="text-gray-500 text-sm">Chưa có tags nào.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
      <h3 className="font-semibold text-lg mb-3">Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            to={`/news/tag/${tag.slug}`}
            className="bg-gray-100 hover:bg-blue-100 hover:text-blue-700 px-3 py-1 rounded-full text-sm transition-colors"
          >
            {tag.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
