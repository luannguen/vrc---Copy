# Health Endpoint Documentation

The `/api/health` endpoint provides a way to check the status of the VRC backend API. This can be used by monitoring systems, frontend applications, or deployment pipelines to verify that the server is up and running.

## Implementation Location

The health endpoint is implemented as a Next.js API Route at:
```
/src/app/api/health/route.ts
```

> **Important**: The old Express-based implementation at `/src/endpoints/health.ts` is deprecated and only maintained as a stub that redirects to the new endpoint.

## Endpoint Details

- **URL**: `/api/health`
- **Methods**: GET, HEAD, OPTIONS
- **Authentication**: None required (public endpoint)
- **CORS**: Full cross-origin support with proper headers

## Response Format

### GET Request

A successful GET request to the health endpoint will return a 200 status code with a JSON response like this:

```json
{
  "status": "ok",
  "timestamp": "2023-05-15T12:34:56.789Z",
  "server": "VRC Backend API",
  "environment": "development",
  "apiVersion": "1.0.0"
}
```

### HEAD Request

A HEAD request will return only headers without a response body. The key headers include:

- `Content-Type: application/json`
- `Cache-Control: no-cache, no-store, must-revalidate`
- `X-Health-Status: ok`
- `X-Backend-Available: true`
- `X-Health-Timestamp: <current timestamp>`

## Error Handling

Even in error conditions, the health endpoint attempts to return a 200 status code with the appropriate headers and a useful message to indicate that while there might be an issue, the server is at least responding.

## Testing

You can test the health endpoint using cURL:

```bash
# Test GET request
curl -X GET http://localhost:3000/api/health

# Test HEAD request
curl -I http://localhost:3000/api/health
```

You can also use the included test script:

```bash
npm run test:health
```

## Implementation Notes

The health endpoint is implemented directly in the Payload CMS configuration (`payload.config.ts`) using the modern Response API to properly handle both GET and HEAD requests according to best practices.
