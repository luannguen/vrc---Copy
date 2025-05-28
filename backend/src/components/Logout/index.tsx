'use client'

import React, { useCallback } from 'react'
import { Button } from '@payloadcms/ui'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import HydrationSafeWrapper from '../HydrationSafeWrapper'

// This component will be used as custom logout button at the bottom of left menu
const LogoutButton = () => {
  const router = useRouter()
  
  // Using useCallback to avoid creating a new function on each render
  const handleLogout = useCallback(() => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      // First call our custom logout endpoint which ensures proper JSON response
      fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add a custom header to ensure our endpoint is called
          'X-Custom-Logout': '1'
        },
        credentials: 'include', // Important for cookie handling
      })
      .then(async response => {
        try {
          // First check if the response is OK
          if (!response.ok) {
            throw new Error('Logout failed');
          }
          
          // Read the response text first
          const text = await response.text();
          
          // Only try to parse as JSON if there's actual content
          if (text && text.trim()) {
            try {
              const data = JSON.parse(text);
              console.log('Logout successful:', data);
            } catch (e) {
              console.warn('Invalid JSON in logout response, but continuing:', e);
            }
          }
        } catch (e) {
          console.warn('Error processing logout response:', e);
        }
        
        // Then navigate to the logout page which will clean up and redirect
        router.push('/admin/logout');
      })
      .catch(error => {
        console.error('Error during logout:', error);
        // Even if there's an error, try to logout via the page
        router.push('/admin/logout');
      });
    }
  }, [router]);
  
  return (
    <div style={{ 
      padding: '1rem', 
      marginTop: 'auto',
      borderTop: '1px solid var(--theme-elevation-100)',
      marginBottom: '1rem'
    }}>
      <HydrationSafeWrapper>
        <Button 
          className="logout-button" 
          icon={<LogOut size={18} />} 
          buttonStyle="secondary"
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </HydrationSafeWrapper>
    </div>
  )
}

export default LogoutButton
