'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { getDictionary } from '@/lib/i18n/dictionary';
import { Button } from '@/components/ui/button';
import { SocialIcon } from '@/components/ui/social-icon';
import {
  ExternalLink,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Quote,
  Copy,
  Check,
  FileText,
  Send,
  Phone,
  MessageCircle,
  BookOpen,
  Info,
} from 'lucide-react';

interface TemplateProps {
  data: FullPortfolioData;
}

export function ElegantTemplate({ data }: TemplateProps) {
  const {
    profile,
    about,
    contactInfo,
    socialLinks = [],
    experiences = [],
    educations = [],
    skills = [],
    projects = [],
    certifications = [],
    testimonials = [],
    accentColor = '#1e3a8a',
    language = 'id',
  } = data;

  const t = getDictionary(language);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || t.sections.skills;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const hasEmail = Boolean(contactInfo?.email && contactInfo.email.trim() !== '');
  const hasWhatsapp = Boolean(contactInfo?.whatsapp && contactInfo.whatsapp.trim() !== '');
  const hasPhone = Boolean(contactInfo?.phone && contactInfo.phone.trim() !== '');
  const hasSocials = socialLinks && socialLinks.length > 0;
  const isAvailableForHire = profile?.availableForHire === true;

  // Section presence guards
  const hasAbout = Boolean(about?.bio && about.bio.trim() !== '') || (about?.keyHighlights && about.keyHighlights.length > 0);
  const hasProjects = projects && projects.length > 0;
  const hasExperiences = experiences && experiences.length > 0;
  const hasEducations = educations && educations.length > 0;
  const hasCertifications = certifications && certifications.length > 0;
  const hasSkills = skills && skills.length > 0;
  const hasTestimonials = testimonials && testimonials.length > 0;
  const hasSidebarContent = hasEducations || hasCertifications || hasSkills;
  const hasContact = hasEmail || hasWhatsapp || hasPhone || hasSocials || contactInfo?.enableContactForm;

  // Compute latest role (prioritize current, then newest start date)
  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return (b.startDate || '').localeCompare(a.startDate || '');
  });
  const currentRole = sortedExperiences[0];

  // Compute latest education (sorted by startDate desc)
  const sortedEducations = [...educations].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return (b.startDate || '').localeCompare(a.startDate || '');
  });
  const latestEducation = sortedEducations[0];

  const handleCopyEmail = () => {
    if (contactInfo?.email) {
      navigator.clipboard.writeText(contactInfo.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    if (!year) return dateStr;
    const monthsId = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const monthsEn = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const months = language === 'en' ? monthsEn : monthsId;
    const mIdx = parseInt(month, 10) - 1;
    return `${months[mIdx] || month} ${year}`;
  };

  return (
    <div
      className="min-h-screen bg-[#FDFCF7] text-stone-900 font-[family-name:var(--font-body)] selection:bg-stone-200 selection:text-stone-900 pb-28 overflow-x-hidden w-full antialiased"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* Top Accent Rule & Header Bar */}
      <div className="w-full h-1.5" style={{ backgroundColor: accentColor }} />
      <header className="border-b border-stone-200/80 bg-[#FDFCF7]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-[family-name:var(--font-heading)] font-bold text-lg sm:text-xl tracking-tight text-stone-900 truncate">
              {profile?.fullName || t.cvDossier}
            </span>
            {isAvailableForHire && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 motion-safe:animate-pulse motion-reduce:animate-none" />
                <span>{profile?.hireBadgeText || t.availableForHire}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {profile?.resumePdfUrl && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 text-xs font-[family-name:var(--font-heading)] bg-white border-stone-300 text-stone-800 hover:bg-stone-50 hover:text-stone-950 transition-colors shadow-none"
              >
                <a
                  href={profile.resumePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.downloadResume}</span>
                  <span className="sm:hidden">CV</span>
                </a>
              </Button>
            )}

            {hasEmail && contactInfo?.email && (
              <Button
                asChild
                size="sm"
                className="h-8 text-xs font-[family-name:var(--font-heading)] bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors shadow-none"
              >
                <a href={`mailto:${contactInfo.email}`}>
                  <Mail className="w-3.5 h-3.5 sm:mr-1.5" />
                  <span className="hidden sm:inline">{t.inquire}</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 space-y-12 sm:space-y-16">
        {/* Masthead / Hero Dossier */}
        <section className="border-b border-stone-200/90 pb-10 sm:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left: Identity & Title */}
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-stone-500 font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest">
                  <span>{t.cvDossier}</span>
                  <span>•</span>
                  <span>{language === 'en' ? 'Editorial Edition' : 'Edisi Editorial'}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] font-bold text-stone-950 tracking-tight leading-[1.1] break-words">
                  {profile?.fullName || 'Portfolio'}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl font-[family-name:var(--font-heading)] italic text-stone-700 leading-relaxed break-words">
                  {profile?.headline || t.subtitles.about}
                </p>
              </div>

              {/* Location and Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                {profile?.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span className="break-words">{profile.location}</span>
                  </div>
                )}
                {currentRole && (
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{currentRole.position} @ {currentRole.company}</span>
                  </div>
                )}
                {latestEducation && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                    <span>{latestEducation.degree} • {latestEducation.institution}</span>
                  </div>
                )}
              </div>

              {/* Social links row */}
              {hasSocials && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.id || s.platform}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-white text-stone-700 hover:text-stone-950 border border-stone-200/90 hover:border-stone-300 transition-colors shadow-2xs"
                      title={s.platform}
                    >
                      <SocialIcon platform={s.platform} className="w-3.5 h-3.5" />
                      <span className="capitalize">{s.platform}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Portrait & "Sekilas / At a Glance" Box */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center sm:items-start gap-6">
              {profile?.avatarUrl && (
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48 rounded-lg overflow-hidden border-2 border-stone-200 bg-stone-100 shadow-md shrink-0">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile?.fullName || 'Avatar'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 176px, 192px"
                    priority
                  />
                </div>
              )}

              {/* Sekilas / At a Glance Summary Box (Dynamic, zero empty cells) */}
              <div className="w-full bg-stone-100/75 border border-stone-200/90 rounded-lg p-4 space-y-3">
                <div className="text-[11px] font-[family-name:var(--font-heading)] uppercase tracking-wider text-stone-600 font-semibold flex items-center gap-1.5 border-b border-stone-200 pb-2">
                  <Info className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                  <span>{t.atAGlance.title}</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {/* Current Position */}
                  {currentRole && (
                    <div className="bg-white p-2.5 rounded border border-stone-200/80 shadow-2xs space-y-0.5">
                      <div className="text-[10px] uppercase font-[family-name:var(--font-heading)] tracking-wider text-stone-500">
                        {t.atAGlance.currentRole}
                      </div>
                      <div className="font-semibold text-stone-900 break-words">
                        {currentRole.position}
                      </div>
                      <div className="text-stone-600 text-[11px] break-words">
                        {currentRole.company}
                      </div>
                    </div>
                  )}

                  {/* Latest Education */}
                  {latestEducation && (
                    <div className="bg-white p-2.5 rounded border border-stone-200/80 shadow-2xs space-y-0.5">
                      <div className="text-[10px] uppercase font-[family-name:var(--font-heading)] tracking-wider text-stone-500">
                        {t.atAGlance.latestEducation}
                      </div>
                      <div className="font-semibold text-stone-900 break-words">
                        {latestEducation.degree}
                      </div>
                      <div className="text-stone-600 text-[11px] break-words">
                        {latestEducation.institution}
                      </div>
                    </div>
                  )}

                  {/* Core Competencies (Top 3) */}
                  {skills.length > 0 && (
                    <div className="bg-white p-2.5 rounded border border-stone-200/80 shadow-2xs space-y-1">
                      <div className="text-[10px] uppercase font-[family-name:var(--font-heading)] tracking-wider text-stone-500">
                        {t.atAGlance.coreCompetencies}
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {skills.slice(0, 3).map((sk) => (
                          <span
                            key={sk.id || sk.name}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-stone-50 text-stone-800 border border-stone-200"
                          >
                            {sk.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location & Availability */}
                  {(profile?.location || isAvailableForHire) && (
                    <div className="bg-white p-2.5 rounded border border-stone-200/80 shadow-2xs space-y-1">
                      {profile?.location && (
                        <div className="text-stone-700 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="break-words">{profile.location}</span>
                        </div>
                      )}
                      {isAvailableForHire && (
                        <div className="flex items-center gap-1.5 text-emerald-700 font-medium pt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 motion-safe:animate-pulse motion-reduce:animate-none" />
                          <span>{profile?.hireBadgeText || t.atAGlance.available}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Editorial Grid: Main Body + Dossier Sidebar */}
        <div className={`grid grid-cols-1 ${hasSidebarContent ? 'lg:grid-cols-12' : ''} gap-10 lg:gap-14 items-start`}>
          
          {/* Main Column */}
          <main className={`${hasSidebarContent ? 'lg:col-span-8' : 'w-full'} space-y-14`}>
            
            {/* About / Overview */}
            {hasAbout && (
              <section className="space-y-4">
                <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
                  <span className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-stone-400 font-semibold">I.</span>
                  <h2 className="text-xl sm:text-2xl font-[family-name:var(--font-heading)] font-bold text-stone-900">
                    {t.sections.about}
                  </h2>
                </div>

                {about?.bio && (
                  <p className="text-stone-700 text-base sm:text-lg leading-relaxed whitespace-pre-line break-words text-justify sm:text-left">
                    {about.bio}
                  </p>
                )}

                {about?.keyHighlights && about.keyHighlights.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-xs uppercase font-[family-name:var(--font-heading)] tracking-wider text-stone-500 font-semibold mb-3">
                      {language === 'en' ? 'Core Highlights & Key Insights' : 'Sorotan Utama & Nilai Unggulan'}
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {about.keyHighlights.map((highlight, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs sm:text-sm text-stone-800 bg-white p-3 rounded border border-stone-200/80 shadow-2xs"
                        >
                          <span className="font-[family-name:var(--font-heading)] font-bold text-stone-400 mt-0.5">•</span>
                          <span className="break-words">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* Projects / Works */}
            {hasProjects && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
                  <span className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-stone-400 font-semibold">II.</span>
                  <h2 className="text-xl sm:text-2xl font-[family-name:var(--font-heading)] font-bold text-stone-900">
                    {t.sections.projects}
                  </h2>
                </div>

                <div className="space-y-8">
                  {projects.map((project, idx) => (
                    <article
                      key={project.id || idx}
                      className="group bg-white p-5 sm:p-7 rounded-lg border border-stone-200/90 hover:border-stone-300 transition-all shadow-xs space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-[family-name:var(--font-heading)] text-xs text-stone-400 font-medium">#{String(idx + 1).padStart(2, '0')}</span>
                            {project.isFeatured && (
                              <span className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-heading)] uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-200 rounded">
                                {language === 'en' ? 'Featured' : 'Unggulan'}
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg sm:text-xl font-[family-name:var(--font-heading)] font-bold text-stone-950 group-hover:text-stone-700 transition-colors break-words">
                            {project.title}
                          </h3>
                          {project.tagline && (
                            <p className="text-xs sm:text-sm font-[family-name:var(--font-heading)] italic text-stone-600 break-words">
                              {project.tagline}
                            </p>
                          )}
                        </div>

                        {/* Project Action Links */}
                        <div className="flex items-center gap-2 shrink-0 self-start">
                          {project.liveUrl && (
                            <Button
                              asChild
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs font-[family-name:var(--font-heading)] bg-stone-50 border-stone-300 text-stone-800 hover:bg-stone-100 hover:text-stone-950"
                            >
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                <span>{t.viewStudy}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                          {project.githubUrl && (
                            <Button
                              asChild
                              size="sm"
                              variant="ghost"
                              className="h-8 text-xs font-[family-name:var(--font-heading)] text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                            >
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                <SocialIcon platform="github" className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{t.sourceCode}</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Project Image if available */}
                      {project.imageUrl && (
                        <div className="relative w-full h-48 sm:h-64 rounded-md overflow-hidden bg-stone-100 border border-stone-200">
                          <Image
                            src={project.imageUrl}
                            alt={project.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 680px"
                          />
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line break-words">
                        {project.description}
                      </p>

                      {/* Tags */}
                      {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-stone-100">
                          {project.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono bg-stone-100 text-stone-600 border border-stone-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Professional Experience */}
            {hasExperiences && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
                  <span className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-stone-400 font-semibold">III.</span>
                  <h2 className="text-xl sm:text-2xl font-[family-name:var(--font-heading)] font-bold text-stone-900">
                    {t.sections.experience}
                  </h2>
                </div>

                <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-300">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id || idx} className="relative space-y-2 group">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[1.85rem] sm:-left-[2.35rem] top-1.5 w-3 h-3 rounded-full bg-stone-900 border-2 border-[#FDFCF7] ring-1 ring-stone-300 group-hover:scale-125 transition-transform" />

                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-base sm:text-lg font-[family-name:var(--font-heading)] font-bold text-stone-950 break-words">
                          {exp.position}
                        </h3>
                        <span className="text-xs font-mono text-stone-500 whitespace-nowrap">
                          {formatDate(exp.startDate)} — {exp.isCurrent ? t.present : formatDate(exp.endDate)}
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-[family-name:var(--font-heading)] italic text-stone-700 flex flex-wrap items-center gap-2">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline decoration-stone-300 hover:decoration-stone-800 underline-offset-2 break-words"
                          >
                            {exp.company}
                          </a>
                        ) : (
                          <span className="break-words">{exp.company}</span>
                        )}
                        {exp.location && (
                          <>
                            <span className="text-stone-400">•</span>
                            <span className="text-stone-600 not-italic text-xs">{exp.location}</span>
                          </>
                        )}
                        {exp.employmentType && (
                          <>
                            <span className="text-stone-400">•</span>
                            <span className="px-1.5 py-0.2 bg-stone-100 text-stone-600 rounded text-[10px] font-mono uppercase not-italic">
                              {exp.employmentType}
                            </span>
                          </>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line pt-1 break-words">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Testimonials */}
            {hasTestimonials && (
              <section className="space-y-6">
                <div className="flex items-center gap-3 border-b border-stone-200 pb-2">
                  <span className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-stone-400 font-semibold">IV.</span>
                  <h2 className="text-xl sm:text-2xl font-[family-name:var(--font-heading)] font-bold text-stone-900">
                    {t.sections.testimonials}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {testimonials.map((test, idx) => (
                    <blockquote
                      key={test.id || idx}
                      className="bg-white p-5 sm:p-6 rounded-lg border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <Quote className="w-5 h-5 text-stone-400 fill-stone-100" />
                        <p className="text-xs sm:text-sm font-[family-name:var(--font-heading)] italic text-stone-800 leading-relaxed break-words">
                          &ldquo;{test.quote}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                        {test.avatarUrl ? (
                          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                            <Image
                              src={test.avatarUrl}
                              alt={test.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-stone-100 text-stone-700 border border-stone-200 flex items-center justify-center font-[family-name:var(--font-heading)] font-bold text-xs shrink-0">
                            {test.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-[family-name:var(--font-heading)] font-bold text-xs sm:text-sm text-stone-900 truncate">
                            {test.name}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate">
                            {test.role} {test.company ? `• ${test.company}` : ''}
                          </div>
                        </div>
                      </div>
                    </blockquote>
                  ))}
                </div>
              </section>
            )}

          </main>

          {/* Dossier Sidebar: Education, Certifications, Skills */}
          {hasSidebarContent && (
            <aside className="lg:col-span-4 space-y-10 lg:sticky lg:top-20">
              
              {/* Education Section */}
              {hasEducations && (
                <section className="bg-white p-5 sm:p-6 rounded-lg border border-stone-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
                    <GraduationCap className="w-4 h-4 text-stone-700" />
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-stone-900">
                      {t.sections.education}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {educations.map((edu, idx) => (
                      <div key={edu.id || idx} className="space-y-1 border-b border-stone-100 last:border-0 pb-3 last:pb-0">
                        <div className="font-[family-name:var(--font-heading)] font-bold text-sm text-stone-950 break-words">
                          {edu.degree}
                        </div>
                        <div className="text-xs text-stone-700 font-[family-name:var(--font-heading)] italic break-words">
                          {edu.fieldOfStudy ? `${edu.fieldOfStudy} • ` : ''}{edu.institution}
                        </div>
                        <div className="text-[11px] font-mono text-stone-500 flex items-center justify-between pt-0.5">
                          <span>
                            {formatDate(edu.startDate)} — {edu.isCurrent ? t.present : formatDate(edu.endDate)}
                          </span>
                          {edu.gpa && (
                            <span className="font-semibold text-stone-800 bg-stone-100 px-1.5 py-0.2 rounded text-[10px]">
                              {t.gpa} {edu.gpa}
                            </span>
                          )}
                        </div>
                        {edu.description && (
                          <p className="text-xs text-stone-600 pt-1 leading-relaxed break-words">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications Section */}
              {hasCertifications && (
                <section className="bg-white p-5 sm:p-6 rounded-lg border border-stone-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
                    <Award className="w-4 h-4 text-stone-700" />
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-stone-900">
                      {t.sections.certifications}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {certifications.map((cert, idx) => (
                      <div key={cert.id || idx} className="space-y-1.5 border-b border-stone-100 last:border-0 pb-3.5 last:pb-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-[family-name:var(--font-heading)] font-bold text-sm text-stone-950 leading-snug break-words">
                            {cert.title}
                          </div>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-stone-400 hover:text-stone-800 transition-colors shrink-0"
                              title={t.verifyCredential}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>

                        <div className="text-xs font-[family-name:var(--font-heading)] italic text-stone-600 break-words">
                          {t.issuedBy} {cert.issuer}
                        </div>

                        <div className="text-[11px] font-mono text-stone-500 flex flex-wrap items-center gap-2">
                          <span>{t.issued}: {formatDate(cert.issueDate)}</span>
                          {cert.expiryDate && <span>• {t.expires}: {formatDate(cert.expiryDate)}</span>}
                        </div>

                        {cert.credentialId && (
                          <div className="text-[10px] font-mono bg-stone-50 text-stone-600 px-2 py-0.5 rounded border border-stone-200/70 inline-block break-all">
                            ID: {cert.credentialId}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills & Expertise Section */}
              {hasSkills && (
                <section className="bg-white p-5 sm:p-6 rounded-lg border border-stone-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-2.5">
                    <BookOpen className="w-4 h-4 text-stone-700" />
                    <h3 className="font-[family-name:var(--font-heading)] font-bold text-base text-stone-900">
                      {t.sections.skills}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                      <div key={category} className="space-y-2">
                        <div className="text-xs font-[family-name:var(--font-heading)] uppercase tracking-wider text-stone-500 font-semibold">
                          {category}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {catSkills.map((sk) => (
                            <span
                              key={sk.id || sk.name}
                              className="px-2.5 py-1 rounded text-xs font-medium bg-stone-50 text-stone-800 border border-stone-200/80 hover:border-stone-400 transition-colors"
                            >
                              {sk.name}
                              {sk.level && (
                                <span className="text-[10px] text-stone-400 ml-1 font-mono font-normal">
                                  ({sk.level})
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </aside>
          )}

        </div>

        {/* Contact & Inquiries Section */}
        {hasContact && (
          <section className="border-t border-stone-200/90 pt-12 pb-6 space-y-8">
            <div className="max-w-2xl mx-auto text-center space-y-3">
              <span className="font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest text-stone-400 font-semibold">
                {t.sections.contact}
              </span>
              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-heading)] font-bold text-stone-950">
                {language === 'en' ? 'Inquiries & Consultation' : 'Peluang Kolaborasi & Diskusi'}
              </h2>
              <p className="text-sm font-[family-name:var(--font-heading)] italic text-stone-600 leading-relaxed">
                {t.subtitles.contact}
              </p>
            </div>

            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-lg border border-stone-200/90 shadow-sm space-y-6">
              {/* Direct channels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hasEmail && contactInfo?.email && (
                  <div className="p-3 bg-stone-50 rounded border border-stone-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-[family-name:var(--font-heading)] uppercase text-stone-500">{t.contact.email}</div>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-xs font-medium text-stone-900 hover:underline truncate block"
                      >
                        {contactInfo.email}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="text-stone-400 hover:text-stone-800 p-1 shrink-0"
                      title={t.contact.copyEmail}
                    >
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {hasWhatsapp && contactInfo?.whatsapp && (
                  <div className="p-3 bg-stone-50 rounded border border-stone-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-[family-name:var(--font-heading)] uppercase text-stone-500">{t.contact.whatsapp}</div>
                      <a
                        href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-stone-900 hover:underline truncate block"
                      >
                        {contactInfo.whatsapp}
                      </a>
                    </div>
                    <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                )}

                {hasPhone && contactInfo?.phone && (
                  <div className="p-3 bg-stone-50 rounded border border-stone-200 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[10px] font-[family-name:var(--font-heading)] uppercase text-stone-500">{t.contact.phone}</div>
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-xs font-medium text-stone-900 hover:underline truncate block"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                    <Phone className="w-4 h-4 text-stone-500 shrink-0" />
                  </div>
                )}
              </div>

              {/* Inquiry Action Button */}
              {hasEmail && contactInfo?.email && (
                <Button
                  asChild
                  className="w-full h-11 text-sm font-[family-name:var(--font-heading)] bg-stone-900 text-stone-50 hover:bg-stone-800 transition-colors shadow-none"
                >
                  <a href={`mailto:${contactInfo.email}?subject=${encodeURIComponent(t.contact.inquirySubject)}`}>
                    <Send className="w-4 h-4 mr-2" />
                    <span>{t.contact.initiateInquiry}</span>
                  </a>
                </Button>
              )}
            </div>
          </section>
        )}

        {/* Editorial Footer */}
        <footer className="border-t border-stone-200 pt-8 pb-4 text-center text-xs font-[family-name:var(--font-heading)] text-stone-500 space-y-1">
          <p>© {new Date().getFullYear()} {profile?.fullName || 'Portfolio'}. {t.footer.allRightsReserved}</p>
          <p className="text-[11px] text-stone-400">{t.footer.curatedWith} • Elegant Template</p>
        </footer>
      </div>
    </div>
  );
}
