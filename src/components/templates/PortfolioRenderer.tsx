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

  const renderTemplate = () => {
    switch (data.templateId) {
      case 'developer':
        return <DeveloperTemplate data={data} />;
      case 'bold':
        return <BoldTemplate data={data} />;
      case 'elegant':
        return <ElegantTemplate data={data} />;
      case 'minimalist':
      default:
        return <MinimalistTemplate data={data} />;
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
