import { useState, useEffect } from 'react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHeroSection } from '@/hooks/useHomepageSettings';
import type { BannerData } from '@/services/homepageSettingsService';

const HeroSection = () => {
  const { t } = useTranslation();
  // Hook automatically uses current locale for localized banner content
  const { settings, banners, isLoading, error, isEnabled } = useHeroSection();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Use localized fallback slides from translations
  const fallbackSlides: BannerData[] = [
    {
      id: '1',
      title: t('heroSection.fallbackSlides.slide1.title'),
      subtitle: t('heroSection.fallbackSlides.slide1.subtitle'),
      imageUrl: "https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      link: "/products/industrial",
      sortOrder: 1,
      isActive: true
    },
    {
      id: '2',
      title: t('heroSection.fallbackSlides.slide2.title'),
      subtitle: t('heroSection.fallbackSlides.slide2.subtitle'),
      imageUrl: "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      link: "/technology",
      sortOrder: 2,
      isActive: true
    },
    {
      id: '3',
      title: t('heroSection.fallbackSlides.slide3.title'),
      subtitle: t('heroSection.fallbackSlides.slide3.subtitle'),
      imageUrl: "https://images.unsplash.com/photo-1551038247-3d9af20df552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      link: "/services",
      sortOrder: 3,
      isActive: true
    }
  ];

  // Use API banners (localized) or fallback to default slides
  const slides = banners.length > 0 ? banners : fallbackSlides;
  const autoplayDelay = settings?.autoplayDelay || 6000;
  const autoplayEnabled = settings?.autoplay ?? true;

  useEffect(() => {
    if (!autoplayEnabled || slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, autoplayDelay);
    
    return () => clearInterval(interval);
  }, [autoplayEnabled, autoplayDelay, slides.length]);

  // Don't render if disabled in settings
  if (!isEnabled) {
    return null;
  }
  // Loading state
  if (isLoading) {
    return (
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t('heroSection.loading')}</span>
        </div>
      </section>
    );
  }

  // Error state with fallback
  if (error) {
    console.warn('Hero section API error, using fallback slides:', error);
  }

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="container-custom h-full flex items-center relative z-20">
            <div className="max-w-2xl text-white">
              <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl md:text-2xl mb-8">{slide.subtitle}</p>              <a 
                href={slide.link} 
                className="inline-flex items-center btn-secondary font-medium"
              >
                {t('heroSection.learnMore')}
                <ChevronRight size={20} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      ))}
      
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center">
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`${t('heroSection.goToSlide')} ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HeroSection;
