'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Book, ChevronRight, Search, Star, Clock, Users } from 'lucide-react'
// Temporary workaround - inline component until module resolution is fixed
// import InteractiveDashboard from './InteractiveDashboard'
// import GuideCard from './GuideCard'
// import SearchFilter from './SearchFilter'
// import QuickActions from './QuickActions'
// import StepTutorial from './StepTutorial'
import type { AdminGuide, GuideCategory } from '../../types/admin-guide.types'
import './admin-guide.scss'

interface AdminGuideProps {
  className?: string
  isMinimized?: boolean
  onToggleMinimize?: () => void
}

export const AdminGuideComponent: React.FC<AdminGuideProps> = ({
  className = '',
  isMinimized = false,
  onToggleMinimize
}) => {
  const [guides, setGuides] = useState<AdminGuide[]>([])
  const [filteredGuides, setFilteredGuides] = useState<AdminGuide[]>([])
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGuide, setActiveGuide] = useState<AdminGuide | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showTutorial, setShowTutorial] = useState(false)

  // Fetch guides from API
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/admin-guides-public?locale=vi&limit=50')
        const data = await response.json()
        setGuides(data.docs || [])
        setFilteredGuides(data.docs || [])
      } catch (error) {
        console.error('Error fetching admin guides:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGuides()
  }, [])

  // Filter guides based on search and category
  useEffect(() => {
    let filtered = guides

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guide => guide.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(query) ||
        guide.summary.toLowerCase().includes(query) ||
        guide.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredGuides(filtered)
  }, [guides, selectedCategory, searchQuery])

  const handleGuideSelect = (guide: AdminGuide) => {
    setActiveGuide(guide)
  }

  const handleStartTutorial = () => {
    setShowTutorial(true)
  }

  const featuredGuides = filteredGuides.filter(guide => guide.featured).slice(0, 3)
  const recentGuides = filteredGuides
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  if (isMinimized) {
    return (
      <motion.div
        className={`admin-guide-minimized ${className}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={onToggleMinimize}
      >
        <Book className="guide-icon" />
        <span className="guide-count">{guides.length}</span>
      </motion.div>
    )
  }

  return (
    <div className={`admin-guide-container ${className}`}>
      <motion.div
        className="admin-guide"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="guide-header">
          <div className="header-left">
            <Book className="header-icon" />
            <h2 className="header-title">Hướng dẫn Admin Dashboard</h2>
          </div>
          <div className="header-actions">
            {/* <QuickActions onStartTutorial={handleStartTutorial} /> */}
            <button onClick={handleStartTutorial} className="btn btn--primary btn--sm">
              Bắt đầu hướng dẫn
            </button>
            {onToggleMinimize && (
              <button
                className="minimize-btn"
                onClick={onToggleMinimize}
                aria-label="Thu nhỏ hướng dẫn"
              >
                <ChevronRight />
              </button>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        {/* <SearchFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          guidesCount={filteredGuides.length}
        /> */}
        <div className="admin-guide__search">
          <input
            type="text"
            placeholder="Tìm kiếm hướng dẫn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Interactive Dashboard Overview */}
        {/* <InteractiveDashboard
          onSectionClick={(section: string) => {
            const relatedGuides = filteredGuides.filter(guide =>
              guide.tags?.includes(section) || guide.category === section
            )
            if (relatedGuides.length > 0) {
              setActiveGuide(relatedGuides[0] || null)
            }
          }}
        /> */}
        <div className="admin-guide__dashboard">
          <h3>Interactive Dashboard Overview</h3>
          <p>Dashboard tương tác sẽ được hiển thị ở đây...</p>
        </div>

        {/* Content Area */}
        <div className="guide-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Đang tải hướng dẫn...</p>
            </div>
          ) : (
            <>
              {/* Featured Guides */}
              {featuredGuides.length > 0 && (
                <section className="featured-section">
                  <h3 className="section-title">
                    <Star className="section-icon" />
                    Hướng dẫn nổi bật
                  </h3>
                  <div className="featured-grid">
                    {featuredGuides.map((guide) => (
                      <div
                        key={guide.id}
                        className="simple-guide-card featured"
                        onClick={() => handleGuideSelect(guide)}
                      >
                        <h4>{guide.title}</h4>
                        <p>{guide.summary}</p>
                        <span className="difficulty">{guide.difficulty}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Guides */}
              <section className="recent-section">
                <h3 className="section-title">
                  <Clock className="section-icon" />
                  Cập nhật gần đây
                </h3>
                <div className="guides-list">
                  {recentGuides.map((guide) => (
                    <div
                      key={guide.id}
                      className="simple-guide-card compact"
                      onClick={() => handleGuideSelect(guide)}
                    >
                      <h4>{guide.title}</h4>
                      <span className="updated">{new Date(guide.updatedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* All Guides */}
              {filteredGuides.length > 0 ? (
                <section className="all-guides-section">
                  <h3 className="section-title">
                    <Users className="section-icon" />
                    Tất cả hướng dẫn ({filteredGuides.length})
                  </h3>
                  <div className="guides-grid">
                    {filteredGuides.map((guide) => (
                      <div
                        key={guide.id}
                        className="simple-guide-card"
                        onClick={() => handleGuideSelect(guide)}
                      >
                        <h4>{guide.title}</h4>
                        <p>{guide.summary}</p>
                        <div className="meta">
                          <span className="category">{guide.category}</span>
                          <span className="difficulty">{guide.difficulty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="empty-state">
                  <Search className="empty-icon" />
                  <p>Không tìm thấy hướng dẫn phù hợp</p>
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="reset-filters-btn"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Step Tutorial Modal */}
      <AnimatePresence>
        {showTutorial && (
          <div className="tutorial-modal">
            <div className="tutorial-content">
              <h3>Tutorial sẽ được hiển thị ở đây</h3>
              <button onClick={() => setShowTutorial(false)}>Đóng</button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Guide Detail Modal */}
      <AnimatePresence>
        {activeGuide && (
          <motion.div
            className="guide-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGuide(null)}
          >
            <motion.div
              className="guide-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2 className="modal-title">{activeGuide.title}</h2>
                <button
                  className="modal-close"
                  onClick={() => setActiveGuide(null)}
                  aria-label="Đóng modal"
                >
                  ×
                </button>
              </div>
              <div className="modal-content">
                <div className="guide-meta">
                  <span className={`difficulty difficulty-${activeGuide.difficulty}`}>
                    {activeGuide.difficulty === 'beginner' && 'Cơ bản'}
                    {activeGuide.difficulty === 'intermediate' && 'Trung cấp'}
                    {activeGuide.difficulty === 'advanced' && 'Nâng cao'}
                  </span>
                  <span className="reading-time">
                    <Clock size={14} />
                    {activeGuide.estimatedReadTime} phút
                  </span>
                </div>
                <p className="guide-summary">{activeGuide.summary}</p>
                <div
                  className="guide-content-html"
                  dangerouslySetInnerHTML={{ __html: activeGuide.content }}
                />
                {activeGuide.tags && activeGuide.tags.length > 0 && (
                  <div className="guide-tags">
                    {activeGuide.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminGuideComponent
