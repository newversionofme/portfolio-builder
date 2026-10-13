'use client';

import React, { useState } from 'react';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface PublicPortfolioViewerProps {
  portfolio: FullPortfolioData;
}

export function PublicPortfolioViewer({ portfolio }: PublicPortfolioViewerProps) {
  // Initialize with portfolio.language as saved by the owner in database/hiddenSections
  const defaultLang = (portfolio.language === 'en' ? 'en' : 'id') as 'id' | 'en';
  const [activeLang, setActiveLang] = useState<'id' | 'en'>(defaultLang);

  const toggleLanguage = () => {
    setActiveLang((prev) => (prev === 'id' ? 'en' : 'id'));
  };

  const currentData: FullPortfolioData = {
    ...portfolio,
    language: activeLang,
  };

  return (
    <div className="relative min-h-screen">
      {/* Floating Visitor Bar: Quick Language Toggle & Dark/Light Mode */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1.5 p-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full shadow-md border border-zinc-200/80 dark:border-zinc-800/80 transition-all">
        {/* Language Switch Button */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="h-7 px-2.5 rounded-full text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
          title={`Ubah Bahasa (Saat ini: ${activeLang === 'id' ? 'Bahasa Indonesia' : 'English'})`}
          aria-label="Toggle Bahasa"
        >
          <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>{activeLang === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
        </Button>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />

        {/* Theme Toggle (Dark/Light mode) */}
        <ThemeToggle className="w-7 h-7 rounded-full" />
      </div>

      {/* Main Portfolio Layout */}
      <PortfolioRenderer data={currentData} />
    </div>
  );
}

