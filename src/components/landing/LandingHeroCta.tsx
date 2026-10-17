'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';

export function LandingHeroCta() {
  const { t, language } = useLanguage();
  const [isLocalOrNonHttps, setIsLocalOrNonHttps] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isNonHttps = window.location.protocol !== 'https:';
      const isLocalhost =
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname.endsWith('.local');
      setIsLocalOrNonHttps(isNonHttps || isLocalhost || process.env.NODE_ENV === 'development');
    }
  }, []);

  return (
    <div className="mt-8 sm:mt-10 w-full max-w-xl mx-auto px-2">
      {/* Primary & Secondary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
        <Button
          size="lg"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base shadow-md font-medium"
          asChild
        >
          <Link href="/register">
            {t.hero.ctaPrimary}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>

        {isLocalOrNonHttps ? (
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base border-zinc-300 dark:border-zinc-700 font-medium"
            asChild
          >
            <a href="/u/alex-rivera" target="_blank" rel="noopener noreferrer">
              {t.hero.tryDemo}
              <ExternalLink className="w-4 h-4 ml-2 text-zinc-500" />
            </a>
          </Button>
        ) : (
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto h-11 sm:h-12 px-6 sm:px-8 text-sm sm:text-base border-zinc-300 dark:border-zinc-700 font-medium"
            asChild
          >
            <Link href="/login">
              {t.nav.login}
            </Link>
          </Button>
        )}
      </div>

      {/* Akun Demo Lokal Box: Hanya tampil di Localhost / Non-HTTPS */}
      {isLocalOrNonHttps && (
        <div className="mt-4 p-3 sm:p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 text-xs w-full shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">
                {t.hero.demoTitle}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              <a
                href="/u/alex-rivera"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-amber-300/80 dark:border-amber-700/80 text-zinc-800 dark:text-zinc-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors inline-flex items-center gap-1 font-medium text-[11px] shadow-2xs"
                title={language === 'en' ? 'Open Alex Rivera live portfolio in new tab' : 'Buka live portfolio Alex Rivera di tab baru'}
              >
                <span>👨‍💻 Alex Rivera</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
              <a
                href="/u/maya-lin"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-amber-300/80 dark:border-amber-700/80 text-zinc-800 dark:text-zinc-200 hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-colors inline-flex items-center gap-1 font-medium text-[11px] shadow-2xs"
                title={language === 'en' ? 'Open Maya Lin live portfolio in new tab' : 'Buka live portfolio Maya Lin di tab baru'}
              >
                <span>🎨 Maya Lin</span>
                <ExternalLink className="w-3 h-3 text-zinc-400" />
              </a>
              <Link
                href="/login?demo=alex"
                className="px-2.5 py-1 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-medium text-[11px] transition-colors inline-flex items-center gap-1 shadow-2xs"
                title={language === 'en' ? '1-Click Direct login to Alex Rivera Dashboard' : '1-Click Login langsung ke Dashboard Alex Rivera'}
              >
                <span>{t.hero.loginDemo}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

