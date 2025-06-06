import { useContext } from 'react';
import { LanguagePreferenceContext } from '../contexts/LanguagePreferenceContext';

/**
 * Hook to use language preferences
 */
export const useLanguagePreference = () => {
  const context = useContext(LanguagePreferenceContext);
  if (context === undefined) {
    throw new Error('useLanguagePreference must be used within a LanguagePreferenceProvider');
  }
  return context;
};
