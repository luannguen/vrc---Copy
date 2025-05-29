'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { VRCLogo } from '@/components/Logo/VRCLogo'
import { LoginForm } from '@/components/Auth/LoginForm'

interface User {
  email: string
  id: string
  // Add other user properties as needed
}

export const HomePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.log('Not authenticated')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginSuccess = (userData: User) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          <source src="/video/videofly.mp4" type="video/mp4" />
        </video>

        {/* Logo in top-left corner */}
        <div style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          zIndex: 2
        }}>
          <VRCLogo size="sm" />
        </div>

        <div style={{
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          zIndex: 1,
          padding: '2rem',
          marginTop: '3rem'
        }}>
          <div style={{ color: 'white', fontSize: '1.1rem', textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Đang tải...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1
          }}
        >
          <source src="/video/videofly.mp4" type="video/mp4" />
        </video>

      {/* Logo in top-left corner */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        zIndex: 2
      }}>
        <VRCLogo size="sm" />
      </div>

      <div style={{
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        zIndex: 1,
        padding: '2rem',
        marginTop: '3rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          Chào mừng đến với VRC
        </h1>

        {user ? (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '400px',
            margin: '0 auto',
            border: '1px solid rgba(255, 255, 255, 0.18)'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
            }}>
              Xin chào, {user.email}!
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link
                href="/admin"
                style={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(29, 78, 216, 0.9)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.8)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Vào trang quản trị
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = 'white'}
                onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{
              color: 'white',
              marginBottom: '2rem',
              fontSize: '1.1rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
            }}>
              Vui lòng đăng nhập để tiếp tục
            </p>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        )}
      </div>
    </div>
  )
}
