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
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { ExportCvModal } from '@/components/export/ExportCvModal';

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
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Section: Back button & Save Status */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Button variant="ghost" size="icon" asChild className="h-8 w-8 sm:h-9 sm:w-9 shrink-0">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-zinc-900 dark:text-white hidden sm:inline">
            Editor Portofolio
          </span>
          <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">•</span>
          
          {/* Autosave Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs truncate max-w-[110px] xs:max-w-[150px] sm:max-w-none">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span className="truncate">Menyimpan...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Tersimpan</span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span title={errorMessage || 'Gagal menyimpan perubahan'}>Gagal</span>
                <button
                  type="button"
                  onClick={triggerRetrySave}
                  className="inline-flex items-center gap-1 text-[11px] underline underline-offset-2 hover:text-red-700 dark:hover:text-red-300 font-semibold cursor-pointer"
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

      {/* Middle Section: Viewport Switcher */}
      <div className="hidden md:flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setPreviewViewport('desktop')}
          className={`p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
            previewViewport === 'desktop'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
          }`}
          title="Tampilan Desktop"
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
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section: Publish & Share */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <ExportCvModal />

        {isPublished && (
          <Button
            variant="outline"
            size="sm"
            onClick={copyPublicLink}
            className="h-8 text-xs gap-1.5 hidden sm:inline-flex"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Salin Link</span>
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 px-2 sm:px-3 text-xs gap-1.5"
          title="Buka Halaman Portofolio"
        >
          <a
            href={`/u/${portfolio.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Buka Web</span>
          </a>
        </Button>

        <Button
          size="sm"
          onClick={handleTogglePublish}
          disabled={publishing}
          className={`h-8 px-2.5 sm:px-3 text-xs font-medium gap-1.5 ${
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
