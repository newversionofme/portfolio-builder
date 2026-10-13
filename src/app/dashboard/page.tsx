import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getCurrentUserPortfolio } from '@/lib/data/portfolio';
import { logoutUser } from '@/actions/auth';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Edit3,
  ExternalLink,
  Globe,
  FolderGit2,
  Briefcase,
  Cpu,
  Award,
  CheckCircle2,
  Circle,
  Eye,
  ArrowRight,
  User,
  Palette,
  Send,
} from 'lucide-react';

export const metadata = {
  title: 'Dashboard | Portfolio Builder',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const portfolio = await getCurrentUserPortfolio();
  const isPublished = portfolio.status === 'PUBLISHED';

  // Check if account is brand new / has zero items
  const totalItems =
    (portfolio.projects?.length || 0) +
    (portfolio.experiences?.length || 0) +
    (portfolio.skills?.length || 0) +
    (portfolio.certifications?.length || 0);
  const isNewAccount = totalItems === 0;

  // Checklist items completion status
  const hasProfile = Boolean(portfolio.profile?.fullName && portfolio.profile.fullName.trim() !== '');
  const hasAbout = Boolean(portfolio.about?.bio && portfolio.about.bio.trim() !== '');
  const hasProjects = Boolean(portfolio.projects && portfolio.projects.length > 0);
  const hasTemplate = Boolean(portfolio.templateId);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between overflow-x-hidden w-full">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-lg font-bold tracking-tight shrink-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>Portfolio<span className="text-blue-600">Builder</span></span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xs text-zinc-500 hidden sm:inline truncate max-w-[150px]">
              Halo, <strong className="text-zinc-800 dark:text-zinc-200">{session.user.name}</strong>
            </span>
            <ThemeToggle />
            <form
              action={async () => {
                'use server';
                await logoutUser();
              }}
            >
              <LogoutButton />
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 flex-1 space-y-6 sm:space-y-8 overflow-hidden">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xs">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Website Portofolio Anda
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500">
              Kelola data profil, karya, dan publikasikan tautan online Anda dalam hitungan detik.
            </p>
          </div>

          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-10 px-5 gap-2 w-full sm:w-auto shrink-0" asChild>
            <Link href="/dashboard/editor">
              <Edit3 className="w-4 h-4" />
              <span>Buka Editor Portofolio</span>
            </Link>
          </Button>
        </div>

        {/* Portfolio Status & Public Link Card */}
        <Card className="border-zinc-200 dark:border-zinc-800 shadow-2xs overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-1 min-w-0">
                <CardTitle className="text-lg">Tautan Publik & Status</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Alamat web resmi yang dapat Anda bagikan ke LinkedIn, CV, atau klien.
                </CardDescription>
              </div>

              <Badge
                variant={isPublished ? 'success' : 'secondary'}
                className="px-3 py-1 text-xs gap-1.5 font-medium self-start sm:self-auto shrink-0"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isPublished ? 'Live & Published' : 'Draft (Privat)'}</span>
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Slug URL Bar & Actions */}
            <div className="p-3 sm:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 overflow-hidden">
              <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-semibold min-w-0 break-all">
                <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                <span className="truncate">/u/{portfolio.slug}</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                <Button variant="outline" size="sm" className="h-9 sm:h-8 text-xs gap-1.5 w-full sm:w-auto justify-center" asChild>
                  <a href={`/u/${portfolio.slug}`} target="_blank" rel="noopener noreferrer">
                    {isPublished ? (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Lihat Halaman Publik</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Pratinjau Portofolio</span>
                      </>
                    )}
                  </a>
                </Button>

                <Button size="sm" className="h-9 sm:h-8 text-xs bg-blue-600 hover:bg-blue-700 gap-1.5 w-full sm:w-auto justify-center" asChild>
                  <Link href="/dashboard/editor">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Konten</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">Proyek</span>
                </div>
                <div className="text-xl font-bold text-zinc-900 dark:text-white">
                  {portfolio.projects.length}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">Pengalaman</span>
                </div>
                <div className="text-xl font-bold text-zinc-900 dark:text-white">
                  {portfolio.experiences.length}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <Cpu className="w-3.5 h-3.5 text-violet-500 shrink-0" />
                  <span className="truncate">Keahlian</span>
                </div>
                <div className="text-xl font-bold text-zinc-900 dark:text-white">
                  {portfolio.skills.length}
                </div>
              </div>

              <div className="p-3.5 sm:p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="truncate">Sertifikat</span>
                </div>
                <div className="text-xl font-bold text-zinc-900 dark:text-white">
                  {portfolio.certifications.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KELOMPOK 2: Panduan Mulai dari Sini (Checklist untuk Akun Baru / Belum Lengkap) */}
        {isNewAccount && (
          <Card className="border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg text-zinc-900 dark:text-white">
                    Mulai dari Sini: Langkah Peluncuran Portofolio
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-500">
                    Ikuti 4 langkah mudah untuk meluncurkan portofolio profesional pertama Anda.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Step 1 */}
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3">
                  {hasProfile && hasAbout ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>1. Lengkapi Profil & Bio</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Tulis nama, foto avatar, judul headline, dan biografi ringkas.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3">
                  {hasProjects ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <FolderGit2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>2. Tambah Portofolio Proyek</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Masukkan minimal 1 karya terbaik, tautan demo, dan deskripsi hasil.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3">
                  {hasTemplate ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>3. Pilih Template & Font</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Sesuaikan tampilan dengan memilih 1 dari 4 template kurasi visual.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-start gap-3">
                  {isPublished ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-xs font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>4. Publikasikan Portofolio</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      Klik tombol &ldquo;Publish Web&rdquo; di editor untuk merilis tautan publik Anda.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 h-9 text-xs gap-1.5 w-full sm:w-auto" asChild>
                  <Link href="/dashboard/editor">
                    <span>Mulai Lengkapi Data</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Portfolio Builder</p>
          <Link href="/dashboard/editor" className="hover:text-blue-600">
            Buka Editor
          </Link>
        </div>
      </footer>
    </div>
  );
}
