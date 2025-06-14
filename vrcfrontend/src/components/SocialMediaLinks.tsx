/**
 * Reusable Social Media Links Component
 * Used in Header and Contact page with shared settings and widgets
 */

import React from 'react';

// Type definitions for social media links
interface SocialMediaItem {
  url?: string;
  enabled?: boolean;
  oaId?: string; // For Zalo OA ID
}

interface SocialLinksData {
  facebook?: string | SocialMediaItem;
  youtube?: string | SocialMediaItem;
  instagram?: string | SocialMediaItem;
  linkedin?: string | SocialMediaItem;
  twitter?: string | SocialMediaItem;
  telegram?: string | SocialMediaItem;
  zalo?: string | SocialMediaItem;
}

interface SocialLinksProps {
  socialLinks: SocialLinksData;
  size?: 'small' | 'medium' | 'large';
  showLabels?: boolean;
  onZaloChatOpen?: () => void;
}

const SocialMediaLinks: React.FC<SocialLinksProps> = ({ 
  socialLinks, 
  size = 'medium', 
  showLabels = false,
  onZaloChatOpen 
}) => {
  // Size mappings
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5', 
    large: 'w-6 h-6'
  };

  const iconSize = sizeClasses[size];

  // Helper function to ensure HTTPS
  const ensureHttps = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      return `https://${url}`;
    }
    return url;
  };
  // Helper function to format Zalo URL
  const formatZaloUrl = (phoneNumber: string): string => {
    if (!phoneNumber) return '';
    
    const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
    let formattedPhone = cleanPhone;
    
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '84' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('84')) {
      formattedPhone = '84' + cleanPhone;
    }
    
    return `https://zalo.me/${formattedPhone}`;
  };

  // Helper function to get social media URL and enabled status
  const getSocialMedia = (platform: string | { url?: string; enabled?: boolean } | null | undefined): { url: string; enabled: boolean } => {
    if (typeof platform === 'string') {
      return { url: platform, enabled: true };
    } else if (typeof platform === 'object' && platform) {
      return {
        url: platform.url || '',
        enabled: platform.enabled !== false
      };
    }
    return { url: '', enabled: false };
  };

  if (!socialLinks || Object.keys(socialLinks).length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Zalo */}
      {(() => {
        const zaloData = getSocialMedia(socialLinks.zalo);
        const hasOAId = typeof socialLinks.zalo === 'object' && socialLinks.zalo?.oaId;
        
        return zaloData.enabled && zaloData.url && (
          <div key="zalo" className="flex items-center">
            {hasOAId && onZaloChatOpen ? (
              // If has OA ID and chat handler, show chat widget
              <button
                onClick={onZaloChatOpen}
                className="flex items-center hover:opacity-80 transition-opacity group"
                aria-label="Chat Zalo"
              >
                <img 
                  src="/assets/svg/zalo.svg" 
                  alt="Zalo" 
                  className={iconSize} 
                />
                {showLabels && <span className="ml-2 text-sm group-hover:text-blue-600">Zalo</span>}
              </button>
            ) : (
              // If no OA ID, use traditional link
              <a 
                href={formatZaloUrl(zaloData.url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center hover:opacity-80 transition-opacity group"
                aria-label="Zalo"
              >
                <img 
                  src="/assets/svg/zalo.svg" 
                  alt="Zalo" 
                  className={iconSize} 
                />
                {showLabels && <span className="ml-2 text-sm group-hover:text-blue-600">Zalo</span>}
              </a>
            )}
          </div>
        );
      })()}

      {/* Facebook */}
      {(() => {
        const facebookData = getSocialMedia(socialLinks.facebook);
        return facebookData.enabled && facebookData.url && (
          <a 
            key="facebook"
            href={ensureHttps(facebookData.url)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors group"
            aria-label="Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
            </svg>
            {showLabels && <span className="ml-2 text-sm group-hover:text-blue-800">Facebook</span>}
          </a>
        );
      })()}

      {/* YouTube */}
      {(() => {
        const youtubeData = getSocialMedia(socialLinks.youtube);
        return youtubeData.enabled && youtubeData.url && (
          <a 
            key="youtube"
            href={ensureHttps(youtubeData.url)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-red-600 hover:text-red-700 transition-colors group"
            aria-label="YouTube"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            {showLabels && <span className="ml-2 text-sm group-hover:text-red-700">YouTube</span>}
          </a>
        );
      })()}

      {/* Instagram */}
      {(() => {
        const instagramData = getSocialMedia(socialLinks.instagram);
        return instagramData.enabled && instagramData.url && (
          <a 
            key="instagram"
            href={ensureHttps(instagramData.url)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-pink-600 hover:text-pink-800 transition-colors group"
            aria-label="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C9.284 2 8.944 2.01133 7.87733 2.06C6.81267 2.10867 6.08533 2.278 5.45 2.525C4.78267 2.77667 4.178 3.1225 3.678 3.678C3.12167 4.178 2.77667 4.78267 2.525 5.45C2.278 6.086 2.10867 6.81267 2.06 7.878C2.01133 8.944 2 9.284 2 12C2 14.716 2.01133 15.056 2.06 16.1227C2.10867 17.1873 2.278 17.9147 2.525 18.55C2.77667 19.218 3.1225 19.822 3.678 20.322C4.178 20.8783 4.78267 21.2233 5.45 21.475C6.086 21.722 6.81267 21.8913 7.878 21.94C8.944 21.9887 9.284 22 12 22C14.716 22 15.056 21.9887 16.1227 21.94C17.1873 21.8913 17.9147 21.722 18.55 21.475C19.218 21.2233 19.822 20.8775 20.322 20.322C20.8783 19.822 21.2233 19.218 21.475 18.55C21.722 17.9147 21.8913 17.1873 21.94 16.1227C21.9887 15.056 22 14.716 22 12C22 9.284 21.9887 8.944 21.94 7.87733C21.8913 6.81267 21.722 6.08533 21.475 5.45C21.2233 4.78267 20.8775 4.178 20.322 3.678C19.822 3.12167 19.218 2.77667 18.55 2.525C17.9147 2.278 17.1873 2.10867 16.1227 2.06C15.056 2.01133 14.716 2 12 2ZM12 3.802C14.67 3.802 14.9867 3.812 16.0413 3.86C17.016 3.90467 17.5453 4.066 17.898 4.2047C18.365 4.38533 18.6987 4.60267 19.05 4.95C19.3973 5.30133 19.6147 5.635 19.7953 6.102C19.934 6.45467 20.0953 6.984 20.14 7.95867C20.188 9.01333 20.198 9.33 20.198 12C20.198 14.67 20.188 14.9867 20.14 16.0413C20.0953 17.016 19.934 17.5453 19.7953 17.898C19.6147 18.365 19.3973 18.6987 19.05 19.05C18.6987 19.3973 18.365 19.6147 17.898 19.7953C17.5453 19.934 17.016 20.0953 16.0413 20.14C14.9867 20.188 14.6707 20.198 12 20.198C9.32933 20.198 9.01333 20.188 7.95867 20.14C6.984 20.0953 6.45467 19.934 6.102 19.7953C5.635 19.6147 5.30133 19.3973 4.95 19.05C4.60267 18.6987 4.38533 18.365 4.2047 17.898C4.066 17.5453 3.90467 17.016 3.86 16.0413C3.812 14.9867 3.802 14.67 3.802 12C3.802 9.33 3.812 9.01333 3.86 7.95867C3.90467 6.984 4.066 6.45467 4.2047 6.102C4.38533 5.635 4.60267 5.30133 4.95 4.95C5.30133 4.60267 5.635 4.38533 6.102 4.2047C6.45467 4.066 6.984 3.90467 7.95867 3.86C9.01333 3.812 9.33 3.802 12 3.802Z"></path>
              <path d="M12 15.334C10.1591 15.334 8.66602 13.8409 8.66602 12C8.66602 10.1591 10.1591 8.66602 12 8.66602C13.8409 8.66602 15.334 10.1591 15.334 12C15.334 13.8409 13.8409 15.334 12 15.334ZM12 6.86602C9.16469 6.86602 6.86602 9.16469 6.86602 12C6.86602 14.8353 9.16469 17.134 12 17.134C14.8353 17.134 17.134 14.8353 17.134 12C17.134 9.16469 14.8353 6.86602 12 6.86602Z"></path>
              <path d="M18.5381 6.66399C18.5381 7.32475 18.0022 7.86066 17.3414 7.86066C16.6807 7.86066 16.1448 7.32475 16.1448 6.66399C16.1448 6.00325 16.6807 5.46733 17.3414 5.46733C18.0022 5.46733 18.5381 6.00325 18.5381 6.66399Z"></path>
            </svg>
            {showLabels && <span className="ml-2 text-sm group-hover:text-pink-800">Instagram</span>}
          </a>
        );
      })()}

      {/* LinkedIn */}
      {(() => {
        const linkedinData = getSocialMedia(socialLinks.linkedin);
        return linkedinData.enabled && linkedinData.url && (
          <a 
            key="linkedin"
            href={ensureHttps(linkedinData.url)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-700 hover:text-blue-900 transition-colors group"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.94 5.00002C6.93974 5.53046 6.72877 6.03906 6.35351 6.41394C5.97825 6.78883 5.46944 6.99929 4.939 6.99902C4.40857 6.99876 3.89997 6.78779 3.52508 6.41253C3.1502 6.03727 2.93974 5.52846 2.94 4.99802C2.94027 4.46759 3.15124 3.95899 3.5265 3.5841C3.90176 3.20922 4.41057 2.99876 4.941 2.99902C5.47144 2.99929 5.98004 3.21026 6.35492 3.58552C6.72981 3.96078 6.94027 4.46959 6.94 5.00002ZM7 8.48002H3V21H7V8.48002ZM13.32 8.48002H9.34V21H13.28V14.43C13.28 10.77 18.05 10.43 18.05 14.43V21H22V13.07C22 6.90002 14.94 7.13002 13.28 10.16L13.32 8.48002Z"></path>
            </svg>
            {showLabels && <span className="ml-2 text-sm group-hover:text-blue-900">LinkedIn</span>}
          </a>
        );
      })()}

      {/* Twitter/X */}
      {(() => {
        const twitterData = getSocialMedia(socialLinks.twitter);
        return twitterData.enabled && twitterData.url && (
          <a 
            key="twitter"
            href={ensureHttps(twitterData.url)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-400 hover:text-blue-600 transition-colors group"
            aria-label="Twitter/X"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.162 5.65593C21.3985 5.99362 20.589 6.2154 19.76 6.31393C20.6337 5.79136 21.2877 4.96894 21.6 3.99993C20.78 4.48793 19.881 4.82993 18.944 5.01493C18.3146 4.34151 17.4803 3.89489 16.5709 3.74451C15.6615 3.59413 14.7279 3.74842 13.9153 4.18338C13.1026 4.61834 12.4564 5.30961 12.0771 6.14972C11.6978 6.98983 11.6067 7.93171 11.818 8.82893C10.1551 8.74558 8.52832 8.31345 7.04328 7.56059C5.55823 6.80773 4.24812 5.75097 3.19799 4.45893C2.82628 5.09738 2.63095 5.82315 2.63199 6.56193C2.63199 8.01193 3.36999 9.29293 4.49199 10.0429C3.828 10.022 3.17862 9.84271 2.59799 9.51993V9.57193C2.59819 10.5376 2.93236 11.4735 3.54384 12.221C4.15532 12.9684 5.00647 13.4814 5.95299 13.6729C5.33661 13.84 4.6903 13.8646 4.06299 13.7449C4.32986 14.5762 4.85 15.3031 5.55058 15.824C6.25117 16.345 7.09712 16.6337 7.96999 16.6499C7.10247 17.3313 6.10917 17.8349 5.04687 18.1321C3.98458 18.4293 2.87412 18.5142 1.77899 18.3819C3.69069 19.6114 5.91609 20.2641 8.18899 20.2619C15.882 20.2619 20.089 13.8889 20.089 8.36193C20.089 8.18193 20.084 7.99993 20.076 7.82193C20.8949 7.23009 21.6016 6.49695 22.163 5.65693L22.162 5.65593Z"></path>
            </svg>
            {showLabels && <span className="ml-2 text-sm group-hover:text-blue-600">Twitter</span>}
          </a>
        );
      })()}

      {/* Telegram */}
      {(() => {
        const telegramData = getSocialMedia(socialLinks.telegram);
        return telegramData.enabled && telegramData.url && (
          <a 
            key="telegram"
            href={ensureHttps(telegramData.url)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-500 hover:text-blue-700 transition-colors group"
            aria-label="Telegram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={iconSize} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8C16.49 10.38 15.84 14.22 15.51 15.99C15.37 16.74 15.09 16.99 14.83 17.02C14.25 17.07 13.81 16.64 13.25 16.27C12.37 15.69 11.87 15.33 11.02 14.77C10.03 14.12 10.67 13.76 11.24 13.18C11.39 13.03 13.95 10.7 14 10.49C14.0069 10.4582 14.0069 10.4252 14 10.3933C13.9931 10.3614 13.9796 10.3322 13.96 10.31C13.89 10.26 13.81 10.28 13.74 10.29C13.65 10.31 12.25 11.24 9.52 13.08C9.1 13.35 8.72 13.49 8.38 13.48C8.01 13.47 7.29 13.29 6.76 13.13C6.1 12.94 5.59 12.84 5.63 12.47C5.65 12.28 5.91 12.08 6.4 11.88C9.38 10.54 11.35 9.66 12.32 9.22C14.89 7.92 15.42 7.75 15.78 7.75C15.86 7.75 16.04 7.77 16.15 7.86C16.24 7.94 16.26 8.05 16.27 8.13C16.27 8.22 16.25 8.55 16.24 8.8H16.64Z"></path>
            </svg>
            {showLabels && <span className="ml-2 text-sm group-hover:text-blue-700">Telegram</span>}
          </a>
        );
      })()}
    </div>
  );
};

export default SocialMediaLinks;
