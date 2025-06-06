import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMultilingualProducts, useMultilingualServices, useMultilingualGlobal } from '../hooks/useMultilingualAPI';
import type { Product, Service, CompanyInfo, ServiceFeature } from '../types/multilingual';

interface MultilingualContentProps {
  showProducts?: boolean;
  showServices?: boolean;
  showCompanyInfo?: boolean;
}

const MultilingualContent: React.FC<MultilingualContentProps> = ({
  showProducts = true,
  showServices = true,
  showCompanyInfo = true,
}) => {
  const { t, i18n } = useTranslation();
  const currentLocale = i18n.language;

  // Fetch multilingual data
  const { 
    data: products, 
    isLoading: productsLoading, 
    error: productsError 
  } = useMultilingualProducts(currentLocale);

  const { 
    data: services, 
    isLoading: servicesLoading, 
    error: servicesError 
  } = useMultilingualServices(currentLocale);

  const { 
    data: companyInfo, 
    isLoading: companyLoading, 
    error: companyError 
  } = useMultilingualGlobal('company-info', currentLocale);

  if (productsLoading || servicesLoading || companyLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">{t('common.loading', 'Loading...')}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Company Info Section */}
      {showCompanyInfo && companyInfo && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {companyInfo.companyName}
          </h2>
          {companyInfo.companyDescription && (
            <p className="text-gray-600 mb-4">
              {companyInfo.companyDescription}
            </p>
          )}
          {companyInfo.contactSection && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {companyInfo.contactSection.address && (
                <div>
                  <span className="font-medium">{t('contact.address', 'Address')}:</span>
                  <p>{companyInfo.contactSection.address}</p>
                </div>
              )}
              {companyInfo.contactSection.phone && (
                <div>
                  <span className="font-medium">{t('contact.phone', 'Phone')}:</span>
                  <p>{companyInfo.contactSection.phone}</p>
                </div>
              )}
              {companyInfo.contactSection.email && (
                <div>
                  <span className="font-medium">{t('contact.email', 'Email')}:</span>
                  <p>{companyInfo.contactSection.email}</p>
                </div>
              )}
              {companyInfo.contactSection.workingHours && (
                <div>
                  <span className="font-medium">{t('contact.workingHours', 'Working Hours')}:</span>
                  <p>{companyInfo.contactSection.workingHours}</p>
                </div>
              )}
            </div>
          )}
          {companyError && (
            <div className="text-red-600 text-sm">
              {t('errors.failedToLoadCompanyInfo', 'Failed to load company information')}
            </div>
          )}
        </section>
      )}

      {/* Products Section */}
      {showProducts && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('navigation.products', 'Products')}
          </h2>
          {productsError ? (
            <div className="text-red-600 text-sm">
              {t('errors.failedToLoadProducts', 'Failed to load products')}
            </div>
          ) : products?.docs && products.docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.docs.slice(0, 6).map((product: Product) => (
                <div key={product.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {product.mainImage && (
                    <img
                      src={product.mainImage.url}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    {product.excerpt && (
                      <p className="text-gray-600 text-sm mb-3">{product.excerpt}</p>
                    )}
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      {t('common.readMore', 'Read More')} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('common.noDataFound', 'No data found')}</p>
          )}
        </section>
      )}

      {/* Services Section */}
      {showServices && (
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {t('navigation.services', 'Services')}
          </h2>
          {servicesError ? (
            <div className="text-red-600 text-sm">
              {t('errors.failedToLoadServices', 'Failed to load services')}
            </div>
          ) : services?.docs && services.docs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.docs.slice(0, 4).map((service: Service) => (
                <div key={service.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-3">{service.name}</h3>
                  {service.description && (
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  )}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-1 text-sm text-gray-600">
                      {service.features.slice(0, 3).map((feature: ServiceFeature, index: number) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature.title}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {t('common.learnMore', 'Learn More')} →
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">{t('common.noDataFound', 'No data found')}</p>
          )}
        </section>
      )}

      {/* Debug Info (only in development) */}
      {import.meta.env.DEV && (
        <section className="bg-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2">Debug Info</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Current Locale: {currentLocale}</p>
            <p>Products Count: {products?.docs?.length || 0}</p>
            <p>Services Count: {services?.docs?.length || 0}</p>
            <p>Company Info Loaded: {companyInfo ? 'Yes' : 'No'}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default MultilingualContent;
