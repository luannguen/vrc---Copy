'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Eye, ArrowRight } from 'lucide-react'
import type { GuideCardProps } from '../../types/admin-guide.types'

export const GuideCard: React.FC<GuideCardProps> = ({
  guide,
  onClick,
  variant = 'default',
  className = ''
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600'
      case 'intermediate':
        return 'text-yellow-600'
      case 'advanced':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Cơ bản'
      case 'intermediate':
        return 'Trung cấp'
      case 'advanced':
        return 'Nâng cao'
      default:
        return difficulty
    }
  }

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      collections: 'Collections',
      globals: 'Globals',
      dashboard: 'Dashboard',
      users: 'Người dùng',
      media: 'Media',
      api: 'API',
      customization: 'Tùy chỉnh',
      troubleshooting: 'Khắc phục sự cố',
      'best-practices': 'Best Practices',
      security: 'Bảo mật'
    }
    return categoryMap[category] || category
  }

  const baseClasses = `guide-card guide-card--${variant} ${className}`

  if (variant === 'compact') {
    return (
      <motion.div
        className={`${baseClasses} guide-card--compact`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onClick(guide)}
      >
        <div className="guide-card__content">
          <div className="guide-card__header">
            <h4 className="guide-card__title">{guide.title}</h4>
            <div className="guide-card__meta">
              <span className={`guide-card__difficulty ${getDifficultyColor(guide.difficulty)}`}>
                {getDifficultyLabel(guide.difficulty)}
              </span>
              <span className="guide-card__reading-time">
                <Clock size={12} />
                {guide.estimatedReadTime}min
              </span>
            </div>
          </div>
          <ArrowRight className="guide-card__arrow" size={16} />
        </div>
      </motion.div>
    )
  }

  if (variant === 'featured') {
    return (
      <motion.div
        className={`${baseClasses} guide-card--featured`}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onClick(guide)}
      >
        <div className="guide-card__badge">
          <Star className="badge-icon" size={14} />
          Nổi bật
        </div>
        <div className="guide-card__content">
          <div className="guide-card__category">
            {getCategoryLabel(guide.category)}
          </div>
          <h3 className="guide-card__title">{guide.title}</h3>
          <p className="guide-card__summary">{guide.summary}</p>
          <div className="guide-card__meta">
            <span className={`guide-card__difficulty ${getDifficultyColor(guide.difficulty)}`}>
              {getDifficultyLabel(guide.difficulty)}
            </span>
            <span className="guide-card__reading-time">
              <Clock size={14} />
              {guide.estimatedReadTime} phút
            </span>
            {guide.viewCount && (
              <span className="guide-card__views">
                <Eye size={14} />
                {guide.viewCount}
              </span>
            )}
          </div>
          {guide.tags && guide.tags.length > 0 && (
            <div className="guide-card__tags">
              {guide.tags.slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="guide-card__tag">
                  {tag}
                </span>
              ))}
              {guide.tags.length > 3 && (
                <span className="guide-card__tag guide-card__tag--more">
                  +{guide.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="guide-card__footer">
          <button className="guide-card__cta">
            Xem hướng dẫn
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      className={`${baseClasses} guide-card--default`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(guide)}
    >
      <div className="guide-card__content">
        <div className="guide-card__header">
          <div className="guide-card__category">
            {getCategoryLabel(guide.category)}
          </div>
          <h3 className="guide-card__title">{guide.title}</h3>
          <p className="guide-card__summary">{guide.summary}</p>
        </div>

        <div className="guide-card__meta">
          <span className={`guide-card__difficulty ${getDifficultyColor(guide.difficulty)}`}>
            {getDifficultyLabel(guide.difficulty)}
          </span>
          <span className="guide-card__reading-time">
            <Clock size={14} />
            {guide.estimatedReadTime} phút
          </span>
          {guide.viewCount && (
            <span className="guide-card__views">
              <Eye size={14} />
              {guide.viewCount}
            </span>
          )}
          {guide.rating && (
            <span className="guide-card__rating">
              <Star size={14} />
              {guide.rating.toFixed(1)}
            </span>
          )}
        </div>

        {guide.tags && guide.tags.length > 0 && (
          <div className="guide-card__tags">
            {guide.tags.slice(0, 4).map((tag: string, index: number) => (
              <span key={index} className="guide-card__tag">
                {tag}
              </span>
            ))}
            {guide.tags.length > 4 && (
              <span className="guide-card__tag guide-card__tag--more">
                +{guide.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="guide-card__footer">
        <div className="guide-card__updated">
          Cập nhật: {new Date(guide.updatedAt).toLocaleDateString('vi-VN')}
        </div>
        <ArrowRight className="guide-card__arrow" size={16} />
      </div>
    </motion.div>
  )
}

export default GuideCard
