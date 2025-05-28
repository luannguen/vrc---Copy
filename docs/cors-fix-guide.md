# Guide for fixing CORS issues in the VRC Backend

## Problem

The backend API is experiencing CORS issues because:

1. The configuration in `payload.config.ts` needs to be updated to properly support modern CORS requirements
2. There are inconsistencies between the central CORS configuration and how individual API routes handle CORS

## Solution

### Step 1: Update payload.config.ts

Update the CORS configuration in `payload.config.ts` to use the following improved structure:

```typescript
cors: {
  // Use origin instead of origins (correct property name according to PayloadCMS docs)
  origin: process.env.NODE_ENV === 'production' 
    ? [
        getServerSideURL(),                                  // Backend URL
        process.env.FRONTEND_URL,                            // Frontend URL (production)
      ].filter(Boolean) as string[]
    : [
        getServerSideURL(),                                  // Backend URL
        process.env.FRONTEND_URL || 'http://localhost:5173', // Frontend Vite URL
        'http://localhost:8080', 'http://localhost:8081',    // Custom frontend ports
        '*',                                                 // Allow all origins for development
      ].filter(Boolean) as string[],    
  // Use exposedHeaders instead of headers to match CORS standard  
  exposedHeaders: [
    'authorization', 
    'content-type', 
    'x-custom-header', 
    'cache-control', 
    'x-requested-with',
    'accept',
    'x-api-test',
  ],
  // Enable credentials support and preflight caching
  credentials: true, // Enable cookies and authentication headers
  maxAge: 86400,     // Cache preflight requests for 24 hours
},
```

### Step 2: Update API helpers

Make sure the CORS helper utilities in `src/app/(payload)/api/_shared/cors.ts` are aligned with the central configuration:

```typescript
// Check and update these functions if needed:
createCORSHeaders()
handleOptionsRequest()
createCORSResponse()
```

### Step 3: Test CORS functionality

Run the test file created at `test/cors-test.js` to verify CORS headers are correctly sent from all API endpoints.

## Additional Notes

- In production, do NOT include the wildcard origin `'*'` for security reasons
- Make sure all API routes consistently use the shared CORS helpers
- Consider adding documentation about CORS configuration to the project README
