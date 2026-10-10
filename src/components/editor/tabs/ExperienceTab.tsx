'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { ExperienceData } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Calendar, Building2 } from 'lucide-react';

export function ExperienceTab() {
  const { portfolio, addExperience, removeExperience } =
    usePortfolioStore();
  const experiences = portfolio.experiences || [];

  const [isAdding, setIsAdding] = useState(false);
  const [newExp, setNewExp] = useState<ExperienceData>({
    company: '',
    companyUrl: '',
    position: '',
    employmentType: 'Full-time',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    order: experiences.length,
  });

  const handleCreate = () => {
    if (!newExp.company || !newExp.position || !newExp.startDate) return;
    addExperience(newExp);
    setNewExp({
      company: '',
      companyUrl: '',
      position: '',
      employmentType: 'Full-time',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      order: experiences.length + 1,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Pengalaman Kerja (Experience)
          </h3>
          <p className="text-xs text-zinc-500">
            Riwayat karier, pekerjaan purna waktu, magang, atau freelance.
          </p>
        </div>

        {!isAdding && (
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pengalaman</span>
          </Button>
        )}
      </div>

      {/* Add New Experience Form */}
      {isAdding && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Tambah Riwayat Baru
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Posisi / Jabatan *</Label>
                <Input
                  placeholder="e.g. Lead Frontend Engineer"
                  value={newExp.position}
                  onChange={(e) =>
                    setNewExp({ ...newExp, position: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Nama Perusahaan *</Label>
                <Input
                  placeholder="e.g. Acme Tech"
                  value={newExp.company}
                  onChange={(e) =>
                    setNewExp({ ...newExp, company: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Lokasi / Tipe Kerja</Label>
                <Input
                  placeholder="e.g. Jakarta (Remote)"
                  value={newExp.location || ''}
                  onChange={(e) =>
                    setNewExp({ ...newExp, location: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tipe Pekerjaan</Label>
                <Input
                  placeholder="e.g. Full-time, Contract, Freelance"
                  value={newExp.employmentType || ''}
                  onChange={(e) =>
                    setNewExp({ ...newExp, employmentType: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tanggal Mulai *</Label>
                <Input
                  type="month"
                  value={newExp.startDate}
                  onChange={(e) =>
                    setNewExp({ ...newExp, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tanggal Selesai</Label>
                <Input
                  type="month"
                  disabled={newExp.isCurrent}
                  value={newExp.isCurrent ? '' : newExp.endDate || ''}
                  onChange={(e) =>
                    setNewExp({ ...newExp, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={newExp.isCurrent}
                onCheckedChange={(val) =>
                  setNewExp({ ...newExp, isCurrent: val, endDate: null })
                }
              />
              <Label className="text-xs">Masih bekerja di sini sampai sekarang</Label>
            </div>

            <div className="space-y-1.5">
              <Label>Deskripsi Pekerjaan & Pencapaian</Label>
              <Textarea
                rows={3}
                placeholder="Jelaskan peran, tanggung jawab, dan dampak/metrik hasil kerja..."
                value={newExp.description || ''}
                onChange={(e) =>
                  setNewExp({ ...newExp, description: e.target.value })
                }
              />
            </div>

            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCreate}
              disabled={!newExp.company || !newExp.position || !newExp.startDate}
            >
              Simpan Pengalaman
            </Button>
          </CardContent>
        </Card>
      )}

      {/* List of existing experiences */}
      <div className="space-y-3">
        {experiences.length === 0 && !isAdding && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            Belum ada riwayat pengalaman. Klik tombol di atas untuk menambahkan.
          </div>
        )}

        {experiences.map((exp, idx) => (
          <div
            key={exp.id || idx}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {exp.position}
                </h4>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{exp.company}</span>
                  <span>•</span>
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    {exp.startDate} — {exp.isCurrent ? 'Present' : exp.endDate || 'Present'}
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-600"
                onClick={() => removeExperience(idx)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {exp.description && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
