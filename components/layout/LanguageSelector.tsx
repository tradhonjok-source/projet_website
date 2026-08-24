'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export type Locale = 'fr' | 'en' | 'es';

interface Language {
  code: Locale;
  label: string;
  description: string;
  flagCode: string;
}

const LANGUAGES: Language[] = [
  { code: 'fr', label: 'Français', description: 'Québec', flagCode: 'qc' },
  { code: 'en', label: 'English', description: 'Canada', flagCode: 'ca' },
  { code: 'es', label: 'Español', description: 'España', flagCode: 'es' },
];

function FlagIcon({ flagCode }: { flagCode: string }) {
  return (
    <img
      src={`/flags/${flagCode}.svg`}
      alt={`${flagCode.toUpperCase()} flag`}
      className="w-6 h-6 rounded-sm shadow-sm object-cover"
      style={{ aspectRatio: '4/3' }}
    />
  );
}

interface LanguageSelectorProps {
  currentLocale: Locale;
  variant?: 'header' | 'mobile';
}

export default function LanguageSelector({ currentLocale, variant = 'header' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLocale)!;
  const otherLanguages = LANGUAGES.filter((lang) => lang.code !== currentLocale);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleLanguageSelect = () => {
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Langue / Language
        </div>
        <div className="flex flex-col gap-1">
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              href={`/${lang.code}`}
              onClick={handleLanguageSelect}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                lang.code === currentLocale
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <FlagIcon flagCode={lang.flagCode} />
              <span>{lang.label}</span>
              <span className="text-xs text-muted-foreground">({lang.description})</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
        aria-label="Sélectionner la langue"
        aria-expanded={isOpen}
      >
        <FlagIcon flagCode={currentLanguage.flagCode} />
        <span className="hidden lg:inline">{currentLanguage.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-xl bg-background border border-border shadow-lg py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          {otherLanguages.map((lang) => (
            <Link
              key={lang.code}
              href={`/${lang.code}`}
              onClick={handleLanguageSelect}
              className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors first:mt-0"
            >
              <FlagIcon flagCode={lang.flagCode} />
              <div className="flex flex-col">
                <span className="font-medium">{lang.label}</span>
                <span className="text-xs text-muted-foreground">{lang.description}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
