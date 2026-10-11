import React from 'react';

export default function EditorLoading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden animate-pulse motion-reduce:animate-none">
      {/* Editor Header Skeleton */}
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-32 h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-20 h-4 rounded bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-28 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 hidden md:block" />
          <div className="w-24 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="w-20 h-8 rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </header>

      {/* Editor Main Content: Sidebar + Form (Left) & Preview (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Area */}
        <div className="w-full lg:w-[540px] xl:w-[600px] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
          {/* Vertical Tab Sidebar Skeleton (Desktop >=1024px) */}
          <div className="hidden lg:flex w-48 border-r border-zinc-100 dark:border-zinc-900 flex-col p-3 space-y-2 shrink-0">
            <div className="w-28 h-3 rounded bg-zinc-200 dark:bg-zinc-800 mb-2" />
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="w-full h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
            ))}
          </div>

          {/* Form Content Area Skeleton */}
          <div className="flex-1 p-6 space-y-5 overflow-y-auto">
            <div className="space-y-1.5">
              <div className="w-40 h-5 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-64 h-3.5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
            </div>

            {/* Form Fields Placeholders */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-24 h-3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-32 h-8 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="w-24 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-full h-9 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <div className="space-y-1.5">
                <div className="w-32 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-full h-9 rounded-md bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Preview Area Skeleton */}
        <div className="hidden lg:flex flex-1 bg-zinc-100 dark:bg-zinc-900/80 items-center justify-center p-4">
          <div className="w-full h-full max-w-4xl bg-white dark:bg-zinc-950 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 p-8 space-y-8">
            <div className="flex justify-between items-center">
              <div className="w-36 h-6 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex gap-2">
                <div className="w-16 h-7 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-16 h-7 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="space-y-3 pt-6">
              <div className="w-3/4 h-10 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-1/2 h-5 rounded bg-zinc-100 dark:bg-zinc-800/60" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="h-32 rounded-lg bg-zinc-100 dark:bg-zinc-800/40" />
              <div className="h-32 rounded-lg bg-zinc-100 dark:bg-zinc-800/40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
