import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex flex-col justify-between p-3.5 sm:p-6 lg:p-8 w-full overflow-x-hidden">
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-zinc-900 dark:text-white group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>Portfolio<span className="text-blue-600">Builder</span></span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main Form Content */}
      <main className="flex-1 flex items-center justify-center py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full text-center text-xs text-zinc-500 py-4">
        &copy; {new Date().getFullYear()} Portfolio Builder. Platform Portofolio Instan & Modern.
      </footer>
    </div>
  );
}
