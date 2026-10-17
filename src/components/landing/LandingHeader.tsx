'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sparkles,
  ArrowRight,
  Globe,
  Menu,
  X,
  Check,
  Layout,
  Zap,
  HelpCircle,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';

export function LandingHeader() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 w-full">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight min-w-0 shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="truncate">
            Portfolio<span className="text-blue-600">Builder</span>
          </span>
        </Link>

        {/* Desktop Navigation Links (Centered) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
          <a
            href="#template"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t.nav.templates}
          </a>
          <a
            href="#fitur"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t.nav.features}
          </a>
          <a
            href="#cara-kerja"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t.nav.howItWorks}
          </a>
        </nav>

        {/* Desktop Actions (Right) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* Language Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2.5 text-xs font-semibold gap-1.5 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                aria-label={t.nav.language}
                title={t.nav.language}
              >
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 text-xs p-1">
              <DropdownMenuItem
                onClick={() => setLanguage('id')}
                className="flex items-center justify-between py-1.5 px-2 cursor-pointer rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span>🇮🇩</span>
                  <span className="font-medium">Bahasa Indonesia</span>
                </div>
                {language === 'id' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setLanguage('en')}
                className="flex items-center justify-between py-1.5 px-2 cursor-pointer rounded-md"
              >
                <div className="flex items-center gap-2">
                  <span>🇬🇧</span>
                  <span className="font-medium">English</span>
                </div>
                {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle className="w-8 h-8 rounded-full" />

          {/* Login Link */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs sm:text-sm font-medium"
            asChild
          >
            <Link href="/login">{t.nav.login}</Link>
          </Button>

          {/* Register / CTA Button */}
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 shadow-sm h-8 px-3 text-xs sm:text-sm font-medium gap-1"
            asChild
          >
            <Link href="/register">
              <span>{t.nav.createPortfolio}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Header Controls (< md) */}
        <div className="flex md:hidden items-center shrink-0">
          {/* Mobile Hamburger / Close Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-9 h-9 p-0 rounded-lg flex items-center justify-center border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"
            aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.menu}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-zinc-900 dark:text-zinc-100 transition-transform duration-200" />
            ) : (
              <Menu className="w-5 h-5 text-zinc-900 dark:text-zinc-100 transition-transform duration-200" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer / Collapsible Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in-0 duration-200">
          <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-2xl px-5 py-6 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Navigation Anchor Links */}
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block px-2 mb-2">
                {t.nav.navigationLabel}
              </span>
              <a
                href="#template"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <Layout className="w-4 h-4 text-blue-600" />
                <span>{t.nav.templates}</span>
              </a>
              <a
                href="#fitur"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>{t.nav.features}</span>
              </a>
              <a
                href="#cara-kerja"
                onClick={closeMenu}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span>{t.nav.howItWorks}</span>
              </a>
            </div>

            {/* Language Switch Section */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block px-2 mb-2 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <span>{t.nav.language}</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('id');
                    closeMenu();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    language === 'id'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>🇮🇩</span> {t.languageNames.id}
                  </span>
                  {language === 'id' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    closeMenu();
                  }}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    language === 'en'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span>🇬🇧</span> {t.languageNames.en}
                  </span>
                  {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            </div>

            {/* Theme Appearance Section */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-zinc-400 block px-2 mb-2 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.theme.label}</span>
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium border transition-colors gap-1 ${
                    theme === 'light'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>{t.theme.light}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium border transition-colors gap-1 ${
                    theme === 'dark'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Moon className="w-4 h-4 text-violet-400" />
                  <span>{t.theme.dark}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium border transition-colors gap-1 ${
                    theme === 'system'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                  }`}
                >
                  <Laptop className="w-4 h-4 text-zinc-500" />
                  <span>{language === 'en' ? 'Auto' : 'Sistem'}</span>
                </button>
              </div>
            </div>

            {/* Action Buttons: Login & Register */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 flex flex-col gap-2.5">
              <Button
                variant="outline"
                className="w-full h-10 text-sm font-medium border-zinc-200 dark:border-zinc-800"
                asChild
              >
                <Link href="/login" onClick={closeMenu}>
                  {t.nav.login}
                </Link>
              </Button>

              <Button
                className="w-full h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md gap-1.5"
                asChild
              >
                <Link href="/register" onClick={closeMenu}>
                  <span>{t.nav.createPortfolio}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

