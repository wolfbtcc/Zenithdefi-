
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import { translations, languages, LanguageCode, TranslationKey } from './i18n';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: (key: TranslationKey, replacements?: { [key: string]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
        const storedLang = localStorage.getItem('zenith_ai_language');
        return (storedLang && languages[storedLang as LanguageCode]) ? (storedLang as LanguageCode) : 'pt';
    } catch {
        return 'pt';
    }
  });

  useEffect(() => {
    try {
        localStorage.setItem('zenith_ai_language', language);
    } catch (error) {
        console.error("Failed to save language to localStorage", error);
    }
  }, [language]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    if (languages[lang]) {
      setLanguageState(lang);
    }
  }, []);

  const t = useCallback((key: TranslationKey, replacements: { [key: string]: string } = {}): string => {
    const langTranslations = translations[language];

    // Check for the key in the current language, then fallback to Portuguese, then to the key itself.
    // This is more robust and type-safe without casting.
    let text = (langTranslations?.[key] ?? translations.pt[key] ?? key) as string;
    
    Object.keys(replacements).forEach(placeholder => {
        text = text.replace(`{${placeholder}}`, replacements[placeholder]);
    });

    return text;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
