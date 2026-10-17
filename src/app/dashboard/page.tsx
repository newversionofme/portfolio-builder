import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getCurrentUserPortfolio } from '@/lib/data/portfolio';
import { logoutUser } from '@/actions/auth';
import { DashboardView } from '@/components/dashboard/DashboardView';

export const metadata = {
  title: 'Dashboard | Portfolio Builder',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const portfolio = await getCurrentUserPortfolio();

  async function handleLogout() {
    'use server';
    await logoutUser();
  }

  return (
    <DashboardView
      portfolio={portfolio}
      userName={session.user.name}
      onLogout={handleLogout}
    />
  );
}
