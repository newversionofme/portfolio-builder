'use client';

import React from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Layout, Palette, Terminal, Briefcase, FileText, ImageIcon, Monitor } from 'lucide-react';
import { useExportModalStore } from '@/lib/store/export-modal-store';
import { Button } from '@/components/ui/button';
import { useEditorText } from '@/lib/i18n/editor-copy';

export function AppearanceTab() {
  const tx = useEditorText();
  const { portfolio, updateTheme } = usePortfolioStore();
  const { openCvModal, openShareCardModal, openFullPageModal } = useExportModalStore();

  const templates = [
    {
      id: 'minimalist',
      name: tx('Minimalist'),
      desc: tx('Clean, editorial, whitespace-focused'),
      icon: Layout,
    },
    {
      id: 'bold',
      name: tx('Bold / Creative'),
      desc: tx('Bento-grid, vibrant pop accents, visual-first'),
      icon: Palette,
    },
    {
      id: 'developer',
      name: tx('Developer / Dark'),
      desc: tx('Terminal aesthetics, monospace, GitHub repos'),
      icon: Terminal,
    },
    {
      id: 'elegant',
      name: tx('Elegant / Pro'),
      desc: tx('Refined serif typography, prestige corporate'),
      icon: Briefcase,
    },
  ];

  const accentColors = [
    { name: tx('Electric Blue'), hex: '#2563eb' },
    { name: tx('Emerald Green'), hex: '#059669' },
    { name: tx('Violet Purple'), hex: '#7c3aed' },
    { name: tx('Amber Orange'), hex: '#d97706' },
    { name: tx('Rose Pink'), hex: '#e11d48' },
    { name: tx('Slate Dark'), hex: '#18181b' },
  ];

  const fonts = [
    { id: 'Inter', name: tx('Inter (Modern Sans)') },
    { id: 'Plus Jakarta Sans', name: tx('Plus Jakarta Sans (Friendly Tech)') },
    { id: 'Playfair Display', name: tx('Playfair Display (Editorial Serif)') },
    { id: 'JetBrains Mono', name: tx('JetBrains Mono (Developer Mono)') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          {tx('Tampilan & Tema Visual')}
        </h3>
        <p className="text-xs text-zinc-500">
          {tx('Ubah gaya visual portofolio Anda secara instan tanpa mengubah data.')}
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <Label>{tx('Pilihan Template (4 Tema Bawaan)')}</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            const isSelected = portfolio.templateId === tpl.id;
            return (
              <Card
                key={tpl.id}
                onClick={() => updateTheme({ templateId: tpl.id as 'minimalist' | 'bold' | 'developer' | 'elegant' })}
                className={`cursor-pointer transition-all border-2 ${
                  isSelected
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <CardContent className="p-3.5 flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-zinc-900 dark:text-white">
                        {tpl.name}
                      </h4>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                      {tpl.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Accent Color Picker */}
      <div className="space-y-3">
        <Label>{tx('Warna Aksen Utama')}</Label>
        <div className="flex items-center gap-3 flex-wrap">
          {accentColors.map((col) => {
            const isSelected = portfolio.accentColor === col.hex;
            return (
              <button
                key={col.hex}
                type="button"
                onClick={() => updateTheme({ accentColor: col.hex })}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${
                  isSelected ? 'scale-110 ring-2 ring-offset-2 ring-zinc-900 dark:ring-white' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: col.hex }}
                title={col.name}
              >
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Family Selection */}
      <div className="space-y-3">
        <Label>{tx('Pilihan Tipografi Font')}</Label>
        <div className="space-y-2">
          {fonts.map((f) => {
            const isSelected = portfolio.fontFamily === f.id;
            return (
              <div
                key={f.id}
                onClick={() => updateTheme({ fontFamily: f.id })}
                className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                }`}
              >
                <span className="text-xs font-medium text-zinc-900 dark:text-white">
                  {f.name}
                </span>
                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Language Selection */}
      <div className="space-y-3">
        <Label>{tx('Bahasa Portofolio (Portfolio Language)')}</Label>
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => updateTheme({ language: 'id' })}
            className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              (portfolio.language || 'id') === 'id'
                ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white block">
                🇮🇩 {tx('Bahasa Indonesia')}
              </span>
              <span className="text-[11px] text-zinc-500">{tx('Label standar bahasa Indonesia')}</span>
            </div>
            {(portfolio.language || 'id') === 'id' && <Check className="w-4 h-4 text-blue-600" />}
          </div>

          <div
            onClick={() => updateTheme({ language: 'en' })}
            className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
              portfolio.language === 'en'
                ? 'border-blue-600 bg-blue-50/20 dark:border-blue-500 dark:bg-blue-950/20'
                : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
            }`}
          >
            <div>
              <span className="text-xs font-semibold text-zinc-900 dark:text-white block">
                🇬🇧 English
              </span>
              <span className="text-[11px] text-zinc-500">{tx('International English labels')}</span>
            </div>
            {portfolio.language === 'en' && <Check className="w-4 h-4 text-blue-600" />}
          </div>
        </div>
      </div>

      {/* Ekspor Dokumen & Media */}
      <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          <Label className="text-sm font-semibold text-zinc-900 dark:text-white">
            {tx('Ekspor & Dokumen')}
          </Label>
          <p className="text-xs text-zinc-500 mt-0.5">
            {tx('Unduh kurikulum vitae (PDF) dan kartu gambar bagikan (PNG) yang disusun langsung dari data portofolio ini.')}
          </p>
        </div>

        <div className="space-y-3">
          {/* Card 1: CV PDF */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">{tx('Curriculum Vitae (PDF)')}</span>
              </h4>
              <p className="text-[11px] text-zinc-500">
                {tx('Format standar A4 ramah ATS dengan teks vektor yang dapat disalin.')}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openCvModal}
              className="w-full sm:w-auto h-10 sm:h-8 px-3 text-xs gap-1.5 cursor-pointer font-medium min-h-[40px] sm:min-h-[32px] justify-center shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{tx('Unduh CV (PDF)')}</span>
            </Button>
          </div>

          {/* Card 2: Share Card PNG */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="truncate">{tx('Kartu Bagikan / Social Card (PNG)')}</span>
              </h4>
              <p className="text-[11px] text-zinc-500">
                {tx('Gambar beresolusi tinggi 1200 × 630 px sesuai tema dan warna aksen untuk dibagikan di media sosial.')}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openShareCardModal}
              className="w-full sm:w-auto h-10 sm:h-8 px-3 text-xs gap-1.5 cursor-pointer font-medium min-h-[40px] sm:min-h-[32px] justify-center shrink-0"
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{tx('Unduh Gambar (PNG)')}</span>
            </Button>
          </div>

          {/* Card 3: Full-Page PNG */}
          <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="truncate">{tx('Halaman Penuh / Full-Page (PNG)')}</span>
              </h4>
              <p className="text-[11px] text-zinc-500">
                {tx('Tangkapan layar resolusi tinggi 1280 px seluruh bagian portofolio dengan tema dan warna aktif.')}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openFullPageModal}
              className="w-full sm:w-auto h-10 sm:h-8 px-3 text-xs gap-1.5 cursor-pointer font-medium min-h-[40px] sm:min-h-[32px] justify-center shrink-0"
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{tx('Unduh Halaman Penuh')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
