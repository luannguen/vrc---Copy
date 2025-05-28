# Hướng Dẫn Sử Dụng API Products

## Giới thiệu

API Products cung cấp các endpoints để thực hiện các thao tác CRUD (Create, Read, Update, Delete) với sản phẩm trong hệ thống VRC. Tài liệu này hướng dẫn chi tiết cách sử dụng API trong các môi trường khác nhau và cách xử lý các lỗi phổ biến.

## Base URL

```
/api/products
```

## Xác thực (Authentication)

Hầu hết các thao tác (POST, PUT, PATCH, DELETE) đều yêu cầu xác thực. Bạn có thể xác thực bằng một trong những cách sau:

- **Bearer Token**: Thêm header `Authorization: Bearer YOUR_TOKEN`
- **Cookie**: Sử dụng cookie `payload-token`

## Môi trường phát triển (Development)

Trong môi trường phát triển, bạn có thể sử dụng một số tùy chọn để bỏ qua xác thực:

1. **Environment Variable**: Thêm `BYPASS_AUTH=true` vào file `.env.local` 
2. **Custom Header**: Thêm header `X-API-Test: true` vào request
3. **Referer**: Gọi API từ URL có chứa `/admin` (không khả dụng trong môi trường production)

## Các endpoints

### 1. Lấy danh sách sản phẩm (GET)

```javascript
// Fetch tất cả sản phẩm (có phân trang)
fetch('/api/products')
  .then(response => response.json())
  .then(data => console.log(data));

// Fetch với các tham số lọc
fetch('/api/products?category=cat-id&featured=true&page=1&limit=10&sort=createdAt&sortDirection=desc')
  .then(response => response.json())
  .then(data => console.log(data));
```

### 2. Tạo sản phẩm mới (POST)

```javascript
// Chuẩn bị token xác thực
const token = localStorage.getItem('token') || sessionStorage.getItem('payloadToken');

// Tạo sản phẩm mới
fetch('/api/products', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Tên sản phẩm',
    slug: 'ten-san-pham',
    excerpt: 'Mô tả ngắn',
    description: 'Mô tả chi tiết',
    status: 'draft'
    // Các trường khác...
  })
})
  .then(response => {
    // Kiểm tra status
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Cần xác thực để tạo sản phẩm');
      } else if (response.status === 405) {
        throw new Error('Phương thức không được phép (CORS issue)');
      } else {
        throw new Error('Lỗi không xác định');
      }
    }
    return response.json();
  })
  .then(data => console.log('Sản phẩm đã tạo:', data))
  .catch(error => console.error('Lỗi khi tạo sản phẩm:', error));
```

### 3. Cập nhật sản phẩm (PUT/PATCH)

```javascript
// Cập nhật toàn bộ sản phẩm
fetch('/api/products?id=product-id', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Tên sản phẩm mới',
    // Tất cả các trường khác...
  })
})
  .then(response => response.json())
  .then(data => console.log('Đã cập nhật:', data));

// Cập nhật một phần sản phẩm
fetch('/api/products?id=product-id', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Tên sản phẩm mới',
    // Chỉ những trường cần cập nhật...
  })
})
  .then(response => response.json())
  .then(data => console.log('Đã cập nhật:', data));
```

### 4. Xóa sản phẩm (DELETE)

```javascript
// Xóa một sản phẩm
fetch('/api/products?id=product-id', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log('Đã xóa:', data));

// Xóa nhiều sản phẩm
fetch('/api/products?ids=id1,id2,id3', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => console.log('Đã xóa nhiều sản phẩm:', data));
```

## Xử lý CORS trong các frameworks phổ biến

### React/Vite

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});

// Sử dụng trong component
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  fetchProducts();
}, []);
```

### Vue.js

```javascript
// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
};

// Sử dụng trong component
methods: {
  async fetchProducts() {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      this.products = data.data;
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
}
```

## Xử lý lỗi phổ biến

### Lỗi 401 Unauthorized

```javascript
// Kiểm tra xác thực trước khi gọi API
const checkAuth = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // Chuyển hướng đến trang đăng nhập
    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
    return false;
  }
  return true;
};

// Sử dụng trong hàm gọi API
const createProduct = async (product) => {
  if (!checkAuth()) return;
  
  // Code gọi API...
};
```

### Lỗi 405 Method Not Allowed

Nếu gặp lỗi 405:

1. Kiểm tra preflight request OPTIONS:
   ```javascript
   fetch('/api/products', {
     method: 'OPTIONS',
     headers: {
       'Origin': window.location.origin,
       'Access-Control-Request-Method': 'POST',
       'Access-Control-Request-Headers': 'Content-Type,Authorization'
     }
   }).then(response => {
     console.log('Preflight response status:', response.status);
     console.log('Preflight headers:', response.headers);
   });
   ```

2. Sử dụng proxy server để tránh CORS trong môi trường development

3. Đảm bảo gửi đúng Content-Type header (thường là 'application/json')

## Thông tin bổ sung

Để biết thêm chi tiết về cấu trúc request/response và cách sử dụng API, tham khảo [Product API Reference](./product-api-reference.md) và [API CORS Troubleshooting Guide](./api-cors-troubleshooting.md).

## Liên hệ hỗ trợ

Nếu bạn gặp vấn đề khi sử dụng API, vui lòng liên hệ đội phát triển qua email [dev@vrcorp.vn](mailto:dev@vrcorp.vn).
