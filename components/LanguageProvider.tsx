'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import enDict from '../lib/i18n/locales/en';
import {
  type Locale,
  type LocaleConfig,
  type TranslationDict,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getLocaleConfig,
  getLocaleFromCookie,
  getLocaleFromBrowser,
  getLocaleFromIP,
  setLocaleCookie,
} from '../lib/i18n';

// Lazy-load other locale dictionaries
const localeDicts: Record<Locale, () => Promise<{ default: TranslationDict }>> = {
  en: () => Promise.resolve({ default: enDict }),
  es: () => import('../lib/i18n/locales/es'),
  fr: () => import('../lib/i18n/locales/fr'),
  ar: () => import('../lib/i18n/locales/ar'),
  hi: () => import('../lib/i18n/locales/hi'),
  zh: () => import('../lib/i18n/locales/zh'),
};

interface LanguageContextValue {
  locale: Locale;
  localeConfig: LocaleConfig;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

interface LanguageProviderProps {
  children: React.ReactNode;
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [dict, setDict] = useState<TranslationDict>(enDict);
  const [fallbackDict] = useState<TranslationDict>(enDict);
  const [isLoading, setIsLoading] = useState(false);

  // Load a locale dictionary
  const loadDict = useCallback(async (loc: Locale) => {
    try {
      const mod = await localeDicts[loc]();
      return mod.default;
    } catch {
      console.warn(`Failed to load locale: ${loc}, falling back to en`);
      return enDict;
    }
  }, []);

  // Initialize: detect locale and load dictionaries
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Detect user's locale
      const fromCookie = getLocaleFromCookie();
      let detectedLocale: Locale = DEFAULT_LOCALE;

      if (fromCookie) {
        detectedLocale = fromCookie;
      } else {
        const fromBrowser = getLocaleFromBrowser();
        if (fromBrowser) {
          detectedLocale = fromBrowser;
        } else {
          const fromIP = await getLocaleFromIP();
          if (!cancelled && fromIP) {
            detectedLocale = fromIP;
          }
        }
      }

      if (cancelled) return;

      // Load detected locale dict if not default
      if (detectedLocale !== DEFAULT_LOCALE) {
        setIsLoading(true);
        const localeDict = await loadDict(detectedLocale);
        if (!cancelled) {
          setDict(localeDict);
          setLocaleState(detectedLocale);
          setLocaleCookie(detectedLocale);
          setIsLoading(false);
        }
      }
    }

    init();
    return () => { cancelled = true; };
  }, [loadDict]);

  // Update HTML attributes when locale changes
  useEffect(() => {
    const config = getLocaleConfig(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = config.dir;
  }, [locale]);

  // Change locale
  const setLocale = useCallback(async (newLocale: Locale) => {
    setLocaleState(newLocale);
    setLocaleCookie(newLocale);

    const newDict = await loadDict(newLocale);
    setDict(newDict);
  }, [loadDict]);

  // Translation function with variable interpolation
  const t = useCallback((key: string, vars?: Record<string, string>): string => {
    let value = dict[key] || fallbackDict[key] || key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        value = value.replace(`{${k}}`, v);
      });
    }
    return value;
  }, [dict, fallbackDict]);

  const localeConfig = useMemo(() => getLocaleConfig(locale), [locale]);
  const dir = localeConfig.dir;

  const contextValue = useMemo<LanguageContextValue>(() => ({
    locale,
    localeConfig,
    setLocale,
    t,
    dir,
    isLoading,
  }), [locale, localeConfig, setLocale, t, dir, isLoading]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}
