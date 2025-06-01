import React, { useState, useEffect } from 'react';
import { X, MessageCircle } from 'lucide-react';
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
  width = 360,
  height = 480
}) => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Load Zalo Social SDK
  useEffect(() => {
    if (!window.ZaloSocialSDK) {
      const script = document.createElement('script');
      script.src = 'https://sp.zalo.me/plugins/sdk.js';
      script.async = true;
      script.onload = () => {
        setIsSDKLoaded(true);
        // Give a moment for the SDK to initialize
        setTimeout(() => setIsLoading(false), 800);
      };
      script.onerror = () => {
        setIsLoading(false);
        console.error('Failed to load Zalo SDK');
      };
      document.head.appendChild(script);
    } else {
      setIsSDKLoaded(true);
      setTimeout(() => setIsLoading(false), 500);
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
      {/* Overlay with fade animation */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Chat Widget Container */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Close button - floating outside */}
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 z-10"
            aria-label="Đóng chat"
          >
            <X size={16} />
          </button>

          {/* Widget Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center shadow-lg">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <MessageCircle size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Chat với chúng tôi</h3>
              <p className="text-blue-100 text-xs">Hỗ trợ trực tuyến 24/7</p>
            </div>
            <div className="ml-auto">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Chat Widget Body */}
          <div 
            className="zalo-chat-widget relative"
            data-oaid={oaId}
            data-welcome-message={welcomeMessage}
            data-autopopup="0"
            data-width={width}
            data-height={height}
          >
            {/* Loading State */}
            {isLoading && (
              <div className="zalo-chat-loading">
                <div className="text-center space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
                      <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Đang kết nối...</p>
                    <p className="text-xs text-gray-500 mt-1">Vui lòng chờ trong giây lát</p>
                  </div>
                </div>
              </div>
            )}

            {/* Zalo SDK will inject content here */}
            {!isLoading && !isSDKLoaded && (
              <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <X size={24} className="text-red-500" />
                  </div>
                  <p className="text-gray-600 font-medium">Không thể tải chat</p>
                  <p className="text-gray-500 text-sm mt-1">Vui lòng thử lại sau</p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Tải lại
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Widget Footer */}
          <div className="bg-gray-50 border-t px-4 py-3 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Powered by Zalo</span>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>    </>
  );
};

export default ZaloChatWidget;
