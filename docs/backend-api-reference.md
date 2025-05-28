# VRC Backend API Documentation

This document provides information about the available API endpoints in the VRC Backend system.

## API Overview

The VRC backend provides several API endpoints for frontend integration:

1. **Health Endpoint**: Check if the backend is available
2. **Header Info**: Get company and contact information for website headers
3. **Contact Form**: Submit contact form data
4. **Pages**: Retrieve page content
5. **Posts**: Retrieve blog posts
6. **Categories**: Retrieve content categories

## Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://api.vrc-example.com/api` (example)

## Authentication

Most public-facing APIs do not require authentication. Admin APIs require authentication via:
- Cookie-based session (when using the admin panel)
- Bearer token in Authorization header

## Available Endpoints

### Health Check

Health check endpoint to verify the API server is running.

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-05-16T12:34:56.789Z",
  "server": "VRC Backend API",
  "environment": "development",
  "apiVersion": "1.0.0"
}
```

**Headers**:
- `X-Health-Status`: Status of the server (ok, warning, error)
- `X-Backend-Available`: Whether the backend is available (true, false)
- `X-Health-Timestamp`: Current server timestamp

**Also supports**: 
- `HEAD /api/health` - Lightweight check that returns only headers

### Header Information

Provides company information and contact details for website headers.

**Endpoint**: `GET /api/header-info`

**Response**:
```json
{
  "companyName": "VRC Company Name",
  "address": "123 VRC Street, City",
  "phone": "+84 123 456 789",
  "email": "contact@example.com",
  "socialMedia": {
    "facebook": "https://facebook.com/vrc-example",
    "instagram": "https://instagram.com/vrc-example",
    "twitter": "https://twitter.com/vrc-example",
    "youtube": "https://youtube.com/vrc-example",
    "zalo": "https://zalo.me/vrc-example"
  },
  "logo": {
    "url": "/media/logo.svg",
    "alt": "VRC Logo"
  }
}
```

### Contact Form Submission

Endpoint for submitting contact form data.

**Endpoint**: `POST /api/contact`

**Request**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "+84 123 456 789",
  "message": "Contact message text",
  "subject": "General Inquiry"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Contact submission received",
  "submissionId": "abc123def456"
}
```

**Error Response**:
```json
{
  "success": false,
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

## API Migration Notes

### From Express Endpoints to Next.js API Routes

The VRC backend is transitioning from Express-based endpoints to Next.js API Routes. All new API endpoints should be implemented using the Next.js App Router API route handlers.

**Old Express Endpoint Structure**:
```typescript
// src/endpoints/example.ts
export const exampleEndpoint: Endpoint = {
  path: '/example',
  method: 'get',
  handler: (req, res) => {
    // Handler code
  }
}
```

**New Next.js API Route Structure**:
```typescript
// src/app/(payload)/api/example/route.ts
export async function GET(req: NextRequest) {
  // Handler code
  return NextResponse.json(data)
}
```

## CORS Support

All public API endpoints have CORS enabled for frontend integration:

- **Development**: Allows all origins (`*`)
- **Production**: Restricted to specific origins

## Error Handling

All API endpoints follow a consistent error format:

```json
{
  "error": true,
  "message": "Error message description",
  "code": "ERROR_CODE",
  "status": 400
}
```

## Testing API Endpoints

You can test the API endpoints using the provided testing tools:

1. **Browser UI**: Access `http://localhost:3000/api-test.html` 
2. **CLI Scripts**: Run `node test/test-all-endpoints.js` in the project root

## Frontend Integration Examples

### Fetching Header Information (React)

```typescript
const fetchHeaderInfo = async () => {
  try {
    const response = await fetch('/api/header-info');
    if (!response.ok) throw new Error('Failed to fetch header info');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching header info:', error);
    return null;
  }
};
```

### Health Check Integration (React)

```typescript
const checkBackendHealth = async () => {
  try {
    // Use a HEAD request for lightweight health check
    const response = await fetch('/api/health', { method: 'HEAD' });
    
    // Check the health status from headers
    const healthStatus = response.headers.get('X-Health-Status');
    const isBackendAvailable = response.headers.get('X-Backend-Available') === 'true';
    
    return {
      isHealthy: response.ok && healthStatus === 'ok',
      isAvailable: isBackendAvailable,
    };
  } catch (error) {
    console.error('Backend health check failed:', error);
    return { isHealthy: false, isAvailable: false };
  }
};
```
