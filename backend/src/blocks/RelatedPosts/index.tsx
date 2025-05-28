"use client";

import React from 'react';
import { EnhancedRelatedPosts } from './EnhancedComponent';
import { relatedPostsBlockConfig } from './config';

// Export the configuration from config.ts
export { relatedPostsBlockConfig };

export type RelatedPostsBlockProps = {
  relatedPostsBlock?: {
    sourcePostId?: string;
    layout?: 'grid' | 'carousel' | 'compact' | 'featured';
    limit?: number;
    title?: string;
    showViewMore?: boolean;
  };
};

export const RelatedPostsBlock: React.FC<RelatedPostsBlockProps> = ({ 
  relatedPostsBlock 
}) => {
  const { 
    sourcePostId, 
    layout = 'grid',
    limit = 4,
    title = 'Related Posts',
    showViewMore = true,
  } = relatedPostsBlock || {};

  if (!sourcePostId) {
    return null;
  }

  return (
    <div className="related-posts-block py-10">
      <div className="container mx-auto">
        <EnhancedRelatedPosts 
          sourcePostId={sourcePostId}
          layout={layout}
          limit={limit}
          title={title}
          showViewMore={showViewMore}
        />
      </div>
    </div>
  );
};

export default RelatedPostsBlock;