import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useMultilingualAPI } from '../../hooks/useMultilingualAPI';
import { useTranslationCache } from '../../hooks/useTranslationCache';

interface TranslationManagerProps {
  collections?: string[];
  showProgress?: boolean;
  onTranslationComplete?: (collection: string, language: string) => void;
}

interface TranslationProgress {
  collection: string;
  language: string;
  total: number;
  completed: number;
  percentage: number;
}

interface TranslationItem {
  id: string;
  collection: string;
  title?: string;
  content?: string;
  description?: string;
  status: 'complete' | 'partial' | 'missing';
  languages: Record<string, boolean>;
}

/**
 * TranslationManager - Admin UI for managing content translations
 * Provides overview of translation status and tools for completion
 */
const TranslationManager: React.FC<TranslationManagerProps> = ({
  collections = ['pages', 'posts', 'projects', 'services', 'events'],
  showProgress = true,
  onTranslationComplete
}) => {
  const { t, i18n } = useTranslation();
  const { fetchContent } = useMultilingualAPI();
  const { getCacheStats, clearCache } = useTranslationCache();
  
  const [translationData, setTranslationData] = useState<TranslationItem[]>([]);
  const [progress, setProgress] = useState<TranslationProgress[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const languages = useMemo(() => [
    { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷' }
  ], []);
  // Fetch translation data for all collections and languages
  const fetchTranslationData = useCallback(async () => {
    setIsLoading(true);
    const allItems: TranslationItem[] = [];
    const progressData: TranslationProgress[] = [];

    try {
      for (const collection of collections) {
        const collectionProgress = {
          collection,
          language: 'all',
          total: 0,
          completed: 0,
          percentage: 0
        };

        // Fetch content for the primary language first to get item list
        const primaryData = await fetchContent(collection, 'vi');
        const items = primaryData?.docs || [];
        
        collectionProgress.total = items.length;

        for (const item of items) {
          const translationItem: TranslationItem = {
            id: item.id,
            collection,
            title: item.title || item.name,
            content: item.content || item.description,
            status: 'missing',
            languages: {}
          };

          let completedLanguages = 0;

          // Check each language for this item
          for (const lang of languages) {
            try {
              const langData = await fetchContent(collection, lang.code);
              const langItem = langData?.docs?.find((doc: { id: string }) => doc.id === item.id);
              
              const hasContent = langItem && (
                langItem.title || langItem.name || langItem.content || langItem.description
              );

              translationItem.languages[lang.code] = !!hasContent;
              if (hasContent) completedLanguages++;
            } catch (error) {
              translationItem.languages[lang.code] = false;
            }
          }

          // Determine overall status
          if (completedLanguages === languages.length) {
            translationItem.status = 'complete';
            collectionProgress.completed++;
          } else if (completedLanguages > 0) {
            translationItem.status = 'partial';
          } else {
            translationItem.status = 'missing';
          }

          allItems.push(translationItem);
        }

        collectionProgress.percentage = collectionProgress.total > 0 
          ? Math.round((collectionProgress.completed / collectionProgress.total) * 100)
          : 0;

        progressData.push(collectionProgress);
      }

      setTranslationData(allItems);
      setProgress(progressData);    } catch (error) {
      console.error('Failed to fetch translation data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [collections, languages, fetchContent]);

  // Filter translation data based on selection
  const filteredData = translationData.filter(item => {
    const matchesCollection = selectedCollection === 'all' || item.collection === selectedCollection;
    const matchesLanguage = selectedLanguage === 'all' || !item.languages[selectedLanguage];
    const matchesSearch = !searchTerm || 
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCollection && matchesLanguage && matchesSearch;
  });

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'complete': return 'text-green-600 bg-green-100';
      case 'partial': return 'text-yellow-600 bg-yellow-100';
      case 'missing': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Calculate overall progress
  const overallProgress = progress.reduce((acc, curr) => {
    acc.total += curr.total;
    acc.completed += curr.completed;
    return acc;
  }, { total: 0, completed: 0 });

  const overallPercentage = overallProgress.total > 0 
    ? Math.round((overallProgress.completed / overallProgress.total) * 100)
    : 0;  const fetchData = useCallback(async () => {
    await fetchTranslationData();
  }, [fetchTranslationData]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update progress bars when data changes
  useEffect(() => {
    // Update overall progress bar
    const overallBar = document.querySelector('.overall-progress-fill') as HTMLElement;
    if (overallBar) {
      overallBar.style.width = `${overallPercentage}%`;
    }

    // Update collection progress bars
    document.querySelectorAll('.collection-progress-fill').forEach((element) => {
      const htmlElement = element as HTMLElement;
      const percentage = htmlElement.getAttribute('data-percentage');
      if (percentage) {
        htmlElement.style.width = `${percentage}%`;
      }
    });
  }, [overallPercentage, progress]);

  return (
    <div className="translation-manager">
      <div className="manager-header">
        <h2 className="text-2xl font-bold mb-4">
          {t('admin.translation.title', 'Translation Manager')}
        </h2>
        
        {showProgress && (
          <div className="progress-overview mb-6">
            <h3 className="text-lg font-semibold mb-3">
              {t('admin.translation.progress', 'Translation Progress')}
            </h3>
            
            <div className="overall-progress mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">
                  {t('admin.translation.overall', 'Overall Progress')}
                </span>
                <span className="text-sm text-gray-600">
                  {overallProgress.completed} / {overallProgress.total} ({overallPercentage}%)
                </span>
              </div>              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="overall-progress-fill"
                  data-percentage={overallPercentage}
                  role="progressbar"
                  aria-label={`Overall progress: ${overallPercentage}%`}
                  {...{
                    'aria-valuenow': overallPercentage,
                    'aria-valuemin': 0,
                    'aria-valuemax': 100
                  }}
                ></div>
              </div>
            </div>

            <div className="collection-progress grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {progress.map(item => (
                <div key={item.collection} className="progress-card p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium capitalize">{item.collection}</span>
                    <span className="text-sm text-gray-600">
                      {item.completed} / {item.total}
                    </span>
                  </div>                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="collection-progress-fill"
                      data-percentage={item.percentage}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {item.percentage}% {t('admin.translation.complete', 'complete')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="manager-controls mb-6">
        <div className="filters grid grid-cols-1 md:grid-cols-4 gap-4">          <div>
            <label htmlFor="collection-select" className="block text-sm font-medium mb-1">
              {t('admin.translation.collection', 'Collection')}
            </label>
            <select 
              id="collection-select"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">{t('admin.translation.allCollections', 'All Collections')}</option>
              {collections.map(collection => (
                <option key={collection} value={collection} className="capitalize">
                  {collection}
                </option>
              ))}
            </select>
          </div>          <div>
            <label htmlFor="language-select" className="block text-sm font-medium mb-1">
              {t('admin.translation.language', 'Language')}
            </label>
            <select 
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="all">{t('admin.translation.allLanguages', 'All Languages')}</option>
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('admin.translation.search', 'Search')}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('admin.translation.searchPlaceholder', 'Search content...')}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchTranslationData}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  {t('admin.translation.loading', 'Loading...')}
                </>
              ) : (
                t('admin.translation.refresh', 'Refresh')
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="translation-items">
        <div className="items-header mb-4">
          <h3 className="text-lg font-semibold">
            {t('admin.translation.items', 'Translation Items')} 
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({filteredData.length} {t('admin.translation.itemsCount', 'items')})
            </span>
          </h3>
        </div>

        <div className="items-list space-y-3">
          {filteredData.map(item => (
            <div key={`${item.collection}-${item.id}`} className="item-card p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="item-info">
                  <h4 className="font-medium">
                    {item.title || t('admin.translation.untitled', 'Untitled')}
                  </h4>
                  <div className="text-sm text-gray-600">
                    <span className="capitalize">{item.collection}</span> • ID: {item.id}
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {t(`admin.translation.status.${item.status}`, item.status)}
                </span>
              </div>

              <div className="language-status grid grid-cols-3 gap-2">
                {languages.map(lang => (
                  <div key={lang.code} className="language-item flex items-center space-x-2">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                    <span className={`ml-auto ${
                      item.languages[lang.code] 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {item.languages[lang.code] ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>

              {item.content && (
                <div className="item-preview mt-3 p-2 bg-gray-50 rounded text-sm">
                  <div 
                    className="line-clamp-2"
                    dangerouslySetInnerHTML={{ 
                      __html: item.content.substring(0, 200) + (item.content.length > 200 ? '...' : '')
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredData.length === 0 && !isLoading && (
          <div className="empty-state text-center py-8">
            <div className="text-gray-500 text-lg mb-2">📝</div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {t('admin.translation.noItems', 'No translation items found')}
            </h3>
            <p className="text-gray-500">
              {t('admin.translation.noItemsDesc', 'Try adjusting your filters or refresh the data.')}
            </p>
          </div>
        )}
      </div>

      <div className="manager-actions mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-3">
          {t('admin.translation.actions', 'Quick Actions')}
        </h4>
        <div className="actions-grid grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={clearCache}
            className="btn btn-outline-secondary"
          >
            {t('admin.translation.clearCache', 'Clear Cache')}
          </button>
          <button className="btn btn-outline-primary">
            {t('admin.translation.exportMissing', 'Export Missing')}
          </button>
          <button className="btn btn-outline-success">
            {t('admin.translation.autoTranslate', 'Auto Translate')}
          </button>
          <button className="btn btn-outline-info">
            {t('admin.translation.generateReport', 'Generate Report')}
          </button>
        </div>

        <div className="cache-info mt-4 text-sm text-gray-600">
          <div>
            {t('admin.translation.cacheStats', 'Cache Statistics')}: {JSON.stringify(getCacheStats())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationManager;
