'use client';

import React, { useEffect, useState } from 'react';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';

const defaultEmptyPortfolio: FullPortfolioData = {
  slug: 'preview',
  status: 'DRAFT',
  templateId: 'minimalist',
  accentColor: '#2563eb',
  fontFamily: 'Inter',
  language: 'id',
  sectionOrder: [
    'about',
    'skills',
    'projects',
    'experience',
    'education',
    'certifications',
    'testimonials',
    'contact',
  ],
  hiddenSections: [],
  profile: {
    fullName: 'Your Name',
    headline: 'Digital Professional',
    availableForHire: true,
    hireBadgeText: 'Available for work',
    avatarUrl: null,
    bannerUrl: null,
    location: null,
    resumePdfUrl: null,
  },
  about: {
    bio: 'Welcome to my digital portfolio!',
    keyHighlights: [],
  },
  contactInfo: {
    email: '',
    phone: null,
    whatsapp: null,
    enableContactForm: true,
  },
  socialLinks: [],
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  certifications: [],
  testimonials: [],
};

export function PreviewClient() {
  const [data, setData] = useState<FullPortfolioData>(defaultEmptyPortfolio);

  useEffect(() => {
    // Listen for real-time postMessage synchronization from parent editor window
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (event.origin !== window.location.origin) return;

      if (event.data && event.data.type === 'PORTFOLIO_PREVIEW_SYNC' && event.data.data) {
        setData(event.data.data);
      }
    };

    window.addEventListener('message', handleMessage);

    // Notify parent window that preview iframe is ready to receive initial state
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'PREVIEW_READY' }, window.location.origin);
      }
    } catch (e) {
      console.error('Error notifying parent preview window:', e);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return <PortfolioRenderer data={data} />;
}
