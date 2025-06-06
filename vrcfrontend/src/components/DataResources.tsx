
import { LineChart, BarChart3, Gauge, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDataResourcesSection } from '../hooks/useHomepageSettings';

const DataResources = () => {
  const { t } = useTranslation();
  
  // Hook automatically uses current locale for localized panel titles and descriptions
  const { settings: dataResourcesData, isLoading, error, isEnabled } = useDataResourcesSection();
  
  // Fallback data if API fails - use translation keys
  const fallbackData = {
    enabled: true,
    leftPanel: {
      title: t('dataResources.leftPanel.title'),
      linkUrl: "/data/statistics"
    },
    rightPanel: {
      title: t('dataResources.rightPanel.title'), 
      linkUrl: "/data/tools"
    }
  };

  // Use API data (localized) or fallback
  const sectionData = dataResourcesData || fallbackData;

  if (error) {
    console.warn('DataResources API error, using fallback data:', error);
  }
  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t('dataResources.loading')}</span>
          </div>
        </div>
      </section>
    );
  }return (
    <section className="py-16 bg-white">
      <div className="container-custom">        <div className="mb-12">
          <h2 className="mb-4">{t('dataResources.sectionTitle')}</h2>
          <p className="text-muted-foreground max-w-2xl">
            {t('dataResources.sectionSubtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Data & Statistics */}
          <div className="bg-muted p-8 rounded-lg">
            <div className="flex items-start mb-6">
              <div className="bg-primary rounded-full p-3 mr-4">
                <LineChart className="text-white w-6 h-6" />
              </div>              <div>
                <h3 className="text-xl font-semibold mb-2">{sectionData?.leftPanel?.title || t('dataResources.leftPanel.title')}</h3>
                <p className="text-muted-foreground">
                  {t('dataResources.leftPanel.description')}
                </p>
              </div>
            </div>            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>{t('dataResources.leftPanel.features.feature1')}</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>{t('dataResources.leftPanel.features.feature2')}</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>{t('dataResources.leftPanel.features.feature3')}</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>{t('dataResources.leftPanel.features.feature4')}</span>
              </li>
            </ul>            <a 
              href={sectionData?.leftPanel?.linkUrl || "/data/statistics"}
              className="inline-flex items-center text-accent hover:text-primary transition-colors font-medium"
            >
              {t('dataResources.leftPanel.linkText')}
              <ArrowRight size={18} className="ml-2" />
            </a>
          </div>
          
          {/* Right Panel - Tools & Design */}
          <div className="bg-muted p-8 rounded-lg">
            <div className="flex items-start mb-6">
              <div className="bg-primary rounded-full p-3 mr-4">
                <Gauge className="text-white w-6 h-6" />
              </div>              <div>
                <h3 className="text-xl font-semibold mb-2">{sectionData?.rightPanel?.title || t('dataResources.rightPanel.title')}</h3>
                <p className="text-muted-foreground">
                  {t('dataResources.rightPanel.description')}
                </p>
              </div>
            </div>            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>{t('dataResources.rightPanel.features.feature1')}</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>{t('dataResources.rightPanel.features.feature2')}</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>{t('dataResources.rightPanel.features.feature3')}</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>{t('dataResources.rightPanel.features.feature4')}</span>
              </li>
            </ul>            <a 
              href={sectionData?.rightPanel?.linkUrl || "/data/tools"}
              className="inline-flex items-center text-accent hover:text-primary transition-colors font-medium"
            >
              {t('dataResources.rightPanel.linkText')}
              <ArrowRight size={18} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataResources;
