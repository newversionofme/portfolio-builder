'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signIn, signOut } from '@/lib/auth/auth';
import { PortfolioStatus } from '@prisma/client';
import { AuthError } from 'next-auth';

const registerSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  slug: z
    .string()
    .min(3, 'Slug minimal 3 karakter')
    .max(30, 'Slug maksimal 30 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan strip (-)'),
});

export async function registerUser(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      slug: (formData.get('slug') as string)?.toLowerCase().trim(),
    };

    const validated = registerSchema.safeParse(rawData);
    if (!validated.success) {
      return {
        error: validated.error.issues[0]?.message || 'Data pendaftaran tidak valid',
      };
    }

    const { name, email, password, slug } = validated.data;

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return { error: 'Email ini sudah terdaftar. Silakan login.' };
    }

    // Check if slug is taken
    const existingSlug = await prisma.portfolio.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      return { error: `Slug "${slug}" sudah digunakan. Silakan pilih slug lain.` };
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user and initial portfolio in a transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
        },
      });

      await tx.portfolio.create({
        data: {
          userId: user.id,
          slug,
          status: PortfolioStatus.DRAFT,
          templateId: 'minimalist',
          accentColor: '#2563eb',
          fontFamily: 'Inter',
          profile: {
            create: {
              fullName: name,
              headline: 'Digital Professional',
              availableForHire: true,
              hireBadgeText: 'Available for work',
            },
          },
          about: {
            create: {
              bio: `Halo! Saya ${name}. Selamat datang di portofolio saya.`,
              keyHighlights: ['Passionate Creator', 'Problem Solver'],
            },
          },
          contactInfo: {
            create: {
              email: email.toLowerCase(),
              enableContactForm: true,
            },
          },
        },
      });

      return user;
    });

    return { success: true, userId: newUser.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan sistem saat mendaftar.';
    console.error('Registration error:', message);
    return { error: 'Terjadi kesalahan sistem saat mendaftar. Silakan coba lagi.' };
  }
}

export async function loginWithCredentials(email: string, password: string) {
  try {
    if (!email || !password) {
      return { error: 'Email dan password wajib diisi' };
    }

    await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirectTo: '/dashboard',
    });

    return { success: true };
  } catch (error: unknown) {
    // Check if error is a Next.js redirect
    if (
      typeof error === 'object' &&
      error !== null &&
      'digest' in error &&
      typeof (error as { digest: unknown }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }

    if (error instanceof AuthError) {
      return { error: 'Email atau password salah. Silakan periksa kembali.' };
    }

    console.error('[loginWithCredentials unexpected error]:', error);
    return { error: 'Gagal memproses login. Silakan coba lagi.' };
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: '/login' });
}

export async function loginWithGoogle(redirectTo: string = '/dashboard') {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return {
      error:
        'Konfigurasi Google OAuth belum disetel (GOOGLE_CLIENT_ID atau GOOGLE_CLIENT_SECRET di file .env belum terisi).',
    };
  }

  await signIn('google', { redirectTo });
}

export async function isGoogleAuthEnabled() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
