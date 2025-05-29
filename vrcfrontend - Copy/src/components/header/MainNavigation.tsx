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
    { title: t('nav.about'), routeKey: "ABOUT" },
    { title: t('nav.services'), routeKey: "SERVICES" },
    { title: 'Sản phẩm', routeKey: "PRODUCTS" },
    { title: t('nav.projects'), routeKey: "PROJECTS" },
    { title: 'Công nghệ', routeKey: "TECHNOLOGIES" },
    { title: t('nav.contact'), routeKey: "CONTACT" },
  ];
  
  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-4">
        <AppLink routeKey="HOME" className="navbar-link text-lg">{t('nav.home')}</AppLink>
        {navLinks.map((item, index) => (
          <AppLink key={index} routeKey={item.routeKey} className="navbar-link text-lg">{item.title}</AppLink>
        ))}        <AppLink routeKey="NEWS" className="navbar-link text-lg">Tin tức</AppLink>
        <AppLink routeKey="EVENTS" className="navbar-link text-lg">Sự kiện</AppLink>
        <AppLink routeKey="CONSULTING" className="navbar-link text-lg">Tư vấn</AppLink>
      </nav>
    );
  }
  
  return (
    <nav className="hidden md:flex items-center space-x-8">
      <AppLink routeKey="HOME" className="navbar-link text-base font-medium">{t('nav.home')}</AppLink>
      {navLinks.map((item, index) => (
        <AppLink key={index} routeKey={item.routeKey} className="navbar-link text-base font-medium">{item.title}</AppLink>
      ))}      <div className="relative group">
        <button className="navbar-link text-base font-medium flex items-center">
          <span>More</span>
          <ChevronDown size={16} className="ml-1" />
        </button>
        <div className="absolute hidden group-hover:block bg-white/10 backdrop-blur-sm shadow-lg p-4 rounded min-w-40 right-0">
          <div className="flex flex-col space-y-2">
            <AppLink routeKey="NEWS" className="text-primary hover:text-accent text-base">Tin tức</AppLink>
            <AppLink routeKey="EVENTS" className="text-primary hover:text-accent text-base">Sự kiện</AppLink>
            <AppLink routeKey="CONSULTING" className="text-primary hover:text-accent text-base">Tư vấn</AppLink>
            <hr className="border-gray-300 my-2" />
            <AppLink routeKey="INSTALLATION" className="text-primary hover:text-accent text-base">Lắp đặt</AppLink>
            <AppLink routeKey="MAINTENANCE" className="text-primary hover:text-accent text-base">Bảo trì</AppLink>
            <AppLink routeKey="REPAIR" className="text-primary hover:text-accent text-base">Sửa chữa</AppLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;