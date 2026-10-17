'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { EducationData, educationSchema } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, GraduationCap, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog';
import { ListItemActions } from '../common/ListItemActions';
import { useEditorText } from '@/lib/i18n/editor-copy';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const emptyEducation: EducationData = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  gpa: '',
  description: '',
  order: 0,
};

export function EducationTab() {
  const tx = useEditorText();
  const { language } = useLanguage();
  const { portfolio, addEducation, updateEducation, removeEducation, moveItem } =
    usePortfolioStore();
  const educations = portfolio.educations || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localEdu, setLocalEdu] = useState<EducationData>(emptyEducation);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    title: string;
  } | null>(null);

  const startAdd = () => {
    setEditingIndex(null);
    setIsAdding(true);
    setLocalEdu({
      ...emptyEducation,
      order: educations.length,
    });
    setErrors({});
  };

  const startEdit = (index: number) => {
    setIsAdding(false);
    setEditingIndex(index);
    setLocalEdu({ ...educations[index] });
    setErrors({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setLocalEdu(emptyEducation);
    setErrors({});
  };

  const handleSave = () => {
    const validation = educationSchema.safeParse(localEdu);
    const newErrors: Record<string, string> = {};

    if (!localEdu.institution.trim()) {
      newErrors.institution = tx('Nama institusi / universitas wajib diisi');
    }
    if (!localEdu.degree.trim()) {
      newErrors.degree = tx('Gelar / jenjang studi wajib diisi');
    }
    if (!localEdu.startDate.trim()) {
      newErrors.startDate = tx('Bulan & tahun mulai wajib diisi');
    }

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0] || 'institution');
        newErrors[fieldName] = tx(issue.message);
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(tx('Silakan lengkapi kolom yang wajib diisi'));
      return;
    }

    if (editingIndex !== null) {
      updateEducation(editingIndex, localEdu);
      toast.success(`${tx('Riwayat pendidikan di')} ${localEdu.institution} ${tx('berhasil diperbarui!')}`);
    } else {
      addEducation(localEdu);
      toast.success(`${tx('Pendidikan di')} ${localEdu.institution} ${tx('berhasil ditambahkan!')}`);
    }

    handleCancel();
  };

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return;
    const { index, title } = deleteTarget;

    if (editingIndex === index) {
      handleCancel();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    removeEducation(index);
    toast.success(`${tx('Pendidikan')} "${title}" ${tx('berhasil dihapus.')}`);
    setDeleteTarget(null);
  };

  const isFormOpen = isAdding || editingIndex !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            {tx('Pendidikan (Education)')}
          </h3>
          <p className="text-xs text-zinc-500">
            {tx('Riwayat perguruan tinggi, sekolah, bootcamp, atau akademi.')}
          </p>
        </div>

        {!isFormOpen && (
          <Button
            size="sm"
            onClick={startAdd}
            className="gap-1.5 h-9 min-h-[38px] text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{tx('Tambah Pendidikan')}</span>
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {tx(editingIndex !== null ? 'Edit Riwayat Pendidikan' : 'Tambah Riwayat Pendidikan')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                onClick={handleCancel}
              >
                {tx('Batal')}
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edu-institution" className="text-xs">
                {tx('Nama Institusi / Universitas')} *
              </Label>
              <Input
                id="edu-institution"
                placeholder={tx('e.g. Universitas Indonesia')}
                value={localEdu.institution}
                onChange={(e) => {
                  setLocalEdu({ ...localEdu, institution: e.target.value });
                  if (errors.institution) setErrors((prev) => ({ ...prev, institution: '' }));
                }}
                className={errors.institution ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {errors.institution && (
                <p className="text-[11px] text-red-500">{errors.institution}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edu-degree" className="text-xs">
                  {tx('Gelar / Tingkat Studi')} *
                </Label>
                <Input
                  id="edu-degree"
                  placeholder={tx('e.g. Sarjana Komputer (S.Kom)')}
                  value={localEdu.degree}
                  onChange={(e) => {
                    setLocalEdu({ ...localEdu, degree: e.target.value });
                    if (errors.degree) setErrors((prev) => ({ ...prev, degree: '' }));
                  }}
                  className={errors.degree ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.degree && (
                  <p className="text-[11px] text-red-500">{errors.degree}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edu-field" className="text-xs">
                  {tx('Jurusan / Bidang Studi')}
                </Label>
                <Input
                  id="edu-field"
                  placeholder={tx('e.g. Teknik Informatika')}
                  value={localEdu.fieldOfStudy || ''}
                  onChange={(e) =>
                    setLocalEdu({ ...localEdu, fieldOfStudy: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="edu-start" className="text-xs">
                  {tx('Tahun / Bulan Mulai')} *
                </Label>
                <Input
                  id="edu-start"
                  type="month"
                  value={localEdu.startDate}
                  onChange={(e) => {
                    setLocalEdu({ ...localEdu, startDate: e.target.value });
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: '' }));
                  }}
                  className={errors.startDate ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.startDate && (
                  <p className="text-[11px] text-red-500">{errors.startDate}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edu-end" className="text-xs">
                  {tx('Tahun / Bulan Selesai')}
                </Label>
                <Input
                  id="edu-end"
                  type="month"
                  disabled={localEdu.isCurrent}
                  value={localEdu.isCurrent ? '' : localEdu.endDate || ''}
                  onChange={(e) =>
                    setLocalEdu({ ...localEdu, endDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edu-gpa" className="text-xs">
                  {tx('IPK / Nilai (Opsional)')}
                </Label>
                <Input
                  id="edu-gpa"
                  placeholder={tx('e.g. 3.85 / 4.00')}
                  value={localEdu.gpa || ''}
                  onChange={(e) =>
                    setLocalEdu({ ...localEdu, gpa: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Switch
                id="edu-current"
                checked={localEdu.isCurrent}
                onCheckedChange={(val) =>
                  setLocalEdu({ ...localEdu, isCurrent: val, endDate: null })
                }
              />
              <Label htmlFor="edu-current" className="text-xs cursor-pointer">
                {tx('Masih menempuh studi saat ini')}
              </Label>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edu-desc" className="text-xs">
                {tx('Aktivitas, Prestasi, atau Catatan')}
              </Label>
              <Textarea
                id="edu-desc"
                rows={2}
                placeholder={tx('Penghargaan akademik, organisasi mahasiswa, judul skripsi...')}
                value={localEdu.description || ''}
                onChange={(e) =>
                  setLocalEdu({ ...localEdu, description: e.target.value })
                }
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 min-h-[38px] text-xs"
                onClick={handleCancel}
              >
                {tx('Batal')}
              </Button>
              <Button
                size="sm"
                className="h-9 min-h-[38px] bg-blue-600 hover:bg-blue-700 text-xs px-5"
                onClick={handleSave}
              >
                {tx(editingIndex !== null ? 'Simpan Perubahan' : 'Simpan Pendidikan')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List of educations */}
      <div className="space-y-3">
        {educations.length === 0 && !isFormOpen && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs space-y-2">
            <p>{tx('Belum ada riwayat pendidikan yang ditambahkan.')}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={startAdd}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{tx('Tambah Pendidikan Pertama')}</span>
            </Button>
          </div>
        )}

        {educations.map((edu, idx) => (
          <div
            key={edu.id || idx}
            className={`p-4 rounded-xl border bg-white dark:bg-zinc-900 space-y-2 shadow-2xs transition-all ${
              editingIndex === idx
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5 truncate">
                  <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">{edu.institution}</span>
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                  {edu.degree} {edu.fieldOfStudy && `${language === 'en' ? 'in' : 'di'} ${edu.fieldOfStudy}`}
                  {edu.gpa && ` • ${tx('IPK:')} ${edu.gpa}`}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Calendar className="w-3 h-3 shrink-0" />
                  <span>
                    {edu.startDate} — {edu.isCurrent ? tx('Sekarang') : edu.endDate || tx('Sekarang')}
                  </span>
                </div>
              </div>

              <ListItemActions
                onMoveUp={() => moveItem('educations', idx, 'up')}
                onMoveDown={() => moveItem('educations', idx, 'down')}
                isFirst={idx === 0}
                isLast={idx === educations.length - 1}
                onEdit={() => startEdit(idx)}
                onDelete={() =>
                  setDeleteTarget({
                    index: idx,
                    title: `${edu.degree} di ${edu.institution}`,
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
        itemType={tx('pendidikan')}
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
