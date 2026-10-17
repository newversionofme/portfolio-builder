'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { EditorHeader } from './EditorHeader';
import { EditorTabs } from './EditorTabs';
import { LivePreviewPane } from './LivePreviewPane';
import { FileEdit, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useExportModalStore } from '@/lib/store/export-modal-store';
import { ExportCvModal } from '@/components/export/ExportCvModal';
import { ExportShareCardModal } from '@/components/export/ExportShareCardModal';
import { ExportFullPageModal } from '@/components/export/ExportFullPageModal';
import { useEditorText } from '@/lib/i18n/editor-copy';

interface EditorClientProps {
  initialData: FullPortfolioData;
}

export function EditorClient({ initialData }: EditorClientProps) {
  const tx = useEditorText();
  const { initializePortfolio, isInitialized, previewViewport, setPreviewViewport } =
    usePortfolioStore();
  const initializedIdRef = useRef<string | null>(null);

  // Mobile/Tablet tab switcher: 'edit' or 'preview'
  const [activeMobileView, setActiveMobileView] = useState<'edit' | 'preview'>('edit');
  const formWrapperRef = useRef<HTMLDivElement | null>(null);
  const previewWrapperRef = useRef<HTMLDivElement | null>(null);
  const savedFormScrollTopRef = useRef<number>(0);
  const savedPreviewScrollTopRef = useRef<number>(0);

  const {
    isCvModalOpen,
    setCvModalOpen,
    isShareCardModalOpen,
    setShareCardModalOpen,
    isFullPageModalOpen,
    setFullPageModalOpen,
  } = useExportModalStore();

  useEffect(() => {
    // Only initialize once on mount or when switching to a different portfolio ID
    const currentId = initialData.id || initialData.slug || 'default';
    if (!isInitialized || initializedIdRef.current !== currentId) {
      initializePortfolio(initialData);
      initializedIdRef.current = currentId;
    }
  }, [initialData, initializePortfolio, isInitialized]);

  const handleSwitchMobileView = (view: 'edit' | 'preview') => {
    if (view === activeMobileView) return;

    if (activeMobileView === 'edit') {
      const scrollEl = formWrapperRef.current?.querySelector('[role="tabpanel"]');
      if (scrollEl) {
        savedFormScrollTopRef.current = scrollEl.scrollTop;
      }
    } else if (activeMobileView === 'preview') {
      try {
        const iframeEl = previewWrapperRef.current?.querySelector('iframe');
        if (iframeEl?.contentWindow) {
          savedPreviewScrollTopRef.current =
            iframeEl.contentWindow.scrollY ||
            iframeEl.contentDocument?.documentElement.scrollTop ||
            0;
        }
      } catch {
        // Safe fallback if frame is inaccessible
      }
    }

    setActiveMobileView(view);

    if (view === 'edit') {
      requestAnimationFrame(() => {
        const scrollEl = formWrapperRef.current?.querySelector('[role="tabpanel"]');
        if (scrollEl && savedFormScrollTopRef.current > 0) {
          scrollEl.scrollTop = savedFormScrollTopRef.current;
        }
      });
    } else if (view === 'preview') {
      requestAnimationFrame(() => {
        try {
          const iframeEl = previewWrapperRef.current?.querySelector('iframe');
          if (iframeEl?.contentWindow && savedPreviewScrollTopRef.current > 0) {
            iframeEl.contentWindow.scrollTo({
              top: savedPreviewScrollTopRef.current,
              behavior: 'instant',
            });
          }
        } catch {
          // Safe fallback
        }
      });
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-pulse text-sm text-zinc-500">
          {tx('Memuat data portofolio...')}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen h-[100dvh] bg-white dark:bg-zinc-950 flex flex-col overflow-hidden">
      <EditorHeader />

      {/* Mobile/Tablet (< 1024px) Segmented Control: Edit vs Pratinjau */}
      <div className="lg:hidden shrink-0 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xs px-3 py-1.5 flex items-center justify-between gap-2 z-20">
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg w-full max-w-xs mx-auto border border-zinc-200/80 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => handleSwitchMobileView('edit')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-all min-h-[40px] cursor-pointer',
              activeMobileView === 'edit'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            )}
            aria-label={tx('Mode Edit Formulir')}
            aria-pressed={activeMobileView === 'edit'}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{tx('Edit')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMobileView('preview')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-semibold transition-all min-h-[40px] cursor-pointer',
              activeMobileView === 'preview'
                ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            )}
            aria-label={tx('Mode Pratinjau Langsung')}
            aria-pressed={activeMobileView === 'preview'}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{tx('Pratinjau')}</span>
          </button>
        </div>

        {/* In tablet mode (768px-1023px) when preview is active: allow toggling tablet vs mobile */}
        {activeMobileView === 'preview' && (
          <div className="hidden sm:flex md:flex lg:hidden items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={() => setPreviewViewport('tablet')}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium transition-all min-h-[36px]',
                previewViewport === 'tablet'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              )}
            >
              {tx('Tablet')}
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport('mobile')}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium transition-all min-h-[36px]',
                previewViewport === 'mobile'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
              )}
            >
              {tx('Mobile')}
            </button>
          </div>
        )}
      </div>

      {/* Main Work Area: Side-by-side on desktop (>=1024px), Switched via visibility on <1024px */}
      <div className="flex-1 min-h-0 relative flex flex-col lg:flex-row overflow-hidden">
        {/* Form Container: preserved with visibility: hidden when inactive on <1024px to prevent scroll reset */}
        <div
          ref={formWrapperRef}
          className={cn(
            'w-full lg:w-1/2 lg:flex-1 h-full min-h-0 overflow-hidden lg:overflow-x-auto',
            activeMobileView === 'edit'
              ? 'relative flex flex-col'
              : 'absolute inset-0 invisible pointer-events-none -z-10 lg:relative lg:visible lg:pointer-events-auto lg:z-auto lg:flex lg:flex-col'
          )}
        >
          <EditorTabs />
        </div>

        {/* Live Preview Container: preserved with visibility: hidden when inactive on <1024px */}
        <div
          ref={previewWrapperRef}
          className={cn(
            'w-full lg:w-1/2 lg:flex-1 h-full min-h-0 overflow-hidden',
            activeMobileView === 'preview'
              ? 'relative flex flex-col'
              : 'absolute inset-0 invisible pointer-events-none -z-10 lg:relative lg:visible lg:pointer-events-auto lg:z-auto lg:flex lg:flex-col'
          )}
        >
          <LivePreviewPane />
        </div>
      </div>

      {/* Single Shared Instances of Export Modals */}
      <ExportCvModal open={isCvModalOpen} onOpenChange={setCvModalOpen} />
      <ExportShareCardModal
        open={isShareCardModalOpen}
        onOpenChange={setShareCardModalOpen}
      />
      <ExportFullPageModal
        open={isFullPageModalOpen}
        onOpenChange={setFullPageModalOpen}
      />
    </div>
  );
}

