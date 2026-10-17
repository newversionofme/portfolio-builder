'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { LandingHeroCta } from '@/components/landing/LandingHeroCta';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Sparkles,
  ArrowRight,
  Layout,
  Terminal,
  Palette,
  Briefcase,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe2,
  FileDown,
} from 'lucide-react';

export function LandingView() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col justify-between w-full overflow-x-hidden transition-colors">
      {/* Responsive Header with Hamburger Menu & Language Switcher */}
      <LandingHeader />

      {/* Hero Section */}
      <main className="flex-1 w-full overflow-x-hidden">
        <section className="py-12 sm:py-20 md:py-28 px-4 sm:px-6 max-w-5xl mx-auto text-center w-full">
          <Badge
            variant="outline"
            className="mb-4 sm:mb-6 px-3.5 py-1 text-[11px] sm:text-xs font-medium border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full inline-flex items-center gap-1.5 max-w-full text-center"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate sm:whitespace-normal">{t.hero.badge}</span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.15] sm:leading-tight break-words px-1">
            {t.hero.titleStart}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {t.hero.titleHighlight}
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed px-1">
            {t.hero.subtitle}
          </p>

          {/* Interactive Environment-Aware CTA & Localhost Demo Section */}
          <LandingHeroCta />

          <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 text-[11px] sm:text-xs text-zinc-500 px-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span>{t.hero.trustFree}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span>{t.hero.trustSlug}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span>{t.hero.trustSsr}</span>
            </div>
          </div>
        </section>

        {/* 4 Templates Preview Section */}
        <section
          id="template"
          className="scroll-mt-20 py-14 sm:py-20 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200/80 dark:border-zinc-800 w-full"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
              <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2 block">
                {t.templates.sectionBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
                {t.templates.title}
              </h2>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.templates.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              {/* Template 1: Minimalist */}
              <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardContent className="p-5 sm:p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 mb-4">
                      <Layout className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                      {t.templates.minimalist.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-4 leading-relaxed">
                      {t.templates.minimalist.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] w-fit">
                    {t.templates.minimalist.tagline}
                  </Badge>
                </CardContent>
              </Card>

              {/* Template 2: Bold / Creative */}
              <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardContent className="p-5 sm:p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-4">
                      <Palette className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                      {t.templates.bold.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-4 leading-relaxed">
                      {t.templates.bold.description}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300 w-fit"
                  >
                    {t.templates.bold.tagline}
                  </Badge>
                </CardContent>
              </Card>

              {/* Template 3: Developer / Terminal */}
              <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardContent className="p-5 sm:p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                      {t.templates.developer.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-4 leading-relaxed">
                      {t.templates.developer.description}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 w-fit"
                  >
                    {t.templates.developer.tagline}
                  </Badge>
                </CardContent>
              </Card>

              {/* Template 4: Elegant Dossier */}
              <Card className="hover:shadow-lg transition-all duration-200 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <CardContent className="p-5 sm:p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-4">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-white">
                      {t.templates.elegant.title}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-4 leading-relaxed">
                      {t.templates.elegant.description}
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 w-fit"
                  >
                    {t.templates.elegant.tagline}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Features Section */}
        <section
          id="fitur"
          className="scroll-mt-20 py-14 sm:py-24 max-w-5xl mx-auto px-4 sm:px-6 w-full"
        >
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-semibold mb-2 block">
              {t.features.sectionBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
              {t.features.title}
            </h2>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 w-full">
            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {t.features.item1.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.features.item1.desc}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 flex items-center justify-center mb-4">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {t.features.item2.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.features.item2.desc}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-4">
                <FileDown className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {t.features.item3.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.features.item3.desc}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-4">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
                {t.features.item4.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.features.item4.desc}
              </p>
            </div>
          </div>
        </section>

        {/* How It Works & CTA Banner */}
        <section
          id="cara-kerja"
          className="scroll-mt-20 py-16 sm:py-24 bg-gradient-to-b from-transparent via-blue-50/50 dark:via-blue-950/20 to-transparent w-full"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
              {t.ctaBanner.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
              {t.ctaBanner.subtitle}
            </p>
            <div className="pt-2">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-base shadow-lg shadow-blue-600/20 font-medium"
                asChild
              >
                <Link href="/register">
                  {t.ctaBanner.button}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 px-4 sm:px-6 w-full">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 w-full text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">PortfolioBuilder</p>
            <p>&copy; {new Date().getFullYear()} Portfolio Builder. {t.footer.rights}</p>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/register"
              className="hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            >
              {t.nav.register}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

