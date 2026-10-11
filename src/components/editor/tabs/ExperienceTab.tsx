'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { ExperienceData, experienceSchema } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar, Building2, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog';
import { ListItemActions } from '../common/ListItemActions';

const emptyExperience: ExperienceData = {
  company: '',
  companyUrl: '',
  position: '',
  employmentType: 'Full-time',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  order: 0,
};

export function ExperienceTab() {
  const { portfolio, addExperience, updateExperience, removeExperience, moveItem } =
    usePortfolioStore();
  const experiences = portfolio.experiences || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localExp, setLocalExp] = useState<ExperienceData>(emptyExperience);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    title: string;
  } | null>(null);

  const startAdd = () => {
    setEditingIndex(null);
    setIsAdding(true);
    setLocalExp({
      ...emptyExperience,
      order: experiences.length,
    });
    setErrors({});
  };

  const startEdit = (index: number) => {
    setIsAdding(false);
    setEditingIndex(index);
    setLocalExp({ ...experiences[index] });
    setErrors({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setLocalExp(emptyExperience);
    setErrors({});
  };

  const handleSave = () => {
    // Validate with Zod
    const validation = experienceSchema.safeParse(localExp);
    const newErrors: Record<string, string> = {};

    if (!localExp.position.trim()) {
      newErrors.position = 'Posisi / jabatan wajib diisi';
    }
    if (!localExp.company.trim()) {
      newErrors.company = 'Nama perusahaan wajib diisi';
    }
    if (!localExp.startDate.trim()) {
      newErrors.startDate = 'Bulan & tahun mulai wajib diisi';
    }

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0] || 'position');
        newErrors[fieldName] = issue.message;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Silakan lengkapi kolom yang wajib diisi');
      return;
    }

    if (editingIndex !== null) {
      updateExperience(editingIndex, localExp);
      toast.success(`Pengalaman di ${localExp.company} berhasil diperbarui!`);
    } else {
      addExperience(localExp);
      toast.success(`Pengalaman di ${localExp.company} berhasil ditambahkan!`);
    }

    handleCancel();
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    removeExperience(deleteTarget.index);

    if (editingIndex === deleteTarget.index) {
      handleCancel();
    } else if (editingIndex !== null && editingIndex > deleteTarget.index) {
      setEditingIndex(editingIndex - 1);
    }

    toast.success(`Pengalaman "${deleteTarget.title}" telah dihapus.`);
    setDeleteTarget(null);
  };

  const isFormOpen = isAdding || editingIndex !== null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Pengalaman Kerja (Experience)
          </h3>
          <p className="text-xs text-zinc-500">
            Riwayat karier, pekerjaan purna waktu, magang, atau freelance ({experiences.length} riwayat).
          </p>
        </div>

        {!isFormOpen && (
          <Button
            size="sm"
            onClick={startAdd}
            className="gap-1.5 h-9 text-xs bg-blue-600 hover:bg-blue-700 min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pengalaman</span>
          </Button>
        )}
      </div>

      {/* Add / Edit Form */}
      {isFormOpen && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/60 pb-3">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{editingIndex !== null ? 'Edit Pengalaman' : 'Tambah Riwayat Pengalaman'}</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Posisi / Jabatan <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. Lead Frontend Engineer"
                  value={localExp.position}
                  onChange={(e) => {
                    setLocalExp({ ...localExp, position: e.target.value });
                    if (errors.position) setErrors((prev) => ({ ...prev, position: '' }));
                  }}
                  className={errors.position ? 'border-red-500' : ''}
                />
                {errors.position && <p className="text-[11px] text-red-500">{errors.position}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">
                  Nama Perusahaan / Organisasi <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="e.g. GoTo Group"
                  value={localExp.company}
                  onChange={(e) => {
                    setLocalExp({ ...localExp, company: e.target.value });
                    if (errors.company) setErrors((prev) => ({ ...prev, company: '' }));
                  }}
                  className={errors.company ? 'border-red-500' : ''}
                />
                {errors.company && <p className="text-[11px] text-red-500">{errors.company}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Jenis Pekerjaan</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                  value={localExp.employmentType || 'Full-time'}
                  onChange={(e) =>
                    setLocalExp({ ...localExp, employmentType: e.target.value })
                  }
                >
                  <option value="Full-time">Full-time (Purna Waktu)</option>
                  <option value="Part-time">Part-time (Paruh Waktu)</option>
                  <option value="Contract">Contract (Kontrak)</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Internship">Internship (Magang)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Lokasi Kerja</Label>
                <Input
                  placeholder="e.g. Jakarta, Indonesia (Remote)"
                  value={localExp.location || ''}
                  onChange={(e) =>
                    setLocalExp({ ...localExp, location: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Bulan & Tahun Mulai <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="month"
                  value={localExp.startDate}
                  onChange={(e) => {
                    setLocalExp({ ...localExp, startDate: e.target.value });
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' }));
                  }}
                  className={errors.startDate ? 'border-red-500' : ''}
                />
                {errors.startDate && <p className="text-[11px] text-red-500">{errors.startDate}</p>}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Bulan & Tahun Selesai</Label>
                <Input
                  type="month"
                  disabled={localExp.isCurrent}
                  value={localExp.isCurrent ? '' : localExp.endDate || ''}
                  onChange={(e) =>
                    setLocalExp({ ...localExp, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Switch
                id="isCurrent"
                checked={localExp.isCurrent}
                onCheckedChange={(val) =>
                  setLocalExp({
                    ...localExp,
                    isCurrent: val,
                    endDate: val ? '' : localExp.endDate,
                  })
                }
              />
              <Label htmlFor="isCurrent" className="text-xs cursor-pointer">
                Saya masih aktif bekerja di perusahaan ini saat ini
              </Label>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Deskripsi Tanggung Jawab & Pencapaian</Label>
              <Textarea
                placeholder="Ceritakan kontribusi utama, teknologi yang dipakai, atau dampak yang dihasilkan..."
                rows={3}
                value={localExp.description || ''}
                onChange={(e) =>
                  setLocalExp({ ...localExp, description: e.target.value })
                }
              />
            </div>

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
                {editingIndex !== null ? 'Simpan Perubahan' : 'Simpan Pengalaman'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List of existing experiences */}
      <div className="space-y-3">
        {experiences.length === 0 && !isFormOpen && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/20">
            <Briefcase className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-600" />
            <div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Belum ada riwayat pengalaman
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Tambahkan riwayat pekerjaan atau magang Anda.
              </p>
            </div>
            <Button
              size="sm"
              onClick={startAdd}
              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pengalaman</span>
            </Button>
          </div>
        )}

        {experiences.map((exp, idx) => (
          <div
            key={exp.id || idx}
            className={`p-4 rounded-xl border bg-white dark:bg-zinc-900 space-y-3 shadow-2xs transition-all ${
              editingIndex === idx
                ? 'border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/20'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {exp.position}
                </h4>
                <div className="flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{exp.company}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>
                      {exp.startDate} — {exp.isCurrent ? 'Sekarang' : exp.endDate || 'Sekarang'}
                    </span>
                  </div>
                  {exp.employmentType && (
                    <>
                      <span>•</span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {exp.employmentType}
                      </span>
                    </>
                  )}
                </div>
                {exp.description && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line pt-1">
                    {exp.description}
                  </p>
                )}
              </div>

              {/* Reorder and Action Buttons */}
              <ListItemActions
                onEdit={() => startEdit(idx)}
                onDelete={() => setDeleteTarget({ index: idx, title: `${exp.position} di ${exp.company}` })}
                onMoveUp={() => moveItem('experiences', idx, 'up')}
                onMoveDown={() => moveItem('experiences', idx, 'down')}
                isFirst={idx === 0}
                isLast={idx === experiences.length - 1}
                editLabel="Edit"
                deleteLabel="Hapus"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Dialog for Deleting Experience */}
      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget?.title || 'Pengalaman'}
        itemType="pengalaman"
      />
    </div>
  );
}
