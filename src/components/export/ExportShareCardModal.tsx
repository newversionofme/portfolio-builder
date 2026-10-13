'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { getDictionary, SupportedLanguage } from '@/lib/i18n/dictionary';
import { sanitizePngFilename } from '@/lib/export/sanitize-png-filename';
import { imageToDataUri } from '@/lib/pdf/image-to-data-uri';
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
import { ImageIcon, Loader2, Download, AlertCircle, RotateCw } from 'lucide-react';
import { toast } from 'sonner';

interface ExportShareCardModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExportShareCardModal({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ExportShareCardModalProps) {
  const { portfolio } = usePortfolioStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const [isGenerating, setIsGenerating] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [avatarDataUri, setAvatarDataUri] = useState<string | null>(null);
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

  // Pre-load avatar data URI when modal opens
  useEffect(() => {
    let isMounted = true;
    if (open && portfolio.profile?.avatarUrl) {
      imageToDataUri(portfolio.profile.avatarUrl).then((uri) => {
        if (isMounted) setAvatarDataUri(uri);
      });
    } else if (open) {
      setAvatarDataUri(null);
    }
    return () => {
      isMounted = false;
    };
  }, [open, portfolio.profile?.avatarUrl]);

  // Adjust preview scale dynamically on resize
  useEffect(() => {
    if (!open) return;
    const container = previewContainerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.clientWidth;
      if (containerWidth > 0) {
        setPreviewScale(Math.min(1, containerWidth / 1200));
      }
    };

    updateScale();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0) {
          setPreviewScale(Math.min(1, width / 1200));
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
    }
  }, [open]);

  useEffect(() => {
    return () => {
      setIsCapturing(false);
      setIsGenerating(false);
    };
  }, []);

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setIsCapturing(true);

    // Timeout safeguard: 15 seconds
    let isTimedOut = false;
    const timeoutTimer = setTimeout(() => {
      isTimedOut = true;
    }, 15000);

    try {
      // 1. Wait for 2 animation frames so React renders the portal into document.body
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve))
      );

      // 2. Wait for document fonts to be ready
      if (typeof document !== 'undefined' && 'fonts' in document) {
        await document.fonts.ready;
      }

      // 3. Fetch fresh avatar data URI if not yet loaded
      let currentAvatarUri = avatarDataUri;
      if (!currentAvatarUri && portfolio.profile?.avatarUrl) {
        currentAvatarUri = await imageToDataUri(portfolio.profile.avatarUrl);
        setAvatarDataUri(currentAvatarUri);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }

      // 4. Ensure target capture node exists in the portal
      const targetNode = captureNodeRef.current;
      if (!targetNode) {
        throw new Error('Elemen capture kartu tidak ditemukan.');
      }

      // 5. Ensure all images inside node have loaded (with eager loading & 2s timeout)
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
      await new Promise((r) => setTimeout(r, 100));

      if (isTimedOut) {
        throw new Error('TIMEOUT');
      }

      // 6. Dynamic import html-to-image
      const { toPng } = await import('html-to-image');

      const dataUrl = await toPng(targetNode, {
        width: 1200,
        height: 630,
        canvasWidth: 1200,
        canvasHeight: 630,
        pixelRatio: 2, // High resolution retina rendering
        cacheBust: false,
        style: {
          position: 'static',
          left: '0',
          top: '0',
          margin: '0',
          transform: 'none',
        },
      });

      clearTimeout(timeoutTimer);

      if (isTimedOut) {
        throw new Error('TIMEOUT');
      }

      // 7. Trigger download with sanitized filename
      const filename = sanitizePngFilename(portfolio.slug, portfolio.templateId);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        language === 'en'
          ? 'Share card image (PNG) successfully generated and downloaded!'
          : 'Kartu Bagikan (PNG) berhasil dibuat dan diunduh!'
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
            ? 'Timeout: Generation took more than 15 seconds.'
            : 'Waktu habis: Proses pembuatan melebihi 15 detik.'
        );
      } else {
        console.error('[ExportShareCardModal] PNG capture failed:', err);
        setErrorMessage(
          language === 'en'
            ? 'Failed to generate image. Please try again.'
            : 'Gagal membuat gambar kartu. Silakan coba lagi.'
        );
        toast.error(
          language === 'en'
            ? 'Failed to export PNG image.'
            : 'Gagal mengekspor gambar PNG.'
        );
      }
    } finally {
      setIsCapturing(false);
      setIsGenerating(false);
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
              <ImageIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{t.shareCardExport.downloadShareCard}</span>
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden p-4 sm:p-6">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
            <ImageIcon className="w-5 h-5" />
          </div>
          <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-white">
            {t.shareCardExport.shareCardTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500 break-words min-w-0 leading-relaxed">
            {t.shareCardExport.shareCardDesc}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 min-w-0">
          {/* Card Meta Specs */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 text-xs min-w-0">
              <span className="text-zinc-500 shrink-0">
                {language === 'en' ? 'Resolution:' : 'Resolusi Kartu:'}
              </span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200 break-words min-w-0 sm:text-right">
                1200 × 630 px (Standar OpenGraph / Media Sosial)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2 text-xs min-w-0">
              <span className="text-zinc-500 shrink-0">
                {language === 'en' ? 'Active Theme:' : 'Tema Visual:'}
              </span>
              <span className="font-medium capitalize text-zinc-800 dark:text-zinc-200 break-words min-w-0 sm:text-right">
                {portfolio.templateId || 'minimalist'} (
                {portfolio.fontFamily || 'Inter'})
              </span>
            </div>
          </div>

          {/* Interactive Preview Container */}
          <div className="space-y-1.5 min-w-0">
            <span className="text-[11px] font-medium text-zinc-500">
              {language === 'en' ? 'Preview:' : 'Pratinjau Hasil:'}
            </span>
            <div
              ref={previewContainerRef}
              className="w-full max-w-full aspect-[1200/630] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 relative shadow-inner"
            >
              <div
                style={{
                  width: '1200px',
                  height: '630px',
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'top left',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                className="pointer-events-none"
              >
                <PortfolioRenderer
                  data={portfolio}
                  exportMode="share-card"
                  avatarDataUri={avatarDataUri}
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
                <span>{t.shareCardExport.retry}</span>
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
            className="text-xs bg-purple-600 hover:bg-purple-700 text-white gap-1.5 min-h-[40px] sm:min-h-[36px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.shareCardExport.downloading}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{t.shareCardExport.downloadButton}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* Isolated Offscreen 1200x630 Capture Stage via Portal into document.body */}
      {isClientMounted &&
        isCapturing &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={captureNodeRef}
            id="share-card-capture-stage"
            aria-hidden="true"
            style={{
              width: '1200px',
              height: '630px',
              position: 'fixed',
              left: '-10000px',
              top: '0',
              pointerEvents: 'none',
              overflow: 'hidden',
            }}
          >
            <PortfolioRenderer
              data={portfolio}
              exportMode="share-card"
              avatarDataUri={avatarDataUri}
            />
          </div>,
          document.body
        )}
    </Dialog>
  );
}
