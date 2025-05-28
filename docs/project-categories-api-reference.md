# Project Categories API Reference

## Overview

The Project Categories API provides a complete CRUD interface for managing project categories in the VRC system. This API supports both frontend applications and the Payload CMS admin panel, with proper authentication, CORS handling, and data validation.

## Base URL

```
http://localhost:3000/api/project-categories
```

## Authentication

- **Admin Operations**: Requires valid JWT token
- **Read Operations**: Optional authentication (public access allowed)
- **Development**: Use `X-API-Test: true` header to bypass authentication

## Endpoints

### GET /api/project-categories

Retrieve project categories with filtering, pagination, and sorting.

#### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `limit` | integer | Number of items per page | 50 |
| `page` | integer | Page number (1-based) | 1 |
| `sort` | string | Sort field | `orderNumber` |
| `search` | string | Search in title and description | - |
| `showInMenu` | boolean | Filter by menu visibility | - |
| `parent` | string | Filter by parent category ID | - |

#### Response Format

```json
{
  "docs": [
    {
      "id": "64a7b8c9d1e2f3g4h5i6j7k8",
      "title": "Commercial Projects",
      "description": "Large-scale commercial HVAC projects",
      "parent": null,
      "icon": "🏢",
      "color": "#007bff",
      "showInMenu": true,
      "orderNumber": 1,
      "featuredImage": null,
      "slug": "commercial-projects",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "totalDocs": 1,
  "limit": 50,
  "page": 1,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPrevPage": false
}
```

#### Example Requests

```bash
# Get all categories
curl -X GET "http://localhost:3000/api/project-categories"

# Get categories with pagination
curl -X GET "http://localhost:3000/api/project-categories?limit=10&page=1"

# Search categories
curl -X GET "http://localhost:3000/api/project-categories?search=commercial"

# Filter by menu visibility
curl -X GET "http://localhost:3000/api/project-categories?showInMenu=true"
```

### POST /api/project-categories

Create a new project category.

#### Request Headers

```
Content-Type: application/json
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "title": "Industrial Projects",
  "description": "Heavy-duty industrial cooling systems",
  "parent": "64a7b8c9d1e2f3g4h5i6j7k8",
  "icon": "🏭",
  "color": "#28a745",
  "showInMenu": true,
  "orderNumber": 2
}
```

#### Required Fields

- `title` (string): Category name

#### Optional Fields

- `description` (string): Category description
- `parent` (string): Parent category ID
- `icon` (string): CSS class or Unicode icon
- `color` (string): Hex color code
- `showInMenu` (boolean): Display in frontend menu
- `orderNumber` (number): Sort order
- `featuredImage` (string): Media ID for featured image

#### Response Format

```json
{
  "success": true,
  "data": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k9",
    "title": "Industrial Projects",
    "description": "Heavy-duty industrial cooling systems",
    "parent": "64a7b8c9d1e2f3g4h5i6j7k8",
    "icon": "🏭",
    "color": "#28a745",
    "showInMenu": true,
    "orderNumber": 2,
    "slug": "industrial-projects",
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Project category created successfully"
}
```

#### Example Request

```bash
curl -X POST "http://localhost:3000/api/project-categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Industrial Projects",
    "description": "Heavy-duty industrial cooling systems",
    "showInMenu": true,
    "orderNumber": 2
  }'
```

### PUT /api/project-categories

Update an existing project category.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Category ID to update |

#### Request Format

Same as POST request, but with category ID in query parameters.

#### Response Format

```json
{
  "success": true,
  "data": {
    "id": "64a7b8c9d1e2f3g4h5i6j7k9",
    "title": "Updated Industrial Projects",
    "description": "Updated description",
    // ... other fields
  },
  "message": "Project category updated successfully"
}
```

#### Example Request

```bash
curl -X PUT "http://localhost:3000/api/project-categories?id=64a7b8c9d1e2f3g4h5i6j7k9" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Updated Industrial Projects",
    "description": "Updated description"
  }'
```

### DELETE /api/project-categories

Delete one or multiple project categories.

#### Single Delete

```bash
curl -X DELETE "http://localhost:3000/api/project-categories?id=64a7b8c9d1e2f3g4h5i6j7k9" \
  -H "Authorization: Bearer <token>"
```

#### Bulk Delete

```bash
curl -X DELETE "http://localhost:3000/api/project-categories" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "ids": ["64a7b8c9d1e2f3g4h5i6j7k9", "64a7b8c9d1e2f3g4h5i6j7ka"]
  }'
```

#### Response Format

```json
{
  "success": true,
  "message": "Successfully deleted 1 project category",
  "deletedIds": ["64a7b8c9d1e2f3g4h5i6j7k9"]
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Validation error",
  "message": "Title is required",
  "field": "title"
}
```

### 401 Unauthorized

```json
{
  "error": "Authentication required"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Not found",
  "message": "Project category not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Database connection failed"
}
```

## CORS Configuration

The API includes comprehensive CORS support:

- **Development**: Allows all origins (`*`)
- **Production**: Restricted to configured domains
- **Headers**: Supports all necessary authentication and content headers
- **Methods**: GET, POST, PUT, DELETE, OPTIONS

## Admin Panel Integration

The API fully supports Payload CMS admin panel operations:

- **Method Override**: Handles `x-http-method-override` header
- **Form Data**: Processes `multipart/form-data` submissions
- **Payload Format**: Handles `_payload` field for admin submissions
- **Relationship Fields**: Properly processes relationship data formats

## Data Validation

### Field Validation

- **title**: Required, non-empty string
- **parent**: Valid project category ID (prevents circular references)
- **orderNumber**: Positive integer
- **showInMenu**: Boolean value
- **color**: Valid hex color code format
- **featuredImage**: Valid media collection ID

### Business Rules

- Categories cannot reference themselves as parent
- Circular parent-child relationships are prevented
- Unique slug generation from title
- Order number defaults to 999 if not provided

## Performance Considerations

- **Pagination**: Default limit of 50 items, configurable
- **Depth Control**: Relationship depth set to 2 for optimal performance
- **Indexing**: Database indexes on commonly queried fields
- **Caching**: Response headers support browser caching

## Testing

Use the included test script for API validation:

```bash
node test/project-categories-api-test.js
```

## Related Documentation

- [Product Categories API](./product-categories-api-reference.md)
- [Backend API Structure](./backend-api-structure.md)
- [Authentication Guide](./api-authentication-guide.md)
- [CORS Configuration](./cors-configuration.md)
