import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import { NavigationProgressBar } from '@/components/ui/navigation-progress-bar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Portfolio Builder - Buat Website Portofolio Modern Tanpa Coding',
    template: '%s | Portfolio Builder',
  },
  description:
    'Platform pembuat website portofolio modern untuk mahasiswa, fresh graduate, desainer, developer, dan profesional. Cukup isi form, langsung publish via link publik.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`h-full ${inter.variable} ${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased text-zinc-900 dark:text-zinc-50 bg-white dark:bg-zinc-950">
        <NavigationProgressBar />
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

