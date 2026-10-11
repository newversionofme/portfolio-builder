import React from 'react';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between overflow-x-hidden w-full animate-pulse motion-reduce:animate-none">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-32 h-5 rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-24 h-4 rounded bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            <div className="w-16 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Welcome Banner Skeleton */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
          <div className="w-48 h-6 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-72 h-4 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="pt-2 flex gap-3">
            <div className="w-36 h-9 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-28 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        </div>

        {/* Action & Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-28 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-full h-3 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-32 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-full h-3 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
          <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-24 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-full h-3 rounded bg-zinc-100 dark:bg-zinc-800/60" />
          </div>
        </div>

        {/* Section Completion Skeleton */}
        <div className="p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
          <div className="w-40 h-5 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80 space-y-2">
                <div className="w-16 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-24 h-3 rounded bg-zinc-100 dark:bg-zinc-800/60" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
