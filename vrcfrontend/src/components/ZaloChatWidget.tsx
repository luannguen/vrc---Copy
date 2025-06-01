import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../styles/zalo-chat-widget.css';

interface ZaloChatWidgetProps {
  oaId: string;
  isOpen: boolean;
  onClose: () => void;
  welcomeMessage?: string;
  width?: number;
  height?: number;
}

declare global {
  interface Window {
    ZaloSocialSDK?: {
      reload: () => void;
    };
  }
}

const ZaloChatWidget: React.FC<ZaloChatWidgetProps> = ({
  oaId,
  isOpen,
  onClose,
  welcomeMessage = "Xin chào! Rất vui khi được hỗ trợ bạn.",
  width = 350,
  height = 420
}) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // Load Zalo Social SDK
  useEffect(() => {
    if (!window.ZaloSocialSDK) {
      const script = document.createElement('script');
      script.src = 'https://sp.zalo.me/plugins/sdk.js';
      script.async = true;
      script.onload = () => {
        setIsSDKLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsSDKLoaded(true);
    }
  }, []);

  // Reload widget when props change
  useEffect(() => {
    if (isSDKLoaded && isOpen && window.ZaloSocialSDK) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        window.ZaloSocialSDK?.reload();
      }, 100);
    }
  }, [isSDKLoaded, isOpen, oaId]);

  if (!isOpen || !oaId) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center">
            <img 
              src="/assets/svg/zalo.svg" 
              alt="Zalo" 
              className="w-6 h-6 mr-2 invert"
            />
            <span className="font-medium">Chat Zalo</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Đóng chat"
          >
            <X size={20} />
          </button>
        </div>        {/* Zalo Chat Widget */}
        <div 
          className="zalo-chat-widget"
          data-oaid={oaId}
          data-welcome-message={welcomeMessage}
          data-autopopup="0"
          data-width={width}
          data-height={height}
        >
          {/* Fallback loading */}
          {!isSDKLoaded && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Đang tải chat...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ZaloChatWidget;
