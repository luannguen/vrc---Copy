# Payload CMS Customization Guide

## Project Structure Overview

The VRC project has a clear separation between frontend and backend:
- `vrcfrontend` - Contains the frontend code for the VRC website (E:\Download\vrc\vrcfrontend)
- `backend` - Contains the backend code and admin interface using Payload CMS (see [Payload Documentation](https://payloadcms.com/docs/getting-started/what-is-payload))

For API development, refer to the [Payload Local API documentation](https://payloadcms.com/docs/local-api/overview).

## Customizing Payload CMS Admin Interface

### Adding a Logout Button to the Left Menu
To add a logout button at the bottom of the left navigation menu, use the `afterNavLinks` property in admin components:

```typescript
admin: {
  components: {
    // Add logout button at the bottom of the left menu
    afterNavLinks: ['@/components/Logout'],
  }
}
```

### Common Issues and Solutions

1. **Object literal may only specify known properties**:
   - Problem: Using incorrect property names with Payload API (e.g., `nav` instead of `Nav`).
   - Solution: Verify correct property names in Payload documentation, respecting case sensitivity.

2. **Error: ENOENT: no such file or directory**:
   - Problem: Configuration referencing a non-existent file.
   - Solution: Check paths, create necessary files, or remove references from configuration.

3. **Runtime Error (open is not a function)**:
   - Problem: Incorrect usage of Payload API (e.g., `useModal` hook).
   - Solution: Use API correctly or replace with simpler solutions (`window.confirm`).

4. **Missing menu after customization**:
   - Problem: Completely replacing navigation components without preserving original functionality.
   - Solution: Use specific properties like `afterNavLinks` instead of replacing the entire `Nav`.

### Best Practices

1. **Customize individual components**: Use specific properties like `logout.Button`, `afterNavLinks` instead of replacing entire components.

2. **Correct component structure**: Ensure components have the correct structure (export default, children props).

3. **Restart after changes**: After changing configuration, restart the server to regenerate the importMap.

4. **Check data types**: Some properties require arrays (e.g., `['@/components/X']`), others accept strings (e.g., `'@/components/Y'`).

5. **Refer to documentation**: Always check the latest documentation at https://payloadcms.com/docs/admin/components when encountering issues.

## CORS Configuration in Payload CMS

CORS (Cross-Origin Resource Sharing) is a mechanism that allows web resources to be accessed from different domains. Proper CORS configuration is crucial to avoid errors when the frontend calls APIs from the backend.

### Current CORS Configuration in the Project

Currently, the project uses the configuration:

```typescript
cors: [getServerSideURL()].filter(Boolean),
```

The `getServerSideURL()` function returns the server URL (defaulting to `http://localhost:3000` if there's no `NEXT_PUBLIC_SERVER_URL` environment variable).

### CORS Configuration Options in Payload

1. **Allow from a specific domain**:
   ```typescript
   cors: ['https://example.com'],
   ```

2. **Allow from multiple domains**:
   ```typescript
   cors: ['https://example.com', 'https://app.example.com'],
   ```

3. **Allow from all domains (not recommended for production)**:
   ```typescript
   cors: '*',
   ```

4. **Advanced configuration with custom headers**:
   ```typescript
   cors: {
     origins: ['https://example.com'],
     headers: ['x-custom-header', 'authorization'],
   },
   ```

### Avoiding Common CORS Errors

1. **Ensure all frontend domains are added to the origins list**:
   - Development: `http://localhost:[port]`
   - Production: `https://yourdomain.com`

2. **Handle credentials properly**:
   - If using `credentials: 'include'` in fetch requests, ensure CORS is configured correctly

3. **Custom headers**:
   - If using custom headers in requests, make sure to add them to the CORS configuration

4. **Middleware for custom endpoints**:
   - For custom endpoints, use Payload's `headersWithCors` function:
   ```typescript
   import { headersWithCors } from 'payload'
   
   return Response.json(
     { message: 'success' },
     {
       headers: headersWithCors({
         headers: new Headers(),
         req,
       })
     },
   )
   ```

### Recommended CORS Configuration for VRC Project

```typescript
cors: {
  origins: [
    process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',  // Backend URL
    process.env.FRONTEND_URL || 'http://localhost:5173',            // Frontend URL (Vite default)
    // Add production domains here
  ].filter(Boolean),
  headers: ['authorization', 'content-type', 'x-custom-header'],    // Add custom headers if needed
},
```

After creating files, check for IDE errors and correct them as necessary.
