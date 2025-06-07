'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Database,
  Globe,
  Users,
  Image,
  Settings,
  HelpCircle,
  Zap
} from 'lucide-react'
import type { InteractiveDashboardProps, DashboardSection } from '../../types/admin-guide.types'

export const InteractiveDashboard: React.FC<InteractiveDashboardProps> = ({
  onSectionClick,
  className = ''
}) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const dashboardSections: DashboardSection[] = [
    {
      id: 'collections',
      title: 'Collections',
      description: 'Quản lý nội dung như Pages, Posts, Products',
      icon: 'Database',
      position: { x: 20, y: 30 },
      relatedGuides: ['collections-basics', 'document-management']
    },
    {
      id: 'globals',
      title: 'Globals',
      description: 'Cài đặt toàn cục: Header, Footer, Company Info',
      icon: 'Globe',
      position: { x: 20, y: 60 },
      relatedGuides: ['globals-setup', 'site-configuration']
    },
    {
      id: 'media',
      title: 'Media Library',
      description: 'Quản lý hình ảnh, video và files',
      icon: 'Image',
      position: { x: 50, y: 20 },
      relatedGuides: ['media-management', 'image-optimization']
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Quản lý người dùng và phân quyền',
      icon: 'Users',
      position: { x: 50, y: 50 },
      relatedGuides: ['user-roles', 'access-control']
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Tổng quan hệ thống và thống kê',
      icon: 'LayoutDashboard',
      position: { x: 80, y: 30 },
      relatedGuides: ['dashboard-overview', 'analytics']
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Cấu hình hệ thống và tùy chọn nâng cao',
      icon: 'Settings',
      position: { x: 80, y: 60 },
      relatedGuides: ['system-settings', 'configuration']
    }
  ]

  const getIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Database,
      Globe,
      Image,
      Users,
      LayoutDashboard,
      Settings,
      HelpCircle,
      Zap
    }
    return iconMap[iconName] || HelpCircle
  }

  const handleSectionClick = (section: DashboardSection) => {
    setActiveSection(section.id)
    onSectionClick(section.id)
  }

  return (
    <div className={`interactive-dashboard ${className}`}>
      <div className="dashboard-header">
        <h3 className="dashboard-title">
          <LayoutDashboard size={20} />
          Tổng quan Admin Dashboard
        </h3>
        <p className="dashboard-subtitle">
          Click vào các khu vực để xem hướng dẫn chi tiết
        </p>
      </div>

      <div className="dashboard-visual">
        <div className="dashboard-mockup">
          {/* Simulated Admin Panel Layout */}
          <div className="mockup-header">
            <div className="mockup-logo">Payload CMS</div>
            <div className="mockup-user">Admin User</div>
          </div>

          <div className="mockup-body">
            <div className="mockup-sidebar">
              {dashboardSections.map((section) => {
                const Icon = getIcon(section.icon)
                return (
                  <motion.div
                    key={section.id}
                    className={`mockup-nav-item ${
                      hoveredSection === section.id ? 'hovered' : ''
                    } ${
                      activeSection === section.id ? 'active' : ''
                    }`}
                    onMouseEnter={() => setHoveredSection(section.id)}
                    onMouseLeave={() => setHoveredSection(null)}
                    onClick={() => handleSectionClick(section)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={16} />
                    <span>{section.title}</span>
                  </motion.div>
                )
              })}
            </div>

            <div className="mockup-main">
              <div className="mockup-content">
                {hoveredSection ? (
                  <motion.div
                    className="section-preview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {(() => {
                      const section = dashboardSections.find(s => s.id === hoveredSection)
                      if (!section) return null
                      const Icon = getIcon(section.icon)
                      return (
                        <>
                          <div className="preview-header">
                            <Icon size={24} />
                            <h4>{section.title}</h4>
                          </div>
                          <p className="preview-description">{section.description}</p>
                          <div className="preview-guides">
                            <span className="guides-label">Hướng dẫn liên quan:</span>
                            <div className="guides-list">
                              {section.relatedGuides.map((guide, index) => (
                                <span key={index} className="guide-tag">
                                  {guide}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </motion.div>
                ) : (
                  <div className="default-content">
                    <div className="content-placeholder">
                      <LayoutDashboard size={48} className="placeholder-icon" />
                      <h4>Admin Dashboard</h4>
                      <p>Di chuyển chuột qua các mục bên trái để xem chi tiết</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Hotspots */}
        <div className="dashboard-hotspots">
          {dashboardSections.map((section) => {
            const Icon = getIcon(section.icon)
            return (
              <motion.div
                key={section.id}
                className={`dashboard-hotspot ${
                  hoveredSection === section.id ? 'hovered' : ''
                } ${
                  activeSection === section.id ? 'active' : ''
                }`}
                style={{
                  left: `${section.position.x}%`,
                  top: `${section.position.y}%`
                }}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={() => handleSectionClick(section)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: dashboardSections.indexOf(section) * 0.1 }}
              >
                <Icon size={16} />
                <div className="hotspot-tooltip">
                  <h5>{section.title}</h5>
                  <p>{section.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="dashboard-legend">
        <div className="legend-item">
          <div className="legend-dot legend-dot--hover"></div>
          <span>Hover để xem chi tiết</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot legend-dot--click"></div>
          <span>Click để xem hướng dẫn</span>
        </div>
      </div>
    </div>
  )
}

export default InteractiveDashboard
