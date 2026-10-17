'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Sparkles } from 'lucide-react';
import { useEditorText } from '@/lib/i18n/editor-copy';

export function AboutTab() {
  const tx = useEditorText();
  const { portfolio, updateAbout } = usePortfolioStore();
  const about = portfolio.about;
  const [highlightInput, setHighlightInput] = useState('');

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    const current = about?.keyHighlights || [];
    updateAbout({ keyHighlights: [...current, highlightInput.trim()] });
    setHighlightInput('');
  };

  const removeHighlight = (index: number) => {
    const current = about?.keyHighlights || [];
    updateAbout({ keyHighlights: current.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          {tx('Tentang Saya (About)')}
        </h3>
        <p className="text-xs text-zinc-500">
          {tx('Ceritakan latar belakang, fokus karier, dan pencapaian utama Anda.')}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bio">{tx('Bio & Ringkasan Naratif')}</Label>
        <Textarea
          id="bio"
          rows={6}
          value={about?.bio || ''}
          onChange={(e) => updateAbout({ bio: e.target.value })}
          placeholder={tx('Tuliskan cerita karier, passion, serta bidang keahlian Anda...')}
        />
      </div>

      {/* Key Highlights / Pill Tags */}
      <div className="space-y-3 pt-2">
        <div className="space-y-0.5">
          <Label>{tx('Highlight Utama (Badge Poin)')}</Label>
          <p className="text-xs text-zinc-500">
            {tx('Contoh: “5+ Tahun Pengalaman”, “100k+ Active Users”, “Red Dot Winner”')}
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addHighlight();
              }
            }}
            placeholder={tx('Tambah poin highlight...')}
          />
          <Button
            type="button"
            variant="outline"
            onClick={addHighlight}
            className="shrink-0 gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{tx('Tambah')}</span>
          </Button>
        </div>

        {about?.keyHighlights && about.keyHighlights.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {about.keyHighlights.map((hl, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="gap-1.5 py-1 px-2.5 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
              >
                <Sparkles className="w-3 h-3 text-blue-500" />
                <span>{hl}</span>
                <button
                  type="button"
                  onClick={() => removeHighlight(idx)}
                  className="hover:text-red-600 transition-colors"
                  aria-label={tx('Hapus highlight')}
                  title={tx('Hapus highlight')}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
