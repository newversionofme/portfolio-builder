'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Loader2, Sparkles, User } from 'lucide-react';
import { toast } from 'sonner';
import { useEditorText } from '@/lib/i18n/editor-copy';

export function ProfileTab() {
  const tx = useEditorText();
  const { portfolio, updateProfile, updateSlug } = usePortfolioStore();
  const profile = portfolio.profile;
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error(tx('Ukuran file maksimal 2 MB'));
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(tx(data.error || 'Gagal mengunggah foto'));
      } else {
        updateProfile({ avatarUrl: data.data.url });
        toast.success(tx('Foto profil berhasil diperbarui!'));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        toast.error(tx('Belum ada respons dari server. Periksa dulu sebelum mencoba lagi.'));
      } else {
        toast.error(tx('Terjadi kesalahan saat mengunggah foto'));
      }
    } finally {
      clearTimeout(timeoutId);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          {tx('Profil Utama')}
        </h3>
        <p className="text-xs text-zinc-500">
          {tx('Informasi dasar yang menjadi headline portofolio Anda.')}
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 shrink-0 flex items-center justify-center">
          {profile?.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={tx('Avatar')}
              fill
              className="object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-zinc-400" />
          )}
        </div>

        <div className="space-y-1.5 flex-1">
          <Label className="text-xs font-medium">{tx('Foto Profil')}</Label>
          <div className="flex items-center gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                disabled={uploading}
                asChild
              >
                <span>
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  {uploading ? tx('Mengunggah...') : tx('Upload Foto')}
                </span>
              </Button>
            </label>

            {profile?.avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => updateProfile({ avatarUrl: null })}
                aria-label={tx('Hapus Foto')}
                title={tx('Hapus Foto')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
          <p className="text-[11px] text-zinc-400">
            {tx('JPG, PNG, atau WebP (Maks 2 MB).')}
          </p>
        </div>
      </div>

      {/* Full Name & Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">{tx('Nama Lengkap')}</Label>
          <Input
            id="fullName"
            value={profile?.fullName || ''}
            onChange={(e) => updateProfile({ fullName: e.target.value })}
            placeholder={tx('e.g. Alex Rivera')}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="slug">{tx('Custom URL Slug')}</Label>
          <Input
            id="slug"
            value={portfolio.slug || ''}
            onChange={(e) =>
              updateSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
            }
            placeholder={tx('alex-rivera')}
          />
          <p className="text-[11px] text-zinc-400 font-mono">
            /u/{portfolio.slug || 'slug'}
          </p>
        </div>
      </div>

      {/* Headline & Location */}
      <div className="space-y-1.5">
        <Label htmlFor="headline">{tx('Headline Profesi / Tagline')}</Label>
        <Input
          id="headline"
          value={profile?.headline || ''}
          onChange={(e) => updateProfile({ headline: e.target.value })}
          placeholder={tx('e.g. Senior Full-Stack Engineer & Open Source Contributor')}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">{tx('Lokasi')}</Label>
        <Input
          id="location"
          value={profile?.location || ''}
          onChange={(e) => updateProfile({ location: e.target.value })}
          placeholder={tx('e.g. Jakarta, Indonesia (Open to Remote)')}
        />
      </div>

      {/* Available for hire toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-zinc-900 dark:text-white">
              {tx('Status Siap Bekerja (Hire Badge)')}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            {tx('Tampilkan badge “Available for hire” di header portofolio Anda.')}
          </p>
        </div>
        <Switch
          checked={profile?.availableForHire ?? true}
          onCheckedChange={(val) => updateProfile({ availableForHire: val })}
        />
      </div>

      {profile?.availableForHire && (
        <div className="space-y-1.5">
          <Label htmlFor="hireBadgeText">{tx('Teks Badge Ketersediaan')}</Label>
          <Input
            id="hireBadgeText"
            value={profile?.hireBadgeText || ''}
            onChange={(e) => updateProfile({ hireBadgeText: e.target.value })}
            placeholder={tx('e.g. Open for Full-time & Freelance Projects')}
          />
        </div>
      )}
    </div>
  );
}
