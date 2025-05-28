# Events API Endpoint Reference

## Overview
The Events API endpoint provides access to event data in the VRC application. It supports filtering, pagination, and sorting to efficiently retrieve event information.

## Endpoint URL
```
GET /api/events
```

## Authentication
This endpoint is publicly accessible and does not require authentication.

## Request Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | Number | Page number for pagination (default: 1) |
| `limit` | Number | Number of items per page (default: 10) |
| `status` | String | Filter by event status: "upcoming", "ongoing", or "past" |
| `type` | String | Filter by event type (legacy parameter) |
| `category` | String | Filter by event category ID |
| `featured` | Boolean | When set to "true", returns only featured events |
| `sort` | String | Field to sort by (default: "startDate") |
| `tag` | String | Filter by tag name |

## Response Format

### Success Response
```json
{
  "success": true,
  "data": [...],  // Array of event objects
  "totalDocs": 42,  // Total number of matching events
  "totalPages": 5,  // Total number of pages
  "page": 1,  // Current page
  "hasNextPage": true,  // Whether there are more pages
  "hasPrevPage": false  // Whether there are previous pages
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here",
  "error": {}  // Details about the error (may be omitted in production)
}
```

## Examples

### Basic Request
```
GET /api/events
```

### Filtered Request
```
GET /api/events?page=2&limit=20&status=upcoming&featured=true
```

### Integration Notes
- The API respects CORS headers for cross-domain requests
- Error handling includes proper status codes and descriptive messages
- The `depth` parameter is set to 1 by default to include basic related data

## Recent Changes
- Added support for filtering by tags
- Added featured events filtering
- Improved CORS handling
