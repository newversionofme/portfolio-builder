'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { SkillData, skillSchema } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Plus,
  Trash2,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog';

export function SkillsTab() {
  const { portfolio, addSkill, updateSkill, removeSkill, moveItem } =
    usePortfolioStore();
  const skills = portfolio.skills || [];

  // Quick add state
  const [quickName, setQuickName] = useState('');
  const [quickCategory, setQuickCategory] = useState('');
  const [quickLevel, setQuickLevel] = useState('Advanced');

  // Edit dialog state (local working copy)
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localSkill, setLocalSkill] = useState<SkillData>({
    name: '',
    category: '',
    level: 'Advanced',
    order: 0,
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Delete target state
  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    title: string;
  } | null>(null);

  const quickCategories = [
    'Frontend',
    'Backend',
    'Design',
    'Database',
    'DevOps',
    'Tools',
    'Soft Skills',
  ];

  const handleAddSkill = () => {
    if (!quickName.trim()) {
      toast.error('Nama keahlian wajib diisi');
      return;
    }
    const newSkill: SkillData = {
      name: quickName.trim(),
      category: quickCategory.trim() || 'General',
      level: quickLevel || 'Advanced',
      order: skills.length,
    };

    addSkill(newSkill);
    toast.success(`Keahlian "${newSkill.name}" ditambahkan!`);
    setQuickName('');
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setLocalSkill({ ...skills[index] });
    setEditErrors({});
  };

  const closeEditModal = () => {
    setEditingIndex(null);
    setLocalSkill({ name: '', category: '', level: 'Advanced', order: 0 });
    setEditErrors({});
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;

    const validation = skillSchema.safeParse(localSkill);
    if (!localSkill.name.trim()) {
      setEditErrors({ name: 'Nama keahlian wajib diisi' });
      return;
    }

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        errMap[String(issue.path[0] || 'name')] = issue.message;
      });
      setEditErrors(errMap);
      return;
    }

    updateSkill(editingIndex, localSkill);
    toast.success(`Keahlian "${localSkill.name}" berhasil diperbarui!`);
    closeEditModal();
  };

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return;
    const { index, title } = deleteTarget;

    if (editingIndex === index) {
      closeEditModal();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    removeSkill(index);
    toast.success(`Keahlian "${title}" berhasil dihapus.`);
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          Keahlian (Skills & Expertise)
        </h3>
        <p className="text-xs text-zinc-500">
          Tambahkan keahlian teknis, tools, bahasa pemrograman, atau soft skills.
        </p>
      </div>

      {/* Quick Add Form (Compact) */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="quick-skill-name" className="text-xs">
              Nama Keahlian *
            </Label>
            <Input
              id="quick-skill-name"
              placeholder="e.g. React.js, Python, Figma"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="quick-skill-cat" className="text-xs">
              Kategori
            </Label>
            <Input
              id="quick-skill-cat"
              placeholder="e.g. Frontend"
              value={quickCategory}
              onChange={(e) => setQuickCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="quick-skill-level" className="text-xs">
              Tingkat Kemahiran
            </Label>
            <select
              id="quick-skill-level"
              className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
              value={quickLevel}
              onChange={(e) => setQuickLevel(e.target.value)}
            >
              <option value="Beginner">Beginner (Pemula)</option>
              <option value="Intermediate">Intermediate (Menengah)</option>
              <option value="Advanced">Advanced (Mahir)</option>
              <option value="Expert">Expert (Ahli)</option>
            </select>
          </div>
        </div>

        {/* Quick Category Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[11px] text-zinc-400">Pilih Kategori:</span>
          {quickCategories.map((qc) => (
            <button
              key={qc}
              type="button"
              onClick={() => setQuickCategory(qc)}
              className="text-[11px] px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              {qc}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 gap-1.5 h-9 min-h-[38px] text-xs"
          onClick={handleAddSkill}
          disabled={!quickName.trim()}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambahkan Keahlian</span>
        </Button>
      </div>

      {/* Skills Display / Tag Cloud */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Daftar Keahlian ({skills.length})
          </Label>
          {skills.length > 0 && (
            <span className="text-[11px] text-zinc-400">
              Klik chip untuk mengedit • Atur posisi dengan panah
            </span>
          )}
        </div>

        {skills.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            Belum ada keahlian ditambahkan. Ketik nama skill di atas lalu klik Tambahkan.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {skills.map((sk, idx) => (
              <div
                key={sk.id || idx}
                className="group inline-flex items-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden transition-all hover:border-blue-400 dark:hover:border-blue-700"
              >
                {/* Reorder Left */}
                <button
                  type="button"
                  onClick={() => moveItem('skills', idx, 'up')}
                  disabled={idx === 0}
                  className="h-10 w-8 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                  aria-label={`Pindahkan ${sk.name} ke kiri`}
                  title="Pindahkan ke kiri"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Clickable Chip Body for Edit */}
                <button
                  type="button"
                  onClick={() => openEditModal(idx)}
                  className="px-2.5 py-2 flex items-center gap-1.5 text-left text-xs font-medium text-zinc-900 dark:text-zinc-100 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors"
                  title="Klik untuk mengedit keahlian"
                >
                  <Cpu className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-semibold">{sk.name}</span>
                  {sk.category && (
                    <span className="text-[10px] text-zinc-400 font-normal">
                      • {sk.category}
                    </span>
                  )}
                  {sk.level && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-normal">
                      {sk.level}
                    </span>
                  )}
                  <Pencil className="w-3 h-3 text-zinc-400 opacity-60 ml-1" />
                </button>

                {/* Reorder Right */}
                <button
                  type="button"
                  onClick={() => moveItem('skills', idx, 'down')}
                  disabled={idx === skills.length - 1}
                  className="h-10 w-8 flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-20 disabled:hover:bg-transparent transition-colors"
                  aria-label={`Pindahkan ${sk.name} ke kanan`}
                  title="Pindahkan ke kanan"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button with >= 40px Touch Target */}
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget({
                      index: idx,
                      title: sk.name,
                    })
                  }
                  className="min-w-[40px] min-h-[40px] h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border-l border-zinc-100 dark:border-zinc-800"
                  aria-label={`Hapus ${sk.name}`}
                  title={`Hapus ${sk.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Skill Dialog (Compact Modal) */}
      <Dialog open={editingIndex !== null} onOpenChange={(open) => !open && closeEditModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Edit Keahlian
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="edit-skill-name" className="text-xs">
                Nama Keahlian *
              </Label>
              <Input
                id="edit-skill-name"
                value={localSkill.name}
                onChange={(e) => {
                  setLocalSkill({ ...localSkill, name: e.target.value });
                  if (editErrors.name) setEditErrors((prev) => ({ ...prev, name: '' }));
                }}
                className={editErrors.name ? 'border-red-500' : ''}
              />
              {editErrors.name && (
                <p className="text-[11px] text-red-500">{editErrors.name}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-skill-cat" className="text-xs">
                Kategori
              </Label>
              <Input
                id="edit-skill-cat"
                placeholder="e.g. Frontend, Design, Backend"
                value={localSkill.category || ''}
                onChange={(e) =>
                  setLocalSkill({ ...localSkill, category: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="edit-skill-level" className="text-xs">
                Tingkat Kemahiran
              </Label>
              <select
                id="edit-skill-level"
                className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-xs shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                value={localSkill.level || 'Advanced'}
                onChange={(e) =>
                  setLocalSkill({ ...localSkill, level: e.target.value })
                }
              >
                <option value="Beginner">Beginner (Pemula)</option>
                <option value="Intermediate">Intermediate (Menengah)</option>
                <option value="Advanced">Advanced (Mahir)</option>
                <option value="Expert">Expert (Ahli)</option>
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={closeEditModal}
              className="h-9 min-h-[38px] text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveEdit}
              className="h-9 min-h-[38px] bg-blue-600 hover:bg-blue-700 text-xs px-4"
            >
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.title || ''}
        itemType="keahlian"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
