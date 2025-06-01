# API Key Security Guide

## Tổng quan
Để bảo vệ server khỏi spam và truy cập trái phép, tất cả các API public đều yêu cầu API key hợp lệ.

## Cách sử dụng API Key

### 1. Trong Header (Khuyến nghị)
```bash
curl -H "x-api-key: your-api-key" http://localhost:3000/api/company-info
```

### 2. Trong Authorization Header
```bash
curl -H "Authorization: Bearer your-api-key" http://localhost:3000/api/company-info
```

### 3. Trong Query Parameter
```bash
curl "http://localhost:3000/api/company-info?api_key=your-api-key"
```

## Environment Variables

### Backend (.env)
```env
PUBLIC_API_KEY=vrc-api-2024-secure
```

### Frontend (.env)
```env
VITE_PUBLIC_API_KEY=vrc-api-2024-secure
```

## API Response

### Success (200)
```json
{
  "companyName": "VRC company",
  "logo": {
    "url": "/api/media/file/logo.svg",
    "alt": "VRC logo"
  },
  // ... other data
}
```

### Error (401)
```json
{
  "success": false,
  "error": "INVALID_API_KEY",
  "message": "API key không hợp lệ. Vui lòng cung cấp API key hợp lệ trong header x-api-key.",
  "code": 401
}
```

## Security Features

1. **Rate Limiting**: API key giúp track và limit requests từ mỗi client
2. **Access Control**: Chỉ những client có API key mới có thể truy cập
3. **Logging**: Tất cả requests đều được log với API key information
4. **Revocation**: Có thể thay đổi API key để revoke access

## Best Practices

1. **Không hardcode API key** trong client-side code
2. **Sử dụng environment variables** để store API key
3. **Rotate API key định kỳ** để tăng security
4. **Monitor API usage** để detect unusual patterns
5. **Use HTTPS** trong production để protect API key

## Frontend Integration

Frontend đã được cấu hình tự động thêm API key vào tất cả requests:

```typescript
// src/lib/api.ts
const API_KEY = import.meta.env.VITE_PUBLIC_API_KEY;

// Automatically added to all requests
config.headers['x-api-key'] = API_KEY;
```

## Production Deployment

Trong production, hãy:
1. Thay đổi API key thành giá trị secure random
2. Sử dụng environment variables thay vì hardcode
3. Implement additional security layers như IP whitelist
4. Monitor và alert cho unusual API usage
