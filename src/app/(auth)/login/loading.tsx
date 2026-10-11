import React from 'react';

export default function LoginLoading() {
  return (
    <div className="w-full max-w-md animate-pulse motion-reduce:animate-none">
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-lg space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-48 h-7 rounded bg-zinc-200 dark:bg-zinc-800 mx-auto" />
          <div className="w-64 h-4 rounded bg-zinc-100 dark:bg-zinc-800/60 mx-auto" />
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="w-16 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-full h-10 rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
          </div>

          <div className="space-y-1.5">
            <div className="w-20 h-3.5 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-full h-10 rounded-md bg-zinc-100 dark:bg-zinc-800/60" />
          </div>

          <div className="w-full h-10 rounded-md bg-zinc-200 dark:bg-zinc-800 pt-2" />
        </div>

        <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
          <div className="w-40 h-3.5 rounded bg-zinc-100 dark:bg-zinc-800/60 mx-auto" />
        </div>
      </div>
    </div>
  );
}
