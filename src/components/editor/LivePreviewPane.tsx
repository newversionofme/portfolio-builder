'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { Loader2 } from 'lucide-react';

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
        return 'w-[375px] h-[812px] max-w-full my-auto rounded-[2.5rem] ring-8 ring-zinc-900/90 shadow-2xl overflow-hidden border-4 border-zinc-950';
      case 'tablet':
        return 'w-[768px] h-[900px] max-w-full my-auto rounded-2xl ring-4 ring-zinc-800/90 shadow-2xl overflow-hidden border-2 border-zinc-800';
      case 'desktop':
      default:
        return 'w-full h-full rounded-none border-none';
    }
  };

  const showOverlay = isLoading || isTemplateSwitching;

  return (
    <div className="flex-1 bg-zinc-100 dark:bg-zinc-900/80 flex items-center justify-center overflow-auto h-[calc(100vh-4rem)] p-2 sm:p-4 relative">
      <div
        className={`transition-all duration-300 bg-white dark:bg-zinc-950 flex flex-col relative ${getContainerStyles()}`}
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
          onLoad={handleIframeLoad}
        />
      </div>
    </div>
  );
}
