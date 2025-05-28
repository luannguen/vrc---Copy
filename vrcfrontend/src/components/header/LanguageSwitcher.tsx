import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
  code: string;
  name: string;
  flagIcon: string;
  i18nCode: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'VI', name: 'Tiếng Việt', flagIcon: '/assets/svg/flags/vi-flag.svg', i18nCode: 'vi' },
  { code: 'EN', name: 'English', flagIcon: '/assets/svg/flags/en-flag.svg', i18nCode: 'en' },
  { code: 'TR', name: 'Türkçe', flagIcon: '/assets/svg/flags/tr-flag.svg', i18nCode: 'tr' },
];

interface LanguageSwitcherProps {
  isMobile?: boolean;
}

const LanguageSwitcher = ({ isMobile = false }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const [activeLanguage, setActiveLanguage] = useState(
    languageOptions.find(lang => lang.i18nCode === i18n.language)?.code || 'EN'
  );

  const handleLanguageChange = (languageCode: string) => {
    const language = languageOptions.find(lang => lang.code === languageCode);
    if (language) {
      setActiveLanguage(languageCode);
      i18n.changeLanguage(language.i18nCode);
    }
  };

  const getActiveLanguageDetails = () => {
    return languageOptions.find(lang => lang.code === activeLanguage) || languageOptions[0];
  };

  if (isMobile) {
    return (
      <div className="pt-4 border-t border-white/20">
        <div className="flex flex-col space-y-2">
          <span className="text-white text-sm">{t('nav.language')}</span>          <select 
            value={activeLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-primary-light/10 text-white border border-white/30 rounded p-2"
            title={t('nav.language')}
            aria-label={t('nav.language')}
          >
            {languageOptions.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
  return (
    <div className="relative group">
      <button className="navbar-link flex items-center">
        <img 
          src={getActiveLanguageDetails().flagIcon} 
          alt={getActiveLanguageDetails().name} 
          className="w-5 h-5 mr-1"
        />
        <span>{activeLanguage}</span>
        <ChevronDown size={16} className="ml-1" />
      </button>
      <div className="absolute hidden group-hover:block bg-white/10 backdrop-blur-sm shadow-lg p-4 rounded min-w-32 right-0">
        <div className="flex flex-col space-y-2">
          {languageOptions.map(lang => (
            <button 
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)} 
              className={`flex items-center text-left ${activeLanguage === lang.code ? 'text-accent font-medium' : 'text-primary'}`}
            >
              <img 
                src={lang.flagIcon} 
                alt={lang.name} 
                className="w-5 h-5 mr-2"
              />
              {lang.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;