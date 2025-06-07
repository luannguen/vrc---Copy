'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Play, BookOpen, Zap, Settings } from 'lucide-react'
import type { QuickActionsProps } from '../../types/admin-guide.types'

export const QuickActions: React.FC<QuickActionsProps> = ({
  onStartTutorial,
  className = ''
}) => {
  const quickActions = [
    {
      id: 'tutorial',
      label: 'Bắt đầu hướng dẫn',
      icon: Play,
      onClick: onStartTutorial,
      variant: 'primary'
    },
    {
      id: 'docs',
      label: 'Tài liệu API',
      icon: BookOpen,
      onClick: () => window.open('/api-docs', '_blank'),
      variant: 'secondary'
    },
    {
      id: 'shortcuts',
      label: 'Phím tắt',
      icon: Zap,
      onClick: () => {
        // Show keyboard shortcuts modal
        console.log('Show shortcuts')
      },
      variant: 'secondary'
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: Settings,
      onClick: () => {
        // Open guide settings
        console.log('Open settings')
      },
      variant: 'secondary'
    }
  ]

  return (
    <div className={`quick-actions ${className}`}>
      {quickActions.map((action, index) => {
        const Icon = action.icon
        return (
          <motion.button
            key={action.id}
            className={`quick-action quick-action--${action.variant}`}
            onClick={action.onClick}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={action.label}
          >
            <Icon size={16} />
            <span className="quick-action__label">{action.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

export default QuickActions
