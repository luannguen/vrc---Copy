'use client'
import { getClientSideURL } from '@/utilities/getURL'
import { RefreshRouteOnSave as PayloadLivePreview } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

/**
 * Standard Payload Live Preview component
 * Theo tài liệu chính thức: component này return null và chỉ lắng nghe window.postMessage
 * Không có UI, chỉ có logic refresh khi admin panel gửi events
 */
export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}

/**
 * Enhanced version với optional visual indicator
 * Chỉ hiển thị khi trong draft mode và có thể tùy chỉnh
 */
export const LivePreviewListenerWithIndicator: React.FC<{
  showIndicator?: boolean
  indicatorPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  indicatorText?: string
}> = ({ 
  showIndicator = false, 
  indicatorPosition = 'top-right',
  indicatorText = 'Live Preview Active'
}) => {
  const router = useRouter()
  
  return (
    <>
      {/* Standard Payload component */}
      <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
      
      {/* Optional visual indicator */}
      {showIndicator && (
        <div className={`live-preview-indicator live-preview-indicator--${indicatorPosition}`}>
          <div className="live-preview-indicator__dot"></div>
          <span className="live-preview-indicator__text">{indicatorText}</span>
          
          <style jsx>{`
            .live-preview-indicator {
              position: fixed;
              z-index: 9999;
              background: rgba(0, 0, 0, 0.8);
              color: white;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 12px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              gap: 8px;
              backdrop-filter: blur(4px);
            }
            
            .live-preview-indicator--top-left {
              top: 20px;
              left: 20px;
            }
            
            .live-preview-indicator--top-right {
              top: 20px;
              right: 20px;
            }
            
            .live-preview-indicator--bottom-left {
              bottom: 20px;
              left: 20px;
            }
            
            .live-preview-indicator--bottom-right {
              bottom: 20px;
              right: 20px;
            }
            
            .live-preview-indicator__dot {
              width: 8px;
              height: 8px;
              background: #10b981;
              border-radius: 50%;
              animation: pulse 2s infinite;
            }
            
            .live-preview-indicator__text {
              font-weight: 500;
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
            
            @media (max-width: 768px) {
              .live-preview-indicator {
                font-size: 11px;
                padding: 6px 10px;
              }
            }
          `}</style>
        </div>
      )}
    </>
  )
}
