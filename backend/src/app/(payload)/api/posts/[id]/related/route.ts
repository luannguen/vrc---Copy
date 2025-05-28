import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  handleOptionsRequest,
  createCORSResponse,
  withCORS
} from '../../../_shared/cors'
import { Post as _Post } from '@/payload-types'

// Pre-flight request handler for CORS
export function OPTIONS(req: NextRequest) {
  return handleOptionsRequest(req, ['GET', 'OPTIONS']);
}

// GET handler for related posts
export const GET = withCORS(async (req: NextRequest): Promise<NextResponse> => {
  const url = new URL(req.url);
  
  // Extract ID from path segments
  const pathSegments = url.pathname.split('/');
  const postId = pathSegments[pathSegments.findIndex(segment => segment === 'posts') + 1];
  
  if (!postId) {
    return createCORSResponse({
      success: false,
      message: 'Post ID is required'
    }, 400);
  }
  
  // Parse query parameters  
  const limit = Number(url.searchParams.get('limit')) || 4;
  const page = Number(url.searchParams.get('page')) || 1;
  const categoryFilter = url.searchParams.get('category');
  
  try {
    // Initialize Payload
    const payload = await getPayload({ config });
    
    // Get current post to find related content
    const currentPost = await payload.findByID({
      collection: 'posts' as any,
      id: postId,
      depth: 0 // No need to populate for this operation
    });
    
    if (!currentPost) {
      return createCORSResponse({
        success: false,
        message: 'Post not found'
      }, 404);
    }
    
    // First try manual related posts
    let relatedPosts: any[] = [];
    if (currentPost.relatedPosts && Array.isArray(currentPost.relatedPosts) && currentPost.relatedPosts.length > 0) {
      // If there are manually selected related posts, use them first
      const manualRelatedQuery = {
        collection: 'posts' as any,
        where: {
          id: {
            in: currentPost.relatedPosts.map((id: any) => typeof id === 'object' ? id.id : id)
          }
        },
        limit,
        page,
        sort: '-publishedAt',
        depth: 1
      };
      
      const manualRelated = await payload.find(manualRelatedQuery);
      relatedPosts = manualRelated.docs;
    }
    
    // If we need more posts to fill the limit, fetch auto-suggested posts
    if (relatedPosts.length < limit) {
      const remainingLimit = limit - relatedPosts.length;
      
      // Query for posts with similar categories
      const autoRelatedQuery = {
        collection: 'posts' as any,
        where: {
          id: {
            not_equals: postId
          },
          // Exclude already fetched manual related posts
          ...(relatedPosts.length > 0 ? {
            id: {
              not_in: relatedPosts.map((post: any) => post.id)
            }
          } : {}),
          // Filter by same categories if the post has categories
          ...(currentPost.categories && Array.isArray(currentPost.categories) && currentPost.categories.length > 0 ? {
            categories: {
              in: currentPost.categories.map((cat: any) => 
                typeof cat === 'object' ? cat.id : cat
              )
            }
          } : {}),
          // Add category filter if specified
          ...(categoryFilter ? {
            categories: {
              in: [categoryFilter]
            }
          } : {})
        },
        limit: remainingLimit,
        page: 1,
        sort: '-publishedAt',
        depth: 1
      };
      
      const autoRelated = await payload.find(autoRelatedQuery);
      relatedPosts = [...relatedPosts, ...autoRelated.docs];
    }
    
    // Process related posts to calculate relevance score 
    // and include only necessary data
    const processedRelatedPosts = relatedPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt,
      categories: post.categories,
      heroImage: post.heroImage,
      meta: post.meta,
      relevanceScore: calculateRelevanceScore(currentPost, post)
    }));
    
    // Sort by relevance score
    processedRelatedPosts.sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
    
    return createCORSResponse({
      success: true,
      data: processedRelatedPosts,
      pagination: {
        limit,
        page,
        total: processedRelatedPosts.length
      }
    }, 200);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return createCORSResponse({
      success: false,
      message: 'Error fetching related posts'
    }, 500);
  }
});

// Utility function to calculate relevance score
function calculateRelevanceScore(sourcePost: any, targetPost: any): number {
  let score = 0;
  
  // Category match score
  if (sourcePost.categories && targetPost.categories) {
    const sourceCategories = sourcePost.categories.map((c: any) => 
      typeof c === 'object' ? c.id : c
    );
    const targetCategories = targetPost.categories.map((c: any) => 
      typeof c === 'object' ? c.id : c
    );
    
    const commonCategories = sourceCategories.filter((c: string) => 
      targetCategories.includes(c)
    );
    
    score += commonCategories.length * 3; // 3 points per matching category
  }
  
  // Recency score - posts published close to each other get higher scores
  if (sourcePost.publishedAt && targetPost.publishedAt) {
    const sourceDate = new Date(sourcePost.publishedAt);
    const targetDate = new Date(targetPost.publishedAt);
    const diffDays = Math.abs((sourceDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 7) score += 5;
    else if (diffDays < 30) score += 3;
    else if (diffDays < 90) score += 1;
  }
  
  return score;
}
