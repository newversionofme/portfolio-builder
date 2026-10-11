'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const { pending } = useFormStatus();

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
          <span className="hidden sm:inline">Keluar...</span>
        </>
      ) : (
        <>
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Keluar</span>
        </>
      )}
    </Button>
  );
}
