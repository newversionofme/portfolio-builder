'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const { pending } = useFormStatus();
  const { t, language } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      type="submit"
      disabled={pending}
      className="text-xs gap-1.5 text-zinc-600 hover:text-red-600 px-2 sm:px-3"
    >
      {pending ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="hidden sm:inline">{language === 'en' ? 'Logging out...' : 'Keluar...'}</span>
        </>
      ) : (
        <>
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.dashboard.logout}</span>
        </>
      )}
    </Button>
  );
}
