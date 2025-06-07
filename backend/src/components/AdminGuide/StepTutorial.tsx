'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Check, ArrowRight } from 'lucide-react'
import type { StepTutorialProps, TutorialStep } from '../../types/admin-guide.types'

export const StepTutorial: React.FC<StepTutorialProps> = ({
  onClose,
  guides,
  className = ''
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Sample tutorial steps - in real app this would come from API
  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Chào mừng đến với Admin Dashboard',
      description: 'Hãy cùng khám phá các tính năng chính của Payload CMS',
      content: `
        <h3>Chào mừng bạn!</h3>
        <p>Hướng dẫn này sẽ giúp bạn làm quen với admin dashboard của Payload CMS.
        Bạn sẽ học cách:</p>
        <ul>
          <li>Điều hướng trong giao diện admin</li>
          <li>Quản lý collections và documents</li>
          <li>Sử dụng các tính năng nâng cao</li>
          <li>Tùy chỉnh cài đặt hệ thống</li>
        </ul>
      `
    },
    {
      id: 'navigation',
      title: 'Điều hướng trong Admin Panel',
      description: 'Tìm hiểu cách sử dụng sidebar và navigation',
      target: '[data-testid="nav-sidebar"]',
      content: `
        <h3>Sidebar Navigation</h3>
        <p>Sidebar bên trái chứa tất cả các collection và global settings:</p>
        <ul>
          <li><strong>Collections:</strong> Quản lý dữ liệu chính như Pages, Posts, Media</li>
          <li><strong>Globals:</strong> Cài đặt toàn cục như Header, Footer, Company Info</li>
          <li><strong>Users:</strong> Quản lý người dùng và quyền truy cập</li>
        </ul>
        <p>Click vào bất kỳ item nào để bắt đầu làm việc với nó.</p>
      `
    },
    {
      id: 'collections',
      title: 'Làm việc với Collections',
      description: 'Học cách tạo, chỉnh sửa và quản lý documents',
      target: '[data-testid="collection-nav"]',
      content: `
        <h3>Collections Management</h3>
        <p>Collections là nơi bạn quản lý nội dung chính:</p>
        <ul>
          <li><strong>List View:</strong> Xem tất cả documents, sắp xếp và lọc</li>
          <li><strong>Create New:</strong> Thêm document mới</li>
          <li><strong>Edit:</strong> Chỉnh sửa document hiện có</li>
          <li><strong>Bulk Actions:</strong> Thao tác với nhiều documents cùng lúc</li>
        </ul>
        <p>Thử click vào một collection để xem danh sách documents.</p>
      `
    },
    {
      id: 'editor',
      title: 'Document Editor',
      description: 'Sử dụng trình soạn thảo để tạo nội dung',
      content: `
        <h3>Rich Text Editor</h3>
        <p>Payload cung cấp editor mạnh mẽ với nhiều tính năng:</p>
        <ul>
          <li><strong>Rich Text:</strong> Format text, thêm links, images</li>
          <li><strong>Blocks:</strong> Thêm components phức tạp</li>
          <li><strong>Relationships:</strong> Liên kết với documents khác</li>
          <li><strong>Media:</strong> Upload và quản lý files</li>
        </ul>
        <p>Auto-save sẽ tự động lưu thay đổi của bạn.</p>
      `
    },
    {
      id: 'globals',
      title: 'Global Settings',
      description: 'Quản lý cài đặt toàn cục của website',
      target: '[data-testid="globals-nav"]',
      content: `
        <h3>Global Configuration</h3>
        <p>Globals chứa cải đặt áp dụng cho toàn bộ website:</p>
        <ul>
          <li><strong>Header:</strong> Cấu hình navigation menu</li>
          <li><strong>Footer:</strong> Thông tin footer</li>
          <li><strong>Company Info:</strong> Thông tin công ty</li>
          <li><strong>Homepage Settings:</strong> Cài đặt trang chủ</li>
        </ul>
        <p>Thay đổi ở globals sẽ ảnh hưởng đến toàn bộ website.</p>
      `
    },
    {
      id: 'completion',
      title: 'Hoàn thành!',
      description: 'Bạn đã sẵn sàng sử dụng Payload CMS',
      content: `
        <h3>🎉 Chúc mừng!</h3>
        <p>Bạn đã hoàn thành hướng dẫn cơ bản. Bây giờ bạn có thể:</p>
        <ul>
          <li>Tự tin điều hướng trong admin panel</li>
          <li>Tạo và quản lý nội dung</li>
          <li>Sử dụng các tính năng nâng cao</li>
          <li>Tùy chỉnh cài đặt theo nhu cầu</li>
        </ul>
        <p>Hãy khám phá thêm các hướng dẫn chi tiết để nắm vững hơn!</p>
      `
    }
  ]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex)
  }

  const handleComplete = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    onClose()
  }

  const currentTutorialStep = tutorialSteps[currentStep]
  const isLastStep = currentStep === tutorialSteps.length - 1
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100

  // Update progress bar width using CSS custom property
  useEffect(() => {
    if (progressBarRef.current) {
      progressBarRef.current.style.setProperty('--progress-width', `${progress}%`)
    }
  }, [progress])

  return (
    <motion.div
      className={`step-tutorial-overlay ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="step-tutorial"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
      >
        {/* Header */}
        <div className="tutorial-header">
          <div className="tutorial-title">
            <h2>Hướng dẫn sử dụng Admin Dashboard</h2>
            <p>Bước {currentStep + 1} / {tutorialSteps.length}</p>
          </div>
          <button
            className="tutorial-close"
            onClick={onClose}
            aria-label="Đóng hướng dẫn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="tutorial-progress">
          <div
            ref={progressBarRef}
            className="tutorial-progress-bar"
          />
        </div>

        {/* Steps Navigation */}
        <div className="tutorial-steps-nav">
          {tutorialSteps.map((step, index) => (
            <button
              key={step.id}
              className={`step-nav-item ${
                index === currentStep ? 'active' :
                completedSteps.has(index) ? 'completed' : ''
              }`}
              onClick={() => handleStepClick(index)}
            >
              <div className="step-number">
                {completedSteps.has(index) ? (
                  <Check size={12} />
                ) : (
                  index + 1
                )}
              </div>
              <span className="step-title">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="tutorial-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="tutorial-step-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="step-title">{currentTutorialStep?.title}</h3>
              <p className="step-description">{currentTutorialStep?.description}</p>
              <div
                className="step-content"
                dangerouslySetInnerHTML={{ __html: currentTutorialStep?.content || '' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="tutorial-footer">
          <div className="tutorial-nav">
            <button
              className="tutorial-btn tutorial-btn--secondary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft size={16} />
              Quay lại
            </button>

            {isLastStep ? (
              <button
                className="tutorial-btn tutorial-btn--primary"
                onClick={handleComplete}
              >
                <Check size={16} />
                Hoàn thành
              </button>
            ) : (
              <button
                className="tutorial-btn tutorial-btn--primary"
                onClick={handleNext}
              >
                Tiếp theo
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          <div className="tutorial-meta">
            <button
              className="skip-tutorial"
              onClick={onClose}
            >
              Bỏ qua hướng dẫn
            </button>
          </div>
        </div>

        {/* Related Guides */}
        {guides.length > 0 && (
          <div className="tutorial-related">
            <h4>Hướng dẫn liên quan</h4>
            <div className="related-guides">
              {guides.slice(0, 3).map((guide) => (
                <div key={guide.id} className="related-guide">
                  <span className="guide-title">{guide.title}</span>
                  <ArrowRight size={12} />
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default StepTutorial
