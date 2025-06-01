import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Tag {
  id: string;
  title: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  heroImage?: {
    url: string;
    alt?: string;
  };
  publishedAt: string;
  categories?: Array<{
    id: string;
    name: string;
  }>;
}

interface TagPageData {
  tag: Tag;
  posts: Post[];
  pagination: {
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const TagPage: React.FC = () => {
  const { tagSlug } = useParams<{ tagSlug: string }>();
  const [data, setData] = useState<TagPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostsByTag = async () => {
      if (!tagSlug) return;

      try {
        setLoading(true);
        setError(null);
          const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/by-tag?tag=${encodeURIComponent(tagSlug)}`
        );
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Tag không tồn tại');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tagData = await response.json();
        setData(tagData);
      } catch (err) {
        console.error('Error fetching posts by tag:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPostsByTag();
  }, [tagSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Có lỗi xảy ra</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link
              to="/news"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại trang tin tức
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.posts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Tag: {data?.tag.title || tagSlug}
            </h1>
            <p className="text-gray-600 mb-4">Chưa có bài viết nào cho tag này.</p>
            <Link
              to="/news"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Quay lại trang tin tức
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-blue-600">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/news" className="hover:text-blue-600">Tin tức</Link>
            <span className="mx-2">/</span>
            <span>Tag: {data.tag.title}</span>
          </nav>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tag: {data.tag.title}
          </h1>
          <p className="text-gray-600">
            {data.pagination.totalDocs} bài viết được tìm thấy
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {data.posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {post.heroImage && (
                <div className="aspect-video bg-gray-200">                  <img
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000'}${post.heroImage.url}`}
                    alt={post.heroImage.alt || post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  <Link 
                    to={`/news/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                  
                  {post.categories && post.categories.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {post.categories[0].name}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2">
            {data.pagination.hasPrevPage && (
              <Link
                to={`/news/tag/${tagSlug}?page=${data.pagination.page - 1}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Trang trước
              </Link>
            )}
            
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {data.pagination.page} / {data.pagination.totalPages}
            </span>
            
            {data.pagination.hasNextPage && (
              <Link
                to={`/news/tag/${tagSlug}?page=${data.pagination.page + 1}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Trang sau
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
