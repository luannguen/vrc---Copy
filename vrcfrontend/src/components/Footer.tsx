import { Facebook, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import AppLink from '@/components/ui/app-link';
import { useCompanyInfo } from '@/hooks/useApi';
import { getLogoUrl } from '@/lib/api';
import ZaloChatWidget from './ZaloChatWidget';

const Footer = () => {
  const { t } = useTranslation();
  const { data: companyInfo, isLoading, error } = useCompanyInfo();
  const [isZaloChatOpen, setIsZaloChatOpen] = useState(false);
  
  
  // Use API data or fallback to defaults
  const companyName = companyInfo?.companyName || 'VRC - Tổng công ty Kỹ thuật lạnh Việt Nam';
  const companyDescription = companyInfo?.companyDescription || 'Cung cấp giải pháp điện lạnh toàn diện cho mọi doanh nghiệp và công trình.';
  const contactInfo = companyInfo?.contactSection;
  const socialMedia = companyInfo?.socialMedia || companyInfo?.socialMediaLinks;
  
  // Sử dụng getLogoUrl() đơn giản như Logo component
  const logoUrl = getLogoUrl();
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
    <footer className="bg-primary text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>            <div className="mb-4">
              <img 
                src={logoUrl} 
                alt={companyName} 
                className="h-16"
                crossOrigin="anonymous"
              />
            </div>            <p className="text-gray-300 mb-6">
              {companyDescription}
            </p>
            <div className="flex flex-wrap gap-3">
              {(() => {
                const facebook = getSocialMedia(socialMedia?.facebook);
                return facebook.enabled && facebook.url && (
                  <a href={ensureHttps(facebook.url)} className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                    <Facebook size={20} />
                  </a>
                );
              })()}
              {(() => {
                const twitter = getSocialMedia(socialMedia?.twitter);
                return twitter.enabled && twitter.url && (
                  <a href={ensureHttps(twitter.url)} className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter/X" target="_blank" rel="noopener noreferrer">
                    <Twitter size={20} />
                  </a>
                );
              })()}
              {(() => {
                const linkedin = getSocialMedia(socialMedia?.linkedin);
                return linkedin.enabled && linkedin.url && (
                  <a href={ensureHttps(linkedin.url)} className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
                    <Linkedin size={20} />
                  </a>
                );
              })()}
              {(() => {
                const youtube = getSocialMedia(socialMedia?.youtube);
                return youtube.enabled && youtube.url && (
                  <a href={ensureHttps(youtube.url)} className="text-gray-300 hover:text-white transition-colors" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                    <Youtube size={20} />
                  </a>
                );
              })()}
              {(() => {
                const instagram = getSocialMedia(socialMedia?.instagram);
                return instagram.enabled && instagram.url && (
                  <a href={ensureHttps(instagram.url)} className="text-gray-300 hover:text-white transition-colors" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                );
              })()}              {(() => {
                const zalo = getSocialMedia(socialMedia?.zalo);
                const hasOAId = typeof socialMedia?.zalo === 'object' && socialMedia.zalo?.oaId;
                
                return zalo.enabled && zalo.url && (
                  hasOAId ? (
                    // If has OA ID, show chat widget
                    <button
                      onClick={() => setIsZaloChatOpen(true)}
                      className="text-gray-300 hover:text-white transition-colors"
                      aria-label="Chat Zalo"
                    >
                      <img src="/assets/svg/zalo.svg" alt="Zalo" className="w-5 h-5 inline-block invert" />
                    </button>
                  ) : (
                    // If no OA ID, use traditional link
                    <a href={formatZaloUrl(zalo.url)} className="text-gray-300 hover:text-white transition-colors" aria-label="Zalo" target="_blank" rel="noopener noreferrer">
                      <img src="/assets/svg/zalo.svg" alt="Zalo" className="w-5 h-5 inline-block invert" />
                    </a>
                  )
                );
              })()}
              {(() => {
                const telegram = getSocialMedia(socialMedia?.telegram);
                return telegram.enabled && telegram.url && (
                  <a href={ensureHttps(telegram.url)} className="text-gray-300 hover:text-white transition-colors" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </a>
                );
              })()}
            </div>
            {/* Loading/Error indicators */}
            {isLoading && (
              <div className="mt-4 flex items-center text-gray-400">
                <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
                <span className="text-sm">{t('common.loading')}</span>
              </div>
            )}
            {error && import.meta.env.DEV && (
              <div className="mt-4 text-red-400 text-xs" title="Company API Error">
                ⚠️ {t('common.error')}
              </div>
            )}
          </div>
          
          {/* Column 2 */}          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><AppLink routeKey="ABOUT" className="footer-link">{t('navigation.about')}</AppLink></li>
              <li><AppLink routeKey="SERVICES" className="footer-link">{t('navigation.services')}</AppLink></li>
              <li><AppLink routeKey="PROJECTS" className="footer-link">{t('navigation.projects')}</AppLink></li>
              <li><AppLink routeKey="NEWS" className="footer-link">{t('footer.newsEvents')}</AppLink></li>
              <li><AppLink routeKey="CONTACT" className="footer-link">{t('navigation.contact')}</AppLink></li>
            </ul>
          </div>
          
          {/* Column 3 */}          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li><AppLink routeKey="INSTALLATION" className="footer-link">{t('navigation.installation')}</AppLink></li>
              <li><AppLink routeKey="MAINTENANCE" className="footer-link">{t('navigation.maintenance')}</AppLink></li>
              <li><AppLink routeKey="REPAIR" className="footer-link">{t('navigation.repair')}</AppLink></li>
              <li><AppLink routeKey="CONSULTING" className="footer-link">{t('navigation.consulting')}</AppLink></li>
              <li><AppLink routeKey="SERVICE_SUPPORT" className="footer-link">{t('footer.support')}</AppLink></li>
            </ul>
          </div>
          
          {/* Column 4 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.contact')}</h4>
            <address className="not-italic text-gray-300 mb-4 space-y-2">
              <p>{companyName}</p>
              {contactInfo?.address && <p>{contactInfo.address}</p>}
              {contactInfo?.workingHours && <p>{contactInfo.workingHours}</p>}
            </address>
            {contactInfo?.email && (
              <a 
                href={`mailto:${contactInfo.email}`} 
                className="inline-flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <Mail size={16} className="mr-2" />
                {contactInfo.email}
              </a>
            )}
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} {companyName}. {t('footer.rights')}.
          </p>          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <AppLink routeKey="PRIVACY" className="footer-link">{t('footer.privacyPolicy')}</AppLink>
            <AppLink routeKey="TERMS" className="footer-link">{t('footer.termsOfService')}</AppLink>
            <AppLink routeKey="COOKIES" className="footer-link">{t('footer.cookiePolicy')}</AppLink>
            <AppLink routeKey="SITEMAP" className="footer-link">{t('footer.sitemap')}</AppLink>
          </div></div>
      </div>
      
      {/* Zalo Chat Widget */}
      {typeof socialMedia?.zalo === 'object' && socialMedia.zalo?.oaId && (
        <ZaloChatWidget
          oaId={socialMedia.zalo.oaId}
          isOpen={isZaloChatOpen}
          onClose={() => setIsZaloChatOpen(false)}
          welcomeMessage="Xin chào! Chúng tôi có thể hỗ trợ gì cho bạn?"
        />
      )}
    </footer>
  );
};

export default Footer;
