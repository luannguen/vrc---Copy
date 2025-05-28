# Hướng dẫn xây dựng API tùy chỉnh trong Payload CMS

Tài liệu này cung cấp hướng dẫn chi tiết về cách xây dựng và tích hợp API tùy chỉnh trong Payload CMS sử dụng Next.js App Router.

## 1. Cấu trúc thư mục cho API tùy chỉnh

Trong Next.js App Router, các API endpoints được định nghĩa bằng file `route.ts` hoặc `route.js` trong cấu trúc thư mục tương ứng với URL:

```
src/
  app/
    (payload)/          # Group route (không ảnh hưởng đến URL)
      api/              # URL: /api
        [collection]/   # URL: /api/[collection]
          route.ts      # Handler cho /api/[collection]
        company-info/   # URL: /api/company-info
          route.ts      # Handler cho /api/company-info
```

## 2. Mẫu chuẩn cho API tùy chỉnh

```typescript
// src/app/(payload)/api/custom-endpoint/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// Helper function để tạo CORS headers
function createCorsHeaders() {
  const headers = new Headers()
  headers.append('Access-Control-Allow-Origin', '*') // Thay bằng domain cụ thể trong production
  headers.append('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  headers.append('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return headers
}

// Handler cho phương thức GET
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Khởi tạo Payload
    const payload = await getPayload({
      config,
    })

    // Truy vấn dữ liệu
    const data = await payload.find({
      collection: 'your-collection',
      depth: 1, // Tải các trường quan hệ cấp 1
    })

    // Trả về dữ liệu
    const headers = createCorsHeaders()
    return NextResponse.json(data, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error('API error:', error)
    
    const headers = createCorsHeaders()
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
      },
      {
        status: 500,
        headers,
      }
    )
  }
}

// Handler cho phương thức POST
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Khởi tạo Payload
    const payload = await getPayload({
      config,
    })

    // Xử lý dữ liệu đầu vào
    const body = await req.json()
    
    // Tạo dữ liệu mới
    const result = await payload.create({
      collection: 'your-collection',
      data: body,
    })

    // Trả về kết quả
    const headers = createCorsHeaders()
    return NextResponse.json(
      {
        success: true,
        result,
      },
      {
        status: 201,
        headers,
      }
    )
  } catch (error) {
    console.error('API error:', error)
    
    const headers = createCorsHeaders()
    return NextResponse.json(
      {
        success: false,
        message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
      },
      {
        status: 500,
        headers,
      }
    )
  }
}

// Handler cho CORS preflight requests
export function OPTIONS() {
  const headers = createCorsHeaders()
  return new NextResponse(null, {
    status: 204,
    headers,
  })
}
```

## 3. Xác thực API

### Kiểm tra xác thực trong API

```typescript
// Kiểm tra xác thực
const isAuthenticated = await checkAuth(req, payload)
if (!isAuthenticated) {
  const headers = createCorsHeaders()
  return NextResponse.json(
    {
      success: false,
      message: 'Xác thực thất bại. Vui lòng đăng nhập để truy cập.',
    },
    {
      status: 401,
      headers,
    }
  )
}

// Hàm kiểm tra xác thực
async function checkAuth(req: NextRequest, payload: Payload): Promise<boolean> {
  // Kiểm tra Bearer token
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      // Xác thực token với Payload
      const result = await payload.verifyToken(token)
      return !!result.user
    } catch (e) {
      return false
    }
  }
  
  // Kiểm tra Payload cookie
  const cookies = req.headers.get('cookie')
  if (cookies && cookies.includes('payload-token=')) {
    // Với cookie-based auth, Payload tự xử lý qua getPayload
    return true
  }
  
  return false
}
```

## 4. Truy cập và xử lý dữ liệu Global

Ví dụ về API endpoint truy cập thông tin từ global:

```typescript
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })
    
    // Truy vấn global
    const globalData = await payload.findGlobal({
      slug: 'your-global-slug',
      depth: 2, // Tải quan hệ đến cấp độ 2
    })
    
    const headers = createCorsHeaders()
    return NextResponse.json(globalData, {
      status: 200,
      headers,
    })
  } catch (error) {
    // Xử lý lỗi
  }
}
```

## 5. Xử lý tải lên file

```typescript
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const payload = await getPayload({ config })
    
    // Với multipart/form-data, cần xử lý dữ liệu form
    const formData = await req.formData()
    const file = formData.get('file') as File
    const data = {
      title: formData.get('title'),
      // Các trường khác
    }
    
    // Tạo Media trước
    const uploadedFile = await payload.create({
      collection: 'media',
      data: {
        alt: data.title || file.name,
      },
      file,
    })
    
    // Sau đó tạo document liên kết đến file
    const document = await payload.create({
      collection: 'your-collection',
      data: {
        ...data,
        image: uploadedFile.id, // Liên kết đến file đã tải lên
      },
    })
    
    const headers = createCorsHeaders()
    return NextResponse.json(
      {
        success: true,
        document,
      },
      {
        status: 201,
        headers,
      }
    )
  } catch (error) {
    // Xử lý lỗi
  }
}
```

## 6. Tích hợp với Frontend

### Gọi API từ React

```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react'

export function useApi<T>(endpoint: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api'
        const response = await fetch(`${baseUrl}${endpoint}`, {
          ...options,
          credentials: 'include', // Gửi kèm cookies
          headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
          },
        })
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [endpoint, JSON.stringify(options)])

  return { data, error, isLoading }
}
```

### Sử dụng hook API trong component

```tsx
import { useApi } from '../hooks/useApi'
import type { CompanyInfo } from '../types'

function CompanyInfoComponent() {
  const { data, error, isLoading } = useApi<CompanyInfo>('/company-info')
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>No data available</div>
  
  return (
    <div>
      <h1>{data.companyName}</h1>
      <p>{data.companyDescription}</p>
      {data.logo && (
        <img 
          src={data.logo.url} 
          alt={data.logo.alt || data.companyName} 
          width={200}
        />
      )}
      {/* Hiển thị các thông tin khác */}
    </div>
  )
}
```

## 7. Thực hành tốt trong API

1. **Luôn xử lý lỗi**: Bắt và ghi log tất cả lỗi, trả về thông báo phù hợp cho client.
2. **Xác thực đúng cách**: Xác minh mọi yêu cầu cần xác thực, không tin tưởng dữ liệu từ client.
3. **Kiểm tra dữ liệu đầu vào**: Validate tất cả các tham số và dữ liệu gửi lên để tránh lỗi và lỗ hổng bảo mật.
4. **Tối ưu truy vấn**: Sử dụng tham số `depth` một cách cẩn thận để tránh tải quá nhiều dữ liệu không cần thiết.
5. **Phản hồi nhất quán**: Đảm bảo cấu trúc phản hồi nhất quán giữa các endpoints khác nhau.
6. **Tài liệu API**: Viết tài liệu cho mỗi API endpoint, bao gồm cấu trúc dữ liệu, tham số và ví dụ.

## 8. Tài nguyên bổ sung

- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Next.js App Router API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [JavaScript APIs](https://payloadcms.com/docs/local-api/overview)
- [TypeScript API Types](https://payloadcms.com/docs/typescript/overview)
