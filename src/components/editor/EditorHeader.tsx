'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
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
  MoreHorizontal,
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

  const { openCvModal, openShareCardModal, openFullPageModal } = useExportModalStore();
  const [publishing, setPublishing] = useState(false);

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
        toast.error('Belum ada respons dari server. Periksa dulu sebelum mencoba lagi.');
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
          toast.success('Portofolio berhasil dipublikasikan!');
        } else {
          toast.info('Status portofolio diubah menjadi Draft.');
        }
      }
    } catch {
      toast.error('Gagal mengubah status publikasi. Silakan periksa koneksi Anda.');
    } finally {
      setPublishing(false);
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/u/${portfolio.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Tautan berhasil disalin ke clipboard!');
  };

  return (
    <header className="h-14 sm:h-16 shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section: Back button & Save Status */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 max-w-[55%] sm:max-w-none">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-9 w-9 sm:h-9 sm:w-9 min-h-[36px] min-w-[36px] shrink-0"
        >
          <Link href="/dashboard" aria-label="Kembali ke Dashboard">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          {/* Title uses truncate so save status is never crowded */}
          <span className="text-sm font-semibold text-zinc-900 dark:text-white truncate max-w-[85px] xs:max-w-[120px] sm:max-w-[160px] xl:max-w-none">
            Editor Portofolio
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>

          {/* Autosave Status Indicator - shrink-0 to prevent truncation */}
          <div className="flex items-center gap-1.5 text-xs shrink-0">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span>Menyimpan...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Tersimpan</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span title={errorMessage || 'Gagal menyimpan perubahan'}>Gagal</span>
                <button
                  type="button"
                  onClick={triggerRetrySave}
                  className="inline-flex items-center gap-1 text-[11px] underline underline-offset-2 hover:text-red-700 dark:hover:text-red-300 font-semibold cursor-pointer p-1"
                  aria-label="Coba simpan ulang"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
              </div>
            )}
            {saveStatus === 'idle' && (
              <div className="flex items-center gap-1.5 text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Siap</span>
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
          title="Tampilan Desktop"
          aria-label="Tampilan Desktop"
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
          title="Tampilan Tablet (768px)"
          aria-label="Tampilan Tablet"
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
          title="Tampilan Mobile (375px)"
          aria-label="Tampilan Mobile"
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
                title="Ekspor Portofolio"
              >
                <Download className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                <span className="hidden sm:inline">Ekspor</span>
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
                  <span className="font-medium">Unduh CV (PDF)</span>
                  <span className="text-[10px] text-zinc-400">Standar ATS format A4</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openShareCardModal}
                className="gap-2.5 py-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <div className="flex flex-col">
                  <span className="font-medium">Unduh Kartu Bagikan</span>
                  <span className="text-[10px] text-zinc-400">Ukuran 1200×630</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openFullPageModal}
                className="gap-2.5 py-2 cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div className="flex flex-col">
                  <span className="font-medium">Unduh Halaman Penuh</span>
                  <span className="text-[10px] text-zinc-400">Tangkapan layar 1280px</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Copy Link Button (Icon only on 768-1279px, with label on >= 1280px) */}
          {isPublished && (
            <Button
              variant="outline"
              size="sm"
              onClick={copyPublicLink}
              className="h-8 text-xs gap-1.5 px-2.5 xl:px-3"
              title="Salin Link Publik"
              aria-label="Salin Link Publik"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Salin Link</span>
            </Button>
          )}

          {/* Open Public Web Button (Icon only on 768-1279px, with label on >= 1280px) */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-2.5 xl:px-3 text-xs gap-1.5"
            title="Buka Halaman Portofolio"
            aria-label="Buka Web Portofolio"
          >
            <a
              href={`/u/${portfolio.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Buka Web</span>
            </a>
          </Button>

          {/* Theme Toggle Desktop */}
          <ThemeToggle />
        </div>

        {/* MOBILE & TABLET OVERFLOW MENU (< 1024px) - Hosts Ekspor, Salin Link, Buka Web, Viewport Switch */}
        <div className="lg:hidden flex items-center gap-1 sm:gap-1.5">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 min-h-[36px] min-w-[36px] p-0"
                aria-label="Menu Opsi Lainnya"
                title="Menu Opsi"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <DropdownMenuItem
                onClick={openCvModal}
                className="gap-2.5 py-2.5 min-h-[40px] cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Unduh CV (PDF)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openShareCardModal}
                className="gap-2.5 py-2.5 min-h-[40px] cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Unduh Kartu Bagikan (1200×630)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={openFullPageModal}
                className="gap-2.5 py-2.5 min-h-[40px] cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Unduh Halaman Penuh (1280px)</span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              {isPublished && (
                <DropdownMenuItem
                  onClick={copyPublicLink}
                  className="gap-2.5 py-2.5 min-h-[40px] cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  <span>Salin Link</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                asChild
                className="gap-2.5 py-2.5 min-h-[40px] cursor-pointer"
              >
                <a
                  href={`/u/${portfolio.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                  <span>Buka Web</span>
                </a>
              </DropdownMenuItem>

              {/* Viewport switch in dropdown is only shown on tablet screens (hidden on mobile HP) */}
              <div className="hidden sm:block">
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <span className="text-[10px] text-zinc-400 font-semibold block mb-1">
                    Pratinjau Layar
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
              <span>{isPublished ? 'Mengubah...' : 'Mempublikasikan...'}</span>
            </>
          ) : isPublished ? (
            <>
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Published</span>
            </>
          ) : (
            <>
              <Globe className="w-3.5 h-3.5" />
              <span>Publish</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
