'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { togglePublishPortfolio } from '@/actions/portfolio';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Globe,
  Share2,
  RotateCw,
  Download,
  ChevronDown,
  FileText,
  ImageIcon,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
  Check,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useExportModalStore } from '@/lib/store/export-modal-store';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { useTheme } from '@/components/theme/ThemeProvider';
import { LanguageToggle } from '@/components/ui/LanguageToggle';

export function EditorHeader() {
  const {
    portfolio,
    saveStatus,
    errorMessage,
    previewViewport,
    setPreviewViewport,
    updateStatus,
    triggerRetrySave,
  } = usePortfolioStore();

  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { openCvModal, openShareCardModal, openFullPageModal } = useExportModalStore();
  const [publishing, setPublishing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublished = portfolio.status === 'PUBLISHED';

  const handleTogglePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    const newStatus = isPublished ? 'DRAFT' : 'PUBLISHED';

    const timeoutPromise = new Promise<{ timeout: true }>((resolve) =>
      setTimeout(() => resolve({ timeout: true }), 15000)
    );

    try {
      const res = await Promise.race([
        togglePublishPortfolio(newStatus),
        timeoutPromise,
      ]);

      if ('timeout' in res) {
        toast.error(
          language === 'en'
            ? 'No response from server. Check your connection.'
            : 'Belum ada respons dari server. Periksa dulu sebelum mencoba lagi.'
        );
        return;
      }

      if (res?.error) {
        toast.error(res.error);
      } else {
        updateStatus(newStatus);
        if (newStatus === 'PUBLISHED') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.2 },
          });
          toast.success(t.editor.publishedSuccess);
        } else {
          toast.info(t.editor.draftSuccess);
        }
      }
    } catch {
      toast.error(
        language === 'en'
          ? 'Failed to update publication status. Check your connection.'
          : 'Gagal mengubah status publikasi. Silakan periksa koneksi Anda.'
      );
    } finally {
      setPublishing(false);
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/u/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    toast.success(t.editor.copiedSuccess);
  };

  return (
    <header className="h-14 sm:h-16 shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section: Back button & Save Status */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-9 w-9 sm:h-9 sm:w-9 min-h-[36px] min-w-[36px] shrink-0"
        >
          <Link href="/dashboard" aria-label={t.editor.backToDashboard} title={t.editor.backToDashboard}>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          {/* Title - hidden on mobile to give space to autosave status, shown on sm+ */}
          <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate hidden sm:inline max-w-[120px] md:max-w-[160px] xl:max-w-none">
            {t.editor.headerTitle}
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>

          {/* Autosave Status Indicator - shrink-0 to prevent truncation */}
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>{t.editor.saving}</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>{t.editor.saved}</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span title={errorMessage || t.editor.failed}>{t.editor.failed}</span>
                <button
                  type="button"
                  onClick={triggerRetrySave}
                  className="inline-flex items-center gap-1 text-[11px] underline underline-offset-2 hover:text-red-700 dark:hover:text-red-300 font-semibold cursor-pointer p-1"
                  aria-label={t.editor.retry}
                  title={t.editor.retry}
                >
                  <RotateCw className="w-3 h-3" />
                </button>
              </div>
            )}
            {saveStatus === 'idle' && (
              <div className="flex items-center gap-1.5 text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>{t.editor.ready}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section: Viewport Switcher (Desktop >= 1024px only) */}
      <div className="hidden lg:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setPreviewViewport('desktop')}
          className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            previewViewport === 'desktop'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title={language === 'en' ? 'Desktop View' : 'Tampilan Desktop'}
          aria-label={language === 'en' ? 'Desktop View' : 'Tampilan Desktop'}
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPreviewViewport('tablet')}
          className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            previewViewport === 'tablet'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title={language === 'en' ? 'Tablet View (768px)' : 'Tampilan Tablet (768px)'}
          aria-label={language === 'en' ? 'Tablet View (768px)' : 'Tampilan Tablet (768px)'}
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button
          onClick={() => setPreviewViewport('mobile')}
          className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            previewViewport === 'mobile'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title={language === 'en' ? 'Mobile View (375px)' : 'Tampilan Mobile (375px)'}
          aria-label={language === 'en' ? 'Mobile View (375px)' : 'Tampilan Mobile (375px)'}
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section: Publish & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* DESKTOP CONTROLS (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Combined Single 'Ekspor' Dropdown Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2.5 xl:px-3 text-xs gap-1.5 font-medium cursor-pointer"
                title={t.editor.export}
              >
                <Download className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                <span className="hidden sm:inline">{t.editor.export}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                onClick={openCvModal}
                className="gap-2.5 py-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <div className="flex flex-col">
                  <span className="font-medium">{t.editor.downloadPdf}</span>
                  <span className="text-[10px] text-zinc-400">{t.editor.pdfDesc}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openShareCardModal}
                className="gap-2.5 py-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div className="flex flex-col">
                  <span className="font-medium">{t.editor.downloadShareCard}</span>
                  <span className="text-[10px] text-zinc-400">{t.editor.shareCardDesc}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openFullPageModal}
                className="gap-2.5 py-2 cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div className="flex flex-col">
                  <span className="font-medium">{t.editor.downloadFullPage}</span>
                  <span className="text-[10px] text-zinc-400">{t.editor.fullPageDesc}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Copy Link Button */}
          {isPublished && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyPublicLink}
              className="h-8 text-xs gap-1.5 px-2.5 xl:px-3"
              title={t.editor.copyLink}
              aria-label={t.editor.copyLink}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.editor.copyLink}</span>
            </Button>
          )}

          {/* Open Public Web Button */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-2.5 xl:px-3 text-xs gap-1.5"
            title={t.editor.openWeb}
            aria-label={t.editor.openWeb}
          >
            <a
              href={`/u/${portfolio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{t.editor.openWeb}</span>
            </a>
          </Button>

          {/* Language Toggle Desktop */}
          <LanguageToggle />

          {/* Theme Toggle Desktop */}
          <ThemeToggle />
        </div>

        {/* MOBILE & TABLET OVERFLOW MENU (< 1024px) - Features Hamburger Menu Toggle (Menu/X icons) */}
        <div className="lg:hidden flex items-center gap-1.5 sm:gap-2">
          <DropdownMenu onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 min-h-[36px] min-w-[36px] p-0 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"
                aria-label={mobileMenuOpen ? t.nav.closeMenu : t.nav.menu}
                title={mobileMenuOpen ? t.nav.closeMenu : t.nav.menu}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-zinc-900 dark:text-zinc-100 transition-transform duration-200" />
                ) : (
                  <Menu className="w-5 h-5 text-zinc-900 dark:text-zinc-100 transition-transform duration-200" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 space-y-2">
              {/* Bahasa / Language Section */}
              <div className="px-1 py-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{t.nav.language}</span>
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLanguage('id')}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      language === 'id'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>🇮🇩 ID</span>
                    {language === 'id' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      language === 'en'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    <span>🇬🇧 EN</span>
                    {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                </div>
              </div>

              {/* Tema Tampilan / Theme Section */}
              <div className="px-1 py-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1.5 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.theme.label}</span>
                </span>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    type="button"
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium border transition-colors gap-1 ${
                      theme === 'light'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                    title={t.theme.light}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t.theme.light}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium border transition-colors gap-1 ${
                      theme === 'dark'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                    title={t.theme.dark}
                  >
                    <Moon className="w-3.5 h-3.5 text-violet-400" />
                    <span>{t.theme.dark}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-lg text-[11px] font-medium border transition-colors gap-1 ${
                      theme === 'system'
                        ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                    title={t.theme.system}
                  >
                    <Laptop className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{language === 'en' ? 'Auto' : 'Sistem'}</span>
                  </button>
                </div>
              </div>

              <DropdownMenuSeparator />

              {/* Ekspor Section */}
              <DropdownMenuItem
                onClick={openCvModal}
                className="gap-2.5 py-2 min-h-[38px] cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs">{t.editor.downloadPdf}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openShareCardModal}
                className="gap-2.5 py-2 min-h-[38px] cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs">{t.editor.downloadShareCard}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openFullPageModal}
                className="gap-2.5 py-2 min-h-[38px] cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs">{t.editor.downloadFullPage}</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {isPublished && (
                <DropdownMenuItem
                  onClick={copyPublicLink}
                  className="gap-2.5 py-2 min-h-[38px] cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  <span className="text-xs">{t.editor.copyLink}</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                asChild
                className="gap-2.5 py-2 min-h-[38px] cursor-pointer"
              >
                <a
                  href={`/u/${portfolio.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  <span className="text-xs">{t.editor.openWeb}</span>
                </a>
              </DropdownMenuItem>

              {/* Viewport switch in dropdown is only shown on tablet screens (hidden on mobile HP) */}
              <div className="hidden sm:block">
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-1">
                    {t.editor.previewViewport}
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => setPreviewViewport('tablet')}
                      className={`py-1 text-center rounded text-[11px] font-medium border ${
                        previewViewport === 'tablet'
                          ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                          : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      Tablet
                    </button>
                    <button
                      onClick={() => setPreviewViewport('mobile')}
                      className={`py-1 text-center rounded text-[11px] font-medium border ${
                        previewViewport === 'mobile'
                          ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                          : 'border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ALWAYS VISIBLE: Publish Button */}
        <Button
          size="sm"
          onClick={handleTogglePublish}
          disabled={publishing}
          className={`h-9 sm:h-9 px-3 text-xs font-medium gap-1.5 min-h-[36px] cursor-pointer ${
            isPublished
              ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {publishing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>{isPublished ? t.editor.unpublishing : t.editor.publishing}</span>
            </>
          ) : isPublished ? (
            <>
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.editor.published}</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5" />
              <span>{t.editor.publish}</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
