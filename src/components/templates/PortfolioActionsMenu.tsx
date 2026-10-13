'use client';

import React from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, Globe, Sun, Moon, Laptop, Check } from 'lucide-react';

interface PortfolioActionsMenuProps {
  currentLanguage: 'id' | 'en';
  onLanguageChange: (lang: 'id' | 'en') => void;
  className?: string;
  variant?: 'outline' | 'ghost';
  triggerIcon?: 'gear' | 'dots';
}

export function PortfolioActionsMenu({
  currentLanguage,
  onLanguageChange,
  className = '',
  variant = 'ghost',
  triggerIcon = 'gear',
}: PortfolioActionsMenuProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="sm"
          className={`w-8 h-8 p-0 rounded-full shrink-0 flex items-center justify-center transition-transform hover:scale-105 focus-visible:ring-1 focus-visible:ring-blue-500 ${className}`}
          aria-label="Pengaturan Bahasa & Tema"
          title="Pengaturan Bahasa & Tema"
        >
          <Settings className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="top"
        sideOffset={8}
        className="w-52 text-xs bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl p-1.5 z-50"
      >
        {/* Language Selection */}
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold px-2 py-1 flex items-center gap-1.5">
          <Globe className="w-3 h-3 text-zinc-500" />
          <span>Bahasa Portofolio</span>
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => onLanguageChange('id')}
          className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg text-xs"
        >
          <div className="flex items-center gap-2">
            <span>🇮🇩</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Bahasa Indonesia</span>
          </div>
          {currentLanguage === 'id' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onLanguageChange('en')}
          className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg text-xs"
        >
          <div className="flex items-center gap-2">
            <span>🇬🇧</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-200">English</span>
          </div>
          {currentLanguage === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 border-zinc-200 dark:border-zinc-800" />

        {/* Theme Selection */}
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-semibold px-2 py-1 flex items-center gap-1.5">
          {resolvedTheme === 'dark' ? (
            <Moon className="w-3 h-3 text-violet-400" />
          ) : (
            <Sun className="w-3 h-3 text-amber-500" />
          )}
          <span>Mode Tampilan</span>
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg text-xs"
        >
          <div className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>Terang (Light)</span>
          </div>
          {theme === 'light' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg text-xs"
        >
          <div className="flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-violet-400" />
            <span>Gelap (Dark)</span>
          </div>
          {theme === 'dark' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="flex items-center justify-between cursor-pointer py-1.5 px-2 rounded-lg text-xs"
        >
          <div className="flex items-center gap-2">
            <Laptop className="w-3.5 h-3.5 text-zinc-400" />
            <span>Ikuti Sistem</span>
          </div>
          {theme === 'system' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
