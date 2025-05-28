"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export type RelatedPostsProps = {
  className?: string;
  sourcePostId: string;
  initialDocs?: any[];
  layout?: 'grid' | 'carousel' | 'compact' | 'featured';
  limit?: number;
  title?: string;
  showViewMore?: boolean;
  onPostClick?: (postId: string) => void;
};

export const EnhancedRelatedPosts: React.FC<RelatedPostsProps> = ({
  className = '',
  sourcePostId,
  initialDocs = [],
  layout = 'grid',
  limit = 4,
  title = 'Related Posts',
  showViewMore = true,
  onPostClick
}) => {
  const [posts, setPosts] = useState(initialDocs);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  const fetchRelatedPosts = async (pageNum = 1) => {
    if (!sourcePostId) return;
    
    try {
      setLoading(true);
      const response = await fetch(
        `/(payload)/api/posts/${sourcePostId}/related?limit=${limit}&page=${pageNum}`,
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch related posts');
      }
      
      if (pageNum === 1) {
        setPosts(data.data);
      } else {
        setPosts(prev => [...prev, ...data.data]);
      }
      
      setHasMore(data.data.length === limit);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch related posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Only fetch if we don't have initial docs
    if (!initialDocs.length) {
      fetchRelatedPosts();
    } else {
      // If we have initial docs, check if there might be more
      setHasMore(initialDocs.length === limit);
    }
  }, [sourcePostId, limit]);
    // Track when post is clicked
  const handlePostClick = (postId: string) => {
    // Track the click for analytics
    fetch('/api/analytics/related-post-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourcePostId,
        clickedPostId: postId,
        timestamp: new Date().toISOString()
      })
    }).catch(err => {
      console.error('Failed to track related post click:', err);
    });
    
    // Call the onPostClick handler if provided
    if (onPostClick) onPostClick(postId);
  };
  
  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRelatedPosts(nextPage);
  };
  
  // If initial load and no data
  if (!posts.length && !loading && !error) {
    return null;
  }
  
  const renderGridLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          onClick={() => handlePostClick(post.id)}
        >
          <Card 
            doc={post} 
            relationTo="posts" 
            showCategories 
          />
        </motion.div>
      ))}
      
      {/* Loading skeletons */}
      {loading && Array.from({ length: 2 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="bg-gray-100 rounded-lg p-4 animate-pulse">
          <div className="w-full h-48 bg-gray-200 mb-4 rounded"></div>
          <div className="h-6 bg-gray-200 w-3/4 mb-2 rounded"></div>
          <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
        </div>
      ))}
    </div>
  );
  
  const renderCompactLayout = () => (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          className="flex gap-4 items-start"
          onClick={() => handlePostClick(post.id)}
        >
          {post.heroImage && (
            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded overflow-hidden">
              <img 
                src={typeof post.heroImage === 'object' ? post.heroImage.url : ''} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h4 className="text-base font-medium mb-1 line-clamp-2 hover:text-primary">
              <a href={`/posts/${post.slug}`}>{post.title}</a>
            </h4>
            {post.publishedAt && (
              <p className="text-xs text-gray-500">
                {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>
        </motion.div>
      ))}
      
      {/* Loading skeletons */}
      {loading && Array.from({ length: 3 }).map((_, index) => (
        <div key={`skeleton-${index}`} className="flex gap-4 items-start animate-pulse">
          <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded"></div>
          <div className="flex-grow">
            <div className="h-5 bg-gray-200 w-full mb-2 rounded"></div>
            <div className="h-3 bg-gray-200 w-1/3 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
  
  const renderFeaturedLayout = () => {
    if (!posts.length) return null;
    
    const featuredPost = posts[0];
    const otherPosts = posts.slice(1);
    
    return (
      <div className="space-y-6">
        {/* Featured post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="featured-post"
          onClick={() => handlePostClick(featuredPost.id)}
        >
          <Card 
            doc={featuredPost} 
            relationTo="posts" 
            showCategories 
            className="featured-card"
          />
        </motion.div>
        
        {/* Other posts in grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {otherPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handlePostClick(post.id)}
            >
              <Card 
                doc={post} 
                relationTo="posts" 
                showCategories 
                className="h-full"
              />
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  // For simplicity, we'll implement the grid, compact, and featured layouts first
  // The carousel layout requires additional dependencies like Swiper
  const renderLayout = () => {
    switch (layout) {
      case 'compact':
        return renderCompactLayout();
      case 'featured':
        return renderFeaturedLayout();
      case 'grid':
      default:
        return renderGridLayout();
    }
  };
  
  return (
    <div ref={ref} className={`related-posts ${className}`}>
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <AnimatePresence>
        {renderLayout()}
      </AnimatePresence>
      
      {showViewMore && hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Đang tải...' : 'Xem thêm bài viết liên quan'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedRelatedPosts;