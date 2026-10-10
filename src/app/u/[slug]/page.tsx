import React from 'react';
import { notFound } from 'next/navigation';
import { getPublicPortfolioBySlug } from '@/lib/data/portfolio';
import { PortfolioRenderer } from '@/components/templates/PortfolioRenderer';
import { auth } from '@/lib/auth/auth';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);

  if (!portfolio) {
    return {
      title: 'Portofolio Tidak Ditemukan',
    };
  }

  const name = portfolio.profile?.fullName || 'Portfolio';
  const headline = portfolio.profile?.headline || 'Digital Portfolio';

  return {
    title: portfolio.seoTitle || `${name} - ${headline}`,
    description:
      portfolio.seoDescription ||
      portfolio.about?.bio?.slice(0, 160) ||
      `Kunjungi website portofolio profesional ${name}.`,
    openGraph: {
      title: portfolio.seoTitle || `${name} - ${headline}`,
      description:
        portfolio.seoDescription ||
        portfolio.about?.bio?.slice(0, 160) ||
        `Portofolio resmi ${name}`,
      images: portfolio.profile?.avatarUrl ? [portfolio.profile.avatarUrl] : [],
    },
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { slug } = await params;
  const portfolio = await getPublicPortfolioBySlug(slug);

  if (!portfolio) {
    notFound();
  }

  const session = await auth();
  const isOwner = Boolean(
    (session?.user?.id && portfolio.userId && session.user.id === portfolio.userId) ||
    (session?.user?.email && portfolio.contactInfo?.email && session.user.email === portfolio.contactInfo.email)
  );

  // If status is DRAFT and viewer is not logged in as owner
  if (portfolio.status === 'DRAFT' && !isOwner) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
            Portofolio Sedang Dalam Tahap Draft
          </h1>
          <p className="text-xs text-zinc-500">
            Pemilik website ini belum mempublikasikan portofolionya untuk publik. Silakan kembali lagi nanti.
          </p>
          <Button variant="outline" size="sm" asChild className="mt-2">
            <Link href="/" className="gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Draft banner notice for owner */}
      {portfolio.status === 'DRAFT' && isOwner && (
        <div className="bg-amber-500 text-white px-4 py-2 text-center text-xs font-medium flex items-center justify-center gap-2 sticky top-0 z-50 shadow-md">
          <Sparkles className="w-4 h-4" />
          <span>
            Mode Preview Pemilik: Portofolio ini masih berstatus <strong>DRAFT</strong>. Klik &ldquo;Publish&rdquo; di editor untuk merilisnya secara publik.
          </span>
          <Button
            size="sm"
            variant="secondary"
            className="h-6 text-[11px] px-2 bg-white text-zinc-900 hover:bg-zinc-100"
            asChild
          >
            <Link href="/dashboard/editor">Buka Editor</Link>
          </Button>
        </div>
      )}

      <PortfolioRenderer data={portfolio} />
    </div>
  );
}
