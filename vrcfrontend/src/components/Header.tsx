import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './header/Logo';
import MainNavigation from './header/MainNavigation';
import LanguageSwitcher from './header/LanguageSwitcher';
import SearchComponent from './header/SearchComponent';
import { useHeaderInfo } from '@/hooks/useApi';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { data: headerInfo, isLoading, error } = useHeaderInfo();
  
  // Debug log


  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Use API data or fallback to defaults
  const contactPhone = headerInfo?.contactSection?.phone || '+84 (28) 1234 5678';
  const socialLinks = headerInfo?.socialMedia || headerInfo?.socialMediaLinks || {};
  

  
  // Helper function to ensure URL has proper protocol
  const ensureHttps = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Helper function to format Zalo URL from phone number
  const formatZaloUrl = (phoneNumber: string) => {
    if (!phoneNumber) return '';
    
    // Remove all non-digit characters
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // If it starts with 84 (Vietnam country code), use as is
    // If it starts with 0, replace with 84
    // Otherwise, add 84 prefix
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
      // Old format - just URL string
      return { url: platform, enabled: true };
    } else if (typeof platform === 'object' && platform) {
      // New format - object with url and enabled
      return {
        url: platform.url || '',
        enabled: platform.enabled !== false // default to true if not specified
      };
    }
    return { url: '', enabled: false };
  };

  return (
    <>
      {/* TopContact integrated into Header */}
      <div className="bg-primary/10 backdrop-blur-sm border-b border-gray-200/20">
        <div className="container-custom">
          <div className="flex justify-end items-center py-1 text-sm">
            {/* Phone number */}
            <a href={`tel:${contactPhone.replace(/\s+/g, '')}`} className="flex items-center text-primary mr-6 hover:text-accent transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{contactPhone}</span>
            </a>

            {/* Social Media Links - All supported platforms */}
            {socialLinks && Object.keys(socialLinks).length > 0 && (
              <div className="flex items-center space-x-2">
              {/* Zalo */}
              {(() => {
                const zaloData = getSocialMedia(socialLinks.zalo);
                return zaloData.enabled && zaloData.url && (
                  <a 
                    href={formatZaloUrl(zaloData.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:opacity-80 transition-opacity"
                    aria-label="Zalo"
                  >
                    <img 
                      src="/assets/svg/zalo.svg" 
                      alt="Zalo" 
                      className="w-5 h-5" 
                    />
                  </a>
                );
              })()}

              {/* Facebook */}
              {(() => {
                const facebookData = getSocialMedia(socialLinks.facebook);
                return facebookData.enabled && facebookData.url && (
                  <a 
                    href={ensureHttps(facebookData.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:text-accent transition-colors"
                    aria-label="Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
                    </svg>
                  </a>
                );
              })()}

              {/* YouTube */}
              {(() => {
                const youtubeData = getSocialMedia(socialLinks.youtube);
                return youtubeData.enabled && youtubeData.url && (
                  <a 
                    href={ensureHttps(youtubeData.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-red-600 hover:text-red-700 transition-colors"
                    aria-label="YouTube"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                );
              })()}

              {/* Instagram */}
              {(() => {
                const instagramData = getSocialMedia(socialLinks.instagram);
                return instagramData.enabled && instagramData.url && (
                  <a 
                    href={ensureHttps(instagramData.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                );
              })()}

              {/* LinkedIn */}
              {(() => {
                const linkedinData = getSocialMedia(socialLinks.linkedin);
                return linkedinData.enabled && linkedinData.url && (
                  <a 
                    href={ensureHttps(linkedinData.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-700 hover:text-blue-800 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                );
              })()}

              {/* Twitter/X */}
              {(() => {
                const twitterData = getSocialMedia(socialLinks.twitter);
                return twitterData.enabled && twitterData.url && (
                  <a 
                    href={ensureHttps(twitterData.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-800 hover:text-gray-900 transition-colors"
                    aria-label="Twitter/X"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                );
              })()}

              {/* Telegram */}
              {(() => {
                const telegramData = getSocialMedia(socialLinks.telegram);
                return telegramData.enabled && telegramData.url && (
                  <a 
                    href={ensureHttps(telegramData.url)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                    aria-label="Telegram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                );
              })()}
            </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center text-primary ml-3">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            )}

            {/* Error indicator - only show in development */}
            {error && import.meta.env.DEV && (
              <div className="text-red-500 text-xs ml-3" title="Header API Error">
                ⚠️
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-primary/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-custom">
          <div className="flex justify-between items-center py-1.5">
            {/* Logo */}
            <Logo />

            {/* Desktop Navigation */}
            <MainNavigation />

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-4">
              <SearchComponent />
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <SearchComponent isMobile={true} />
              <button onClick={toggleMenu} className="text-white p-1">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-light/10 backdrop-blur-sm animate-slide-in-right">
            <div className="container-custom py-4">
              <MainNavigation isMobile={true} />
              <LanguageSwitcher isMobile={true} />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
