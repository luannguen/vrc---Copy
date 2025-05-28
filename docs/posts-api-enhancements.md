# Posts API Enhancements

## Overview

This document outlines the improvements made to the Posts API endpoints in the VRC backend.

## Implemented Enhancements

### 1. Improved ID Extraction

Created dedicated utility functions to extract post IDs from various request formats:

- `extractPostIds`: Asynchronously extracts IDs from request query parameters, URL path, and request body.
- `extractPostIdsSync`: Synchronously extracts IDs when immediate results are needed.

These utilities handle:
- Standard query parameters (`?id=123` or `?ids=123,456`)
- Complex admin UI formats (e.g., `where[and][1][id][in][0]=123`)
- Path parameters (e.g., `/api/posts/123`)
- Request body JSON with ID fields

### 2. Advanced Filtering and Sorting

Enhanced the GET endpoint with advanced filtering options:

- **Status filtering**: Filter by any post status, with a default to published posts.
  ```
  GET /api/posts?status=draft
  GET /api/posts?status=all
  ```

- **Content search**: Extended search to look in both title and content.
  ```
  GET /api/posts?search=example
  ```

- **Category filtering**: Filter posts by category.
  ```
  GET /api/posts?category=news
  ```

- **Date range filtering**: Filter posts by creation date range.
  ```
  GET /api/posts?fromDate=2023-01-01&toDate=2023-12-31
  ```

- **Flexible sorting**: Sort by any field in ascending or descending order.
  ```
  GET /api/posts?sort=title&order=asc
  GET /api/posts?sort=createdAt&order=desc
  ```

### 3. Improved Error Handling

Enhanced error handling for all endpoints:

- Added `errorType` field to distinguish between different types of errors:
  - `validation`: Invalid input parameters
  - `notFound`: Requested resource not found
  - `authentication`: Authentication/authorization failures
  - `serverError`: Internal server errors

- Detailed error information with appropriate HTTP status codes:
  - HTTP 400 for validation errors
  - HTTP 404 for not found errors
  - HTTP 401 for authentication errors
  - HTTP 500 for server errors
  - HTTP 207 for partial success in bulk operations

- Improved error messages with more context.

### 4. Bulk Operation Support

Enhanced support for bulk post operations:

- Improved bulk deletion with detailed results and error reporting.
- Added partial success handling with HTTP 207 Multi-Status responses.

## Usage Examples

### Example 1: Filtered Search with Sorting

```
GET /api/posts?search=technology&category=tech&fromDate=2023-01-01&sort=title&order=asc&page=1&limit=20
```

### Example 2: Bulk Delete

```
DELETE /api/posts?ids=123,456,789
```

Response example:
```json
{
  "success": true,
  "message": "Đã xóa thành công tất cả 3 bài viết.",
  "results": [
    { "id": "123", "title": "Example Post 1", "success": true },
    { "id": "456", "title": "Example Post 2", "success": true },
    { "id": "789", "title": "Example Post 3", "success": true }
  ]
}
```

## Implementation Notes

- ID extraction is centralized in the `extractPostIds.ts` utility to avoid code duplication.
- All endpoints now use standardized error handling.
- GET list endpoint supports advanced filtering and sorting.
- DELETE endpoint properly handles single and bulk operations with comprehensive error reporting.
