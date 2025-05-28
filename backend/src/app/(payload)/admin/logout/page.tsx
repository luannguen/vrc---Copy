'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@payloadcms/ui'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Properly handle logout by calling the official Payload logout endpoint
    const performLogout = async () => {
      try {
        const res = await fetch('/api/users/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Important for cookies
        })

        if (res.ok) {
          // Redirect back to homepage after successful logout
          router.push('/')
        } else {
          console.error('Logout failed:', await res.text())
          // Even if logout fails, redirect to homepage
          setTimeout(() => {
            router.push('/')
          }, 1000)
        }      } catch (error) {
        console.error('Error during logout:', error)
        // Fallback - redirect to homepage even on error
        setTimeout(() => {
          router.push('/')
        }, 1000)
      }
    }

    performLogout()
  }, [router])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: '2rem'
    }}>
      <h1>Đang đăng xuất...</h1>
      <div>
        <Button
          onClick={() => router.push('/admin/login')}
        >
          Quay lại trang đăng nhập
        </Button>
      </div>
    </div>
  )
}
