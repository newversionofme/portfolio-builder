'use client';

import React, { useEffect, useRef } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { EditorHeader } from './EditorHeader';
import { EditorTabs } from './EditorTabs';
import { LivePreviewPane } from './LivePreviewPane';

interface EditorClientProps {
  initialData: FullPortfolioData;
}

export function EditorClient({ initialData }: EditorClientProps) {
  const { initializePortfolio, isInitialized } = usePortfolioStore();
  const initializedIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only initialize once on mount or when switching to a different portfolio ID
    const currentId = initialData.id || initialData.slug || 'default';
    if (!isInitialized || initializedIdRef.current !== currentId) {
      initializePortfolio(initialData);
      initializedIdRef.current = currentId;
    }
  }, [initialData, initializePortfolio, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="animate-pulse text-sm text-zinc-500">
          Memuat data portofolio...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <EditorHeader />
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <EditorTabs />
        <LivePreviewPane />
      </div>
    </div>
  );
}
