import ContactForm from "@/components/ContactForm";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import ZaloChatWidget from "@/components/ZaloChatWidget";
import { useCompanyInfo } from "@/hooks/useApi";
import { useState } from "react";

const Contact = () => {  
  const { data: companyInfo, isLoading, error } = useCompanyInfo();
  const [isZaloChatOpen, setIsZaloChatOpen] = useState(false);
  
  // Extract data with fallbacks
  const companyName = companyInfo?.companyName || 'Tổng công ty Kỹ thuật lạnh Việt Nam (VRC)';
  const companyDescription = companyInfo?.companyDescription || 'Tiên phong trong lĩnh vực kỹ thuật lạnh tại Việt Nam';
  const contactSection = companyInfo?.contactSection;
  const socialMedia = companyInfo?.socialMedia || companyInfo?.socialMediaLinks || {};
  const mapsInfo = companyInfo?.maps;

  // Extract URL from iframe string if needed
  const getMapsSrc = () => {
    if (mapsInfo?.googleMapsEmbed) {
      // If it's a full iframe string, extract the src URL
      const srcMatch = mapsInfo.googleMapsEmbed.match(/src="([^"]+)"/);
      if (srcMatch) {
        return srcMatch[1];
      }
      // If it's already just a URL
      return mapsInfo.googleMapsEmbed;
    }
    
    // Fallback to coordinates
    if (mapsInfo?.latitude && mapsInfo?.longitude) {
      return `https://maps.google.com/maps?q=${mapsInfo.latitude},${mapsInfo.longitude}&hl=vi&z=${mapsInfo.mapZoom || 15}&output=embed`;
    }
    
    // Final fallback to address
    return `https://maps.google.com/maps?q=${encodeURIComponent(contactSection?.address || 'VRC Vietnam, Ho Chi Minh City')}&hl=vi&z=15&output=embed`;
  };

  if (isLoading) {
    return (
      <main className="flex-grow">
        <div className="container-custom py-8 md:py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <div className="bg-gray-200 h-96 rounded-lg"></div>
              </div>
              <div className="lg:col-span-7">
                <div className="bg-gray-200 h-96 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      <div className="container-custom py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Liên hệ</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-primary mb-4">Thông tin liên hệ</h2>
                <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg text-primary">{companyName}</h3>
                  <p className="text-gray-600">{companyDescription}</p>
                </div>
                
                <div>
                  <h3 className="font-medium">Địa chỉ:</h3>
                  <p className="text-gray-600">{contactSection?.address || '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactSection?.phone && (
                    <div>
                      <h3 className="font-medium">Điện thoại:</h3>
                      <p className="text-gray-600">{contactSection.phone}</p>
                    </div>
                  )}
                  
                  {contactSection?.email && (
                    <div>
                      <h3 className="font-medium">Email:</h3>
                      <p className="text-gray-600">{contactSection.email}</p>
                    </div>
                  )}
                  
                  {contactSection?.hotline && (
                    <div>
                      <h3 className="font-medium">Hotline:</h3>
                      <p className="text-gray-600">{contactSection.hotline}</p>
                    </div>
                  )}
                  
                  {contactSection?.workingHours && (
                    <div>
                      <h3 className="font-medium">Giờ làm việc:</h3>
                      <p className="text-gray-600">{contactSection.workingHours}</p>
                    </div>
                  )}
                </div>              </div>
                <div className="mt-6">
                <h3 className="font-medium mb-2">Kết nối với chúng tôi:</h3>                <SocialMediaLinks 
                  socialLinks={socialMedia} 
                  size="medium" 
                  showLabels={false}
                  onZaloChatOpen={() => setIsZaloChatOpen(true)}
                />
              </div>
            </div>            <div className="mt-8">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">Bản đồ</h2>
                
                {/* Google Maps Embed iframe */}                <div className="aspect-video w-full rounded-lg overflow-hidden border border-gray-200 mb-4">
                  <iframe
                    src={getMapsSrc()}
                    width="100%"
                    height="100%"
                    className="border-0"
                    allowFullScreen={mapsInfo?.showMapControls !== false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Bản đồ vị trí ${companyName}`}
                  ></iframe>
                </div>

                {/* Location Info */}
                <div className="space-y-3">
                  {contactSection?.address && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">📍 Địa chỉ:</h3>
                      <p className="text-gray-600 pl-6">{contactSection.address}</p>
                    </div>
                  )}
                  
                  {(mapsInfo?.latitude && mapsInfo?.longitude) && (
                    <div>
                      <h3 className="font-medium text-gray-700 mb-1">🌐 Tọa độ:</h3>
                      <p className="text-gray-600 pl-6">
                        Vĩ độ: {mapsInfo.latitude}, Kinh độ: {mapsInfo.longitude}
                      </p>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={
                        mapsInfo?.latitude && mapsInfo?.longitude
                          ? `https://maps.google.com/maps?q=${mapsInfo.latitude},${mapsInfo.longitude}&hl=vi`
                          : `https://maps.google.com/maps?q=${encodeURIComponent(contactSection?.address || 'VRC Vietnam')}&hl=vi`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Xem trên Google Maps
                    </a>
                    
                    <a
                      href={
                        mapsInfo?.latitude && mapsInfo?.longitude
                          ? `https://maps.google.com/maps/dir//${mapsInfo.latitude},${mapsInfo.longitude}/@${mapsInfo.latitude},${mapsInfo.longitude},15z/data=!4m2!4m1!3e0`
                          : `https://maps.google.com/maps/dir//${encodeURIComponent(contactSection?.address || 'VRC Vietnam')}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                      </svg>
                      Chỉ đường đến đây
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-7">
            <ContactForm />          </div>
        </div>
      </div>        {/* Zalo Chat Widget */}
      {typeof socialMedia?.zalo === 'object' && socialMedia.zalo?.oaId && (
        <ZaloChatWidget
          oaId={socialMedia.zalo.oaId}
          isOpen={isZaloChatOpen}
          onClose={() => setIsZaloChatOpen(false)}
        />
      )}
    </main>
  );
};

export default Contact;