# Hướng dẫn kết nối Frontend với API Backend

## Giới thiệu

Tài liệu này hướng dẫn cách kết nối phần Frontend (vrcfrontend) với các API đã tạo trong phần Backend (backend). Việc này bao gồm:

1. Lấy thông tin công ty từ API
2. Gửi dữ liệu form liên hệ đến API

## 1. Lấy thông tin công ty

### API Endpoint

```
GET /api/company-info
```

### Cách triển khai

Tạo một hook custom trong thư mục `vrcfrontend/src/hooks`:

```tsx
// src/hooks/useCompanyInfo.ts
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface CompanyInfo {
  companyName: string;
  companyShortName?: string;
  companyDescription?: string;
  contactSection: {
    address: string;
    phone: string;
    email: string;
    hotline?: string;
    workingHours?: string;
    fax?: string;
  };
  socialMedia: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    telegram?: string;
  };
  maps: {
    googleMapsEmbed?: string;
    latitude?: string;
    longitude?: string;
  };
  logo?: {
    url: string;
    alt: string;
  };
}

export const useCompanyInfo = () => {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/api/company-info`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setCompanyInfo(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch company info:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyInfo();
  }, []);

  return { companyInfo, isLoading, error };
};
```

### Cách sử dụng trong component

```tsx
// Trong Contact.tsx
import { useCompanyInfo } from '@/hooks/useCompanyInfo';

const Contact = () => {
  const { companyInfo, isLoading, error } = useCompanyInfo();

  if (isLoading) return <div>Đang tải thông tin...</div>;
  if (error) return <div>Có lỗi xảy ra: {error}</div>;
  if (!companyInfo) return <div>Không tìm thấy thông tin công ty</div>;

  return (
    <main className="flex-grow">
      <div className="container-custom py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Liên hệ</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Thông tin liên hệ</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg text-primary">{companyInfo.companyName}</h3>
                  <p className="text-gray-600">{companyInfo.companyDescription}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Địa chỉ:</h3>
                  <p className="text-gray-600">{companyInfo.contactSection.address}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Điện thoại:</h3>
                    <p className="text-gray-600">{companyInfo.contactSection.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Email:</h3>
                    <p className="text-gray-600">{companyInfo.contactSection.email}</p>
                  </div>
                  
                  {companyInfo.contactSection.hotline && (
                    <div>
                      <h3 className="font-medium">Hotline:</h3>
                      <p className="text-gray-600">{companyInfo.contactSection.hotline}</p>
                    </div>
                  )}
                  
                  {companyInfo.contactSection.workingHours && (
                    <div>
                      <h3 className="font-medium">Giờ làm việc:</h3>
                      <p className="text-gray-600">{companyInfo.contactSection.workingHours}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Social Media Links */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">Kết nối với chúng tôi:</h3>
                <div className="flex space-x-4">
                  {/* Render social media links dynamically based on available data */}
                  {companyInfo.socialMedia.facebook && (
                    <a href={companyInfo.socialMedia.facebook} className="text-blue-600 hover:text-blue-800">
                      {/* Facebook icon */}
                    </a>
                  )}
                  {/* Similar code for other social media platforms */}
                </div>
              </div>
            </div>
            
            {/* Map */}
            {companyInfo.maps.googleMapsEmbed && (
              <div className="mt-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Bản đồ</h2>
                  <div className="aspect-video w-full h-full rounded-md overflow-hidden">
                    <iframe 
                      src={companyInfo.maps.googleMapsEmbed}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
};
```

## 2. Gửi Form Liên hệ

### API Endpoint

```
POST /api/contact
```

### Cách triển khai

Cập nhật component ContactForm để sử dụng API mới:

```tsx
// src/components/ContactForm.tsx
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Đã có lỗi xảy ra khi gửi form');
      }
      
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : 'Đã có lỗi xảy ra. Vui lòng thử lại sau!');
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rest of the component remains the same
  return (
    <section className="bg-gray-100 py-16">
      {/* Use existing JSX code */}
      {/* Just replace the error message display with: */}
      {submitStatus === "error" && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          {errorMessage || 'Đã có lỗi xảy ra. Vui lòng thử lại sau!'}
        </div>
      )}
      {/* Rest of the form remains unchanged */}
    </section>
  );
};

export default ContactForm;
```

## 3. Cài đặt Biến Môi Trường

Tạo file `.env.local` trong thư mục `vrcfrontend`:

```
VITE_API_URL=http://localhost:3000
```

Trong môi trường production, cập nhật biến này thành URL thực tế của backend:

```
VITE_API_URL=https://api.yourwebsite.com
```

## 4. Xử lý CORS

Backend đã được cấu hình để chấp nhận request từ frontend. CORS đã được thiết lập trong file `payload.config.ts`:

```typescript
cors: {
  origins: [
    getServerSideURL(),                                    // Backend URL
    process.env.FRONTEND_URL || 'http://localhost:5173',   // Frontend Vite URL
    // Thêm domain production nếu cần
  ].filter(Boolean),
  headers: ['authorization', 'content-type', 'x-custom-header'],
},
```

Đảm bảo biến môi trường `FRONTEND_URL` trong backend đã được cập nhật chính xác.

## 5. Testing

Để kiểm tra tích hợp:

1. Chạy backend: `cd backend && npm run dev`
2. Chạy frontend: `cd vrcfrontend && npm run dev`
3. Mở trình duyệt và truy cập trang Liên hệ
4. Kiểm tra xem thông tin công ty có được load chính xác không
5. Thử gửi form liên hệ và xác nhận dữ liệu được lưu vào backend

## 6. Giải quyết Sự cố

### Frontend không lấy được dữ liệu từ backend

- Kiểm tra console trình duyệt để xem lỗi
- Xác nhận URL API đúng trong biến môi trường
- Kiểm tra cấu hình CORS trên backend
- Đảm bảo backend đang chạy và có thể truy cập được

### Form không gửi được

- Kiểm tra payload dữ liệu gửi đi
- Xác nhận URL API đúng
- Kiểm tra response từ backend trong Network tab của Developer Tools
