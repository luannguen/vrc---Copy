import { useState, useEffect } from 'react';

interface SafeGoogleMapsProps {
  mapsInfo?: {
    googleMapsEmbed?: string;
    latitude?: number;
    longitude?: number;
    mapZoom?: number;
    showMapControls?: boolean;
  };
  contactSection?: {
    address?: string;
  };
  companyName: string;
}

const SafeGoogleMaps: React.FC<SafeGoogleMapsProps> = ({ 
  mapsInfo, 
  contactSection, 
  companyName 
}) => {
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log('🗺️ SafeGoogleMaps props:', { mapsInfo, contactSection, companyName });
    
  useEffect(() => {
    // Auto-hide loading state after 5 seconds regardless of iframe events
    const loadingTimer = setTimeout(() => {
      console.log('⏰ Auto-hiding loading state after 5 seconds');
      setIsLoading(false);
      if (!mapLoaded) {
        setMapLoaded(true);
      }
    }, 5000);

    // Show error if map doesn't load within 10 seconds
    const errorTimer = setTimeout(() => {
      if (!mapLoaded && !mapError) {
        console.warn('⏰ Google Maps loading timeout, showing error state');
        setMapError(true);
        setIsLoading(false);
      }
    }, 10000);

    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(errorTimer);
    };
  }, [mapLoaded, mapError]);
    // Generate a cleaner, more reliable Google Maps URL (without API key)
  const getCleanMapsSrc = () => {
    console.log('🔧 Generating maps URL...');
    try {
      // Use coordinates if available (most reliable)
      if (mapsInfo?.latitude && mapsInfo?.longitude) {
        // Use proper Google Maps Embed URL format
        const url = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${mapsInfo.longitude}!3d${mapsInfo.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zM!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s`;
        console.log('📍 Using Google Embed URL:', url);
        return url;
      }
      
      // Fallback to address search
      if (contactSection?.address) {
        const encodedAddress = encodeURIComponent(contactSection.address);
        const url = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d0!3d0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s${encodedAddress}!2s!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s`;
        console.log('📍 Using address embed URL:', url);
        return url;
      }
      
      // Final fallback - basic location
      const url = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.992!2d106.718!3d10.735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f87b701aaab:0x126e9a25d39f1263!2sHo%20Chi%20Minh%20City%2C%20Vietnam!5e0!3m2!1sen!2s!4v${Date.now()}!5m2!1sen!2s`;
      console.log('📍 Using fallback embed URL:', url);
      return url;
    } catch (error) {
      console.error('❌ Error generating Maps URL:', error);
      setMapError(true);
      return '';
    }
  };
  const handleIframeLoad = () => {
    console.log('✅ Google Maps iframe loaded successfully');
    setMapLoaded(true);
    setMapError(false);
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.error('❌ Google Maps iframe failed to load');
    setMapError(true);
    setIsLoading(false);
  };

  if (mapError) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 mb-4 bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Không thể tải bản đồ</h3>
          <p className="text-gray-500 mb-4">Bản đồ Google Maps tạm thời không khả dụng</p>
          <div className="space-y-2">
            {contactSection?.address && (
              <p className="text-sm text-gray-600">
                📍 <strong>Địa chỉ:</strong> {contactSection.address}
              </p>
            )}
            {mapsInfo?.latitude && mapsInfo?.longitude && (
              <p className="text-sm text-gray-600">
                🌐 <strong>Tọa độ:</strong> {mapsInfo.latitude}, {mapsInfo.longitude}
              </p>
            )}
          </div>
          <a
            href={
              mapsInfo?.latitude && mapsInfo?.longitude
                ? `https://maps.google.com/maps?q=${mapsInfo.latitude},${mapsInfo.longitude}`
                : `https://maps.google.com/maps?q=${encodeURIComponent(contactSection?.address || 'VRC Vietnam')}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Mở trong Google Maps
          </a>
        </div>
      </div>
    );  }
  
  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 mb-4 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bản đồ...</p>
          </div>
        </div>
      )}
      <iframe
        src={getCleanMapsSrc()}
        width="100%"
        height="100%"
        className="border-0"
        allowFullScreen={mapsInfo?.showMapControls !== false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Bản đồ vị trí ${companyName}`}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      />
    </div>
  );
};

export default SafeGoogleMaps;
