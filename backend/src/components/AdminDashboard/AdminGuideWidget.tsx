'use client'

import React, { useState } from 'react'
import { AdminGuideComponent } from '../AdminGuide'
import { HelpCircle, BookOpen, X } from 'lucide-react'
import './admin-guide-widget.scss'

interface AdminGuideWidgetProps {
  className?: string
}

export const AdminGuideWidget: React.FC<AdminGuideWidgetProps> = ({
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)

  const handleToggle = () => {
    if (isMinimized) {
      setIsMinimized(false)
      setIsOpen(true)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }

  const handleMinimize = () => {
    setIsOpen(false)
    setIsMinimized(true)
  }

  return (
    <>
      {/* Admin Guide Widget Card - Always visible in dashboard */}
      <div className={`admin-guide-widget ${className}`}>
        <div className="admin-guide-card">
          <div className="guide-header">
            <div className="guide-icon">
              <BookOpen size={24} />
            </div>
            <div className="guide-info">
              <h3 className="guide-title">Hướng dẫn Admin</h3>
              <p className="guide-description">
                Khám phá các tính năng của Payload CMS
              </p>
            </div>
          </div>

          <div className="guide-stats">
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Hướng dẫn</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5</span>
              <span className="stat-label">Danh mục</span>
            </div>
          </div>

          <div className="guide-actions">
            <button
              className="btn-primary"
              onClick={handleToggle}
            >
              <HelpCircle size={16} />
              Xem hướng dẫn
            </button>
          </div>
        </div>
      </div>

      {/* Floating Guide Button - when minimized */}
      {isMinimized && (
        <button
          className="admin-guide-float-btn"
          onClick={handleToggle}
          title="Mở hướng dẫn admin"
        >
          <HelpCircle size={20} />
          <span className="guide-badge">?</span>
        </button>
      )}

      {/* Full Admin Guide Modal/Overlay */}
      {isOpen && (
        <div className="admin-guide-overlay">
          <div className="guide-modal">
            <div className="guide-modal-header">
              <h2 className="modal-title">Hướng dẫn Admin Dashboard</h2>
              <div className="modal-actions">
                <button
                  className="btn-ghost"
                  onClick={handleMinimize}
                  title="Thu nhỏ"
                >
                  —
                </button>
                <button
                  className="btn-ghost"
                  onClick={handleClose}
                  title="Đóng"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
              <div className="guide-modal-content">
              <AdminGuideComponent
                className="dashboard-guide"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminGuideWidget
