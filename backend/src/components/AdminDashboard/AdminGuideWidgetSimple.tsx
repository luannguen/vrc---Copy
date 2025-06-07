'use client'

import React, { useState } from 'react'
import { HelpCircle, BookOpen, X, ExternalLink } from 'lucide-react'
import './admin-guide-widget.scss'

interface AdminGuideWidgetProps {
  className?: string
}

export const AdminGuideWidget: React.FC<AdminGuideWidgetProps> = ({
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const guides = [
    {
      title: 'Hướng dẫn Dashboard',
      description: 'Tìm hiểu cách sử dụng admin dashboard',
      category: 'Cơ bản',
      readTime: '5 phút'
    },
    {
      title: 'Quản lý Collections',
      description: 'Tạo và quản lý collections hiệu quả',
      category: 'Trung bình',
      readTime: '8 phút'
    },
    {
      title: 'Media & Upload',
      description: 'Quản lý files và media',
      category: 'Cơ bản',
      readTime: '6 phút'
    }
  ]

  return (
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
          <button
            className="expand-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Thu gọn' : 'Mở rộng'}
          >
            {isExpanded ? <X size={16} /> : <ExternalLink size={16} />}
          </button>
        </div>

        <div className="guide-stats">
          <div className="stat-item">
            <span className="stat-number">{guides.length}</span>
            <span className="stat-label">Hướng dẫn</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">Danh mục</span>
          </div>
        </div>

        {isExpanded && (
          <div className="guide-list">
            <h4 className="list-title">Hướng dẫn phổ biến</h4>
            {guides.map((guide, index) => (
              <div key={index} className="guide-item">
                <div className="guide-item-info">
                  <h5 className="guide-item-title">{guide.title}</h5>
                  <p className="guide-item-desc">{guide.description}</p>
                  <div className="guide-item-meta">
                    <span className="category">{guide.category}</span>
                    <span className="read-time">{guide.readTime}</span>
                  </div>
                </div>                <button
                  className="guide-item-btn"
                  title="Xem hướng dẫn chi tiết"
                  onClick={() => {
                    // Navigate to admin guides collection
                    window.location.href = '/admin/collections/admin-guides'
                  }}
                >
                  <ExternalLink size={14} />
                </button>
              </div>
            ))}

            <div className="guide-actions">
              <button
                className="btn-primary"
                onClick={() => {
                  window.location.href = '/admin/collections/admin-guides'
                }}
              >
                <HelpCircle size={16} />
                Xem tất cả hướng dẫn
              </button>
            </div>
          </div>
        )}

        {!isExpanded && (
          <div className="guide-actions">
            <button
              className="btn-primary"
              onClick={() => setIsExpanded(true)}
            >
              <HelpCircle size={16} />
              Xem hướng dẫn
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminGuideWidget
