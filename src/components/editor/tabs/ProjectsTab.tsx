'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { ProjectData } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export function ProjectsTab() {
  const { portfolio, addProject, removeProject } = usePortfolioStore();
  const projects = portfolio.projects || [];

  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [newProject, setNewProject] = useState<ProjectData>({
    title: '',
    tagline: '',
    description: '',
    imageUrl: '',
    galleryUrls: [],
    tags: [],
    liveUrl: '',
    githubUrl: '',
    isFeatured: true,
    order: projects.length,
  });

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

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        toast.error(data.error || 'Gagal mengunggah thumbnail proyek');
      } else {
        setNewProject({ ...newProject, imageUrl: data.data.url });
        toast.success('Gambar proyek berhasil diunggah!');
      }
    } catch {
      toast.error('Terjadi kesalahan saat mengunggah gambar');
    } finally {
      setUploading(false);
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const current = newProject.tags || [];
    setNewProject({ ...newProject, tags: [...current, tagInput.trim()] });
    setTagInput('');
  };

  const handleRemoveTag = (index: number) => {
    const current = newProject.tags || [];
    setNewProject({ ...newProject, tags: current.filter((_, i) => i !== index) });
  };

  const handleCreate = () => {
    if (!newProject.title || !newProject.description) return;
    addProject(newProject);
    setNewProject({
      title: '',
      tagline: '',
      description: '',
      imageUrl: '',
      galleryUrls: [],
      tags: [],
      liveUrl: '',
      githubUrl: '',
      isFeatured: false,
      order: projects.length + 1,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Proyek Unggulan (Projects)
          </h3>
          <p className="text-xs text-zinc-500">
            Pamerkan portofolio studi kasus, aplikasi, desain, atau repositori.
          </p>
        </div>

        {!isAdding && (
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Proyek</span>
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Tambah Proyek Baru
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setIsAdding(false)}
              >
                Batal
              </Button>
            </div>

            {/* Thumbnail upload */}
            <div className="space-y-1.5">
              <Label>Gambar Mockup / Screenshot Proyek</Label>
              <div className="flex items-center gap-3">
                {newProject.imageUrl ? (
                  <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800">
                    <Image
                      src={newProject.imageUrl}
                      alt="Thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-16 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-zinc-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}

                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
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
                      {uploading ? 'Mengunggah...' : 'Pilih Gambar'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Judul Proyek *</Label>
                <Input
                  placeholder="e.g. FinTech Mobile Dashboard"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Tagline Singkat</Label>
                <Input
                  placeholder="e.g. Real-time investment analytics platform"
                  value={newProject.tagline || ''}
                  onChange={(e) =>
                    setNewProject({ ...newProject, tagline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Deskripsi / Studi Kasus Proyek *</Label>
              <Textarea
                rows={3}
                placeholder="Ceritakan latar belakang masalah, peran Anda, dan hasil/dampak proyek..."
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
              />
            </div>

            {/* Tech stack tags */}
            <div className="space-y-2">
              <Label>Tag Teknologi / Kategori</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. React, Next.js, Figma..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                  className="shrink-0"
                >
                  Tambah Tag
                </Button>
              </div>

              {newProject.tags && newProject.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {newProject.tags.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs gap-1 py-0.5"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Link Demo / Website Publik</Label>
                <Input
                  placeholder="https://myproject.com"
                  value={newProject.liveUrl || ''}
                  onChange={(e) =>
                    setNewProject({ ...newProject, liveUrl: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Link GitHub / Repositori</Label>
                <Input
                  placeholder="https://github.com/..."
                  value={newProject.githubUrl || ''}
                  onChange={(e) =>
                    setNewProject({ ...newProject, githubUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={newProject.isFeatured}
                onCheckedChange={(val) =>
                  setNewProject({ ...newProject, isFeatured: val })
                }
              />
              <Label className="text-xs">Jadikan Proyek Unggulan (Featured Badge)</Label>
            </div>

            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCreate}
              disabled={!newProject.title || !newProject.description}
            >
              Simpan Proyek
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {projects.length === 0 && !isAdding && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            Belum ada proyek yang ditambahkan.
          </div>
        )}

        {projects.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                {proj.imageUrl && (
                  <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-zinc-100 dark:border-zinc-800">
                    <Image src={proj.imageUrl} alt={proj.title} fill className="object-cover" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {proj.title}
                    </h4>
                    {proj.isFeatured && (
                      <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                        Featured
                      </Badge>
                    )}
                  </div>
                  {proj.tagline && (
                    <p className="text-xs text-zinc-500">{proj.tagline}</p>
                  )}
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-600"
                onClick={() => removeProject(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
