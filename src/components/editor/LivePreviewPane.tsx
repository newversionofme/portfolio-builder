'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';

export function LivePreviewPane() {
  const { portfolio, previewViewport } = usePortfolioStore();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isIframeReadyRef = useRef<boolean>(false);

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
        sendSyncMessage();
      }
    };

    window.addEventListener('message', handleIncomingMessage);
    return () => {
      window.removeEventListener('message', handleIncomingMessage);
    };
  }, [sendSyncMessage]);

  // Sync state whenever portfolio updates
  useEffect(() => {
    sendSyncMessage();
  }, [portfolio, sendSyncMessage]);

  const handleIframeLoad = () => {
    isIframeReadyRef.current = true;
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

  return (
    <div className="flex-1 bg-zinc-100 dark:bg-zinc-900/80 flex items-center justify-center overflow-auto h-[calc(100vh-4rem)] p-2 sm:p-4">
      <div
        className={`transition-all duration-300 bg-white dark:bg-zinc-950 flex flex-col ${getContainerStyles()}`}
      >
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
