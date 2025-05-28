# VRC API Endpoints Reference

This document provides comprehensive documentation for all API endpoints available in the VRC Backend.

## Base URL

- Development: `http://localhost:3000`
- Production: `https://your-production-domain.com`

## Authentication

Some endpoints may require authentication. Use the following header:

```
Authorization: Bearer YOUR_TOKEN
```

## Common Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "totalDocs": 25,
  "totalPages": 3,
  "page": 1,
  "hasNextPage": true,
  "hasPrevPage": false
}
```

## Available Endpoints

### Health Check

```
GET /api/health
```

Checks if the API is running properly.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2025-05-16T12:34:56.789Z",
  "server": "VRC Backend API",
  "environment": "development",
  "apiVersion": "1.0.0"
}
```

### Company Information

```
GET /api/company-info
```

Retrieves general company information.

**Response:**

```json
{
  "success": true,
  "data": {
    "companyName": "VRC Company",
    "companyShortName": "VRC",
    "companyDescription": "...",
    "contactSection": {
      "address": "...",
      "phone": "...",
      "email": "...",
      "hotline": "...",
      "workingHours": "...",
      "fax": "..."
    },
    "socialMedia": {
      "facebook": "...",
      "zalo": "...",
      "youtube": "...",
      "linkedin": "..."
    }
  }
}
```

### Header Information

```
GET /api/header-info
```

Retrieves specific information for the website header.

### Navigation

```
GET /api/navigation?type=main
```

Retrieves navigation menu items.

**Parameters:**

| Parameter | Description                             | Default |
|-----------|-----------------------------------------|---------|
| type      | Type of menu (main, secondary, footer)  | main    |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "title": "Main Menu",
      "type": "main",
      "order": 0,
      "items": [
        {
          "label": "Trang chủ",
          "link": "/",
          "target": "_self"
        },
        {
          "label": "Giới thiệu",
          "link": "/gioi-thieu",
          "target": "_self",
          "childItems": [
            {
              "label": "Về chúng tôi",
              "link": "/gioi-thieu/ve-chung-toi",
              "target": "_self"
            }
          ]
        }
      ]
    }
  ]
}
```

### Products

```
GET /api/products
```

Retrieves a list of products.

**Parameters:**

| Parameter | Description                           | Default |
|-----------|---------------------------------------|---------|
| page      | Page number                           | 1       |
| limit     | Number of items per page              | 10      |
| category  | Filter by category ID                 |         |
| featured  | Filter featured products (true/false) |         |
| slug      | Get product by slug                   |         |
| search    | Search products by name               |         |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "product1",
      "name": "Product Name",
      "slug": "product-name",
      "excerpt": "...",
      "description": "...",
      "mainImage": { ... },
      "gallery": [ ... ],
      "category": { ... },
      "specifications": [ ... ]
    }
  ],
  "totalDocs": 25,
  "totalPages": 3,
  "page": 1
}
```

### Services

```
GET /api/services
```

Retrieves a list of services.

**Parameters:**

| Parameter | Description                          | Default |
|-----------|--------------------------------------|---------|
| page      | Page number                          | 1       |
| limit     | Number of items per page             | 10      |
| type      | Filter by service type               |         |
| featured  | Filter featured services (true/false)|         |
| slug      | Get service by slug                  |         |
| search    | Search services by title             |         |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "service1",
      "title": "Service Name",
      "slug": "service-name",
      "type": "installation",
      "summary": "...",
      "content": "...",
      "featuredImage": { ... },
      "features": [ ... ],
      "benefits": [ ... ]
    }
  ],
  "totalDocs": 15,
  "totalPages": 2,
  "page": 1
}
```

### Projects

```
GET /api/projects
```

Retrieves a list of projects.

**Parameters:**

| Parameter | Description                          | Default |
|-----------|--------------------------------------|---------|
| page      | Page number                          | 1       |
| limit     | Number of items per page             | 10      |
| category  | Filter by category ID                |         |
| service   | Filter by service type               |         |
| featured  | Filter featured projects (true/false)|         |
| slug      | Get project by slug                  |         |
| search    | Search projects by title             |         |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "project1",
      "title": "Project Name",
      "slug": "project-name",
      "client": "Client Name",
      "location": "...",
      "timeframe": { ... },
      "summary": "...",
      "content": "...",
      "featuredImage": { ... },
      "gallery": [ ... ],
      "services": [ ... ],
      "testimonial": { ... }
    }
  ],
  "totalDocs": 8,
  "totalPages": 1,
  "page": 1
}
```

### Technologies & Partners

```
GET /api/technologies
```

Retrieves a list of technologies and partners.

**Parameters:**

| Parameter | Description                             | Default |
|-----------|-----------------------------------------|---------|
| page      | Page number                             | 1       |
| limit     | Number of items per page                | 20      |
| type      | Filter by type (technology, partner, supplier) |   |
| featured  | Filter featured items (true/false)      |         |
| slug      | Get item by slug                        |         |
| search    | Search by name                          |         |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "tech1",
      "name": "Technology Name",
      "slug": "technology-name",
      "type": "technology",
      "logo": { ... },
      "website": "https://example.com",
      "description": "...",
      "order": 1,
      "certifications": [ ... ]
    }
  ],
  "totalDocs": 12,
  "totalPages": 1,
  "page": 1
}
```

### Homepage

```
GET /api/homepage
```

Retrieves all data needed for the homepage in a single request.

**Response:**

```json
{
  "success": true,
  "data": {
    "companyInfo": { ... },
    "header": { ... },
    "footer": { ... },
    "navigation": [ ... ],
    "featuredProducts": [ ... ],
    "featuredServices": [ ... ],
    "featuredProjects": [ ... ],
    "technologies": [ ... ],
    "recentPosts": [ ... ]
  }
}
```

### Contact Submissions

```
POST /api/contact
```

Submits a new contact form.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "message": "Hello, I'm interested in your services."
}
```

**Response:**

```json
{
  "success": true,
  "message": "Thông tin liên hệ đã được gửi thành công. Chúng tôi sẽ liên hệ lại sớm nhất có thể."
}
```

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information (development only)"
}
```

Common HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error
