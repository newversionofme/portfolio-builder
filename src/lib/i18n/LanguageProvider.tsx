'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { SiteLanguage, SiteDictionary, siteDictionaries } from './site-dictionary';

interface LanguageContextType {
  language: SiteLanguage;
  setLanguage: (lang: SiteLanguage) => void;
  toggleLanguage: () => void;
  t: SiteDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SiteLanguage>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('site_language') as SiteLanguage | null;
      if (stored === 'id' || stored === 'en') {
        setLanguageState(stored);
      }
    } catch {
      // localStorage may fail in restricted/iframe environments
    }
  }, []);

  const setLanguage = (newLang: SiteLanguage) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem('site_language', newLang);
      document.cookie = `site_language=${newLang}; path=/; max-age=31536000`;
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      toggleLanguage,
      t: siteDictionaries[language],
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback for non-wrapped components or SSR
    return {
      language: 'id' as SiteLanguage,
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: siteDictionaries.id,
    };
  }
  return context;
}

