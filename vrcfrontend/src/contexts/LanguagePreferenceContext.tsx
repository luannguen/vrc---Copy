import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguagePreference {
  language: string;
  region?: string;
  dateFormat?: string;
  numberFormat?: string;
  currency?: string;
  timezone?: string;
}

interface LanguagePreferenceContextType {
  preference: LanguagePreference;
  setPreference: (preference: Partial<LanguagePreference>) => void;
  persistPreference: boolean;
  setPersistPreference: (persist: boolean) => void;
  resetToDefault: () => void;
  getFormattedDate: (date: Date) => string;
  getFormattedNumber: (number: number) => string;
  getFormattedCurrency: (amount: number) => string;
}

const LanguagePreferenceContext = createContext<LanguagePreferenceContextType | undefined>(undefined);

export { LanguagePreferenceContext };

const defaultPreferences: Record<string, LanguagePreference> = {
  vi: {
    language: 'vi',
    region: 'VN',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'vi-VN',
    currency: 'VND',
    timezone: 'Asia/Ho_Chi_Minh'
  },
  en: {
    language: 'en',
    region: 'US',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
    currency: 'USD',
    timezone: 'America/New_York'
  },
  tr: {
    language: 'tr',
    region: 'TR',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: 'tr-TR',
    currency: 'TRY',
    timezone: 'Europe/Istanbul'
  }
};

interface LanguagePreferenceProviderProps {
  children: React.ReactNode;
  enablePersistence?: boolean;
}

/**
 * LanguagePreferenceProvider - Manages user language preferences
 * Handles persistent storage, formatting, and regional settings
 */
export const LanguagePreferenceProvider: React.FC<LanguagePreferenceProviderProps> = ({
  children,
  enablePersistence = true
}) => {
  const { i18n } = useTranslation();
  const [preference, setPreferenceState] = useState<LanguagePreference>(
    defaultPreferences[i18n.language] || defaultPreferences.vi
  );
  const [persistPreference, setPersistPreference] = useState(enablePersistence);

  // Storage keys
  const STORAGE_KEY = 'vrc-language-preference';
  const PERSIST_KEY = 'vrc-persist-preference';

  // Load preferences from storage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storedPersist = localStorage.getItem(PERSIST_KEY);
      if (storedPersist !== null) {
        setPersistPreference(JSON.parse(storedPersist));
      }

      const storedPreference = localStorage.getItem(STORAGE_KEY);
      if (storedPreference && JSON.parse(storedPersist || 'true')) {
        const parsed = JSON.parse(storedPreference);
        setPreferenceState(parsed);
        
        // Apply language to i18n if different
        if (parsed.language && parsed.language !== i18n.language) {
          i18n.changeLanguage(parsed.language);
        }
      }
    } catch (error) {
      console.warn('Failed to load language preferences:', error);
    }
  }, [i18n]);

  // Save preferences to storage
  useEffect(() => {
    if (typeof window === 'undefined' || !persistPreference) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preference));
      localStorage.setItem(PERSIST_KEY, JSON.stringify(persistPreference));
    } catch (error) {
      console.warn('Failed to save language preferences:', error);
    }
  }, [preference, persistPreference]);

  // Update preference when i18n language changes
  useEffect(() => {
    const currentLang = i18n.language;
    if (currentLang !== preference.language) {
      const newPreference = {
        ...defaultPreferences[currentLang],
        ...preference,
        language: currentLang
      };
      setPreferenceState(newPreference);
    }
  }, [i18n.language, preference]);

  const setPreference = useCallback((newPreference: Partial<LanguagePreference>) => {
    setPreferenceState(prev => ({
      ...prev,
      ...newPreference
    }));

    // Update i18n language if changed
    if (newPreference.language && newPreference.language !== i18n.language) {
      i18n.changeLanguage(newPreference.language);
    }
  }, [i18n]);

  const resetToDefault = useCallback(() => {
    const defaultPref = defaultPreferences[i18n.language] || defaultPreferences.vi;
    setPreferenceState(defaultPref);
    i18n.changeLanguage(defaultPref.language);
  }, [i18n]);

  const getFormattedDate = useCallback((date: Date): string => {
    try {
      const locale = `${preference.language}-${preference.region}`;
      return new Intl.DateTimeFormat(locale, {
        timeZone: preference.timezone
      }).format(date);
    } catch (error) {
      console.warn('Date formatting failed:', error);
      return date.toLocaleDateString();
    }
  }, [preference]);

  const getFormattedNumber = useCallback((number: number): string => {
    try {
      const locale = preference.numberFormat || `${preference.language}-${preference.region}`;
      return new Intl.NumberFormat(locale).format(number);
    } catch (error) {
      console.warn('Number formatting failed:', error);
      return number.toString();
    }
  }, [preference]);

  const getFormattedCurrency = useCallback((amount: number): string => {
    try {
      const locale = preference.numberFormat || `${preference.language}-${preference.region}`;
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: preference.currency
      }).format(amount);
    } catch (error) {
      console.warn('Currency formatting failed:', error);
      return `${amount} ${preference.currency}`;
    }
  }, [preference]);

  const value: LanguagePreferenceContextType = {
    preference,
    setPreference,
    persistPreference,
    setPersistPreference,
    resetToDefault,
    getFormattedDate,
    getFormattedNumber,
    getFormattedCurrency
  };

  return (
    <LanguagePreferenceContext.Provider value={value}>
      {children}
    </LanguagePreferenceContext.Provider>
  );
};

// Hook moved to hooks/useLanguagePreference.ts

/**
 * Component for managing language preferences UI
 */
interface LanguagePreferenceManagerProps {
  className?: string;
  showAdvanced?: boolean;
}

export const LanguagePreferenceManager: React.FC<LanguagePreferenceManagerProps> = ({
  className = '',
  showAdvanced = false
}) => {
  const context = useContext(LanguagePreferenceContext);
  if (!context) {
    throw new Error('LanguagePreferenceManager must be used within a LanguagePreferenceProvider');
  }
  
  const {
    preference,
    setPreference,
    persistPreference,
    setPersistPreference,
    resetToDefault
  } = context;

  return (
    <div className={`language-preference-manager ${className}`}>
      <div className="preference-section">
        <h3>Language Settings</h3>
        
        {/* Language Selection */}
        <div className="form-group">
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={preference.language}
            onChange={(e) => setPreference({ language: e.target.value })}
          >
            <option value="vi">Tiếng Việt</option>
            <option value="en">English</option>
            <option value="tr">Türkçe</option>
          </select>
        </div>

        {/* Persistence Setting */}
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={persistPreference}
              onChange={(e) => setPersistPreference(e.target.checked)}
            />
            Remember my language preference
          </label>
        </div>

        {showAdvanced && (
          <div className="advanced-settings">
            <h4>Advanced Settings</h4>
            
            {/* Region */}
            <div className="form-group">
              <label htmlFor="region-select">Region:</label>
              <input
                id="region-select"
                type="text"
                value={preference.region || ''}
                onChange={(e) => setPreference({ region: e.target.value })}
                placeholder="e.g., VN, US, TR"
              />
            </div>

            {/* Currency */}
            <div className="form-group">
              <label htmlFor="currency-select">Currency:</label>
              <input
                id="currency-select"
                type="text"
                value={preference.currency || ''}
                onChange={(e) => setPreference({ currency: e.target.value })}
                placeholder="e.g., VND, USD, TRY"
              />
            </div>

            {/* Timezone */}
            <div className="form-group">
              <label htmlFor="timezone-select">Timezone:</label>
              <input
                id="timezone-select"
                type="text"
                value={preference.timezone || ''}
                onChange={(e) => setPreference({ timezone: e.target.value })}
                placeholder="e.g., Asia/Ho_Chi_Minh"
              />
            </div>
          </div>
        )}

        <div className="actions">
          <button onClick={resetToDefault}>Reset to Default</button>
        </div>
      </div>
    </div>
  );
};

export default LanguagePreferenceProvider;
