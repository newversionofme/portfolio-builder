'use client';

import React from 'react';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { MinimalistTemplate } from './MinimalistTemplate';
import { DeveloperTemplate } from './DeveloperTemplate';
import { BoldTemplate } from './BoldTemplate';
import { ElegantTemplate } from './ElegantTemplate';

interface PortfolioRendererProps {
  data: FullPortfolioData;
}

export function PortfolioRenderer({ data }: PortfolioRendererProps) {
  // Determine template default font if not set
  const getDefaultFontForTemplate = (tpl?: string) => {
    switch (tpl) {
      case 'developer':
        return 'JetBrains Mono';
      case 'bold':
        return 'Plus Jakarta Sans';
      case 'elegant':
        return 'Playfair Display';
      case 'minimalist':
      default:
        return 'Inter';
    }
  };

  const activeFont = data.fontFamily || getDefaultFontForTemplate(data.templateId);

  // Compute font pairing for heading and body
  const getFontPairing = (font: string) => {
    switch (font) {
      case 'Plus Jakarta Sans':
        return {
          heading: 'var(--font-plus-jakarta), sans-serif',
          body: 'var(--font-plus-jakarta), sans-serif',
        };
      case 'Playfair Display':
        return {
          heading: 'var(--font-playfair), Georgia, serif',
          body: 'var(--font-plus-jakarta), var(--font-inter), sans-serif',
        };
      case 'JetBrains Mono':
        return {
          heading: 'var(--font-jetbrains), monospace',
          body: 'var(--font-inter), sans-serif',
        };
      case 'Inter':
      default:
        return {
          heading: 'var(--font-inter), sans-serif',
          body: 'var(--font-inter), sans-serif',
        };
    }
  };

  const pairing = getFontPairing(activeFont);

  const sortedData: FullPortfolioData = {
    ...data,
    projects: [...(data.projects || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    experiences: [...(data.experiences || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    educations: [...(data.educations || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    skills: [...(data.skills || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    certifications: [...(data.certifications || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    testimonials: [...(data.testimonials || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    socialLinks: [...(data.socialLinks || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };

  const renderTemplate = () => {
    switch (sortedData.templateId) {
      case 'developer':
        return <DeveloperTemplate data={sortedData} />;
      case 'bold':
        return <BoldTemplate data={sortedData} />;
      case 'elegant':
        return <ElegantTemplate data={sortedData} />;
      case 'minimalist':
      default:
        return <MinimalistTemplate data={sortedData} />;
    }
  };

  return (
    <div
      className="w-full min-h-full font-[family-name:var(--font-body)] text-zinc-900 dark:text-zinc-100"
      style={
        {
          '--font-heading': pairing.heading,
          '--font-body': pairing.body,
          '--primary': data.accentColor || '#2563eb',
        } as React.CSSProperties
      }
    >
      {renderTemplate()}
    </div>
  );
}
