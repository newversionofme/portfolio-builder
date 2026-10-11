'use client';

import React, { useState, useRef } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { TestimonialData, testimonialSchema } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Upload, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog';
import { ListItemActions } from '../common/ListItemActions';

const emptyTestimonial: TestimonialData = {
  name: '',
  role: '',
  company: '',
  quote: '',
  avatarUrl: '',
  order: 0,
};

export function TestimonialsTab() {
  const {
    portfolio,
    addTestimonial,
    updateTestimonial,
    removeTestimonial,
    moveItem,
  } = usePortfolioStore();
  const testimonials = portfolio.testimonials || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localTest, setLocalTest] = useState<TestimonialData>(emptyTestimonial);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track old avatar to clean up in storage only AFTER save succeeds
  const oldAvatarPendingCleanupRef = useRef<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    title: string;
  } | null>(null);

  const startAdd = () => {
    setEditingIndex(null);
    setIsAdding(true);
    setLocalTest({
      ...emptyTestimonial,
      order: testimonials.length,
    });
    oldAvatarPendingCleanupRef.current = null;
    setErrors({});
  };

  const startEdit = (index: number) => {
    setIsAdding(false);
    setEditingIndex(index);
    setLocalTest({ ...testimonials[index] });
    oldAvatarPendingCleanupRef.current = null;
    setErrors({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setLocalTest(emptyTestimonial);
    oldAvatarPendingCleanupRef.current = null;
    setErrors({});
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran foto maksimal 2MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || 'Gagal mengunggah foto avatar');
      } else {
        if (editingIndex !== null && localTest.avatarUrl && localTest.avatarUrl !== data.data.url) {
          oldAvatarPendingCleanupRef.current = localTest.avatarUrl;
        }
        setLocalTest((prev) => ({ ...prev, avatarUrl: data.data.url }));
        toast.success('Foto profil berhasil diunggah!');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah foto');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    if (editingIndex !== null && localTest.avatarUrl) {
      oldAvatarPendingCleanupRef.current = localTest.avatarUrl;
    }
    setLocalTest((prev) => ({ ...prev, avatarUrl: '' }));
  };

  const handleSave = () => {
    const validation = testimonialSchema.safeParse(localTest);
    const newErrors: Record<string, string> = {};

    if (!localTest.name.trim()) {
      newErrors.name = 'Nama pemberi rekomendasi wajib diisi';
    }
    if (!localTest.role.trim()) {
      newErrors.role = 'Jabatan / posisi wajib diisi';
    }
    if (!localTest.quote.trim()) {
      newErrors.quote = 'Kutipan testimoni wajib diisi';
    }

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0] || 'name');
        newErrors[fieldName] = issue.message;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Silakan lengkapi kolom yang wajib diisi');
      return;
    }

    if (editingIndex !== null) {
      updateTestimonial(editingIndex, localTest);
      toast.success(`Testimoni dari "${localTest.name}" berhasil diperbarui!`);

      // Cleanup old avatar if changed
      if (oldAvatarPendingCleanupRef.current) {
        const urlToClean = oldAvatarPendingCleanupRef.current;
        fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToClean }),
        }).catch((err) => {
          console.warn('[Storage Cleanup Warning]: Gagal menghapus avatar lama:', err);
        });
        oldAvatarPendingCleanupRef.current = null;
      }
    } else {
      addTestimonial(localTest);
      toast.success(`Testimoni dari "${localTest.name}" berhasil ditambahkan!`);
    }

    handleCancel();
  };

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return;
    const { index, title } = deleteTarget;

    const targetItem = testimonials[index];
    const avatarToClean = targetItem?.avatarUrl;

    if (editingIndex === index) {
      handleCancel();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    removeTestimonial(index);

    if (avatarToClean) {
      fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: avatarToClean }),
      }).catch((err) => {
        console.warn('[Storage Cleanup Warning]: Gagal membersihkan foto testimoni:', err);
      });
    }

    toast.success(`Testimoni dari "${title}" berhasil dihapus.`);
    setDeleteTarget(null);
  };

  const isFormOpen = isAdding || editingIndex !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Testimoni & Rekomendasi
          </h3>
          <p className="text-xs text-zinc-500">
            Kutipan rekomendasi dari manajer, klien, atau rekan kerja.
          </p>
        </div>

        {!isFormOpen && (
          <Button
            size="sm"
            onClick={startAdd}
            className="gap-1.5 h-9 min-h-[38px] text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Testimoni</span>
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {editingIndex !== null ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                onClick={handleCancel}
              >
                Batal
              </Button>
            </div>

            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border border-zinc-200 dark:border-zinc-800">
                <AvatarImage src={localTest.avatarUrl || ''} alt={localTest.name} />
                <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500">
                  {localTest.name ? localTest.name.slice(0, 2).toUpperCase() : 'Avatar'}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-wrap items-center gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-200 transition-colors shadow-2xs">
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploading ? 'Mengunggah...' : 'Unggah Foto'}</span>
                  </div>
                </label>

                {localTest.avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1"
                    onClick={handleRemoveAvatar}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Hapus Foto</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="test-name" className="text-xs">
                  Nama Pemberi Rekomendasi *
                </Label>
                <Input
                  id="test-name"
                  placeholder="e.g. Sarah Jenkins"
                  value={localTest.name}
                  onChange={(e) => {
                    setLocalTest({ ...localTest, name: e.target.value });
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="test-role" className="text-xs">
                  Jabatan / Peran *
                </Label>
                <Input
                  id="test-role"
                  placeholder="e.g. VP of Engineering"
                  value={localTest.role}
                  onChange={(e) => {
                    setLocalTest({ ...localTest, role: e.target.value });
                    if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
                  }}
                  className={errors.role ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.role && (
                  <p className="text-[11px] text-red-500">{errors.role}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="test-company" className="text-xs">
                Nama Perusahaan / Klien (Opsional)
              </Label>
              <Input
                id="test-company"
                placeholder="e.g. Tech Corp / Vercel Ecosystem"
                value={localTest.company || ''}
                onChange={(e) =>
                  setLocalTest({ ...localTest, company: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="test-quote" className="text-xs">
                Kutipan Testimoni *
              </Label>
              <Textarea
                id="test-quote"
                rows={3}
                placeholder="Tuliskan ulasan atau rekomendasi tentang etos kerja Anda..."
                value={localTest.quote}
                onChange={(e) => {
                  setLocalTest({ ...localTest, quote: e.target.value });
                  if (errors.quote) setErrors((prev) => ({ ...prev, quote: '' }));
                }}
                className={errors.quote ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.quote && (
                <p className="text-[11px] text-red-500">{errors.quote}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 min-h-[38px] text-xs"
                onClick={handleCancel}
              >
                Batal
              </Button>
              <Button
                size="sm"
                className="h-9 min-h-[38px] bg-blue-600 hover:bg-blue-700 text-xs px-5"
                onClick={handleSave}
              >
                {editingIndex !== null ? 'Simpan Perubahan' : 'Simpan Testimoni'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {testimonials.length === 0 && !isFormOpen && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs space-y-2">
            <p>Belum ada testimoni yang ditambahkan.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={startAdd}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Testimoni Pertama</span>
            </Button>
          </div>
        )}

        {testimonials.map((test, idx) => (
          <div
            key={test.id || idx}
            className={`p-4 rounded-xl border bg-white dark:bg-zinc-900 space-y-2 shadow-2xs transition-all ${
              editingIndex === idx
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <Avatar className="h-10 w-10 shrink-0 border border-zinc-200 dark:border-zinc-800">
                  <AvatarImage src={test.avatarUrl || ''} alt={test.name} />
                  <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500">
                    {test.name ? test.name.slice(0, 2).toUpperCase() : 'AV'}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1 min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                    {test.name}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
                    {test.role} {test.company && `• ${test.company}`}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 italic pt-1 line-clamp-2">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
              </div>

              <ListItemActions
                onMoveUp={() => moveItem('testimonials', idx, 'up')}
                onMoveDown={() => moveItem('testimonials', idx, 'down')}
                isFirst={idx === 0}
                isLast={idx === testimonials.length - 1}
                onEdit={() => startEdit(idx)}
                onDelete={() =>
                  setDeleteTarget({
                    index: idx,
                    title: test.name,
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.title || ''}
        itemType="testimoni"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
