'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { ProjectData, projectSchema } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Upload, Loader2, Image as ImageIcon, FolderGit2, X } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog';
import { ListItemActions } from '../common/ListItemActions';

const emptyProject: ProjectData = {
  title: '',
  tagline: '',
  description: '',
  imageUrl: '',
  galleryUrls: [],
  tags: [],
  liveUrl: '',
  githubUrl: '',
  isFeatured: false,
  order: 0,
};

export function ProjectsTab() {
  const { portfolio, addProject, updateProject, removeProject, moveItem } =
    usePortfolioStore();
  const projects = portfolio.projects || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localProject, setLocalProject] = useState<ProjectData>(emptyProject);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Track old image to clean up only AFTER save succeeds
  const oldImagePendingCleanupRef = useRef<string | null>(null);

  // Delete confirmation dialog state
  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    title: string;
  } | null>(null);

  const startAdd = () => {
    setEditingIndex(null);
    setIsAdding(true);
    setLocalProject({
      ...emptyProject,
      order: projects.length,
    });
    oldImagePendingCleanupRef.current = null;
    setErrors({});
  };

  const startEdit = (index: number) => {
    setIsAdding(false);
    setEditingIndex(index);
    setLocalProject({
      ...projects[index],
      tags: projects[index].tags ? [...projects[index].tags] : [],
      galleryUrls: projects[index].galleryUrls ? [...projects[index].galleryUrls] : [],
    });
    oldImagePendingCleanupRef.current = null;
    setErrors({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setLocalProject(emptyProject);
    oldImagePendingCleanupRef.current = null;
    setErrors({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 2 MB');
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
        toast.error(data.error || 'Gagal mengunggah thumbnail proyek');
      } else {
        // If editing and replacing an existing image, queue old one for cleanup
        if (editingIndex !== null && localProject.imageUrl && localProject.imageUrl !== data.data.url) {
          oldImagePendingCleanupRef.current = localProject.imageUrl;
        }
        setLocalProject((prev) => ({ ...prev, imageUrl: data.data.url }));
        toast.success('Gambar proyek berhasil diunggah!');
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        toast.error('Belum ada respons dari server. Periksa dulu sebelum mencoba lagi.');
      } else {
        toast.error('Terjadi kesalahan saat mengunggah gambar');
      }
    } finally {
      clearTimeout(timeoutId);
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (editingIndex !== null && localProject.imageUrl) {
      oldImagePendingCleanupRef.current = localProject.imageUrl;
    }
    setLocalProject((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const current = localProject.tags || [];
    setLocalProject((prev) => ({
      ...prev,
      tags: [...current, tagInput.trim()],
    }));
    setTagInput('');
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const current = localProject.tags || [];
    setLocalProject((prev) => ({
      ...prev,
      tags: current.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSave = () => {
    // Validate with Zod
    const validation = projectSchema.safeParse(localProject);
    const newErrors: Record<string, string> = {};

    if (!localProject.title.trim()) {
      newErrors.title = 'Judul proyek wajib diisi';
    }
    if (!localProject.description.trim()) {
      newErrors.description = 'Deskripsi proyek wajib diisi';
    }

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0] || 'title');
        newErrors[fieldName] = issue.message;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Silakan lengkapi kolom yang wajib diisi');
      return;
    }

    // Save changes to Zustand Store
    if (editingIndex !== null) {
      updateProject(editingIndex, localProject);
      toast.success(`Perubahan pada "${localProject.title}" berhasil disimpan!`);

      // Cleanup old image if one was replaced
      if (oldImagePendingCleanupRef.current) {
        const urlToClean = oldImagePendingCleanupRef.current;
        fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: urlToClean }),
        }).catch((err) => {
          console.warn('[Storage Cleanup Warning]: Gagal menghapus file lama:', err);
        });
        oldImagePendingCleanupRef.current = null;
      }
    } else {
      addProject(localProject);
      toast.success(`Proyek "${localProject.title}" berhasil ditambahkan!`);
    }

    handleCancel();
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const targetProject = projects[deleteTarget.index];
    const imageToDelete = targetProject?.imageUrl;

    removeProject(deleteTarget.index);

    // If deleting currently edited item, close form
    if (editingIndex === deleteTarget.index) {
      handleCancel();
    } else if (editingIndex !== null && editingIndex > deleteTarget.index) {
      // Adjust editingIndex if item before it was deleted
      setEditingIndex(editingIndex - 1);
    }

    // Clean up storage file in background if exists
    if (imageToDelete) {
      fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: imageToDelete }),
      }).catch((err) => {
        console.warn('[Storage Cleanup Warning]: Gagal menghapus gambar proyek yang dihapus:', err);
      });
    }

    toast.success(`Proyek "${deleteTarget.title}" telah dihapus.`);
    setDeleteTarget(null);
  };

  const isFormOpen = isAdding || editingIndex !== null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Proyek & Portofolio Karya
          </h3>
          <p className="text-xs text-zinc-500">
            Tampilkan proyek terbaik, studi kasus, atau produk digital Anda ({projects.length} proyek).
          </p>
        </div>

        {!isFormOpen && (
          <Button
            size="sm"
            onClick={startAdd}
            className="gap-1.5 h-9 text-xs bg-blue-600 hover:bg-blue-700 min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Proyek Baru</span>
          </Button>
        )}
      </div>

      {/* Unified Add / Edit Project Form */}
      {isFormOpen && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/60 pb-3">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" />
                <span>{editingIndex !== null ? 'Edit Proyek' : 'Tambah Proyek Baru'}</span>
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

            {/* Thumbnail Upload & Preview */}
            <div className="space-y-2">
              <Label className="text-xs">Thumbnail / Cover Proyek</Label>
              <div className="flex flex-wrap items-center gap-3">
                {localProject.imageUrl ? (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shrink-0 group">
                    <Image
                      src={localProject.imageUrl}
                      alt="Thumbnail Proyek"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      title="Hapus Gambar"
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-16 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 text-[10px] gap-1 shrink-0">
                    <ImageIcon className="w-4 h-4" />
                    <span>Kosong</span>
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploading}
                      className="h-8 text-xs gap-1.5"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Mengunggah...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>{localProject.imageUrl ? 'Ganti Gambar' : 'Pilih Gambar'}</span>
                        </>
                      )}
                    </Button>
                  </div>
                  <span className="text-[10px] text-zinc-400">JPG, PNG, atau WebP (Maks 2 MB)</span>
                </div>
              </div>
            </div>

            {/* Title & Tagline */}
            <div className="space-y-1.5">
              <Label className="text-xs">
                Judul Proyek <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="e.g. Platform E-Commerce Fashion"
                value={localProject.title}
                onChange={(e) => {
                  setLocalProject({ ...localProject, title: e.target.value });
                  if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                }}
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-[11px] text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Tagline Singkat</Label>
              <Input
                placeholder="e.g. Toko online modern dengan sistem checkout multi-payment"
                value={localProject.tagline || ''}
                onChange={(e) =>
                  setLocalProject({ ...localProject, tagline: e.target.value })
                }
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs">
                Deskripsi & Peran Anda <span className="text-red-500">*</span>
              </Label>
              <Textarea
                placeholder="Jelaskan masalah yang diselesaikan, teknologi yang digunakan, dan dampak dari proyek ini..."
                rows={3}
                value={localProject.description}
                onChange={(e) => {
                  setLocalProject({ ...localProject, description: e.target.value });
                  if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
                }}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-[11px] text-red-500">{errors.description}</p>}
            </div>

            {/* Tech Stack Tags */}
            <div className="space-y-2">
              <Label className="text-xs">Tech Stack / Kategori Tags</Label>
              <div className="flex items-center gap-2">
                <Input
                  placeholder="e.g. Next.js, PostgreSQL, Tailwind"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  className="h-8 text-xs"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                  className="h-8 text-xs shrink-0"
                >
                  Tambah
                </Button>
              </div>

              {localProject.tags && localProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {localProject.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs gap-1 py-0.5 px-2 bg-zinc-200/80 dark:bg-zinc-800"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Live URL & GitHub URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tautan Live Demo</Label>
                <Input
                  placeholder="https://..."
                  value={localProject.liveUrl || ''}
                  onChange={(e) =>
                    setLocalProject({ ...localProject, liveUrl: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Tautan Repositori GitHub</Label>
                <Input
                  placeholder="https://github.com/..."
                  value={localProject.githubUrl || ''}
                  onChange={(e) =>
                    setLocalProject({ ...localProject, githubUrl: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Featured Switch */}
            <div className="flex items-center gap-2.5 pt-1">
              <Switch
                id="isFeatured"
                checked={localProject.isFeatured}
                onCheckedChange={(val) =>
                  setLocalProject({ ...localProject, isFeatured: val })
                }
              />
              <Label htmlFor="isFeatured" className="text-xs cursor-pointer">
                Jadikan Proyek Unggulan (Tampil menonjol dengan badge Featured)
              </Label>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-blue-100 dark:border-blue-900/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="h-9 px-4 text-xs"
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                className="h-9 px-4 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-2xs"
                onClick={handleSave}
              >
                {editingIndex !== null ? 'Simpan Perubahan' : 'Simpan Proyek'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.length === 0 && !isFormOpen && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/20">
            <FolderGit2 className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-600" />
            <div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Belum ada proyek ditambahkan
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Tambahkan proyek pertama Anda untuk menunjukkannya di portofolio.
              </p>
            </div>
            <Button
              size="sm"
              onClick={startAdd}
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Proyek Sekarang</span>
            </Button>
          </div>
        )}

        {projects.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className={`p-4 rounded-xl border bg-white dark:bg-zinc-900 space-y-3 shadow-2xs transition-all ${
              editingIndex === idx
                ? 'border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {proj.imageUrl ? (
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
                    <Image
                      src={proj.imageUrl}
                      alt={proj.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center shrink-0">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                      {proj.title}
                    </h4>
                    {proj.isFeatured && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                      >
                        Featured
                      </Badge>
                    )}
                  </div>
                  {proj.tagline && (
                    <p className="text-xs text-zinc-500 truncate mt-0.5">{proj.tagline}</p>
                  )}
                  {proj.tags && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {proj.tags.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reorder and Action Buttons */}
              <ListItemActions
                onEdit={() => startEdit(idx)}
                onDelete={() => setDeleteTarget({ index: idx, title: proj.title })}
                onMoveUp={() => moveItem('projects', idx, 'up')}
                onMoveDown={() => moveItem('projects', idx, 'down')}
                isFirst={idx === 0}
                isLast={idx === projects.length - 1}
                editLabel="Edit"
                deleteLabel="Hapus"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog for Deleting Project */}
      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.title || 'Proyek'}
        itemType="proyek"
      />
    </div>
  );
}
