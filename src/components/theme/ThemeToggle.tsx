'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Laptop, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme, resetTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch icon flicker
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`w-8 h-8 p-0 rounded-lg text-zinc-600 dark:text-zinc-400 ${className || ''}`}
        aria-label="Toggle tema"
      >
        <Sun className="w-4 h-4 text-amber-500" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`w-8 h-8 p-0 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors ${className || ''}`}
          aria-label="Pengaturan tema tampilan"
          title={`Tema aktif: ${theme === 'system' ? 'Sistem' : theme === 'dark' ? 'Gelap' : 'Terang'}`}
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="w-4 h-4 text-violet-400 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500 transition-transform" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 text-xs">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold px-2 py-1.5">
          Tema Tampilan
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center justify-between cursor-pointer py-1.5"
        >
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Terang (Light)</span>
          </div>
          {theme === 'light' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center justify-between cursor-pointer py-1.5"
        >
          <div className="flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-violet-400" />
            <span>Gelap (Dark)</span>
          </div>
          {theme === 'dark' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center justify-between cursor-pointer py-1.5"
        >
          <div className="flex items-center gap-2">
            <Laptop className="w-3.5 h-3.5 text-zinc-500" />
            <span>Sistem (Device)</span>
          </div>
          {theme === 'system' && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
        </DropdownMenuItem>

        {theme !== 'system' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={resetTheme}
              className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer py-1.5 text-[11px]"
            >
              <RotateCcw className="w-3 h-3 text-zinc-400" />
              <span>Reset ke Pengaturan Default</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

