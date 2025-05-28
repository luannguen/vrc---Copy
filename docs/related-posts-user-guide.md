# Related Posts Feature Guide

## Overview

The Enhanced Related Posts feature provides intelligent content recommendations based on categories, publish dates, and other relevance factors. This guide explains how to use the various components of this feature.

## Features

1. **Smart Related Posts API**
   - Dedicated endpoint for fetching related posts
   - Supports pagination and filtering
   - Relevance scoring algorithm
   
2. **Multiple Layout Options**
   - Grid layout (default): Cards in a responsive grid
   - Compact layout: Space-efficient list view
   - Featured layout: One featured post with supporting related posts
   
3. **Auto-Related Posts**
   - Automatically suggests related content
   - Updates periodically using the relevance algorithm
   
4. **Analytics Tracking**
   - Tracks user clicks on related posts
   - Data can be used to improve recommendations

## Usage Guide

### Adding Related Posts to a Page

1. Edit any page in the admin panel
2. Add a new "Related Posts Block" from the block selector
3. Configure the block:
   - Enter the source post ID
   - Select a layout (Grid, Compact, or Featured)
   - Set the number of posts to display
   - Enter a title (default: "Related Posts")
   - Toggle "View More" button visibility

### Adding Related Posts to a Post

The Related Posts functionality can be used directly within posts as well:

1. Edit a post in the admin panel
2. Add a new "Related Posts Block" in the content editor
3. Configure as needed

### Manual vs. Automatic Related Posts

There are two ways related posts are determined:

1. **Manual Selection**
   - In the post editor sidebar, use the "Related Posts" field to manually select specific posts to display as related content.
   
2. **Automatic Suggestions**
   - The "Auto Related Posts" field is automatically populated by the system based on categories, publish date proximity, and other factors.
   - This field is read-only and updated by running the update script.

### Updating Auto-Related Posts

Run the following command to update all posts with automatically suggested related content:

```
npm run update:related
```

This script:
- Calculates relevance scores between all published posts
- Updates each post's autoRelatedPosts field with the top 10 most relevant posts
- Should be run periodically to keep suggestions fresh

## API Reference

### Related Posts API Endpoint

```
GET /api/posts/{id}/related?limit=4&page=1&category={categoryId}
```

Parameters:
- `id`: The source post ID to find related content for
- `limit`: Maximum number of posts to return (default: 4)
- `page`: Page number for pagination (default: 1)
- `category`: Optional category ID to filter related posts

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "post-id",
      "title": "Post Title",
      "slug": "post-slug",
      "publishedAt": "2025-01-01T00:00:00Z",
      "categories": [...],
      "heroImage": {...},
      "meta": {...},
      "relevanceScore": 8
    },
    ...
  ],
  "pagination": {
    "limit": 4,
    "page": 1,
    "total": 10
  }
}
```

### Analytics Tracking Endpoint

```
POST /api/analytics/related-post-click
```

Request body:
```json
{
  "sourcePostId": "source-post-id",
  "clickedPostId": "clicked-post-id",
  "timestamp": "2025-05-21T12:00:00Z"
}
```

## Styling and Customization

The Related Posts components use Tailwind CSS classes and can be customized through your project's theme configuration.

## Troubleshooting

If related posts are not appearing:
1. Ensure the source post ID is correct
2. Check if there are any posts with matching categories
3. Manually select some related posts in the post editor
4. Run the auto-related posts update script