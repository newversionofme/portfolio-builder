import React from 'react';
import { getCurrentUserPortfolio } from '@/lib/data/portfolio';
import { EditorClient } from '@/components/editor/EditorClient';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Editor Portofolio | Portfolio Builder',
};

export default async function EditorPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const portfolio = await getCurrentUserPortfolio();

  return <EditorClient initialData={portfolio} />;
}
