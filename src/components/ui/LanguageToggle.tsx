'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';

interface LanguageToggleProps {
  variant?: 'ghost' | 'outline';
  className?: string;
}

export function LanguageToggle({
  variant = 'ghost',
  className = '',
}: LanguageToggleProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={`h-8 px-2.5 text-xs font-semibold gap-1.5 rounded-full text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${className}`}
          aria-label={t.nav.language}
          title={t.nav.language}
        >
          <Globe className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span>{language === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44 text-xs p-1">
        <DropdownMenuItem
          onClick={() => setLanguage('id')}
          className="flex items-center justify-between py-1.5 px-2 cursor-pointer rounded-md"
        >
          <div className="flex items-center gap-2">
            <span>🇮🇩</span>
            <span className="font-medium">Bahasa Indonesia</span>
          </div>
          {language === 'id' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('en')}
          className="flex items-center justify-between py-1.5 px-2 cursor-pointer rounded-md"
        >
          <div className="flex items-center gap-2">
            <span>🇬🇧</span>
            <span className="font-medium">English</span>
          </div>
          {language === 'en' && <Check className="w-3.5 h-3.5 text-blue-600" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

