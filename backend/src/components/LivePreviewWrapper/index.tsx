'use client'

import React, { useEffect, useState } from 'react'

/**
 * Live Preview Wrapper Component
 * Phát hiện khi đang trong live preview mode và apply CSS riêng biệt
 * Không ảnh hưởng đến production CSS
 */
export const LivePreviewWrapper: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  const [isInIframe, setIsInIframe] = useState(false)

  useEffect(() => {
    // Detect nếu đang chạy trong iframe (live preview)
    setIsInIframe(window.self !== window.top)
  }, [])
  return (
    <div 
      className={className}
      data-preview-mode={isInIframe ? 'true' : 'false'}
    >
      {children}
    </div>
  )
}

/**
 * Hook để detect live preview mode
 */
export const useIsLivePreview = () => {
  const [isInIframe, setIsInIframe] = useState(false)

  useEffect(() => {
    setIsInIframe(window.self !== window.top)
  }, [])

  return isInIframe
}
