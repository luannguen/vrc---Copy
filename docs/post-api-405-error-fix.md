# Post API 405 Error Fix Guide

## Issue Overview

The application was experiencing 405 (Method Not Allowed) errors when attempting to delete or unpublish posts. This occurred because the API route for posts (`/api/posts`) only implemented the GET method but was missing implementations for DELETE and PATCH methods needed for these operations.

## Solution

The fix involved adding proper implementations for both DELETE and PATCH methods to the posts API route file:

### 1. Added DELETE Method

The DELETE method now supports:
- Authentication check to ensure only authorized users can delete posts
- Support for both soft deletion (unpublishing) and hard deletion
- Parameter `hardDelete=true` can be passed to perform permanent deletion
- Without the parameter, a soft delete is performed by setting `_status: 'draft'`

### 2. Added PATCH Method

The PATCH method now supports:
- Authentication check to ensure only authorized users can update posts
- Full update capabilities for post data
- Proper error handling and response formatting

### 3. Fixed Status Field Naming

Fixed an inconsistency in how the status field is handled:
- Changed all references from `status` to `_status` for compatibility with Payload CMS
- This includes both the query filter in GET requests and the data updates in DELETE/PATCH requests

## Usage Examples

### To unpublish a post:

```
DELETE /api/posts/{postId}
```

### To permanently delete a post:

```
DELETE /api/posts/{postId}?hardDelete=true
```

### To update a post:

```
PATCH /api/posts/{postId}
Content-Type: application/json

{
  "title": "Updated Post Title",
  "_status": "published"
}
```

## Troubleshooting

If you encounter issues with these API operations:

1. Check that you're authenticated (logged in) when performing these operations
2. Verify that the post ID is correct and exists
3. Ensure you're using the correct HTTP method (DELETE or PATCH)
4. For PATCH requests, ensure your request body is valid JSON

## Related Documentation

- [Payload CMS Documentation](https://payloadcms.com/docs/getting-started/concepts)
- [API Endpoint Development Guide](../docs/api-endpoint-development-guide.md)
