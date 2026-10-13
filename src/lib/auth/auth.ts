import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { PortfolioStatus } from '@prisma/client';
import { authConfig } from './auth.config';

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    ...(googleClientId && googleClientSecret
      ? [
          Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[authorize called with]:', credentials?.email);
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          console.log('[authorize parse fail]:', parsed.error);
          return null;
        }

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: { portfolio: true },
        });
        console.log('[authorize user query result]:', user ? user.email : 'not found');

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        console.log('[authorize password compare]:', isPasswordValid);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      // Auto-generate portfolio when a user signs up via Google / OAuth adapter
      if (!user.id) return;

      const existingPortfolio = await prisma.portfolio.findUnique({
        where: { userId: user.id },
      });

      if (!existingPortfolio) {
        const rawName = user.name || (user.email ? user.email.split('@')[0] : 'user');
        const baseSlug = rawName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || 'portfolio';

        let targetSlug = baseSlug;
        let counter = 1;
        while (await prisma.portfolio.findUnique({ where: { slug: targetSlug } })) {
          targetSlug = `${baseSlug}-${counter}`;
          counter++;
        }

        await prisma.portfolio.create({
          data: {
            userId: user.id,
            slug: targetSlug,
            status: PortfolioStatus.DRAFT,
            templateId: 'minimalist',
            accentColor: '#2563eb',
            fontFamily: 'Inter',
            profile: {
              create: {
                fullName: user.name || 'Digital Professional',
                headline: 'Digital Professional',
                avatarUrl: user.image || null,
                availableForHire: true,
                hireBadgeText: 'Available for work',
              },
            },
            about: {
              create: {
                bio: `Halo! Saya ${user.name || 'seorang profesional'}. Selamat datang di portofolio saya.`,
                keyHighlights: ['Passionate Creator', 'Problem Solver'],
              },
            },
            contactInfo: {
              create: {
                email: user.email || '',
                enableContactForm: true,
              },
            },
          },
        });
      }
    },
  },
});
