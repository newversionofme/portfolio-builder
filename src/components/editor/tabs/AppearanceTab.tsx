'use client';

import React from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Layout, Palette, Terminal, Briefcase, FileText } from 'lucide-react';
import { ExportCvModal } from '@/components/export/ExportCvModal';

export function AppearanceTab() {
  const { portfolio, updateTheme } = usePortfolioStore();

  const templates = [
    {
      id: 'minimalist',
      name: 'Minimalist',
      desc: 'Clean, editorial, whitespace-focused',
      icon: Layout,
    },
    {
      id: 'bold',
      name: 'Bold / Creative',
      desc: 'Bento-grid, vibrant pop accents, visual-first',
      icon: Palette,
    },
    {
      id: 'developer',
      name: 'Developer / Dark',
      desc: 'Terminal aesthetics, monospace, GitHub repos',
      icon: Terminal,
    },
    {
      id: 'elegant',
      name: 'Elegant / Pro',
      desc: 'Refined serif typography, prestige corporate',
      icon: Briefcase,
    },
  ];

  const accentColors = [
    { name: 'Electric Blue', hex: '#2563eb' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Violet Purple', hex: '#7c3aed' },
    { name: 'Amber Orange', hex: '#d97706' },
    { name: 'Rose Pink', hex: '#e11d48' },
    { name: 'Slate Dark', hex: '#18181b' },
  ];

  const fonts = [
    { id: 'Inter', name: 'Inter (Modern Sans)' },
    { id: 'Plus Jakarta Sans', name: 'Plus Jakarta Sans (Friendly Tech)' },
    { id: 'Playfair Display', name: 'Playfair Display (Editorial Serif)' },
    { id: 'JetBrains Mono', name: 'JetBrains Mono (Developer Mono)' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          Tampilan & Tema Visual
        </h3>
        <p className="text-xs text-zinc-500">
          Ubah gaya visual portofolio Anda secara instan tanpa mengubah data.
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-3">
        <Label>Pilihan Template (4 Tema Bawaan)</Label>
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
        <Label>Warna Aksen Utama</Label>
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
        <Label>Pilihan Tipografi Font</Label>
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
        <Label>Bahasa Portofolio (Portfolio Language)</Label>
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
                🇮🇩 Bahasa Indonesia
              </span>
              <span className="text-[11px] text-zinc-500">Label standar bahasa Indonesia</span>
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
              <span className="text-[11px] text-zinc-500">International English labels</span>
            </div>
            {portfolio.language === 'en' && <Check className="w-4 h-4 text-blue-600" />}
          </div>
        </div>
      </div>

      {/* Ekspor Dokumen & CV */}
      <div className="space-y-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          <Label className="text-sm font-semibold text-zinc-900 dark:text-white">
            {portfolio.language === 'en' ? 'Export & Documents' : 'Ekspor & Dokumen'}
          </Label>
          <p className="text-xs text-zinc-500 mt-0.5">
            {portfolio.language === 'en'
              ? 'Download your curriculum vitae generated directly from your portfolio data.'
              : 'Unduh kurikulum vitae Anda yang disusun langsung dari data portofolio ini.'}
          </p>
        </div>

        <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Curriculum Vitae (PDF)</span>
            </h4>
            <p className="text-[11px] text-zinc-500">
              {portfolio.language === 'en'
                ? 'Standard ATS-friendly A4 format with selectable vector text.'
                : 'Format standar A4 ramah ATS dengan teks vektor yang dapat disalin.'}
            </p>
          </div>

          <ExportCvModal />
        </div>
      </div>
    </div>
  );
}
