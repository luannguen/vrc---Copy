'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

interface LoginFormProps {
  onLoginSuccess?: (user: any) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        if (onLoginSuccess) {
          onLoginSuccess(data.user)
        } else {
          // Redirect to admin panel
          router.push('/admin')
        }
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Đăng nhập thất bại')
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi đăng nhập')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '320px', margin: '10px auto' }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1rem',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        background: 'rgba(255, 255, 255, 0.08)',
        margin: '10px'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '0.25rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }}>
            Đăng nhập
          </h2>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.8rem'
          }}>
            Vui lòng nhập thông tin để tiếp tục
          </p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }} htmlFor="email">
            Email
          </label>
          <input
            style={{
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
              appearance: 'none',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              width: '100%',
              padding: '0.7rem 0.1rem',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              lineHeight: '1.25',
              outline: 'none',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit'
            }}
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.8)'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
              e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }} htmlFor="password">
            Mật khẩu
          </label>
          <input
            style={{
              boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
              appearance: 'none',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              width: '100%',
              padding: '0.7rem 0.1rem',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              lineHeight: '1.25',
              outline: 'none',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              fontFamily: 'inherit'
            }}
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.8)'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
              e.target.style.boxShadow = 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)'
            }}
            required
          />
        </div>

        {error && (
          <div style={{
            marginBottom: '1.5rem',
            padding: '0.875rem 1rem',
            backgroundColor: 'rgba(220, 38, 38, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '500',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}>
            ⚠️ {error}
          </div>
        )}

        <button
          style={{
            width: '100%',
            background: isLoading
              ? 'rgba(156, 163, 175, 0.6)'
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(29, 78, 216, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            fontWeight: '600',
            padding: '0.7rem 1.2rem',
            borderRadius: '8px',
            outline: 'none',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem',
            letterSpacing: '0.025em',
            boxShadow: isLoading
              ? 'none'
              : '0 4px 14px 0 rgba(59, 130, 246, 0.3)',
            transform: 'translateY(0)',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}
          type="submit"
          disabled={isLoading}
          onMouseOver={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 25px 0 rgba(59, 130, 246, 0.4)'
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(29, 78, 216, 1) 100%)'
            }
          }}
          onMouseOut={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.3)'
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(29, 78, 216, 0.9) 100%)'
            }
          }}
          onMouseDown={(e) => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(0)'
            }
          }}
        >
          {isLoading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff40',
                borderTop: '2px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></span>
              Đang đăng nhập...
            </span>
          ) : (
            'Đăng nhập →'
          )}
        </button>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </form>
    </div>
  )
}
