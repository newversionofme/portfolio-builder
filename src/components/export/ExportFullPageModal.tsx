'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { getDictionary, SupportedLanguage } from '@/lib/i18n/dictionary';
import { sanitizePngFilename } from '@/lib/export/sanitize-png-filename';
import { optimizeImageToDataUri } from '@/lib/export/optimize-image';
import { captureFullPage, calculateCapturePlan } from '@/lib/export/capture-full-page';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Monitor, Loader2, Download, AlertCircle, RotateCw, Layers } from 'lucide-react';
import { toast } from 'sonner';

import { toPng } from 'html-to-image';

if (typeof window !== 'undefined') {
  (window as unknown as { __captureFullPage?: typeof captureFullPage; __calculateCapturePlan?: typeof calculateCapturePlan; __toPng?: typeof toPng }).__captureFullPage = captureFullPage;
  (window as unknown as { __calculateCapturePlan?: typeof calculateCapturePlan }).__calculateCapturePlan = calculateCapturePlan;
  (window as unknown as { __toPng?: typeof toPng }).__toPng = toPng;
}

interface ExportFullPageModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExportFullPageModal({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ExportFullPageModalProps) {
  const { portfolio } = usePortfolioStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const [isGenerating, setIsGenerating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [avatarDataUri, setAvatarDataUri] = useState<string | null>(null);
  const [optimizedImages, setOptimizedImages] = useState<Record<string, string>>({});
  const [isClientMounted, setIsClientMounted] = useState(false);

  const captureNodeRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.45);

  const language = (portfolio.language || 'id') as SupportedLanguage;
  const t = getDictionary(language);

  // Mark client mounted for safe Portal rendering
  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  // Pre-load and optimize images when modal opens
  useEffect(() => {
    let isMounted = true;
    if (open) {
      // 1. Optimize avatar
      if (portfolio.profile?.avatarUrl) {
        optimizeImageToDataUri(portfolio.profile.avatarUrl).then((uri) => {
          if (isMounted && uri) setAvatarDataUri(uri);
        });
      } else {
        setAvatarDataUri(null);
      }

      // 2. Pre-optimize project images
      const imageUrls: string[] = [];
      portfolio.projects?.forEach((p) => {
        if (p.imageUrl && !p.imageUrl.startsWith('data:')) imageUrls.push(p.imageUrl);
      });

      if (imageUrls.length > 0) {
        Promise.all(
          imageUrls.map(async (url) => {
            const optimized = await optimizeImageToDataUri(url);
            return { url, optimized };
          })
        ).then((results) => {
          if (!isMounted) return;
          const map: Record<string, string> = {};
          results.forEach(({ url, optimized }) => {
            if (optimized) map[url] = optimized;
          });
          setOptimizedImages(map);
        });
      }
    } else {
      setAvatarDataUri(null);
      setOptimizedImages({});
    }

    return () => {
      isMounted = false;
    };
  }, [open, portfolio]);

  // Adjust preview scale dynamically on resize with ResizeObserver
  useEffect(() => {
    if (!open) return;
    const container = previewContainerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.clientWidth;
      if (containerWidth > 0) {
        setPreviewScale(Math.min(1, containerWidth / 1280));
      }
    };

    updateScale();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setPreviewScale(Math.min(1, width / 1280));
        }
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [open]);

  // Cleanup stage if modal closes or unmounts during capture
  useEffect(() => {
    if (!open) {
      setIsCapturing(false);
      setIsGenerating(false);
      setProgressStatus('');
    }
  }, [open]);

  useEffect(() => {
    return () => {
      setIsCapturing(false);
      setIsGenerating(false);
      setProgressStatus('');
    };
  }, []);

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setProgressStatus(
      language === 'en' ? 'Preparing full-page canvas...' : 'Menyiapkan canvas halaman penuh...'
    );
    setIsCapturing(true);

    // Timeout safeguard: 30 seconds for full-page
    let isTimedOut = false;
    const timeoutTimer = setTimeout(() => {
      isTimedOut = true;
    }, 30000);

    try {
      // 1. Wait for 2 animation frames so React renders the portal into document.body
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      // 2. Wait for document fonts to be ready
      if (typeof document !== 'undefined' && 'fonts' in document) {
        await document.fonts.ready;
      }

      // 3. Ensure target capture node exists in the portal
      const targetNode = captureNodeRef.current;
      if (!targetNode) {
        throw new Error('Elemen capture halaman penuh tidak ditemukan.');
      }

      // 4. Ensure all images inside targetNode have loaded (with eager loading & 2s timeout)
      const images = Array.from(targetNode.querySelectorAll('img'));
      await Promise.all(
        images.map((img) => {
          img.loading = 'eager';
          if (img.complete && img.naturalWidth > 0) return Promise.resolve(true);
          return new Promise((resolve) => {
            const timer = setTimeout(() => resolve(false), 2000);
            img.onload = () => {
              clearTimeout(timer);
              resolve(true);
            };
            img.onerror = () => {
              clearTimeout(timer);
              resolve(false);
            };
          });
        })
      );

      // Brief pause for browser layout rendering to settle
      await new Promise((r) => setTimeout(r, 120));

      if (isTimedOut) {
        throw new Error('TIMEOUT');
      }

      // 5. Run full-page capture with adaptive slicing and conservative bounds
      const baseFilename = sanitizePngFilename(portfolio.slug, portfolio.templateId).replace(/\.png$/i, '');
      const filenameBase = `${baseFilename}-full`;

      const results = await captureFullPage(targetNode, {
        filenameBase,
        onProgress: (status) => {
          setProgressStatus(status);
        },
      });

      clearTimeout(timeoutTimer);

      if (isTimedOut) {
        throw new Error('TIMEOUT');
      }

      // 6. Download results sequentially
      for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const link = document.createElement('a');
        link.href = item.dataUrl;
        link.download = item.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Small pause between multiple part downloads
        if (i < results.length - 1) {
          await new Promise((r) => setTimeout(r, 400));
        }
      }

      toast.success(
        language === 'en'
          ? results.length > 1
            ? `Full-page exported successfully in ${results.length} parts!`
            : 'Full-page image (PNG) successfully exported!'
          : results.length > 1
            ? `Gambar halaman penuh berhasil diunduh dalam ${results.length} bagian!`
            : 'Gambar halaman penuh (PNG) berhasil dibuat dan diunduh!'
      );
      setOpen(false);
    } catch (err: unknown) {
      clearTimeout(timeoutTimer);
      const isTimeoutErr =
        isTimedOut || (err instanceof Error && err.message === 'TIMEOUT');

      if (isTimeoutErr) {
        setErrorMessage(
          language === 'en'
            ? 'Server took too long to render. Please try again.'
            : 'Belum ada respons dari sistem. Silakan coba lagi.'
        );
        toast.error(
          language === 'en'
            ? 'Timeout: Generation took more than 30 seconds.'
            : 'Waktu habis: Proses pembuatan melebihi 30 detik.'
        );
      } else {
        console.error('[ExportFullPageModal] Full-page PNG capture failed:', err);
        setErrorMessage(
          language === 'en'
            ? 'Failed to generate full-page image. Please try again.'
            : 'Gagal membuat gambar halaman penuh. Silakan coba lagi.'
        );
        toast.error(
          language === 'en'
            ? 'Failed to export full-page image.'
            : 'Gagal mengekspor gambar halaman penuh.'
        );
      }
    } finally {
      setIsCapturing(false);
      setIsGenerating(false);
      setProgressStatus('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {(trigger || controlledOpen === undefined) && (
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              size="sm"
              className="h-10 sm:h-8 px-3 text-xs gap-1.5 cursor-pointer font-medium min-h-[40px] sm:min-h-[32px]"
            >
              <Monitor className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t.fullPageExport.downloadFullPage}</span>
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
            <Monitor className="w-5 h-5" />
          </div>
          <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-white">
            {t.fullPageExport.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 break-words min-w-0 leading-relaxed">
            {t.fullPageExport.desc}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 min-w-0">
          {/* Meta Specs Box */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 text-xs min-w-0">
              <span className="text-zinc-500 shrink-0">
                {language === 'en' ? 'Resolution Width:' : 'Lebar Tangkapan:'}
              </span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200 break-words min-w-0 sm:text-right">
                1280 px (Standar Desktop)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 text-xs min-w-0">
              <span className="text-zinc-500 shrink-0">
                {language === 'en' ? 'Active Theme:' : 'Tema Visual:'}
              </span>
              <span className="font-medium capitalize text-zinc-800 dark:text-zinc-200 break-words min-w-0 sm:text-right">
                {portfolio.templateId || 'minimalist'} ({portfolio.fontFamily || 'Inter'})
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 text-xs min-w-0">
              <span className="text-zinc-500 shrink-0">
                {language === 'en' ? 'Target Size:' : 'Ukuran Berkas:'}
              </span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 break-words min-w-0 sm:text-right">
                {language === 'en' ? 'Ultra-lightweight (< 2 MB)' : 'Ringan & Teroptimasi (< 2 MB)'}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 text-xs min-w-0">
              <span className="text-zinc-500 shrink-0">
                {language === 'en' ? 'Content Layout:' : 'Format Konten:'}
              </span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200 break-words min-w-0 sm:text-right">
                {language === 'en'
                  ? 'Full text & link details (no clipped images)'
                  : 'Teks utuh & tautan lengkap (bebas gambar terpotong)'}
              </span>
            </div>
          </div>

          {/* Interactive Preview Container */}
          <div className="space-y-1.5 min-w-0">
            <span className="text-[11px] font-medium text-zinc-500">
              {language === 'en' ? 'Layout Preview:' : 'Pratinjau Tata Letak:'}
            </span>
            <div
              ref={previewContainerRef}
              className="w-full max-w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 relative shadow-inner overflow-y-auto"
            >
              <div
                style={{
                  width: '1280px',
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                }}
                className="pointer-events-none"
              >
                <PortfolioRenderer
                  data={portfolio}
                  exportMode="full-page"
                  avatarDataUri={avatarDataUri}
                  optimizedImages={optimizedImages}
                />
              </div>
            </div>
          </div>

          {/* Error Message with Retry */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center justify-between gap-3 text-xs text-red-700 dark:text-red-400">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="h-7 text-xs border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 gap-1 shrink-0"
              >
                <RotateCw className="w-3 h-3" />
                <span>{t.fullPageExport.retry}</span>
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
            className="text-xs min-h-[40px] sm:min-h-[36px]"
          >
            {language === 'en' ? 'Cancel' : 'Batal'}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownload}
            disabled={isGenerating}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5 min-h-[40px] sm:min-h-[36px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{progressStatus || t.fullPageExport.downloading}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{t.fullPageExport.downloadButton}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Isolated Offscreen 1280px Capture Stage via Portal into document.body */}
      {isClientMounted &&
        isCapturing &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={captureNodeRef}
            id="full-page-capture-stage"
            aria-hidden="true"
            style={{
              width: '1280px',
              position: 'fixed',
              left: '-10000px',
              top: '0',
              pointerEvents: 'none',
              overflow: 'visible',
            }}
          >
            <PortfolioRenderer
              data={portfolio}
              exportMode="full-page"
              avatarDataUri={avatarDataUri}
              optimizedImages={optimizedImages}
            />
          </div>,
          document.body
        )}
    </Dialog>
  );
}
