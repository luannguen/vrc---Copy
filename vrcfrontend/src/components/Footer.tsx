import { Facebook, Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLink from '@/components/ui/app-link';
import { useCompanyInfo } from '@/hooks/useApi';
import { getLogoUrl } from '@/lib/api';

const Footer = () => {
  const { t } = useTranslation();
  const { data: companyInfo, isLoading, error } = useCompanyInfo();

  // Use API data or fallback to defaults
  const companyName = companyInfo?.companyName || 'VRC - Tổng công ty Kỹ thuật lạnh Việt Nam';
  const companyDescription = companyInfo?.companyDescription || 'Cung cấp giải pháp điện lạnh toàn diện cho mọi doanh nghiệp và công trình.';
  const contactInfo = companyInfo?.contactSection;
  const socialLinks = companyInfo?.socialMediaLinks || {};
  
  // Sử dụng getLogoUrl() đơn giản như Logo component
  const logoUrl = getLogoUrl();

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
            </div>
            <p className="text-gray-300 mb-6">
              {companyDescription}
            </p>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} className="text-gray-300 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} className="text-gray-300 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} className="text-gray-300 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin size={20} />
                </a>
              )}
              {socialLinks.youtube && (
                <a href={socialLinks.youtube} className="text-gray-300 hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              )}
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
          
          {/* Column 2 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li><AppLink routeKey="ABOUT" className="footer-link">{t('nav.about')}</AppLink></li>
              <li><AppLink routeKey="SERVICES" className="footer-link">{t('nav.services')}</AppLink></li>
              <li><AppLink routeKey="PROJECTS" className="footer-link">{t('nav.projects')}</AppLink></li>
              <li><AppLink routeKey="NEWS" className="footer-link">News & Events</AppLink></li>
              <li><AppLink routeKey="CONTACT" className="footer-link">{t('nav.contact')}</AppLink></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2">
              <li><AppLink routeKey="INSTALLATION" className="footer-link">Installation</AppLink></li>
              <li><AppLink routeKey="MAINTENANCE" className="footer-link">Maintenance</AppLink></li>
              <li><AppLink routeKey="REPAIR" className="footer-link">Repair</AppLink></li>
              <li><AppLink routeKey="CONSULTING" className="footer-link">Consulting</AppLink></li>
              <li><AppLink routeKey="SERVICE_SUPPORT" className="footer-link">Support</AppLink></li>
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
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
            <AppLink routeKey="PRIVACY" className="footer-link">Privacy Policy</AppLink>
            <AppLink routeKey="TERMS" className="footer-link">Terms of Service</AppLink>
            <AppLink routeKey="COOKIES" className="footer-link">Cookie Policy</AppLink>
            <AppLink routeKey="SITEMAP" className="footer-link">Sitemap</AppLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
