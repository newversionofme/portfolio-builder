import { create } from 'zustand';
import {
  FullPortfolioData,
  ProfileData,
  AboutData,
  ContactInfoData,
  SocialLinkData,
  ExperienceData,
  EducationData,
  SkillData,
  ProjectData,
  CertificationData,
  TestimonialData,
  ThemeConfigData,
} from '@/lib/validations/portfolio';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export function getPortfolioComparableJson(p: FullPortfolioData): string {
  return JSON.stringify({
    slug: p.slug || '',
    templateId: p.templateId || 'minimalist',
    accentColor: p.accentColor || '#2563eb',
    fontFamily: p.fontFamily || 'Inter',
    language: p.language || 'id',
    sectionOrder: p.sectionOrder || [],
    hiddenSections: p.hiddenSections || [],
    seoTitle: p.seoTitle || null,
    seoDescription: p.seoDescription || null,
    profile: p.profile || null,
    about: p.about || null,
    contactInfo: p.contactInfo || null,
    socialLinks: p.socialLinks || [],
    experiences: p.experiences || [],
    educations: p.educations || [],
    skills: p.skills || [],
    projects: p.projects || [],
    certifications: p.certifications || [],
    testimonials: p.testimonials || [],
  });
}

interface PortfolioState {
  portfolio: FullPortfolioData;
  lastSavedJson: string;
  isInitialized: boolean;
  saveStatus: SaveStatus;
  lastSavedAt: Date | null;
  errorMessage: string | null;
  activeTab: string;
  previewViewport: ViewportMode;
  manualSaveTrigger: number;

  // Actions
  initializePortfolio: (data: FullPortfolioData) => void;
  setSaveStatus: (status: SaveStatus, error?: string | null) => void;
  markAsSaved: (data: FullPortfolioData) => void;
  triggerRetrySave: () => void;
  setActiveTab: (tab: string) => void;
  setPreviewViewport: (viewport: ViewportMode) => void;

  // Section mutators
  updateProfile: (data: Partial<ProfileData>) => void;
  updateAbout: (data: Partial<AboutData>) => void;
  updateContact: (data: Partial<ContactInfoData>) => void;
  
  // Socials
  addSocialLink: (link: SocialLinkData) => void;
  updateSocialLink: (index: number, link: Partial<SocialLinkData>) => void;
  removeSocialLink: (index: number) => void;

  // Experiences
  addExperience: (exp: ExperienceData) => void;
  updateExperience: (index: number, exp: Partial<ExperienceData>) => void;
  removeExperience: (index: number) => void;

  // Educations
  addEducation: (edu: EducationData) => void;
  updateEducation: (index: number, edu: Partial<EducationData>) => void;
  removeEducation: (index: number) => void;

  // Skills
  addSkill: (skill: SkillData) => void;
  updateSkill: (index: number, skill: Partial<SkillData>) => void;
  removeSkill: (index: number) => void;

  // Projects
  addProject: (project: ProjectData) => void;
  updateProject: (index: number, proj: Partial<ProjectData>) => void;
  removeProject: (index: number) => void;

  // Certifications
  addCertification: (cert: CertificationData) => void;
  updateCertification: (index: number, cert: Partial<CertificationData>) => void;
  removeCertification: (index: number) => void;

  // Testimonials
  addTestimonial: (test: TestimonialData) => void;
  updateTestimonial: (index: number, test: Partial<TestimonialData>) => void;
  removeTestimonial: (index: number) => void;

  // Reordering
  moveItem: (
    section: 'projects' | 'experiences' | 'educations' | 'skills' | 'certifications' | 'testimonials' | 'socialLinks',
    fromIndex: number,
    direction: 'up' | 'down'
  ) => void;

  // Theme & Appearance
  updateTheme: (theme: Partial<ThemeConfigData>) => void;
  updateSlug: (slug: string) => void;
  updateStatus: (status: 'DRAFT' | 'PUBLISHED') => void;
}

const defaultPortfolio: FullPortfolioData = {
  slug: '',
  status: 'DRAFT',
  templateId: 'minimalist',
  accentColor: '#2563eb',
  fontFamily: 'Inter',
  language: 'id',
  sectionOrder: [
    'about',
    'skills',
    'projects',
    'experience',
    'education',
    'certifications',
    'testimonials',
    'contact',
  ],
  hiddenSections: [],
  profile: {
    fullName: '',
    headline: '',
    avatarUrl: null,
    bannerUrl: null,
    location: null,
    availableForHire: true,
    hireBadgeText: 'Available for work',
    resumePdfUrl: null,
  },
  about: {
    bio: '',
    keyHighlights: [],
  },
  contactInfo: {
    email: '',
    phone: '',
    whatsapp: '',
    enableContactForm: true,
  },
  socialLinks: [],
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  certifications: [],
  testimonials: [],
};

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: defaultPortfolio,
  lastSavedJson: getPortfolioComparableJson(defaultPortfolio),
  isInitialized: false,
  saveStatus: 'idle',
  lastSavedAt: null,
  errorMessage: null,
  activeTab: 'profile',
  previewViewport: 'desktop',
  manualSaveTrigger: 0,

  initializePortfolio: (data) => {
    const full = { ...defaultPortfolio, ...data };
    set({
      portfolio: full,
      lastSavedJson: getPortfolioComparableJson(full),
      isInitialized: true,
      saveStatus: 'saved',
      lastSavedAt: new Date(),
      errorMessage: null,
    });
  },

  setSaveStatus: (status, error = null) =>
    set((state) => ({
      saveStatus: status,
      errorMessage: error,
      lastSavedAt: status === 'saved' ? new Date() : state.lastSavedAt,
    })),

  markAsSaved: (data) =>
    set({
      lastSavedJson: getPortfolioComparableJson(data),
      saveStatus: 'saved',
      lastSavedAt: new Date(),
      errorMessage: null,
    }),

  triggerRetrySave: () =>
    set((state) => ({
      manualSaveTrigger: state.manualSaveTrigger + 1,
    })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setPreviewViewport: (viewport) => set({ previewViewport: viewport }),

  updateProfile: (data) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        profile: {
          ...(state.portfolio.profile || defaultPortfolio.profile!),
          ...data,
        },
      },
    })),

  updateAbout: (data) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        about: {
          ...(state.portfolio.about || defaultPortfolio.about!),
          ...data,
        },
      },
    })),

  updateContact: (data) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        contactInfo: {
          ...(state.portfolio.contactInfo || defaultPortfolio.contactInfo!),
          ...data,
        },
      },
    })),

  addSocialLink: (link) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        socialLinks: [...state.portfolio.socialLinks, link],
      },
    })),

  updateSocialLink: (index, link) =>
    set((state) => {
      const updated = [...state.portfolio.socialLinks];
      updated[index] = { ...updated[index], ...link };
      return {
        portfolio: { ...state.portfolio, socialLinks: updated },
      };
    }),

  removeSocialLink: (index) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        socialLinks: state.portfolio.socialLinks.filter((_, i) => i !== index),
      },
    })),

  addExperience: (exp) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        experiences: [exp, ...state.portfolio.experiences].map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  updateExperience: (index, exp) =>
    set((state) => {
      const updated = [...state.portfolio.experiences];
      updated[index] = { ...updated[index], ...exp };
      return {
        portfolio: { ...state.portfolio, experiences: updated },
      };
    }),

  removeExperience: (index) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        experiences: state.portfolio.experiences
          .filter((_, i) => i !== index)
          .map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  addEducation: (edu) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        educations: [edu, ...state.portfolio.educations].map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  updateEducation: (index, edu) =>
    set((state) => {
      const updated = [...state.portfolio.educations];
      updated[index] = { ...updated[index], ...edu };
      return {
        portfolio: { ...state.portfolio, educations: updated },
      };
    }),

  removeEducation: (index) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        educations: state.portfolio.educations
          .filter((_, i) => i !== index)
          .map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  addSkill: (skill) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        skills: [...state.portfolio.skills, skill].map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  updateSkill: (index, skill) =>
    set((state) => {
      const updated = [...state.portfolio.skills];
      updated[index] = { ...updated[index], ...skill };
      return {
        portfolio: { ...state.portfolio, skills: updated },
      };
    }),

  removeSkill: (index) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        skills: state.portfolio.skills
          .filter((_, i) => i !== index)
          .map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  addProject: (project) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        projects: [project, ...state.portfolio.projects].map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  updateProject: (index, proj) =>
    set((state) => {
      const updated = [...state.portfolio.projects];
      updated[index] = { ...updated[index], ...proj };
      return {
        portfolio: { ...state.portfolio, projects: updated },
      };
    }),

  removeProject: (index) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        projects: state.portfolio.projects
          .filter((_, i) => i !== index)
          .map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  addCertification: (cert) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        certifications: [cert, ...state.portfolio.certifications].map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  updateCertification: (index, cert) =>
    set((state) => {
      const updated = [...state.portfolio.certifications];
      updated[index] = { ...updated[index], ...cert };
      return {
        portfolio: { ...state.portfolio, certifications: updated },
      };
    }),

  removeCertification: (index) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        certifications: state.portfolio.certifications
          .filter((_, i) => i !== index)
          .map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  addTestimonial: (test) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        testimonials: [test, ...state.portfolio.testimonials].map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  updateTestimonial: (index, test) =>
    set((state) => {
      const updated = [...state.portfolio.testimonials];
      updated[index] = { ...updated[index], ...test };
      return {
        portfolio: { ...state.portfolio, testimonials: updated },
      };
    }),

  removeTestimonial: (index) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        testimonials: state.portfolio.testimonials
          .filter((_, i) => i !== index)
          .map((item, idx) => ({ ...item, order: idx })),
      },
    })),

  moveItem: (section, fromIndex, direction) =>
    set((state) => {
      const list = [...((state.portfolio[section] as Array<{ order?: number }>) || [])];
      const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
      if (toIndex < 0 || toIndex >= list.length) return state;

      const [movedItem] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, movedItem);

      const updatedList = list.map((item, idx) => ({
        ...item,
        order: idx,
      }));

      return {
        portfolio: {
          ...state.portfolio,
          [section]: updatedList,
        },
      };
    }),

  updateTheme: (theme) =>
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        templateId: theme.templateId ?? state.portfolio.templateId,
        accentColor: theme.accentColor ?? state.portfolio.accentColor,
        fontFamily: theme.fontFamily ?? state.portfolio.fontFamily,
        language: theme.language ?? state.portfolio.language ?? 'id',
        sectionOrder: theme.sectionOrder ?? state.portfolio.sectionOrder,
        hiddenSections: theme.hiddenSections ?? state.portfolio.hiddenSections,
      },
    })),

  updateSlug: (slug) =>
    set((state) => ({
      portfolio: { ...state.portfolio, slug },
    })),

  updateStatus: (status) =>
    set((state) => ({
      portfolio: { ...state.portfolio, status },
    })),
}));
