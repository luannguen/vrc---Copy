# Backend API Structure

This project originally used Payload CMS endpoints but has been migrated to use Next.js App Router API routes.

## Current API Structure

All active API endpoints are now located in:
```
/src/app/(payload)/api/
```

### Available Endpoints

- `/api/health` - Health check endpoint
- `/api/company-info` - Company information endpoint
- `/api/header-info` - Header-specific company information endpoint
- `/api/contact` - Contact form submission endpoint

### API Implementation Notes

1. **Modern API Structure**: 
   - Each endpoint is implemented as a route.ts file in the corresponding directory structure
   - Uses the Next.js App Router pattern with named exports for HTTP methods (GET, POST, etc.)

2. **Legacy Endpoints**:
   - Some older endpoint files may still exist in `/src/endpoints/`
   - These are kept for reference but are no longer used
   - Any endpoint files with TypeScript errors in the legacy directory can be ignored

## Migration Notes

When implementing new API endpoints:

1. **Always** create them in the App Router structure (`/src/app/(payload)/api/`)
2. **Do not** use the legacy endpoint structure (`/src/endpoints/`)
3. Follow the patterns seen in existing route.ts files for consistent implementation

## CORS Support

All API endpoints include proper CORS headers to support cross-origin requests from the frontend application.

## Testing

API endpoints can be tested using the test scripts in the `/test` directory.
