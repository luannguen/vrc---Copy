'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface EventRegistrationDashboardProps {
  doc?: {
    id: string
    fullName: string
    email: string
    eventTitle: string
    status: string
    participationType: string
    createdAt: string
  }
}

interface RegistrationStats {
  total: number
  pending: number
  confirmed: number
  cancelled: number
  byParticipationType: {
    'in-person': number
    'online': number
    'hybrid': number
  }
  recentRegistrations: Array<{
    id: string
    fullName: string
    email: string
    eventTitle: string
    status: string
    createdAt: string
  }>
}

const EventRegistrationDashboard: React.FC<EventRegistrationDashboardProps> = ({ doc }) => {
  const [stats, setStats] = useState<RegistrationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/event-registrations?limit=1000&depth=1')
        if (!response.ok) {
          throw new Error('Failed to fetch registration data')
        }

        const data = await response.json()
        console.log('📊 Registration data received:', data)
        const registrations = data.registrations || []

        // Calculate statistics
        const stats: RegistrationStats = {
          total: registrations.length,
          pending: registrations.filter((r: any) => r.status === 'pending').length,
          confirmed: registrations.filter((r: any) => r.status === 'confirmed').length,
          cancelled: registrations.filter((r: any) => r.status === 'cancelled').length,
          byParticipationType: {
            'in-person': registrations.filter((r: any) => r.participationType === 'in-person').length,
            'online': registrations.filter((r: any) => r.participationType === 'online').length,
            'hybrid': registrations.filter((r: any) => r.participationType === 'hybrid').length,
          },
          recentRegistrations: registrations
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 10)
        }

        console.log('📈 Calculated stats:', stats)
        setStats(stats)
      } catch (err) {
        console.error('Error fetching registration stats:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleConfirmRegistration = async (registrationId: string) => {
    try {
      const response = await fetch(`/api/event-registrations/${registrationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'confirmed'
        })
      })

      if (response.ok) {
        // Refresh stats
        window.location.reload()
      } else {
        console.error('Failed to confirm registration')
      }
    } catch (error) {
      console.error('Error confirming registration:', error)
    }
  }

  const handleSendConfirmationEmail = async (registrationId: string) => {
    try {
      const response = await fetch(`/api/event-registrations/${registrationId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        alert('Email xác nhận đã được gửi thành công!')
      } else {
        alert('Không thể gửi email xác nhận')
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      alert('Lỗi khi gửi email xác nhận')
    }
  }

  if (loading) {
    return (
      <div className="event-registration-dashboard" style={{ padding: '20px' }}>
        <div className="loading" style={{ textAlign: 'center', padding: '40px' }}>
          <div>Đang tải thống kê đăng ký sự kiện...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="event-registration-dashboard" style={{ padding: '20px' }}>
        <div className="error" style={{ color: 'red', textAlign: 'center', padding: '40px' }}>
          <div>Lỗi: {error}</div>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '10px', padding: '8px 16px' }}
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="event-registration-dashboard" style={{ padding: '20px' }}>
        <div>Không có dữ liệu thống kê</div>
      </div>
    )
  }

  return (
    <div className="event-registration-dashboard" style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>Thống kê Đăng ký Sự kiện</h2>

      {/* Stats Overview */}
      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="stat-card" style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#666', textTransform: 'uppercase' }}>
            Tổng đăng ký
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#333' }}>{stats.total}</div>
        </div>

        <div className="stat-card" style={{
          background: '#fff3cd',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#856404', textTransform: 'uppercase' }}>
            Chờ xác nhận
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#856404' }}>{stats.pending}</div>
        </div>

        <div className="stat-card" style={{
          background: '#d4edda',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #c3e6cb'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#155724', textTransform: 'uppercase' }}>
            Đã xác nhận
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#155724' }}>{stats.confirmed}</div>
        </div>

        <div className="stat-card" style={{
          background: '#f8d7da',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #f5c6cb'
        }}>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#721c24', textTransform: 'uppercase' }}>
            Đã hủy
          </h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#721c24' }}>{stats.cancelled}</div>
        </div>
      </div>

      {/* Participation Type Stats */}
      <div className="participation-stats" style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Loại tham gia</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px'
        }}>
          <div style={{
            background: '#e3f2fd',
            padding: '16px',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1976d2' }}>
              {stats.byParticipationType['in-person']}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Trực tiếp</div>
          </div>
          <div style={{
            background: '#f3e5f5',
            padding: '16px',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#7b1fa2' }}>
              {stats.byParticipationType['online']}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Online</div>
          </div>
          <div style={{
            background: '#e8f5e8',
            padding: '16px',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#388e3c' }}>
              {stats.byParticipationType['hybrid']}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Hybrid</div>
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="recent-registrations">
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Đăng ký gần đây</h3>
        {stats.recentRegistrations.length === 0 ? (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            Chưa có đăng ký nào
          </div>
        ) : (
          <div style={{
            background: 'white',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            {stats.recentRegistrations.map((registration, index) => (
              <div
                key={registration.id}
                style={{
                  padding: '16px',
                  borderBottom: index < stats.recentRegistrations.length - 1 ? '1px solid #e9ecef' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {registration.fullName}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                    {registration.email}
                  </div>
                  <div style={{ fontSize: '14px', color: '#666' }}>
                    {registration.eventTitle}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    background: registration.status === 'confirmed' ? '#d4edda' :
                               registration.status === 'pending' ? '#fff3cd' : '#f8d7da',
                    color: registration.status === 'confirmed' ? '#155724' :
                           registration.status === 'pending' ? '#856404' : '#721c24'
                  }}>
                    {registration.status === 'confirmed' ? 'Đã xác nhận' :
                     registration.status === 'pending' ? 'Chờ xác nhận' : 'Đã hủy'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(registration.createdAt).toLocaleDateString('vi-VN')}
                  </div>
                  {registration.status === 'pending' && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleConfirmRegistration(registration.id)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          background: '#28a745',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => handleSendConfirmationEmail(registration.id)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '12px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Gửi email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions" style={{ marginTop: '32px' }}>
        <h3 style={{ marginBottom: '16px', color: '#333' }}>Thao tác nhanh</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => router.push('/admin/collections/event-registrations')}
            style={{
              padding: '12px 24px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Quản lý tất cả đăng ký
          </button>
          <button
            onClick={() => router.push('/admin/collections/events')}
            style={{
              padding: '12px 24px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Quản lý sự kiện
          </button>
          <button
            onClick={() => {
              const csvContent = 'data:text/csv;charset=utf-8,' +
                ['Họ tên,Email,Sự kiện,Trạng thái,Loại tham gia,Ngày đăng ký']
                  .concat(stats.recentRegistrations.map(r =>
                    `"${r.fullName}","${r.email}","${r.eventTitle}","${r.status}","",${new Date(r.createdAt).toLocaleDateString('vi-VN')}`
                  ))
                  .join('\n')

              const encodedUri = encodeURI(csvContent)
              const link = document.createElement('a')
              link.setAttribute('href', encodedUri)
              link.setAttribute('download', `event-registrations-${new Date().toISOString().split('T')[0]}.csv`)
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
            style={{
              padding: '12px 24px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Xuất CSV
          </button>
        </div>
      </div>
    </div>
  )
}

export default EventRegistrationDashboard
