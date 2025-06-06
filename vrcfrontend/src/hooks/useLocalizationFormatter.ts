import { useTranslation } from 'react-i18next';

interface LocalizationFormatterOptions {
  locale?: string;
  currency?: string;
  timezone?: string;
}

/**
 * Hook for formatting numbers, dates, and currencies according to locale
 * Provides consistent formatting across different languages
 */
export const useLocalizationFormatter = (options: LocalizationFormatterOptions = {}) => {
  const { i18n } = useTranslation();
  
  const currentLanguage = i18n.language || 'vi';
  const locale = options.locale || getLocaleFromLanguage(currentLanguage);
  const currency = options.currency || getCurrencyFromLanguage(currentLanguage);
  const timezone = options.timezone || getTimezoneFromLanguage(currentLanguage);

  // Map language codes to full locales
  function getLocaleFromLanguage(lang: string): string {
    const localeMap: Record<string, string> = {
      vi: 'vi-VN',
      en: 'en-US',
      tr: 'tr-TR'
    };
    return localeMap[lang] || 'vi-VN';
  }

  // Map language codes to currencies
  function getCurrencyFromLanguage(lang: string): string {
    const currencyMap: Record<string, string> = {
      vi: 'VND',
      en: 'USD',
      tr: 'TRY'
    };
    return currencyMap[lang] || 'VND';
  }

  // Map language codes to timezones
  function getTimezoneFromLanguage(lang: string): string {
    const timezoneMap: Record<string, string> = {
      vi: 'Asia/Ho_Chi_Minh',
      en: 'America/New_York',
      tr: 'Europe/Istanbul'
    };
    return timezoneMap[lang] || 'Asia/Ho_Chi_Minh';
  }

  // Format numbers according to locale
  const formatNumber = (
    value: number,
    options: Intl.NumberFormatOptions = {}
  ): string => {
    try {
      return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      console.warn('Number formatting failed:', error);
      return value.toString();
    }
  };

  // Format currency according to locale
  const formatCurrency = (
    value: number,
    currencyCode?: string,
    options: Intl.NumberFormatOptions = {}
  ): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode || currency,
        ...options
      }).format(value);
    } catch (error) {
      console.warn('Currency formatting failed:', error);
      return `${value} ${currencyCode || currency}`;
    }
  };

  // Format dates according to locale
  const formatDate = (
    date: Date | string | number,
    options: Intl.DateTimeFormatOptions = {}
  ): string => {
    try {
      const dateObj = typeof date === 'string' || typeof date === 'number' 
        ? new Date(date) 
        : date;
      
      return new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        ...options
      }).format(dateObj);
    } catch (error) {
      console.warn('Date formatting failed:', error);
      return date.toString();
    }
  };

  // Format relative time (e.g., "2 hours ago")
  const formatRelativeTime = (
    date: Date | string | number,
    options: Intl.RelativeTimeFormatOptions = {}
  ): string => {
    try {
      const dateObj = typeof date === 'string' || typeof date === 'number' 
        ? new Date(date) 
        : date;
      
      const now = new Date();
      const diffInSeconds = (dateObj.getTime() - now.getTime()) / 1000;
      
      const rtf = new Intl.RelativeTimeFormat(locale, {
        numeric: 'auto',
        ...options
      });

      // Determine the appropriate unit and value
      const absDiff = Math.abs(diffInSeconds);
      
      if (absDiff < 60) {
        return rtf.format(Math.round(diffInSeconds), 'second');
      } else if (absDiff < 3600) {
        return rtf.format(Math.round(diffInSeconds / 60), 'minute');
      } else if (absDiff < 86400) {
        return rtf.format(Math.round(diffInSeconds / 3600), 'hour');
      } else if (absDiff < 2592000) {
        return rtf.format(Math.round(diffInSeconds / 86400), 'day');
      } else if (absDiff < 31536000) {
        return rtf.format(Math.round(diffInSeconds / 2592000), 'month');
      } else {
        return rtf.format(Math.round(diffInSeconds / 31536000), 'year');
      }
    } catch (error) {
      console.warn('Relative time formatting failed:', error);
      return date.toString();
    }
  };

  // Format percentage
  const formatPercentage = (
    value: number,
    options: Intl.NumberFormatOptions = {}
  ): string => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'percent',
        ...options
      }).format(value);
    } catch (error) {
      console.warn('Percentage formatting failed:', error);
      return `${(value * 100).toFixed(2)}%`;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const unitMap: Record<string, string[]> = {
      vi: ['B', 'KB', 'MB', 'GB', 'TB'],
      en: ['B', 'KB', 'MB', 'GB', 'TB'],
      tr: ['B', 'KB', 'MB', 'GB', 'TB']
    };

    const localizedUnits = unitMap[currentLanguage] || units;
    
    if (bytes === 0) return `0 ${localizedUnits[0]}`;
    
    const k = 1024;
    const dm = 2;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    const formattedValue = formatNumber(value, { maximumFractionDigits: dm });
    
    return `${formattedValue} ${localizedUnits[i]}`;
  };

  // Format phone numbers (basic implementation)
  const formatPhoneNumber = (phoneNumber: string): string => {
    // Remove all non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Format based on language/region
    switch (currentLanguage) {
      case 'vi':
        // Vietnamese format: +84 xxx xxx xxx
        if (cleaned.startsWith('84')) {
          return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
        } else if (cleaned.startsWith('0')) {
          return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
        }
        break;
      case 'tr':
        // Turkish format: +90 xxx xxx xx xx
        if (cleaned.startsWith('90')) {
          return `+90 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
        }
        break;
      case 'en':
      default:
        // US format: +1 (xxx) xxx-xxxx
        if (cleaned.length === 11 && cleaned.startsWith('1')) {
          return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
        } else if (cleaned.length === 10) {
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        break;
    }
    
    return phoneNumber; // Return original if no formatting rule matches
  };
  // Get localized list formatting
  const formatList = (
    items: string[],
    type: 'conjunction' | 'disjunction' = 'conjunction'
  ): string => {
    if (items.length === 0) return '';
    if (items.length === 1) return items[0];
    if (items.length === 2) {
      const connector = type === 'conjunction' 
        ? getConjunctionWord() 
        : getDisjunctionWord();
      return `${items[0]} ${connector} ${items[1]}`;
    }

    const lastItem = items[items.length - 1];
    const otherItems = items.slice(0, -1);
    const connector = type === 'conjunction' 
      ? getConjunctionWord() 
      : getDisjunctionWord();
    
    return `${otherItems.join(', ')} ${connector} ${lastItem}`;
  };

  // Get conjunction word based on language
  const getConjunctionWord = (): string => {
    const conjunctionMap: Record<string, string> = {
      vi: 'và',
      en: 'and',
      tr: 've'
    };
    return conjunctionMap[currentLanguage] || 'và';
  };

  // Get disjunction word based on language
  const getDisjunctionWord = (): string => {
    const disjunctionMap: Record<string, string> = {
      vi: 'hoặc',
      en: 'or',
      tr: 'veya'
    };
    return disjunctionMap[currentLanguage] || 'hoặc';
  };

  return {
    locale,
    currency,
    timezone,
    formatNumber,
    formatCurrency,
    formatDate,
    formatRelativeTime,
    formatPercentage,
    formatFileSize,
    formatPhoneNumber,
    formatList
  };
};
