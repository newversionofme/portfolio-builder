'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/actions/auth';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, User, Link as LinkIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto suggest slug if user hasn't manually altered it
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('slug', slug);

    const timeoutPromise = new Promise<{ timeout: true }>((resolve) =>
      setTimeout(() => resolve({ timeout: true }), 15000)
    );

    try {
      const res = await Promise.race([
        registerUser(formData),
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
      } else {
        router.push('/login?registered=true');
      }
    } catch {
      setError('Terjadi kesalahan saat pendaftaran. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Buat Akun Portofolio</CardTitle>
          <CardDescription>
            Cukup isi form, langsung dapat website portofolio profesional
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-sm flex items-center gap-2 border border-red-200 dark:border-red-900">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g. John Doe"
                  className="pl-9"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="slug">Tautan Portofolio (Slug URL)</Label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <Input
                  id="slug"
                  type="text"
                  placeholder="john-doe"
                  className="pl-9"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  required
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                URL publik Anda: <span className="font-mono text-blue-600 font-medium">/u/{slug || 'username'}</span>
              </p>
            </div>

            <div className="space-y-1.5">
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

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-10 font-medium mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mendaftarkan Akun...
                </>
              ) : (
                <>
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider & Google Register Button */}
          <div className="relative flex py-1 items-center mt-4">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            <span className="flex-shrink mx-3 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
              atau daftar dengan
            </span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>

          <div className="mt-3">
            <GoogleAuthButton mode="register" onError={(msg) => setError(msg)} />
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
              Masuk di Sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
