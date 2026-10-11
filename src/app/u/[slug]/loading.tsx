import React from 'react';

export default function PublicPortfolioLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 flex flex-col justify-between animate-pulse motion-reduce:animate-none">
      {/* Public Header Skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-28 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="flex gap-2">
            <div className="w-20 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
            <div className="w-24 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </header>

      {/* Hero Section Skeleton */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex-1 w-full space-y-12">
        <div className="space-y-6 max-w-2xl">
          <div className="w-24 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="space-y-3">
            <div className="w-full h-12 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-3/4 h-12 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="w-full h-4 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="w-5/6 h-4 rounded bg-zinc-100 dark:bg-zinc-800/60" />

          <div className="pt-2 flex gap-3">
            <div className="w-36 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-28 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        </div>

        {/* Section Cards Skeleton */}
        <div className="space-y-4 pt-6">
          <div className="w-36 h-6 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
              <div className="w-40 h-5 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-full h-3.5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
              <div className="w-4/5 h-3.5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
            </div>
            <div className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
              <div className="w-40 h-5 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-full h-3.5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
              <div className="w-4/5 h-3.5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-zinc-100 dark:border-zinc-900 py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="w-32 h-3.5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="w-24 h-3.5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
      </footer>
    </div>
  );
}
