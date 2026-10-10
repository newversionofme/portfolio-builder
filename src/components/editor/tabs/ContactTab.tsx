'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Globe, Mail, Phone } from 'lucide-react';

export function ContactTab() {
  const {
    portfolio,
    updateContact,
    addSocialLink,
    removeSocialLink,
  } = usePortfolioStore();

  const contact = portfolio.contactInfo;
  const socialLinks = portfolio.socialLinks || [];

  const [platform, setPlatform] = useState('github');
  const [url, setUrl] = useState('');

  const handleAddSocial = () => {
    if (!url.trim()) return;
    addSocialLink({
      platform,
      url: url.trim(),
      order: socialLinks.length,
    });
    setUrl('');
  };

  const platforms = [
    { value: 'github', label: 'GitHub' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'twitter', label: 'Twitter / X' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'dribbble', label: 'Dribbble' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'website', label: 'Website Pribadi' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
          Kontak & Sosial Media
        </h3>
        <p className="text-xs text-zinc-500">
          Cara rekruter dan pengunjung menghubungi Anda secara langsung.
        </p>
      </div>

      {/* Direct Contact Fields */}
      <div className="space-y-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="space-y-1.5">
          <Label htmlFor="contactEmail">Email Kontak</Label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <Input
              id="contactEmail"
              type="email"
              placeholder="nama@domain.com"
              className="pl-9"
              value={contact?.email || ''}
              onChange={(e) => updateContact({ email: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <div className="relative">
              <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <Input
                id="phone"
                placeholder="+62 812 3456 7890"
                className="pl-9"
                value={contact?.phone || ''}
                onChange={(e) => updateContact({ phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
            <Input
              id="whatsapp"
              placeholder="+62 812 3456 7890"
              value={contact?.whatsapp || ''}
              onChange={(e) => updateContact({ whatsapp: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Social Links Manager */}
      <div className="space-y-3">
        <Label>Tautan Sosial Media & Portofolio Eksternal</Label>

        <div className="flex gap-2">
          <select
            className="flex h-9 rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm shadow-2xs dark:border-zinc-800 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            {platforms.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <Input
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSocial();
              }
            }}
          />

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSocial}
            className="shrink-0 gap-1.5"
            disabled={!url.trim()}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </Button>
        </div>

        {/* List of social links */}
        <div className="space-y-2 pt-2">
          {socialLinks.map((s, idx) => (
            <div
              key={s.id || idx}
              className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs"
            >
              <div className="flex items-center gap-2 text-xs">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-semibold capitalize text-zinc-900 dark:text-white">
                  {s.platform}:
                </span>
                <span className="text-zinc-500 truncate max-w-[240px] sm:max-w-xs">
                  {s.url}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-zinc-400 hover:text-red-600"
                onClick={() => removeSocialLink(idx)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
