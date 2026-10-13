if (typeof window !== 'undefined') {
  throw new Error('This module can only be executed on the server.');
}

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';
import { Prisma, PortfolioStatus } from '@prisma/client';
import { FullPortfolioData } from '@/lib/validations/portfolio';

export type FullPortfolioFromDb = Prisma.PortfolioGetPayload<{
  include: {
    profile: true;
    about: true;
    contactInfo: true;
    socialLinks: true;
    experiences: true;
    educations: true;
    skills: true;
    projects: true;
    certifications: true;
    testimonials: true;
  };
}>;

export function formatPortfolioForClient(portfolio: FullPortfolioFromDb): FullPortfolioData {
  return {
    id: portfolio.id,
    userId: portfolio.userId,
    slug: portfolio.slug,
    status: portfolio.status,
    publishedAt: portfolio.publishedAt?.toISOString() || null,
    templateId: portfolio.templateId || 'minimalist',
    accentColor: portfolio.accentColor || '#2563eb',
    fontFamily: portfolio.fontFamily || 'Inter',
    language: (() => {
      const hiddenList = (portfolio.hiddenSections as string[]) || [];
      const langEntry = hiddenList.find((s) => s.startsWith('lang:'));
      if (langEntry) {
        const parsedLang = langEntry.replace('lang:', '');
        if (parsedLang === 'en' || parsedLang === 'id') return parsedLang;
      }
      return 'id';
    })(),
    sectionOrder: (portfolio.sectionOrder as string[]) || [
      'about',
      'skills',
      'projects',
      'experience',
      'education',
      'certifications',
      'testimonials',
      'contact',
    ],
    hiddenSections: ((portfolio.hiddenSections as string[]) || []).filter(
      (s) => !s.startsWith('lang:')
    ),
    seoTitle: portfolio.seoTitle || null,
    seoDescription: portfolio.seoDescription || null,
    ogImageUrl: portfolio.ogImageUrl || null,
    profile: portfolio.profile
      ? {
          fullName: portfolio.profile.fullName,
          headline: portfolio.profile.headline,
          avatarUrl: portfolio.profile.avatarUrl,
          bannerUrl: portfolio.profile.bannerUrl,
          location: portfolio.profile.location,
          availableForHire: portfolio.profile.availableForHire,
          hireBadgeText: portfolio.profile.hireBadgeText,
          resumePdfUrl: portfolio.profile.resumePdfUrl,
        }
      : null,
    about: portfolio.about
      ? {
          bio: portfolio.about.bio,
          keyHighlights: (portfolio.about.keyHighlights as string[]) || [],
        }
      : null,
    contactInfo: portfolio.contactInfo
      ? {
          email: portfolio.contactInfo.email,
          phone: portfolio.contactInfo.phone,
          whatsapp: portfolio.contactInfo.whatsapp,
          enableContactForm: portfolio.contactInfo.enableContactForm,
        }
      : null,
    socialLinks: portfolio.socialLinks.map((s) => ({
      id: s.id,
      platform: s.platform,
      url: s.url,
      order: s.order,
    })),
    experiences: portfolio.experiences.map((e) => ({
      id: e.id,
      company: e.company,
      companyUrl: e.companyUrl,
      position: e.position,
      employmentType: e.employmentType,
      location: e.location,
      startDate: e.startDate ? new Date(e.startDate).toISOString().slice(0, 7) : '',
      endDate: e.endDate ? new Date(e.endDate).toISOString().slice(0, 7) : null,
      isCurrent: e.isCurrent,
      description: e.description,
      order: e.order,
    })),
    educations: portfolio.educations.map((ed) => ({
      id: ed.id,
      institution: ed.institution,
      degree: ed.degree,
      fieldOfStudy: ed.fieldOfStudy,
      startDate: ed.startDate ? new Date(ed.startDate).toISOString().slice(0, 7) : '',
      endDate: ed.endDate ? new Date(ed.endDate).toISOString().slice(0, 7) : null,
      isCurrent: ed.isCurrent,
      gpa: ed.gpa,
      description: ed.description,
      order: ed.order,
    })),
    skills: portfolio.skills.map((sk) => ({
      id: sk.id,
      name: sk.name,
      category: sk.category,
      level: sk.level,
      order: sk.order,
    })),
    projects: portfolio.projects.map((p) => ({
      id: p.id,
      title: p.title,
      tagline: p.tagline,
      description: p.description,
      imageUrl: p.imageUrl,
      galleryUrls: (p.galleryUrls as string[]) || [],
      tags: (p.tags as string[]) || [],
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      isFeatured: p.isFeatured,
      order: p.order,
    })),
    certifications: portfolio.certifications.map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      issueDate: c.issueDate ? new Date(c.issueDate).toISOString().slice(0, 7) : '',
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().slice(0, 7) : null,
      credentialId: c.credentialId,
      credentialUrl: c.credentialUrl,
      order: c.order,
    })),
    testimonials: portfolio.testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      quote: t.quote,
      avatarUrl: t.avatarUrl,
      order: t.order,
    })),
  };
}

export async function getCurrentUserPortfolio(): Promise<FullPortfolioData> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const portfolio = await prisma.portfolio.findUnique({
    where: { userId: session.user.id },
    include: {
      profile: true,
      about: true,
      contactInfo: true,
      socialLinks: { orderBy: { order: 'asc' } },
      experiences: { orderBy: { order: 'asc' } },
      educations: { orderBy: { order: 'asc' } },
      skills: { orderBy: { order: 'asc' } },
      projects: { orderBy: { order: 'asc' } },
      certifications: { orderBy: { order: 'asc' } },
      testimonials: { orderBy: { order: 'asc' } },
    },
  });

  if (!portfolio) {
    const newPortfolio = await prisma.portfolio.create({
      data: {
        userId: session.user.id,
        slug:
          (session.user.name || 'user')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-') +
          '-' +
          session.user.id.slice(0, 4),
        status: PortfolioStatus.DRAFT,
        templateId: 'minimalist',
        accentColor: '#2563eb',
        fontFamily: 'Inter',
        profile: {
          create: {
            fullName: session.user.name || 'Your Name',
            headline: 'Digital Professional',
            availableForHire: true,
            hireBadgeText: 'Available for work',
          },
        },
        about: {
          create: {
            bio: 'Welcome to my digital portfolio!',
            keyHighlights: ['Creative Thinker', 'Problem Solver'],
          },
        },
        contactInfo: {
          create: {
            email: session.user.email || '',
            enableContactForm: true,
          },
        },
      },
      include: {
        profile: true,
        about: true,
        contactInfo: true,
        socialLinks: true,
        experiences: true,
        educations: true,
        skills: true,
        projects: true,
        certifications: true,
        testimonials: true,
      },
    });
    return formatPortfolioForClient(newPortfolio);
  }

  return formatPortfolioForClient(portfolio);
}

export async function getPublicPortfolioBySlug(slug: string): Promise<FullPortfolioData | null> {
  const portfolio = await prisma.portfolio.findUnique({
    where: { slug },
    include: {
      profile: true,
      about: true,
      contactInfo: true,
      socialLinks: { orderBy: { order: 'asc' } },
      experiences: { orderBy: { order: 'asc' } },
      educations: { orderBy: { order: 'asc' } },
      skills: { orderBy: { order: 'asc' } },
      projects: { orderBy: { order: 'asc' } },
      certifications: { orderBy: { order: 'asc' } },
      testimonials: { orderBy: { order: 'asc' } },
    },
  });

  if (!portfolio) {
    return null;
  }

  return formatPortfolioForClient(portfolio);
}
