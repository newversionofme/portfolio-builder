import React from 'react';
import { LandingView } from '@/components/landing/LandingView';

export const metadata = {
  title: 'Portfolio Builder - Buat Website Portofolio Modern Tanpa Coding',
  description:
    'Platform pembuat website portofolio modern untuk mahasiswa, fresh graduate, desainer, developer, dan profesional. Cukup isi form, langsung publish via link publik.',
};

export default function HomePage() {
  return <LandingView />;
}
