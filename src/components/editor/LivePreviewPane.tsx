'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LivePreviewPane() {
  const { portfolio, previewViewport } = usePortfolioStore();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isIframeReadyRef = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTemplateSwitching, setIsTemplateSwitching] = useState(false);
  const prevTemplateRef = useRef(portfolio.templateId);

  const sendSyncMessage = useCallback(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'PORTFOLIO_PREVIEW_SYNC',
          data: portfolio,
        },
        window.location.origin
      );
    }
  }, [portfolio]);

  // Handle incoming ready handshake from preview iframe
  useEffect(() => {
    const handleIncomingMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'PREVIEW_READY') {
        isIframeReadyRef.current = true;
        setIsLoading(false);
        sendSyncMessage();
      }
    };

    window.addEventListener('message', handleIncomingMessage);
    return () => {
      window.removeEventListener('message', handleIncomingMessage);
    };
  }, [sendSyncMessage]);

  // Track template switching
  useEffect(() => {
    if (prevTemplateRef.current !== portfolio.templateId) {
      prevTemplateRef.current = portfolio.templateId;
      setIsTemplateSwitching(true);
      const timer = setTimeout(() => {
        setIsTemplateSwitching(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [portfolio.templateId]);

  // Sync state whenever portfolio updates
  useEffect(() => {
    sendSyncMessage();
  }, [portfolio, sendSyncMessage]);

  const handleIframeLoad = () => {
    isIframeReadyRef.current = true;
    setIsLoading(false);
    sendSyncMessage();
  };

  const getContainerStyles = () => {
    switch (previewViewport) {
      case 'mobile':
        return 'w-full h-full rounded-none border-none ring-0 shadow-none my-0 sm:w-[375px] sm:h-full sm:max-h-[820px] sm:my-auto sm:rounded-[2.5rem] sm:ring-8 sm:ring-zinc-900/90 sm:shadow-2xl sm:border-4 sm:border-zinc-950 sm:overflow-hidden';
      case 'tablet':
        return 'w-full h-full rounded-none border-none ring-0 shadow-none my-0 sm:w-[768px] sm:max-w-full sm:h-full sm:max-h-[900px] sm:my-auto sm:rounded-2xl sm:ring-4 sm:ring-zinc-800/90 sm:shadow-2xl sm:border-2 sm:border-zinc-800 sm:overflow-hidden';
      case 'desktop':
      default:
        return 'w-full h-full rounded-none border-none ring-0 shadow-none my-0';
    }
  };

  const showOverlay = isLoading || isTemplateSwitching;

  return (
    <div
      className={cn(
        'flex-1 min-h-0 w-full h-full bg-zinc-100 dark:bg-zinc-900/80 flex items-center justify-center overflow-hidden relative',
        previewViewport !== 'desktop' ? 'p-0 sm:p-4' : 'p-0'
      )}
    >
      <div
        className={cn(
          'transition-all duration-300 bg-white dark:bg-zinc-950 flex flex-col relative',
          getContainerStyles()
        )}
      >
        {/* Skeleton & Indicator Overlay */}
        {showOverlay && (
          <div
            aria-live="polite"
            className="absolute inset-0 z-20 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xs flex flex-col items-center justify-center gap-3 p-6 pointer-events-none transition-opacity duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
              <Loader2 className="w-5 h-5 animate-spin motion-reduce:animate-none" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                {isTemplateSwitching ? 'Menerapkan Tema Baru...' : 'Memuat Pratinjau...'}
              </p>
              <p className="text-[11px] text-zinc-500">
                Menyinkronkan data langsung ke tampilan
              </p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src="/preview"
          title="Portfolio Live Preview"
          className="w-full h-full border-0 bg-transparent flex-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
}
