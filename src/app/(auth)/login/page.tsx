'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { loginWithCredentials } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, ArrowRight, Loader2, UserCheck, AlertCircle } from 'lucide-react';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registered = searchParams.get('registered');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const timeoutPromise = new Promise<{ timeout: true }>((resolve) =>
      setTimeout(() => resolve({ timeout: true }), 15000)
    );

    try {
      const res = await Promise.race([
        loginWithCredentials(email, password),
        timeoutPromise,
      ]);

      if ('timeout' in res) {
        setError('Belum ada respons dari server. Periksa koneksi Anda sebelum mencoba lagi.');
        setLoading(false);
        return;
      }

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.success) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
      setLoading(false);
    }
  };

  const fillDemoAccount = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password123!');
    setError(null);
    setLoading(true);

    const timeoutPromise = new Promise<{ timeout: true }>((resolve) =>
      setTimeout(() => resolve({ timeout: true }), 15000)
    );

    try {
      const res = await Promise.race([
        loginWithCredentials(demoEmail, 'Password123!'),
        timeoutPromise,
      ]);

      if ('timeout' in res) {
        setError('Belum ada respons dari server. Periksa koneksi Anda sebelum mencoba lagi.');
        setLoading(false);
        return;
      }

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.success) {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Terjadi kesalahan saat masuk akun demo. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Selamat Datang Kembali</CardTitle>
        <CardDescription>
          Masuk ke akun Anda untuk mengelola dan mempublikasikan portofolio
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {registered && (
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-sm flex items-center gap-2 border border-emerald-200 dark:border-emerald-900">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>Akun berhasil dibuat! Silakan masuk dengan kredensial Anda.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-sm flex items-center gap-2 border border-red-200 dark:border-red-900">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Alamat Email</Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <Input
                id="email"
                type="email"
                placeholder="nama@domain.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-10 font-medium" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                Masuk Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        {/* Quick Demo Fill Buttons for Testing (Only in Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="pt-2">
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="flex-shrink mx-3 text-xs text-zinc-400 uppercase tracking-wider">
                Dev Demo Quick Fill
              </span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs text-zinc-600 dark:text-zinc-400 justify-start"
                onClick={() => fillDemoAccount('alex.rivera@example.com')}
              >
                👨‍💻 Alex (Developer)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs text-zinc-600 dark:text-zinc-400 justify-start"
                onClick={() => fillDemoAccount('maya.lin@example.com')}
              >
                🎨 Maya (Designer)
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Belum punya akun?{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:underline">
            Daftar Gratis
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <Suspense fallback={<div className="p-8 text-center text-sm text-zinc-500">Memuat formulir masuk...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
