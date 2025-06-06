import { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageRouterContext';

export const useLanguageRouter = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageRouter must be used within a LanguageRouter');
  }
  return context;
};
