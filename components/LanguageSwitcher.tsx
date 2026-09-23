'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { SUPPORTED_LOCALES, type Locale } from '../lib/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const currentLocale = SUPPORTED_LOCALES.find((l) => l.code === locale);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground border border-transparent hover:border-border transition-all"
        aria-label={t('lang.select')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLocale?.nativeName || 'EN'}</span>
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          role="listbox"
          aria-label={t('lang.select')}
        >
          <div className="py-1">
            {SUPPORTED_LOCALES.map((loc) => (
              <button
                key={loc.code}
                role="option"
                aria-selected={locale === loc.code}
                onClick={() => {
                  setLocale(loc.code as Locale);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors ${
                  locale === loc.code
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                <span className="text-base">{loc.flag}</span>
                <span className="flex-1">{loc.nativeName}</span>
                {locale === loc.code && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
