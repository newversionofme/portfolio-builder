'use client';

import React, { useState } from 'react';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';
import { PortfolioActionsMenu } from '@/components/templates/PortfolioActionsMenu';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

interface PublicPortfolioViewerProps {
  portfolio: FullPortfolioData;
}

export function PublicPortfolioViewer({ portfolio }: PublicPortfolioViewerProps) {
  // Initialize with portfolio.language as saved by the owner
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
      {/* 
        DESKTOP / TABLET (sm:flex): 
        Floating Pill Kapsul Bahasa & Tema di pojok kanan atas seperti gambar (Globe • EN/ID | Theme) 
      */}
      <aside
        aria-label="Desktop Visitor Controls"
        className="hidden sm:flex fixed top-4 right-4 z-50 pointer-events-auto"
      >
        <div className="flex items-center gap-1.5 p-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full shadow-lg shadow-black/10 dark:shadow-black/40 border border-zinc-200/90 dark:border-zinc-800/90 transition-all hover:scale-[1.02]">
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
      </aside>

      {/* 
        MOBILE ONLY (sm:hidden):
        Floating Gear Icon Button di Pojok Kanan Bawah.
      */}
      <aside
        aria-label="Mobile Visitor Controls"
        className="sm:hidden fixed bottom-5 right-5 z-50 pointer-events-auto"
      >
        <PortfolioActionsMenu
          currentLanguage={activeLang}
          onLanguageChange={(lang) => setActiveLang(lang)}
          variant="outline"
          className="w-10 h-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/20 dark:shadow-black/50"
        />
      </aside>

      {/* Main Portfolio Layout */}
      <PortfolioRenderer data={currentData} />
    </div>
  );
}
