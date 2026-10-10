'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { TestimonialData } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

export function TestimonialsTab() {
  const { portfolio, addTestimonial, removeTestimonial } = usePortfolioStore();
  const testimonials = portfolio.testimonials || [];

  const [isAdding, setIsAdding] = useState(false);
  const [newTest, setNewTest] = useState<TestimonialData>({
    name: '',
    role: '',
    company: '',
    quote: '',
    avatarUrl: '',
    order: testimonials.length,
  });

  const handleCreate = () => {
    if (!newTest.name || !newTest.role || !newTest.quote) return;
    addTestimonial(newTest);
    setNewTest({
      name: '',
      role: '',
      company: '',
      quote: '',
      avatarUrl: '',
      order: testimonials.length + 1,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Testimoni & Rekomendasi
          </h3>
          <p className="text-xs text-zinc-500">
            Kutipan rekomendasi dari manajer, klien, atau rekan kerja.
          </p>
        </div>

        {!isAdding && (
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Testimoni</span>
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20">
          <CardContent className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Tambah Testimoni Baru
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
                <Label>Nama Pemberi Rekomendasi *</Label>
                <Input
                  placeholder="e.g. Sarah Jenkins"
                  value={newTest.name}
                  onChange={(e) =>
                    setNewTest({ ...newTest, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Jabatan / Peran *</Label>
                <Input
                  placeholder="e.g. VP of Engineering"
                  value={newTest.role}
                  onChange={(e) =>
                    setNewTest({ ...newTest, role: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Nama Perusahaan / Klien</Label>
              <Input
                placeholder="e.g. Vercel Ecosystem"
                value={newTest.company || ''}
                onChange={(e) =>
                  setNewTest({ ...newTest, company: e.target.value })
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label>Kutipan Testimoni *</Label>
              <Textarea
                rows={3}
                placeholder="Tuliskan ulasan atau rekomendasi tentang etos kerja Anda..."
                value={newTest.quote}
                onChange={(e) =>
                  setNewTest({ ...newTest, quote: e.target.value })
                }
              />
            </div>

            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCreate}
              disabled={!newTest.name || !newTest.role || !newTest.quote}
            >
              Simpan Testimoni
            </Button>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {testimonials.length === 0 && !isAdding && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            Belum ada testimoni.
          </div>
        )}

        {testimonials.map((test, idx) => (
          <div
            key={test.id || idx}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {test.name}
                </h4>
                <p className="text-xs text-zinc-500">
                  {test.role} {test.company && `• ${test.company}`}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 italic pt-1">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-zinc-400 hover:text-red-600"
                onClick={() => removeTestimonial(idx)}
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
