'use client';

import React from 'react';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { MinimalistTemplate } from './MinimalistTemplate';
import { DeveloperTemplate } from './DeveloperTemplate';
import { BoldTemplate } from './BoldTemplate';
import { ElegantTemplate } from './ElegantTemplate';

import { MotionConfig } from 'framer-motion';
import { ShareCardRenderer } from '@/components/export/ShareCardRenderer';

interface PortfolioRendererProps {
  data: FullPortfolioData;
  exportMode?: 'share-card' | 'full-page' | 'none';
  avatarDataUri?: string | null;
  optimizedImages?: Record<string, string>;
}

export function PortfolioRenderer({
  data,
  exportMode = 'none',
  avatarDataUri,
  optimizedImages,
}: PortfolioRendererProps) {
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

  // Apply mapped avatar and optimized images in export mode
  const resolvedProfile = data.profile
    ? {
        ...data.profile,
        avatarUrl: avatarDataUri !== undefined ? avatarDataUri : data.profile.avatarUrl,
      }
    : undefined;

  const sortedData: FullPortfolioData = {
    ...data,
    profile: resolvedProfile,
    projects: [...(data.projects || [])]
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((proj) => ({
        ...proj,
        imageUrl:
          exportMode === 'full-page'
            ? undefined
            : (proj.imageUrl && optimizedImages?.[proj.imageUrl]) || proj.imageUrl,
      })),
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

  if (exportMode === 'share-card') {
    return (
      <ShareCardRenderer
        data={sortedData}
        pairing={pairing}
        avatarDataUri={avatarDataUri}
      />
    );
  }

  if (exportMode === 'full-page') {
    return (
      <MotionConfig reducedMotion="always">
        <div
          className="export-full-page w-[1280px] min-w-[1280px] max-w-[1280px] font-[family-name:var(--font-body)] text-zinc-900 dark:text-zinc-100 overflow-visible relative"
          style={
            {
              '--font-heading': pairing.heading,
              '--font-body': pairing.body,
              '--primary': data.accentColor || '#2563eb',
            } as React.CSSProperties
          }
        >
          <style>{`
            .export-full-page {
              width: 1280px !important;
              max-width: 1280px !important;
              min-width: 1280px !important;
            }
            .export-full-page *,
            .export-full-page *::before,
            .export-full-page *::after {
              animation-duration: 0.001ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.001ms !important;
              transition-delay: 0s !important;
              scroll-behavior: auto !important;
            }
            .export-full-page nav,
            .export-full-page header {
              position: static !important;
              top: auto !important;
            }
            .export-full-page aside {
              position: static !important;
              top: auto !important;
            }
            .export-full-page .fixed {
              position: absolute !important;
            }
            .export-full-page .min-h-screen {
              min-height: auto !important;
            }
            /* Sembunyikan cover/visual image proyek agar ukuran file minimal (<2MB) & tidak terpotong */
            .export-full-page .relative.w-full.h-36,
            .export-full-page .relative.w-full.h-40,
            .export-full-page .relative.w-full.h-48,
            .export-full-page .relative.w-full.h-56,
            .export-full-page .w-full.h-56,
            .export-full-page .w-full.h-44,
            .export-full-page .w-full.h-52,
            .export-full-page .w-full.h-72,
            .export-full-page .w-full.h-80,
            .export-full-page article > div.relative,
            .export-full-page article > div.w-full.relative,
            .export-full-page .group .relative.overflow-hidden img {
              display: none !important;
            }
            .export-full-page .group > div:has(> img) {
              display: none !important;
            }

            /* Buka seluruh teks yang terpotong (line-clamp / truncate) agar tampil lengkap */
            .export-full-page .line-clamp-2,
            .export-full-page .line-clamp-3,
            .export-full-page .line-clamp-4,
            .export-full-page .line-clamp-5,
            .export-full-page [class*="line-clamp-"] {
              -webkit-line-clamp: unset !important;
              display: block !important;
              max-height: none !important;
              overflow: visible !important;
            }

            .export-full-page .truncate {
              white-space: normal !important;
              overflow: visible !important;
              text-overflow: unset !important;
            }

            /* Pastikan kontainer tidak memotong isi (overflow visible) */
            .export-full-page section,
            .export-full-page article,
            .export-full-page .group {
              overflow: visible !important;
              break-inside: avoid;
            }
          `}</style>
          {renderTemplate()}
        </div>
      </MotionConfig>
    );
  }

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
