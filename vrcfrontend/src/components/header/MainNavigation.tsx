import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLink from '@/components/ui/app-link';

interface MainNavigationProps {
  isMobile?: boolean;
}

const MainNavigation = ({ isMobile = false }: MainNavigationProps) => {
  const { t } = useTranslation();
    // Navigation links that are used in both desktop and mobile views
  const navLinks = [
    { title: t('navigation.about'), routeKey: "ABOUT" },
    { title: t('navigation.services'), routeKey: "SERVICES" },
    { title: t('navigation.products'), routeKey: "PRODUCTS" },
    { title: t('navigation.projects'), routeKey: "PROJECTS" },
    { title: t('navigation.technologies'), routeKey: "TECHNOLOGIES" },
    { title: t('navigation.contact'), routeKey: "CONTACT" },
  ];
  
  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-4">        <AppLink routeKey="HOME" className="navbar-link text-lg">{t('navigation.home')}</AppLink>
        {navLinks.map((item, index) => (
          <AppLink key={index} routeKey={item.routeKey} className="navbar-link text-lg">{item.title}</AppLink>
        ))}        <AppLink routeKey="NEWS" className="navbar-link text-lg">{t('navigation.news')}</AppLink>
        <AppLink routeKey="EVENTS" className="navbar-link text-lg">{t('navigation.events')}</AppLink>
        <AppLink routeKey="FAQ" className="navbar-link text-lg">{t('navigation.faq')}</AppLink>
        <AppLink routeKey="CONSULTING" className="navbar-link text-lg">{t('navigation.consulting')}</AppLink>
      </nav>
    );
  }
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <AppLink routeKey="HOME" className="navbar-link text-base font-medium">{t('navigation.home')}</AppLink>
      {navLinks.map((item, index) => (
        <AppLink key={index} routeKey={item.routeKey} className="navbar-link text-base font-medium">{item.title}</AppLink>
      ))}      <div className="relative group">
        <button className="navbar-link text-base font-medium flex items-center">
          <span>{t('navigation.more')}</span>
          <ChevronDown size={16} className="ml-1" />
        </button>        <div className="absolute hidden group-hover:block bg-white/10 backdrop-blur-sm shadow-lg p-4 rounded min-w-40 right-0">
          <div className="flex flex-col space-y-2">            <AppLink routeKey="NEWS" className="text-primary hover:text-accent text-base">{t('navigation.news')}</AppLink>
            <AppLink routeKey="EVENTS" className="text-primary hover:text-accent text-base">{t('navigation.events')}</AppLink>
            <AppLink routeKey="FAQ" className="text-primary hover:text-accent text-base">{t('navigation.faq')}</AppLink>
            <AppLink routeKey="CONSULTING" className="text-primary hover:text-accent text-base">{t('navigation.consulting')}</AppLink>
            <hr className="border-gray-300 my-2" />
            <AppLink routeKey="INSTALLATION" className="text-primary hover:text-accent text-base">{t('navigation.installation')}</AppLink>
            <AppLink routeKey="MAINTENANCE" className="text-primary hover:text-accent text-base">{t('navigation.maintenance')}</AppLink>
            <AppLink routeKey="REPAIR" className="text-primary hover:text-accent text-base">{t('navigation.repair')}</AppLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;