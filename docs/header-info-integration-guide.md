# Frontend Integration Guide for Header Info API

This guide explains how to integrate the Header Info API into the frontend application.

## Overview

The Header Info API provides company information, contact details, and social media links that can be used in the website header, footer, and contact components.

## API Endpoint

**Endpoint:** `GET /api/header-info`

**Response Example:**
```json
{
  "companyName": "VRC Company Name",
  "address": "123 VRC Street, City",
  "phone": "+84 123 456 789",
  "email": "contact@example.com",
  "socialMedia": {
    "facebook": "https://facebook.com/vrc-example",
    "instagram": "https://instagram.com/vrc-example",
    "twitter": "https://twitter.com/vrc-example",
    "youtube": "https://youtube.com/vrc-example",
    "zalo": "https://zalo.me/vrc-example"
  },
  "logo": {
    "url": "/media/logo.svg",
    "alt": "VRC Logo"
  }
}
```

## Integration Steps

### 1. Using the Provided Hook

A custom React hook called `useHeaderInfo` has been created to facilitate the integration:

```typescript
// Import the hook
import { useHeaderInfo } from '../hooks/useHeaderInfo';

function Header() {
  // Use the hook in your component
  const { data, isLoading, error } = useHeaderInfo();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading header information</div>;
  
  // Use the data in your component
  return (
    <header>
      <div className="logo">
        <img src={data.logo.url} alt={data.logo.alt} />
      </div>
      <div className="contact-info">
        <p>{data.phone}</p>
        <p>{data.email}</p>
      </div>
      <div className="social-links">
        {data.socialMedia.facebook && (
          <a href={data.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        )}
        {data.socialMedia.zalo && (
          <a href={data.socialMedia.zalo} target="_blank" rel="noopener noreferrer">
            Zalo
          </a>
        )}
        {/* Add other social media links as needed */}
      </div>
    </header>
  );
}
```

### 2. Manual Implementation

If you prefer not to use the provided hook, you can implement the API call directly:

```typescript
import { useState, useEffect } from 'react';

function Header() {
  const [headerInfo, setHeaderInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchHeaderInfo() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/header-info');
        
        if (!response.ok) {
          throw new Error('Failed to fetch header information');
        }
        
        const data = await response.json();
        setHeaderInfo(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching header info:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchHeaderInfo();
  }, []);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!headerInfo) return <div>No header information available</div>;
  
  // Render with the header information
  return (
    <header>
      {/* Your header implementation using headerInfo */}
    </header>
  );
}
```

## Error Handling

The API may return errors in the following situations:

1. **Server Unavailable**: The backend server is not running or unreachable
2. **Rate Limiting**: Too many requests from the same IP
3. **Server Error**: An unexpected error occurred on the server

It's important to handle these errors gracefully in the UI. The provided `useHeaderInfo` hook includes proper error handling.

## Caching Strategy

For optimal performance, consider implementing a caching strategy:

1. Cache the header info in localStorage with an expiration time
2. Use stale-while-revalidate pattern to show cached data immediately while fetching fresh data

Example implementation with caching:

```typescript
function useHeaderInfoWithCache() {
  // Implementation details...
  
  useEffect(() => {
    // Check for cached data first
    const cachedData = localStorage.getItem('header-info-cache');
    const cacheTimestamp = localStorage.getItem('header-info-timestamp');
    
    if (cachedData && cacheTimestamp) {
      // Check if cache is still fresh (less than 1 hour old)
      const isStale = Date.now() - parseInt(cacheTimestamp) > 3600000;
      
      // Use cached data immediately
      if (!isStale) {
        setHeaderInfo(JSON.parse(cachedData));
        setIsLoading(false);
      }
    }
    
    // Always fetch fresh data
    fetchHeaderInfo();
  }, []);
  
  // Rest of the implementation...
}
```

## Development vs Production

During development, the API is available at: `http://localhost:3000/api/header-info`

For production, update the API base URL in your environment configuration:

```typescript
// src/lib/api.ts
export const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.vrc-example.com/api'
  : '/api';
  
export const getHeaderInfo = async () => {
  const response = await fetch(`${API_BASE_URL}/header-info`);
  return response.json();
};
```

## Testing

You can test the Header Info API using the provided test tools:

1. Open `http://localhost:3000/api-test.html` in your browser
2. Run `node test/test-header-info.js` from the command line
3. Run `node test/test-all-endpoints.js --endpoint=header-info` for a comprehensive test
