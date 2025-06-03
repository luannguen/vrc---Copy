import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNewsTags, Tag } from '@/services/tagsService';

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
        
        const newsTags = await getNewsTags();
        setTags(newsTags);
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Không thể tải tags: ' + (err instanceof Error ? err.message : 'Failed to fetch'));
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
