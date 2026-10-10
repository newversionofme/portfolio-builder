'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Cpu } from 'lucide-react';

export function SkillsTab() {
  const { portfolio, addSkill, removeSkill } = usePortfolioStore();
  const skills = portfolio.skills || [];

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('Advanced');

  const handleAddSkill = () => {
    if (!name.trim()) return;
    addSkill({
      name: name.trim(),
      category: category.trim() || 'General',
      level: level || 'Advanced',
      order: skills.length,
    });
    setName('');
  };

  const quickCategories = [
    'Frontend',
    'Backend',
    'Design',
    'Database',
    'DevOps',
    'Tools',
    'Soft Skills',
  ];

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

      {/* Add Skill Form */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1 sm:col-span-1">
            <Label className="text-xs">Nama Keahlian *</Label>
            <Input
              placeholder="e.g. TypeScript"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <Label className="text-xs">Kategori</Label>
            <Input
              placeholder="e.g. Frontend"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <Label className="text-xs">Tingkat Kemahiran</Label>
            <select
              className="flex h-9 w-full rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-2xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Quick Category Buttons */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[11px] text-zinc-400">Pilih Kategori Cepat:</span>
          {quickCategories.map((qc) => (
            <button
              key={qc}
              type="button"
              onClick={() => setCategory(qc)}
              className="text-[11px] px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
            >
              {qc}
            </button>
          ))}
        </div>

        <Button
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 gap-1.5"
          onClick={handleAddSkill}
          disabled={!name.trim()}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambahkan Keahlian</span>
        </Button>
      </div>

      {/* Skills Display / Tag Cloud */}
      <div className="space-y-3">
        <Label>Daftar Keahlian Aktif ({skills.length})</Label>

        {skills.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            Belum ada keahlian ditambahkan.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((sk, idx) => (
              <Badge
                key={sk.id || idx}
                variant="outline"
                className="py-1.5 px-3 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-xs font-medium gap-2 items-center shadow-2xs"
              >
                <Cpu className="w-3 h-3 text-blue-500" />
                <span className="text-zinc-900 dark:text-white">{sk.name}</span>
                {sk.category && (
                  <span className="text-[10px] text-zinc-400">
                    ({sk.category})
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="text-zinc-400 hover:text-red-600 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
