# Hướng Dẫn Sử Dụng Hệ Thống Refresh Token JWT

Tài liệu này hướng dẫn cách triển khai và sử dụng hệ thống refresh token JWT được nâng cấp trong dự án VRC.

## Kiến Trúc Hệ Thống

Hệ thống token JWT của chúng ta bao gồm hai loại token:

1. **Access Token**: Token chính dùng để xác thực người dùng, có thời gian sống ngắn (mặc định 1 giờ)
2. **Refresh Token**: Token dùng để lấy access token mới khi token cũ hết hạn, có thời gian sống dài hơn (mặc định 1 tuần)

![JWT Flow](https://mermaid.ink/img/pako:eNp1kk9PAjEQxb9KM-cNygGiMQaDiUFExSgHb810YButnW478Af57t4uC4LxsKftm_f6e5POQBUGoQD7TK7Rk4fA2Y8NOqeEKzQLKijRo8hCwDS5ogYy857M2WGFzXvPmZ3cCAUaXBvJ6SyvVhoivqKPK1aGgUh6Bynl_c4XkLPZdQqbRLad9ot1JrF2IuEutb5H52AERPrTAw_T7aZWbT_drZ4JRr0HPVbfFqrB3ip2q1MKIVN58hGCRi8TipFDqpxskG6TfXBBbGq9S1iSCW-Sy-hAw5RLNjjFEDK5TEr0aSlUX68n6rqXjMdn4zF8lVgGuoUP1IVu4f5hPJpxeRP0gjOsn3B8G-AE46-4jsL9A7eP_8isqAVnGF90YDN7wemf5dgw8YJOLDBbLTDDZO2BnOSqQm_Q7LGiLX6Ral2giT4tszZQLOxnAyUuG__c0e8faEzaPA?type=png)

## Cấu Hình Môi Trường

Để sử dụng hệ thống JWT hiệu quả, cần cấu hình các biến môi trường sau trong file `.env`:

```
# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key
JWT_REFRESH_SECRET=your-secure-refresh-token-secret
JWT_EXPIRES_IN=3600                # Access token expiration in seconds (1 hour)
JWT_REFRESH_EXPIRES_IN=604800      # Refresh token expiration in seconds (7 days)
```

## Tạo Token Mới

Để tạo token mới cho người dùng khi đăng nhập:

```typescript
import jwt from 'jsonwebtoken';
import { generateNewRefreshToken } from '../utilities/verifyJwt';

export async function createTokens(user) {
  // Lấy thông tin cơ bản của người dùng
  const userId = user.id;
  const userRoles = user.roles || ['user'];
  
  // Tạo payload cho access token với thông tin nâng cao
  const now = Math.floor(Date.now() / 1000);
  const expiresIn = process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN) : 3600;
  
  // Tạo payload
  const tokenPayload = {
    userId,
    sub: userId,
    email: user.email,
    roles: userRoles,
    permissions: user.permissions,
    iat: now,
    exp: now + expiresIn,
    updatedAt: now,
    refreshCount: 0,
    tokenVersion: 1,
    deviceId: req.headers['user-agent'] || 'unknown',
    sessionData: {
      lastActivity: now,
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    }
  };
  
  // Ký access token
  const jwtSecret = process.env.JWT_SECRET || process.env.PAYLOAD_SECRET;
  const accessToken = jwt.sign(tokenPayload, jwtSecret, { expiresIn });
  
  // Tạo refresh token
  const refreshToken = generateNewRefreshToken(userId);
  
  return { accessToken, refreshToken };
}
```

## Xác Thực Người Dùng

Để xác thực người dùng từ request:

```typescript
import { getUserFromRequest } from '../utilities/verifyJwt';

export async function handleProtectedRoute(req, res) {
  try {
    // Lấy thông tin người dùng với tự động refresh nếu token hết hạn
    const { payload, newAccessToken, newRefreshToken } = await getUserFromRequest(req, {
      strict: true,          // Báo lỗi nếu token không hợp lệ
      autoRefresh: true      // Tự động làm mới token nếu hết hạn
    });
    
    // Nếu không có payload, người dùng chưa xác thực
    if (!payload) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Sử dụng thông tin người dùng
    const userId = payload.userId || payload.sub;
    const userRoles = payload.roles || [];
    
    // Xử lý nghiệp vụ sau khi xác thực
    const data = await getProtectedData(userId);
    
    // Tạo response
    const response = {
      success: true,
      data
    };
    
    // Nếu token đã được làm mới, trả về token mới cho client
    if (newAccessToken) {
      // Thêm token mới vào header hoặc cookie
      res.setHeader('Authorization', `Bearer ${newAccessToken}`);
      
      // Nếu refresh token cũng được cập nhật (do token rotation)
      if (newRefreshToken) {
        res.cookie('refresh-token', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          maxAge: 604800000 // 7 days in milliseconds
        });
      }
    }
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}
```

## Logout và Thu Hồi Token

Để đăng xuất người dùng và thu hồi refresh token:

```typescript
export async function handleLogout(req, res) {
  try {
    // Lấy token từ request
    const refreshToken = req.cookies['refresh-token'];
    
    if (refreshToken) {
      // Trong triển khai thực tế, bạn nên lưu token này vào blacklist
      // hoặc đánh dấu là đã thu hồi trong cơ sở dữ liệu
      // blacklistRefreshToken(refreshToken);
    }
    
    // Xóa cookies
    res.clearCookie('payload-token');
    res.clearCookie('refresh-token');
    
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Logout failed' });
  }
}
```

## Xử Lý Token Hết Hạn ở Client

Trong các ứng dụng frontend, bạn cần xử lý trường hợp token hết hạn:

```javascript
// Hàm axios interceptor mẫu
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Kiểm tra nếu lỗi là do token hết hạn (status 401)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Gọi API refresh token
        const refreshResponse = await axios.post('/api/auth/refresh', {}, {
          withCredentials: true // Quan trọng để gửi cookies
        });
        
        // Lấy token mới từ response header
        const newToken = refreshResponse.headers.authorization?.replace('Bearer ', '');
        
        if (newToken) {
          // Lưu token mới
          localStorage.setItem('accessToken', newToken);
          
          // Cập nhật token cho request ban đầu và thử lại
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh token cũng không thành công, đăng xuất người dùng
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login?session=expired';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Các Tính Năng Bảo Mật

1. **Token Rotation**: Sau một số lần refresh nhất định, refresh token sẽ được thay đổi để tăng cường bảo mật.

2. **Token Tracking**: Mỗi token chứa thông tin phiên người dùng như IP, User-Agent, để phát hiện các hoạt động đáng ngờ.

3. **Token Version**: Mỗi token có version để hệ thống có thể vô hiệu hóa tất cả các token trước đó của một người dùng nếu cần.

4. **Strict Mode**: Chế độ xác thực nghiêm ngặt sẽ báo lỗi chi tiết về vấn đề với token.

## Cảnh Báo Bảo Mật

- **Bảo vệ Refresh Token**: Luôn lưu refresh token trong HttpOnly cookies để tránh bị tấn công XSS
- **CSRF Protection**: Khi sử dụng cookie-based authentication, luôn triển khai bảo vệ CSRF
- **Secret Keys**: Sử dụng các khóa bí mật mạnh và riêng biệt cho access token và refresh token
