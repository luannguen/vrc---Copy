import dotenv from 'dotenv';
import payload from 'payload';
import cliProgress from 'cli-progress';
import colors from 'colors';
import type { Post as _Post } from '@/payload-types';

// Load environment variables
dotenv.config();

// Calculate relevance score between posts
function calculateRelevanceScore(sourcePost: any, targetPost: any): number {
  let score = 0;
  
  // Skip if same post
  if (sourcePost.id === targetPost.id) {
    return 0;
  }
  
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
  
  // Title similarity could be added here for more advanced matching
  
  return score;
}

const updateAutoRelatedPosts = async () => {  try {
    // Import the config using ES modules
    const { default: config } = await import('../../payload.config');
    
    // Initialize Payload
    await payload.init({
      config,
    });

    console.log(colors.cyan('\n📊 Starting auto-related posts update'));
    
    // Get all published posts
    const { docs: allPosts } = await payload.find({
      collection: 'posts',
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 1000,
      depth: 0,
    });

    console.log(colors.green(`Found ${allPosts.length} published posts to process`));

    // Create progress bar
    const progressBar = new cliProgress.SingleBar({
      format: 'Progress |' + colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Posts',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });
    
    progressBar.start(allPosts.length, 0);

    // Process each post
    for (const [index, post] of allPosts.entries()) {
      // Calculate relevance scores for all other posts
      const scoredPosts = allPosts
        .filter(otherPost => otherPost.id !== post.id)
        .map(otherPost => ({
          id: otherPost.id,
          score: calculateRelevanceScore(post, otherPost)
        }))
        .filter(item => item.score > 0) // Only include posts with some relevance
        .sort((a, b) => b.score - a.score) // Sort by score descending
        .slice(0, 10); // Take top 10
      
      // Get IDs of top related posts
      const autoRelatedPostIds = scoredPosts.map(item => item.id);
      
      // Update the post with auto-related posts
      if (autoRelatedPostIds.length > 0) {
        await payload.update({
          collection: 'posts',
          id: post.id,
          data: {
            relatedPosts: autoRelatedPostIds, // Update relatedPosts field (renamed from autoRelatedPosts to match schema)
          },
        });
      }
      
      progressBar.update(index + 1);
    }
    
    progressBar.stop();
    
    console.log(colors.green('\n✅ Auto-related posts update completed successfully'));
    
    process.exit(0);
  } catch (error) {
    console.error(colors.red('\n❌ Error updating auto-related posts:'));
    console.error(error);
    process.exit(1);
  }
};

updateAutoRelatedPosts();