'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { EducationData } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GraduationCap, Calendar } from 'lucide-react';

export function EducationTab() {
  const { portfolio, addEducation, removeEducation } = usePortfolioStore();
  const educations = portfolio.educations || [];

  const [isAdding, setIsAdding] = useState(false);
  const [newEdu, setNewEdu] = useState<EducationData>({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    gpa: '',
    description: '',
    order: educations.length,
  });

  const handleCreate = () => {
    if (!newEdu.institution || !newEdu.degree || !newEdu.startDate) return;
    addEducation(newEdu);
    setNewEdu({
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      gpa: '',
      description: '',
      order: educations.length + 1,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Pendidikan (Education)
          </h3>
          <p className="text-xs text-zinc-500">
            Riwayat perguruan tinggi, sekolah, bootcamp, atau akademi.
          </p>
        </div>

        {!isAdding && (
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pendidikan</span>
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Tambah Riwayat Pendidikan
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

            <div className="space-y-1.5">
              <Label>Nama Institusi / Universitas *</Label>
              <Input
                placeholder="e.g. Universitas Indonesia"
                value={newEdu.institution}
                onChange={(e) =>
                  setNewEdu({ ...newEdu, institution: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Gelar / Tingkat Studi *</Label>
                <Input
                  placeholder="e.g. Sarjana Komputer (S.Kom)"
                  value={newEdu.degree}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, degree: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Jurusan / Bidang Studi</Label>
                <Input
                  placeholder="e.g. Teknik Informatika"
                  value={newEdu.fieldOfStudy || ''}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, fieldOfStudy: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label>Tahun / Bulan Mulai *</Label>
                <Input
                  type="month"
                  value={newEdu.startDate}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tahun / Bulan Selesai</Label>
                <Input
                  type="month"
                  disabled={newEdu.isCurrent}
                  value={newEdu.isCurrent ? '' : newEdu.endDate || ''}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, endDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>IPK / Nilai (Opsional)</Label>
                <Input
                  placeholder="e.g. 3.85 / 4.00"
                  value={newEdu.gpa || ''}
                  onChange={(e) =>
                    setNewEdu({ ...newEdu, gpa: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={newEdu.isCurrent}
                onCheckedChange={(val) =>
                  setNewEdu({ ...newEdu, isCurrent: val, endDate: null })
                }
              />
              <Label className="text-xs">Masih menempuh studi saat ini</Label>
            </div>

            <div className="space-y-1.5">
              <Label>Aktivitas, Prestasi, atau Catatan</Label>
              <Textarea
                rows={2}
                placeholder="Penghargaan akademik, organisasi mahasiswa, judul skripsi..."
                value={newEdu.description || ''}
                onChange={(e) =>
                  setNewEdu({ ...newEdu, description: e.target.value })
                }
              />
            </div>

            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCreate}
              disabled={!newEdu.institution || !newEdu.degree || !newEdu.startDate}
            >
              Simpan Pendidikan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* List of educations */}
      <div className="space-y-3">
        {educations.length === 0 && !isAdding && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            Belum ada riwayat pendidikan.
          </div>
        )}

        {educations.map((edu, idx) => (
          <div
            key={edu.id || idx}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-zinc-400" />
                  {edu.institution}
                </h4>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  {edu.gpa && ` • IPK: ${edu.gpa}`}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {edu.startDate} — {edu.isCurrent ? 'Present' : edu.endDate || 'Present'}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-600"
                onClick={() => removeEducation(idx)}
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
