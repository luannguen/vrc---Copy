# Header Information API Documentation

The `/api/header-info` endpoint provides essential company information needed for website headers. This endpoint is designed to be lightweight, returning only the necessary data for displaying company information in the header section of the website.

## Endpoint Details

- **URL**: `/api/header-info`
- **Methods**: GET, OPTIONS
- **Authentication**: None required (public endpoint)

## Response Format

A successful GET request to the header-info endpoint will return a 200 status code with a JSON response like this:

```json
{
  "companyName": "Công ty TNHH Thiết bị Điện lạnh VRC",
  "companyShortName": "VRC",
  "contactSection": {
    "phone": "+84 28 1234 5678",
    "hotline": "+84 909 123 456"
  },
  "socialMedia": {
    "facebook": "https://facebook.com/your_profile",
    "zalo": "https://zalo.me/your_zalo_id"
  },
  "logo": {
    "id": "123456789",
    "url": "/media/logo.svg",
    "alt": "VRC Logo"
  }
}
```

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS), allowing it to be called from different domains, including the frontend application. The API sets the following CORS headers:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

For production, the `Access-Control-Allow-Origin` header should be configured to allow only specific domains.

## Error Handling

In case of errors, the API returns a meaningful error response with appropriate HTTP status code:

```json
{
  "success": false,
  "message": "Đã xảy ra lỗi khi lấy thông tin header. Vui lòng thử lại sau."
}
```

## Frontend Integration

To integrate this API with the frontend, use the `useHeaderInfo` hook:

```typescript
import { useHeaderInfo } from '@/hooks/useHeaderInfo';

const Header = () => {
  const { headerInfo, isLoading, error } = useHeaderInfo();
  
  if (isLoading) return <div>Loading header information...</div>;
  if (error) return <div>Error loading header: {error}</div>;
  
  return (
    <header>
      {headerInfo?.logo && <img src={headerInfo.logo.url} alt={headerInfo.companyName} />}
      <h1>{headerInfo?.companyName}</h1>
      {/* Other header elements using the headerInfo data */}
    </header>
  );
};
```

## Testing

You can test the header-info endpoint using the provided test script:

```bash
node test/test-header-info.js
```

## Implementation Notes

The header-info endpoint is specifically designed to be lightweight and fast, providing only the necessary data for the header component. It excludes larger company information fields that would only be used on pages like the Contact or About pages.
