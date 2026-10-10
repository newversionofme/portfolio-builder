'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/auth';
import { fullPortfolioSchema, FullPortfolioData } from '@/lib/validations/portfolio';
import { revalidatePath, revalidateTag } from 'next/cache';

function safeDate(val: string | Date | null | undefined): Date {
  if (!val) return new Date();
  if (val instanceof Date) return isNaN(val.getTime()) ? new Date() : val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

function safeNullableDate(val: string | Date | null | undefined): Date | null {
  if (!val || (typeof val === 'string' && val.trim() === '')) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

export async function savePortfolio(data: FullPortfolioData): Promise<{
  success: boolean;
  savedAt?: string;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized. Silakan login kembali.' };
    }

    const validated = fullPortfolioSchema.safeParse(data);
    if (!validated.success) {
      const issueDetails = validated.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join(', ');
      return {
        success: false,
        error: `Data tidak valid: ${issueDetails}`,
      };
    }

    const clean = validated.data;

    // Strict ownership check: find portfolio belonging to authenticated session user ID
    const currentPortfolio = await prisma.portfolio.findUnique({
      where: { userId: session.user.id },
      select: { id: true, slug: true },
    });

    if (!currentPortfolio) {
      return { success: false, error: 'Portofolio tidak ditemukan.' };
    }

    // Check slug uniqueness if changed
    if (clean.slug !== currentPortfolio.slug) {
      const slugTaken = await prisma.portfolio.findUnique({
        where: { slug: clean.slug },
      });
      if (slugTaken && slugTaken.id !== currentPortfolio.id) {
        return {
          success: false,
          error: `Slug "${clean.slug}" sudah digunakan oleh orang lain.`,
        };
      }
    }

    // Execute atomic update in transaction
    await prisma.$transaction(async (tx) => {
      // 1. Update Core Portfolio & Theme
      await tx.portfolio.update({
        where: { id: currentPortfolio.id },
        data: {
          slug: clean.slug,
          templateId: clean.templateId,
          accentColor: clean.accentColor,
          fontFamily: clean.fontFamily,
          sectionOrder: clean.sectionOrder,
          hiddenSections: clean.hiddenSections,
          seoTitle: clean.seoTitle,
          seoDescription: clean.seoDescription,
        },
      });

      // 2. Profile
      if (clean.profile) {
        await tx.profile.upsert({
          where: { portfolioId: currentPortfolio.id },
          create: {
            portfolioId: currentPortfolio.id,
            fullName: clean.profile.fullName || '',
            headline: clean.profile.headline || '',
            avatarUrl: clean.profile.avatarUrl,
            bannerUrl: clean.profile.bannerUrl,
            location: clean.profile.location,
            availableForHire: clean.profile.availableForHire,
            hireBadgeText: clean.profile.hireBadgeText,
            resumePdfUrl: clean.profile.resumePdfUrl,
          },
          update: {
            fullName: clean.profile.fullName || '',
            headline: clean.profile.headline || '',
            avatarUrl: clean.profile.avatarUrl,
            bannerUrl: clean.profile.bannerUrl,
            location: clean.profile.location,
            availableForHire: clean.profile.availableForHire,
            hireBadgeText: clean.profile.hireBadgeText,
            resumePdfUrl: clean.profile.resumePdfUrl,
          },
        });
      }

      // 3. About
      if (clean.about) {
        await tx.about.upsert({
          where: { portfolioId: currentPortfolio.id },
          create: {
            portfolioId: currentPortfolio.id,
            bio: clean.about.bio || '',
            keyHighlights: clean.about.keyHighlights || [],
          },
          update: {
            bio: clean.about.bio || '',
            keyHighlights: clean.about.keyHighlights || [],
          },
        });
      }

      // 4. Contact Info
      if (clean.contactInfo) {
        await tx.contactInfo.upsert({
          where: { portfolioId: currentPortfolio.id },
          create: {
            portfolioId: currentPortfolio.id,
            email: clean.contactInfo.email || null,
            phone: clean.contactInfo.phone || null,
            whatsapp: clean.contactInfo.whatsapp || null,
            enableContactForm: clean.contactInfo.enableContactForm,
          },
          update: {
            email: clean.contactInfo.email || null,
            phone: clean.contactInfo.phone || null,
            whatsapp: clean.contactInfo.whatsapp || null,
            enableContactForm: clean.contactInfo.enableContactForm,
          },
        });
      }

      // 5. Social Links
      await tx.socialLink.deleteMany({ where: { portfolioId: currentPortfolio.id } });
      if (clean.socialLinks && clean.socialLinks.length > 0) {
        await tx.socialLink.createMany({
          data: clean.socialLinks.map((s, idx) => ({
            portfolioId: currentPortfolio.id,
            platform: s.platform || 'github',
            url: s.url || '',
            order: idx,
          })),
        });
      }

      // 6. Experiences
      await tx.experience.deleteMany({ where: { portfolioId: currentPortfolio.id } });
      if (clean.experiences && clean.experiences.length > 0) {
        await tx.experience.createMany({
          data: clean.experiences.map((exp, idx) => ({
            portfolioId: currentPortfolio.id,
            company: exp.company || '',
            companyUrl: exp.companyUrl || null,
            position: exp.position || '',
            employmentType: exp.employmentType || null,
            location: exp.location || null,
            startDate: safeDate(exp.startDate),
            endDate: exp.isCurrent ? null : safeNullableDate(exp.endDate),
            isCurrent: exp.isCurrent,
            description: exp.description || null,
            order: idx,
          })),
        });
      }

      // 7. Educations
      await tx.education.deleteMany({ where: { portfolioId: currentPortfolio.id } });
      if (clean.educations && clean.educations.length > 0) {
        await tx.education.createMany({
          data: clean.educations.map((edu, idx) => ({
            portfolioId: currentPortfolio.id,
            institution: edu.institution || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.fieldOfStudy || null,
            startDate: safeDate(edu.startDate),
            endDate: edu.isCurrent ? null : safeNullableDate(edu.endDate),
            isCurrent: edu.isCurrent,
            gpa: edu.gpa || null,
            description: edu.description || null,
            order: idx,
          })),
        });
      }

      // 8. Skills
      await tx.skill.deleteMany({ where: { portfolioId: currentPortfolio.id } });
      if (clean.skills && clean.skills.length > 0) {
        await tx.skill.createMany({
          data: clean.skills.map((skill, idx) => ({
            portfolioId: currentPortfolio.id,
            name: skill.name || '',
            category: skill.category || null,
            level: skill.level || null,
            order: idx,
          })),
        });
      }

      // 9. Projects
      await tx.project.deleteMany({ where: { portfolioId: currentPortfolio.id } });
      if (clean.projects && clean.projects.length > 0) {
        await tx.project.createMany({
          data: clean.projects.map((proj, idx) => ({
            portfolioId: currentPortfolio.id,
            title: proj.title || '',
            tagline: proj.tagline || null,
            description: proj.description || '',
            imageUrl: proj.imageUrl || null,
            galleryUrls: proj.galleryUrls || [],
            tags: proj.tags || [],
            liveUrl: proj.liveUrl || null,
            githubUrl: proj.githubUrl || null,
            isFeatured: proj.isFeatured || false,
            order: idx,
          })),
        });
      }

      // 10. Certifications
      await tx.certification.deleteMany({ where: { portfolioId: currentPortfolio.id } });
      if (clean.certifications && clean.certifications.length > 0) {
        await tx.certification.createMany({
          data: clean.certifications.map((cert, idx) => ({
            portfolioId: currentPortfolio.id,
            title: cert.title || '',
            issuer: cert.issuer || '',
            issueDate: safeDate(cert.issueDate),
            expiryDate: safeNullableDate(cert.expiryDate),
            credentialId: cert.credentialId || null,
            credentialUrl: cert.credentialUrl || null,
            order: idx,
          })),
        });
      }

      // 11. Testimonials
      await tx.testimonial.deleteMany({ where: { portfolioId: currentPortfolio.id } });
      if (clean.testimonials && clean.testimonials.length > 0) {
        await tx.testimonial.createMany({
          data: clean.testimonials.map((test, idx) => ({
            portfolioId: currentPortfolio.id,
            name: test.name || '',
            role: test.role || '',
            company: test.company || null,
            quote: test.quote || '',
            avatarUrl: test.avatarUrl || null,
            order: idx,
          })),
        });
      }
    });

    return { success: true, savedAt: new Date().toISOString() };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal menyimpan perubahan ke database.';
    console.error('[savePortfolio Error]:', err);
    return { success: false, error: msg };
  }
}

export async function togglePublishPortfolio(status: 'DRAFT' | 'PUBLISHED'): Promise<{
  success: boolean;
  status?: string;
  slug?: string;
  error?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized. Silakan login kembali.' };
    }

    // Strict ownership: update portfolio matching authenticated session user ID
    const portfolio = await prisma.portfolio.update({
      where: { userId: session.user.id },
      data: {
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });

    revalidatePath(`/u/${portfolio.slug}`);
    revalidateTag(`portfolio-${portfolio.slug}`);

    return { success: true, status: portfolio.status, slug: portfolio.slug };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Gagal mengubah status publikasi';
    console.error('[togglePublishPortfolio Error]:', err);
    return { success: false, error: msg };
  }
}
