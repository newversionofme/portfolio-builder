import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().default(''),
  headline: z.string().default(''),
  avatarUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  availableForHire: z.boolean().default(true),
  hireBadgeText: z.string().nullable().optional(),
  resumePdfUrl: z.string().nullable().optional(),
});

export const aboutSchema = z.object({
  bio: z.string().default(''),
  keyHighlights: z.array(z.string()).default([]),
});

export const contactInfoSchema = z.object({
  email: z.string().nullable().optional().or(z.literal('')),
  phone: z.string().nullable().optional(),
  whatsapp: z.string().nullable().optional(),
  enableContactForm: z.boolean().default(true),
});

export const socialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().default('github'),
  url: z.string().default(''),
  order: z.number().default(0),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().default(''),
  companyUrl: z.string().nullable().optional().or(z.literal('')),
  position: z.string().default(''),
  employmentType: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  startDate: z.string().default(''),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().nullable().optional(),
  order: z.number().default(0),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().default(''),
  degree: z.string().default(''),
  fieldOfStudy: z.string().nullable().optional(),
  startDate: z.string().default(''),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().default(false),
  gpa: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  order: z.number().default(0),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().default(''),
  category: z.string().nullable().optional(),
  level: z.string().nullable().optional(),
  order: z.number().default(0),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().default(''),
  tagline: z.string().nullable().optional(),
  description: z.string().default(''),
  imageUrl: z.string().nullable().optional(),
  galleryUrls: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  liveUrl: z.string().nullable().optional().or(z.literal('')),
  githubUrl: z.string().nullable().optional().or(z.literal('')),
  isFeatured: z.boolean().default(false),
  order: z.number().default(0),
});

export const certificationSchema = z.object({
  id: z.string().optional(),
  title: z.string().default(''),
  issuer: z.string().default(''),
  issueDate: z.string().default(''),
  expiryDate: z.string().nullable().optional(),
  credentialId: z.string().nullable().optional(),
  credentialUrl: z.string().nullable().optional().or(z.literal('')),
  order: z.number().default(0),
});

export const testimonialSchema = z.object({
  id: z.string().optional(),
  name: z.string().default(''),
  role: z.string().default(''),
  company: z.string().nullable().optional(),
  quote: z.string().default(''),
  avatarUrl: z.string().nullable().optional(),
  order: z.number().default(0),
});

export const themeConfigSchema = z.object({
  templateId: z.enum(['minimalist', 'bold', 'developer', 'elegant']).default('minimalist'),
  accentColor: z.string().default('#2563eb'),
  fontFamily: z.string().default('Inter'),
  language: z.enum(['id', 'en']).default('id'),
  customCss: z.string().nullable().optional(),
  sectionOrder: z.array(z.string()).default([
    'about',
    'skills',
    'projects',
    'experience',
    'education',
    'certifications',
    'testimonials',
    'contact',
  ]),
  hiddenSections: z.array(z.string()).default([]),
});

export const fullPortfolioSchema = z.object({
  id: z.string().optional(),
  userId: z.string().optional(),
  slug: z.string().min(3).max(30),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  publishedAt: z.string().nullable().optional(),
  templateId: z.string().default('minimalist'),
  accentColor: z.string().default('#2563eb'),
  fontFamily: z.string().default('Inter'),
  language: z.enum(['id', 'en']).default('id'),
  sectionOrder: z.array(z.string()).default([
    'about',
    'skills',
    'projects',
    'experience',
    'education',
    'certifications',
    'testimonials',
    'contact',
  ]),
  hiddenSections: z.array(z.string()).default([]),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional(),
  ogImageUrl: z.string().nullable().optional(),
  profile: profileSchema.nullable().optional(),
  about: aboutSchema.nullable().optional(),
  contactInfo: contactInfoSchema.nullable().optional(),
  socialLinks: z.array(socialLinkSchema).default([]),
  experiences: z.array(experienceSchema).default([]),
  educations: z.array(educationSchema).default([]),
  skills: z.array(skillSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
  testimonials: z.array(testimonialSchema).default([]),
});

export type ProfileData = z.infer<typeof profileSchema>;
export type AboutData = z.infer<typeof aboutSchema>;
export type ContactInfoData = z.infer<typeof contactInfoSchema>;
export type SocialLinkData = z.infer<typeof socialLinkSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type SkillData = z.infer<typeof skillSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type CertificationData = z.infer<typeof certificationSchema>;
export type TestimonialData = z.infer<typeof testimonialSchema>;
export type ThemeConfigData = z.infer<typeof themeConfigSchema>;
export type FullPortfolioData = z.infer<typeof fullPortfolioSchema>;
