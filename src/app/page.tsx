import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LandingHeroCta } from '@/components/landing/LandingHeroCta';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
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
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col justify-between w-full overflow-x-hidden">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 w-full">
          <Link href="/" className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight min-w-0 shrink">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shrink-0">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <span className="truncate">Portfolio<span className="text-blue-600">Builder</span></span>
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs sm:text-sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm h-8 px-2.5 sm:px-3 text-xs sm:text-sm font-medium" asChild>
              <Link href="/register">
                <span className="hidden sm:inline">Buat Portofolio</span>
                <span className="sm:hidden">Daftar</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-1 sm:ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 w-full overflow-x-hidden">
        <section className="py-12 sm:py-20 md:py-28 px-3.5 sm:px-6 max-w-5xl mx-auto text-center w-full">
          <Badge
            variant="outline"
            className="mb-4 sm:mb-6 px-3 py-1 text-[11px] sm:text-xs font-medium border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 rounded-full inline-flex items-center gap-1.5 max-w-full text-center"
          >
            <Sparkles className="w-3 h-3 shrink-0" />
            <span className="truncate sm:whitespace-normal">⚡ Digunakan oleh 1.400+ Developer & Desainer • Siap Rilis dalam 7 Menit</span>
          </Badge>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.15] sm:leading-tight break-words px-1">
            Cukup Isi Formulir,{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Website Portofolio Siap Rilis
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed px-1">
            Tanpa pusing coding atau mendesain dari canvas kosong. Masukkan riwayat, proyek, dan keahlian Anda, lalu publikasikan tautan portofolio profesional dalam 5 menit.
          </p>

          {/* Interactive Environment-Aware CTA & Localhost Demo Section */}
          <LandingHeroCta />

          <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 text-[11px] sm:text-xs text-zinc-500 px-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span>100% Gratis untuk MVP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span>Link Publik Unik /u/slug</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
              <span>Performa Cepat (SSR)</span>
            </div>
          </div>
        </section>

        {/* 4 Templates Preview Section */}
        <section className="py-12 sm:py-16 bg-zinc-50 dark:bg-zinc-900/50 border-y border-zinc-200/80 dark:border-zinc-800 w-full">
          <div className="max-w-6xl mx-auto px-3.5 sm:px-6 w-full">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                4 Konsep Template Terkurasi
              </h2>
              <p className="mt-2 sm:mt-3 text-xs sm:text-base text-zinc-600 dark:text-zinc-400">
                Data Anda terpisah secara modular dari tampilan. Ganti tema kapan saja dalam 1 klik tanpa kehilangan data.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
              {/* Template 1: Minimalist */}
              <Card className="hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800">
                <CardContent className="p-4 sm:p-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-800 dark:text-zinc-200 mb-3 sm:mb-4">
                    <Layout className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-white">Minimalist</h3>
                  <p className="text-xs text-zinc-500 mt-1 mb-3 sm:mb-4 leading-relaxed">
                    Clean, editorial, fokus pada whitespace dan tipografi rapi. Cocok untuk fresh graduate & profesional umum.
                  </p>
                  <Badge variant="secondary" className="text-[10px]">Clean & Editorial</Badge>
                </CardContent>
              </Card>

              {/* Template 2: Bold / Creative */}
              <Card className="hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800">
                <CardContent className="p-4 sm:p-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center text-violet-600 dark:text-violet-400 mb-3 sm:mb-4">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-white">Bold / Creative</h3>
                  <p className="text-xs text-zinc-500 mt-1 mb-3 sm:mb-4 leading-relaxed">
                    Bento-grid modern, galeri visual, dan warna pop vibrant. Cocok untuk UI/UX designer & kreator.
                  </p>
                  <Badge variant="secondary" className="text-[10px] bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300">
                    Bento & Visual
                  </Badge>
                </CardContent>
              </Card>

              {/* Template 3: Developer / Dark */}
              <Card className="hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800">
                <CardContent className="p-4 sm:p-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3 sm:mb-4">
                    <Terminal className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-white">Developer / Dark</h3>
                  <p className="text-xs text-zinc-500 mt-1 mb-3 sm:mb-4 leading-relaxed">
                    Aksen terminal, font monospace, kartu repositori GitHub & tech stack badges. Cocok untuk programmer.
                  </p>
                  <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                    Code & GitHub
                  </Badge>
                </CardContent>
              </Card>

              {/* Template 4: Elegant / Professional */}
              <Card className="hover:shadow-md transition-shadow border-zinc-200 dark:border-zinc-800">
                <CardContent className="p-4 sm:p-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-3 sm:mb-4">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg text-zinc-900 dark:text-white">Elegant / Pro</h3>
                  <p className="text-xs text-zinc-500 mt-1 mb-3 sm:mb-4 leading-relaxed">
                    Nuansa mewah dengan tipografi Serif prestisius, highlight sertifikasi & kredensial verifikasi.
                  </p>
                  <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                    Prestige & Serif
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Live Features Section */}
        <section className="py-12 sm:py-20 max-w-5xl mx-auto px-3.5 sm:px-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center w-full">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center mb-3 sm:mb-4">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">Live Real-Time Preview</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Lihat perubahan tampilan seketika saat mengisi form data tanpa perlu refresh browser.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mb-3 sm:mb-4">
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">1-Click Instant Publish</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Publikasikan ke URL publik <span className="font-mono text-xs">/u/username</span> dan bagikan langsung ke LinkedIn atau CV Anda.
              </p>
            </div>

            <div className="flex flex-col items-center sm:col-span-2 md:col-span-1">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mb-3 sm:mb-4">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">Aman & Terstruktur</h3>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Didukung database PostgreSQL terstruktur, proteksi otentikasi sesi aman, dan validasi skema ketat.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 sm:py-8 px-3.5 sm:px-6 w-full">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-zinc-500 w-full text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} Portfolio Builder. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Login</Link>
            <Link href="/register" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
