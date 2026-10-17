'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { loginWithGoogle } from '@/actions/auth';

interface GoogleAuthButtonProps {
  mode?: 'login' | 'register';
  callbackUrl?: string;
  onError?: (errorMessage: string) => void;
}

export function GoogleAuthButton({
  mode = 'login',
  callbackUrl = '/dashboard',
  onError,
}: GoogleAuthButtonProps) {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleGoogleClick = async () => {
    setLoading(true);
    try {
      const res = await loginWithGoogle(callbackUrl);
      if (res?.error) {
        setLoading(false);
        if (onError) {
          onError(res.error);
        } else {
          alert(res.error);
        }
      }
    } catch {
      // In Next.js, signIn with OAuth triggers a redirect which might throw NEXT_REDIRECT in some environments.
      // If it's a real failure, we stop loading.
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleClick}
      disabled={loading}
      className="w-full h-10 font-medium text-sm text-zinc-700 dark:text-zinc-200 border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2.5"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
          <span>{language === 'en' ? 'Connecting to Google...' : 'Menghubungkan ke Google...'}</span>
        </>
      ) : (
        <>
          {/* Official Google G Logo SVG */}
          <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>
            {mode === 'login'
              ? language === 'en'
                ? 'Sign in with Google'
                : 'Masuk dengan Google'
              : language === 'en'
              ? 'Sign up with Google'
              : 'Daftar dengan Google'}
          </span>
        </>
      )}
    </Button>
  );
}

