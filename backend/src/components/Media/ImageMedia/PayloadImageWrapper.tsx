'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/ui'

interface PayloadImageWrapperProps {
  children: React.ReactNode
  className?: string
  fill?: boolean
}

/**
 * Wrapper component to ensure proper height for Next.js Images with fill prop
 * especially in Payload live preview iframe environments
 * 
 * FIXED: Hydration mismatch by avoiding conditional rendering/styles
 * Uses CSS classes and data attributes for iframe detection instead
 * 
 * ENHANCED: Added comprehensive fallback for Payload CMS GitHub issue #11066
 * - Uses suppressHydrationWarning for data attributes only
 * - Relies on CSS body classes as primary iframe detection
 * - Data attributes as secondary enhancement after hydration
 */
export const PayloadImageWrapper: React.FC<PayloadImageWrapperProps> = ({
  children,
  className,
  fill = false
}) => {  const wrapperRef = useRef<HTMLDivElement>(null)
  const [isInIframe, setIsInIframe] = useState(false)
  
  useEffect(() => {
    // Only detect iframe after mount to avoid hydration mismatch
    const inIframe = window !== window.parent
    setIsInIframe(inIframe)
    
    // Add body class immediately for CSS targeting (safe from hydration mismatch)
    if (inIframe) {
      document.body.classList.add('payload-live-preview')
    }
    
    // Add data attribute for CSS targeting instead of direct style manipulation
    // This is safe from hydration mismatch since it happens after initial render
    if (wrapperRef.current) {
      wrapperRef.current.setAttribute('data-in-iframe', inIframe ? 'true' : 'false')
    }

    // Remove debug log to prevent console spam
    // if (process.env.NODE_ENV === 'development') {
    //   console.log('[PayloadImageWrapper] Iframe detection:', inIframe)
    // }
  }, [])

  // Always render the same structure to prevent hydration mismatch
  // Use consistent className and let CSS handle iframe-specific styling
  const wrapperClassName = cn(
    'payload-image-wrapper',
    fill && 'payload-image-wrapper--fill',
    className
  )
  return (
    <div
      ref={wrapperRef}
      className={wrapperClassName}
      suppressHydrationWarning={true} // Safe to suppress since we only change data attributes
    >
      {children}
    </div>
  )
}
