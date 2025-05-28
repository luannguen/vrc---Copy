# Product API Reference

This document describes the RESTful API for product management in the VRC system.

## Overview

The products API follows REST principles and provides endpoints for creating, reading, updating, and deleting products. The API uses standard HTTP methods and returns JSON responses.

## Base URL

All API endpoints are relative to: `/api/products`

## Authentication

Most operations (POST, PUT, PATCH, DELETE) require authentication. Include an authentication token in your requests:

- Via Bearer token in the Authorization header: `Authorization: Bearer your-token`
- Via the payload-token cookie

## Response Format

All responses follow a standard format:

```json
{
  "success": true|false,
  "data": [...],  // for successful responses
  "message": "...",  // description message
  "error": "...",  // error details (only when success is false)
  "meta": {  // pagination metadata (for list operations)
    "totalDocs": 25,
    "limit": 10,
    "page": 1,
    "totalPages": 3,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  }
}
```

## Endpoints

### List Products

```
GET /api/products
```

Retrieves a list of products with various filtering, pagination, and sorting options.

**Parameters:**

| Parameter      | Description                           | Default       |
|----------------|---------------------------------------|---------------|
| page           | Page number                           | 1             |
| limit          | Number of items per page              | 20            |
| category       | Filter by category ID                 |               |
| featured       | Filter featured products (true/false) |               |
| search         | Search products by name/description   |               |
| slug           | Get product by slug                   |               |
| id             | Get product by ID                     |               |
| sort           | Field to sort by                      | createdAt     |
| sortDirection  | Sort direction (asc/desc)             | desc          |
| status         | Filter by status                      | published     |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "product-1",
      "name": "Product Name",
      "slug": "product-name",
      "excerpt": "Short product description",
      "description": "...",
      "mainImage": { ... },
      "gallery": [ ... ],
      "category": { ... },
      "tags": [ ... ],
      "featured": true,
      "specifications": [ ... ],
      "documents": [ ... ],
      "status": "published",
      "productCode": "ABC123",
      "sortOrder": 1,
      "meta": { ... },
      "createdAt": "2025-05-10T09:30:00Z",
      "updatedAt": "2025-05-15T14:20:00Z"
    },
    // More products...
  ],
  "meta": {
    "totalDocs": 25,
    "limit": 10,
    "page": 1,
    "totalPages": 3,
    "pagingCounter": 1,
    "hasPrevPage": false,
    "hasNextPage": true,
    "prevPage": null,
    "nextPage": 2
  }
}
```

### Get Single Product

```
GET /api/products?id=product-id
GET /api/products?slug=product-slug
```

Retrieves a single product by its ID or slug.

**Parameters:**

| Parameter | Description                 | Required |
|-----------|-----------------------------|----------|
| id        | Product ID                  | Yes (if slug not provided) |
| slug      | Product slug                | Yes (if id not provided)   |

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "product-1",
    "name": "Product Name",
    "slug": "product-name",
    "excerpt": "Short product description",
    "description": "...",
    "mainImage": { ... },
    "gallery": [ ... ],
    "category": { ... },
    "tags": [ ... ],
    "featured": true,
    "specifications": [ ... ],
    "documents": [ ... ],
    "status": "published",
    "productCode": "ABC123",
    "sortOrder": 1,
    "meta": { ... },
    "createdAt": "2025-05-10T09:30:00Z",
    "updatedAt": "2025-05-15T14:20:00Z"
  }
}
```

### Create Product

```
POST /api/products
```

Creates a new product. Requires authentication.

**Request Body:**

```json
{
  "name": "New Product",
  "slug": "new-product",
  "excerpt": "Short description",
  "description": { ... },
  "mainImage": "media-id",
  "gallery": [ ... ],
  "category": "category-id",
  "tags": [ "tag1-id", "tag2-id" ],
  "featured": false,
  "specifications": [
    {
      "name": "Power",
      "value": "2000W"
    },
    {
      "name": "Voltage",
      "value": "220V"
    }
  ],
  "documents": [
    {
      "name": "User Manual",
      "file": "media-id"
    }
  ],
  "status": "published",
  "productCode": "ABC123",
  "sortOrder": 1,
  "meta": {
    "title": "SEO Title",
    "description": "SEO Description",
    "image": "media-id"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đã tạo sản phẩm thành công",
  "data": {
    "id": "new-product-id",
    "name": "New Product",
    // All other product fields...
    "createdAt": "2025-05-18T12:30:00Z",
    "updatedAt": "2025-05-18T12:30:00Z"
  }
}
```

### Update Product

```
PUT /api/products?id=product-id
```

Updates an existing product. Requires authentication.

**Parameters:**

| Parameter | Description                 | Required |
|-----------|-----------------------------|----------|
| id        | Product ID                  | Yes      |

**Request Body:**
Same as for creating a product, all fields will be replaced.

**Response:**

```json
{
  "success": true,
  "message": "Đã cập nhật sản phẩm thành công",
  "data": {
    "id": "product-id",
    "name": "Updated Product",
    // All other updated product fields...
    "updatedAt": "2025-05-18T14:45:00Z"
  }
}
```

### Partial Update Product

```
PATCH /api/products?id=product-id
```

Updates specific fields of an existing product. Requires authentication.

**Parameters:**

| Parameter | Description                 | Required |
|-----------|-----------------------------|----------|
| id        | Product ID                  | Yes      |

**Request Body:**
Only include the fields you want to update.

```json
{
  "name": "Updated Name",
  "featured": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đã cập nhật sản phẩm thành công",
  "data": {
    "id": "product-id",
    "name": "Updated Name",
    "featured": true,
    // All other product fields...
    "updatedAt": "2025-05-18T14:50:00Z"
  }
}
```

### Delete Product

```
DELETE /api/products?id=product-id
```

Deletes a product. Requires authentication.

**Parameters:**

| Parameter | Description                 | Required |
|-----------|-----------------------------|----------|
| id        | Product ID                  | Yes (if ids not provided) |
| ids       | Comma-separated product IDs | Yes (if id not provided)  |

**Response:**

For single delete:
```json
{
  "success": true,
  "message": "Đã xóa sản phẩm thành công: Product Name"
}
```

For batch delete:
```json
{
  "success": true,
  "message": "Đã xóa 3/3 sản phẩm",
  "results": [
    { "id": "product-1", "success": true },
    { "id": "product-2", "success": true },
    { "id": "product-3", "success": true }
  ]
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request` - Invalid input parameters or data
- `401 Unauthorized` - Authentication required
- `404 Not Found` - Product not found
- `500 Internal Server Error` - Server error

Example error response:

```json
{
  "success": false,
  "message": "Dữ liệu không hợp lệ",
  "errors": {
    "name": "Tên sản phẩm là bắt buộc",
    "mainImage": "Hình ảnh chính là bắt buộc"
  }
}
```

## Batch Operations

For bulk delete operations, use the `ids` parameter:

```
DELETE /api/products?ids=id1,id2,id3
```

This will attempt to delete multiple products in one request.
