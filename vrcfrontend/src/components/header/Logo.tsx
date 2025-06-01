import { Link } from 'react-router-dom';
import { useCompanyInfo } from '@/hooks/useApi';
import { getLogoUrl } from '../../lib/api';

const Logo = () => {
  const { data: companyInfo, isLoading, error } = useCompanyInfo();

  // Use API data or fallback to defaults (giống Footer)
  const companyName = companyInfo?.companyName || 'VRC - Tổng công ty Kỹ thuật lạnh Việt Nam';
  
  // Sử dụng getLogoUrl() đơn giản như Footer component
  const logoUrl = getLogoUrl();

  // Loading state
  if (isLoading) {
    return (
      <Link to="/" className="flex items-center">
        <div className="h-[150px] w-32 bg-gray-200 animate-pulse rounded"></div>
      </Link>
    );
  }

  return (
    <Link to="/" className="flex items-center">
      <img 
        src={logoUrl} 
        alt="VRC - Tổng công ty Kỹ thuật lạnh Việt Nam" 
        className="h-[150px]"
        crossOrigin="anonymous"
        onError={(e) => {
          console.error('Logo failed to load:', logoUrl);
          // Fallback to default image
          e.currentTarget.src = '/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png';
        }}
      />
    </Link>
  );
};

export default Logo;