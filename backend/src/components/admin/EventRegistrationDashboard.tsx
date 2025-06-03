'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from './EventRegistrationDashboard.module.css'

interface Registration {
  id: string
  fullName: string
  email: string
  eventTitle: string
  status: string
  participationType: string
  createdAt: string
}

interface EventRegistrationDashboardProps {
  doc?: Registration
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
  recentRegistrations: Array<Registration>
}

const EventRegistrationDashboard: React.FC<EventRegistrationDashboardProps> = () => {
  const [stats, setStats] = useState<RegistrationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const searchParams = useSearchParams()

  // Fetch registration statistics
  const fetchStats = useCallback(async () => {
    try {
      setIsRefreshing(true)
      console.log('🔄 Fetching registration statistics...')

      const response = await fetch('/api/event-registrations', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch registration data')
      }

      const data = await response.json()
      console.log('📊 Registration data received:', data)
      const registrations: Registration[] = data.docs || data.registrations || []

      // Calculate statistics
      const stats: RegistrationStats = {
        total: registrations.length,
        pending: registrations.filter((r: Registration) => r.status === 'pending').length,
        confirmed: registrations.filter((r: Registration) => r.status === 'confirmed').length,
        cancelled: registrations.filter((r: Registration) => r.status === 'cancelled').length,
        byParticipationType: {
          'in-person': registrations.filter((r: Registration) => r.participationType === 'in-person').length,
          'online': registrations.filter((r: Registration) => r.participationType === 'online').length,
          'hybrid': registrations.filter((r: Registration) => r.participationType === 'hybrid').length,
        },
        recentRegistrations: registrations
          .sort((a: Registration, b: Registration) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10)
      }

      console.log('📈 Calculated stats:', stats)
      setStats(stats)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error('Error fetching registration stats:', err)
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Auto-refresh when URL changes (when user navigates back from edit/detail pages)
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Window focused - refreshing dashboard...')
      fetchStats()
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('👁️ Tab became visible - refreshing dashboard...')
        fetchStats()
      }
    }

    // Listen for window focus events (when user comes back to tab)
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchStats])

  // Auto-refresh every 30 seconds to keep data fresh
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ Auto-refresh triggered')
      fetchStats()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchStats])

  // Listen for storage events (in case of changes in other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      console.log('💾 Storage change detected - refreshing...')
      fetchStats()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [fetchStats])

  // Listen for popstate events (browser back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      console.log('🔙 Navigation detected - refreshing dashboard...')
      fetchStats()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [fetchStats])

  // Listen for custom refresh events
  useEffect(() => {
    const handleCustomRefresh = () => {
      console.log('🔄 Custom refresh event - refreshing dashboard...')
      fetchStats()
    }

    window.addEventListener('dashboardRefresh', handleCustomRefresh)
    return () => window.removeEventListener('dashboardRefresh', handleCustomRefresh)
  }, [fetchStats])

  // Listen for URL parameter changes to detect when user returns from edit/detail pages
  useEffect(() => {
    const currentUrl = window.location.href
    console.log('🔍 URL changed:', currentUrl)

    // If we're back on the main list page, refresh
    if (currentUrl.includes('/admin/collections/event-registrations') && !currentUrl.includes('/edit') && !currentUrl.includes('/create')) {
      setTimeout(() => {
        console.log('🏠 Back to list page - refreshing...')
        fetchStats()
      }, 500) // Small delay to ensure page is fully loaded
    }
  }, [searchParams, fetchStats])

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
        // Refresh stats immediately instead of page reload
        console.log('✅ Registration confirmed - refreshing stats...')
        await fetchStats()

        // Trigger custom event for other components
        window.dispatchEvent(new CustomEvent('dashboardRefresh'))
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

  if (loading && !stats) {
    return (
      <div className={styles['event-registration-dashboard']}>
        <div className={styles.loading}>
          <div>Đang tải thống kê đăng ký sự kiện...</div>
        </div>
      </div>
    )
  }

  if (error && !stats) {
    return (
      <div className={styles['event-registration-dashboard']}>
        <div className={styles.error}>
          <div>Lỗi: {error}</div>
          <button
            onClick={() => fetchStats()}
            className={styles.retryButton}
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className={styles['event-registration-dashboard']}>
        <div className={styles.loading}>Không có dữ liệu thống kê</div>
      </div>
    )
  }

  return (
    <div className={styles['event-registration-dashboard']}>
      <h2>
        Thống kê Đăng ký Sự kiện
        {isRefreshing && <span className={styles.refreshIndicator}>⟳</span>}
      </h2>

      {lastUpdated && (
        <div className={styles.lastUpdated}>
          Cập nhật lần cuối: {lastUpdated.toLocaleString('vi-VN')}
        </div>
      )}

      {/* Stats Overview */}
      <div className={`${styles['stats-grid']} ${styles.statsGrid}`}>
        <div className={`${styles['stat-card']} ${styles.statCard} ${styles.total}`}>
          <h3 className={styles.statTitle}>Tổng đăng ký</h3>
          <div className={styles.statValue}>{stats.total}</div>
        </div>

        <div className={`${styles['stat-card']} ${styles.statCard} ${styles.pending}`}>
          <h3 className={styles.statTitle}>Chờ xác nhận</h3>
          <div className={styles.statValue}>{stats.pending}</div>
        </div>

        <div className={`${styles['stat-card']} ${styles.statCard} ${styles.confirmed}`}>
          <h3 className={styles.statTitle}>Đã xác nhận</h3>
          <div className={styles.statValue}>{stats.confirmed}</div>
        </div>

        <div className={`${styles['stat-card']} ${styles.statCard} ${styles.cancelled}`}>
          <h3 className={styles.statTitle}>Đã hủy</h3>
          <div className={styles.statValue}>{stats.cancelled}</div>
        </div>
      </div>

      {/* Participation Types */}
      <h3>Phân loại theo hình thức tham gia</h3>
      <div className={styles.participationGrid}>
        <div className={styles.participationCard}>
          <h4 className={styles.participationTitle}>Trực tiếp</h4>
          <div className={styles.participationValue}>{stats.byParticipationType['in-person']}</div>
        </div>
        <div className={styles.participationCard}>
          <h4 className={styles.participationTitle}>Trực tuyến</h4>
          <div className={styles.participationValue}>{stats.byParticipationType['online']}</div>
        </div>
        <div className={styles.participationCard}>
          <h4 className={styles.participationTitle}>Kết hợp</h4>
          <div className={styles.participationValue}>{stats.byParticipationType['hybrid']}</div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className={styles.recentSection}>
        <h3 className={styles.recentTitle}>Đăng ký gần đây</h3>
        {stats.recentRegistrations.length > 0 ? (
          <div className={styles.recentList}>
            {stats.recentRegistrations.map((registration) => (
              <div key={registration.id} className={styles.recentItem}>
                <div className={styles.recentInfo}>
                  <div className={styles.recentName}>{registration.fullName}</div>
                  <div className={styles.recentDetails}>
                    {registration.email} | {registration.eventTitle} |
                    <span className={`${styles.status} ${styles[registration.status]}`}>
                      {registration.status === 'pending' && 'Chờ xác nhận'}
                      {registration.status === 'confirmed' && 'Đã xác nhận'}
                      {registration.status === 'cancelled' && 'Đã hủy'}
                    </span>
                  </div>
                </div>
                <div className={styles.recentActions}>
                  {registration.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleConfirmRegistration(registration.id)}
                        className={`${styles.actionButton} ${styles.confirmButton}`}
                      >
                        Xác nhận
                      </button>
                      <button
                        onClick={() => handleSendConfirmationEmail(registration.id)}
                        className={`${styles.actionButton} ${styles.emailButton}`}
                      >
                        Gửi email
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noRecentRegistrations}>
            Không có đăng ký gần đây
          </div>
        )}
      </div>
    </div>
  )
}

export default EventRegistrationDashboard
