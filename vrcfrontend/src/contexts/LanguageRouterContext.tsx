import React from 'react';

export interface LanguageContextType {
  currentLanguage: string;
  switchLanguage: (lang: string) => void;
  availableLanguages: string[];
}

export const LanguageContext = React.createContext<{
  currentLanguage: string;
  switchLanguage: (lang: string) => void;
  availableLanguages: string[];
} | null>(null);
