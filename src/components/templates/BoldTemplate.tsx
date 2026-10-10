'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { getDictionary } from '@/lib/i18n/dictionary';
import { Button } from '@/components/ui/button';
import { SocialIcon } from '@/components/ui/social-icon';
import {
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Quote,
  Check,
  FileText,
  Layers,
  Star,
  Send,
  MessageSquare,
} from 'lucide-react';

interface TemplateProps {
  data: FullPortfolioData;
}

export function BoldTemplate({ data }: TemplateProps) {
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
    accentColor = '#2563eb',
    language = 'id',
  } = data;

  const t = getDictionary(language);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Group skills by category if any
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || t.sections.skills;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const hasEmail = Boolean(contactInfo?.email && contactInfo.email.trim() !== '');
  const hasWhatsapp = Boolean(contactInfo?.whatsapp && contactInfo.whatsapp.trim() !== '');
  const hasSocials = socialLinks && socialLinks.length > 0;
  const isAvailableForHire = profile?.availableForHire === true;

  // Check section presence
  const hasAbout = Boolean(about?.bio && about.bio.trim() !== '') || (about?.keyHighlights && about.keyHighlights.length > 0);
  const hasProjects = projects && projects.length > 0;
  const hasExperiences = experiences && experiences.length > 0;
  const hasEducations = educations && educations.length > 0;
  const hasCertifications = certifications && certifications.length > 0;
  const hasSkills = skills && skills.length > 0;
  const hasTestimonials = testimonials && testimonials.length > 0;
  const hasCredentials = hasEducations || hasCertifications;

  const handleCopyEmail = () => {
    if (contactInfo?.email) {
      navigator.clipboard.writeText(contactInfo.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div
      className="min-h-screen bg-zinc-950 text-zinc-100 font-[family-name:var(--font-body)] selection:bg-white selection:text-zinc-950 pb-28 overflow-x-hidden w-full"
      style={{ '--accent-theme': accentColor } as React.CSSProperties}
    >
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[140px] opacity-20"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] rounded-full blur-[160px] opacity-15"
          style={{ backgroundColor: accentColor }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] rounded-full blur-[180px] opacity-10"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      {/* Floating Top Navigation Pill */}
      <header className="sticky top-4 z-40 max-w-5xl mx-auto px-4 w-full">
        <nav className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/90 rounded-full px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3 min-w-0">
            {profile?.avatarUrl && (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 relative shrink-0">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName || 'Avatar'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <span className="font-[family-name:var(--font-heading)] font-extrabold text-sm sm:text-base tracking-tight text-white truncate max-w-[140px] sm:max-w-xs">
              {profile?.fullName || 'Portfolio'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isAvailableForHire && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="motion-safe:animate-ping motion-reduce:animate-none absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span className="hidden sm:inline">{profile?.hireBadgeText || t.availableForHire}</span>
                <span className="sm:hidden">Available</span>
              </div>
            )}

            {hasEmail && (
              <Button
                size="sm"
                className="h-8 px-3.5 text-xs font-[family-name:var(--font-heading)] font-bold rounded-full bg-white text-zinc-950 hover:bg-zinc-200 transition-transform motion-safe:hover:scale-105"
                onClick={handleCopyEmail}
                aria-label={t.contact.copyEmail}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>{t.contact.copied}</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 mr-1" />
                    <span>{t.inquire}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </nav>
      </header>

      {/* Main Bento Layout */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 space-y-6 sm:space-y-8 w-full">
        
        {/* HERO BENTO BOX */}
        <section className="bg-gradient-to-b from-zinc-900/90 to-zinc-900/40 border-2 border-zinc-800 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none rounded-tr-3xl" />
          
          <div className="flex flex-col-reverse lg:flex-row lg:items-center lg:justify-between gap-8 sm:gap-12 relative z-10">
            <div className="space-y-6 flex-1 min-w-0 w-full">
              
              {/* Creator Tag & Location */}
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {language === 'en' ? 'Featured Portfolio' : 'Portofolio Unggulan'}
                </span>
                {profile?.location && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-zinc-800/80 px-3 py-1 rounded-full border border-zinc-700/60">
                    <MapPin className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Massive Headline / Full Name */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-[family-name:var(--font-heading)] font-black tracking-tight text-white leading-[0.95] break-words">
                  {profile?.fullName || 'Portfolio'}
                </h1>
                {profile?.headline && (
                  <p className="text-lg sm:text-2xl md:text-3xl font-[family-name:var(--font-heading)] font-bold text-zinc-300 leading-snug break-words">
                    {profile.headline}
                  </p>
                )}
              </div>

              {/* Action Buttons & Socials */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                {hasEmail && contactInfo?.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="inline-flex items-center gap-2 h-11 px-6 rounded-full font-[family-name:var(--font-heading)] font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-lg motion-safe:hover:-translate-y-0.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.getInTouch}</span>
                  </a>
                )}

                {hasWhatsapp && contactInfo?.whatsapp && (
                  <a
                    href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full font-[family-name:var(--font-heading)] font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg motion-safe:hover:-translate-y-0.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {profile?.resumePdfUrl && (
                  <a
                    href={profile.resumePdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full font-[family-name:var(--font-heading)] font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all motion-safe:hover:-translate-y-0.5"
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t.downloadResume}</span>
                  </a>
                )}

                {/* Social Icons Pill Group */}
                {hasSocials && (
                  <div className="flex items-center gap-1.5 p-1 bg-zinc-800/80 border border-zinc-700/80 rounded-full">
                    {socialLinks.map((s, idx) => (
                      <a
                        key={s.id || idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                        aria-label={`Open ${s.platform}`}
                      >
                        <SocialIcon platform={s.platform} className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stylized Avatar Visual Showcase */}
            {profile?.avatarUrl && (
              <div className="relative group shrink-0 mx-auto lg:mx-0">
                <div
                  className="w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-3xl sm:rounded-[2rem] overflow-hidden border-4 border-zinc-800 relative shadow-2xl transition-transform duration-300 motion-safe:group-hover:scale-105"
                  style={{
                    boxShadow: `0 20px 50px -15px ${accentColor}33`,
                  }}
                >
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.fullName || 'Creator Profile'}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div
                  className="absolute -bottom-3 -right-3 px-3.5 py-1 rounded-full text-[11px] font-[family-name:var(--font-heading)] font-black tracking-wide uppercase text-white shadow-xl border-2 border-zinc-950 flex items-center gap-1"
                  style={{ backgroundColor: accentColor }}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Verified</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BENTO GRID ROW: About + Skills */}
        {(hasAbout || hasSkills) && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Bento Card: About */}
            {hasAbout && (
              <div className={`${hasSkills ? 'md:col-span-7' : 'md:col-span-12'} bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                    <h2 className="text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-zinc-400">
                      {t.sections.about}
                    </h2>
                  </div>

                  {about?.bio && (
                    <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-normal break-words">
                      {about.bio}
                    </p>
                  )}
                </div>

                {about?.keyHighlights && about.keyHighlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-[family-name:var(--font-heading)] font-bold text-zinc-400 uppercase tracking-wider block">
                      {language === 'en' ? 'Core Highlights' : 'Sorotan Utama'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {about.keyHighlights.map((highlight, idx) => (
                        <span
                          key={idx}
                          className="px-3.5 py-1.5 rounded-xl bg-zinc-800/90 border border-zinc-700/80 text-xs font-semibold text-zinc-200 flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{highlight}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bento Card: Skills */}
            {hasSkills && (
              <div className={`${hasAbout ? 'md:col-span-5' : 'md:col-span-12'} bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden`}>
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <h2 className="text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-zinc-400">
                    {t.sections.skills}
                  </h2>
                </div>

                <div className="space-y-4">
                  {Object.entries(skillsByCategory).map(([category, items]) => (
                    <div key={category} className="space-y-2">
                      <span className="text-[11px] font-[family-name:var(--font-heading)] font-bold uppercase tracking-wider text-zinc-400 block">
                        {category}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {items.map((skill) => (
                          <div
                            key={skill.id || skill.name}
                            className="px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/70 text-xs font-bold text-zinc-200 transition-colors flex items-center gap-1.5 shadow-xs"
                          >
                            <span>{skill.name}</span>
                            {skill.level && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-900/80 text-zinc-400 font-medium">
                                {skill.level}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FEATURED WORKS: Visual Project Showcase */}
        {hasProjects && (
          <section className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-zinc-400 block">
                  {t.sections.projects}
                </span>
                <h2 className="text-2xl sm:text-4xl font-[family-name:var(--font-heading)] font-black text-white tracking-tight">
                  {language === 'en' ? 'Selected Works & Case Studies' : 'Koleksi Portofolio & Studi Kasus'}
                </h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono">
                {projects.length} Works
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {projects.map((project, idx) => {
                const isFirstFeatured = idx === 0 && project.isFeatured;
                return (
                  <div
                    key={project.id || idx}
                    className={`group bg-zinc-900/70 border-2 border-zinc-800 hover:border-zinc-700 rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-300 motion-safe:hover:-translate-y-1 shadow-xl ${
                      isFirstFeatured ? 'md:col-span-2' : 'md:col-span-1'
                    }`}
                  >
                    {/* Project Visual Cover */}
                    {project.imageUrl ? (
                      <div className="w-full h-56 sm:h-72 md:h-80 relative overflow-hidden bg-zinc-950 border-b border-zinc-800/80">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent opacity-80" />
                        
                        {project.isFeatured && (
                          <div
                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-white shadow-lg"
                            style={{ backgroundColor: accentColor }}
                          >
                            {language === 'en' ? 'Featured' : 'Unggulan'}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className="w-full h-44 sm:h-52 relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border-b border-zinc-800/80 flex items-center justify-center p-6"
                      >
                        <Layers className="w-12 h-12 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
                        {project.isFeatured && (
                          <div
                            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-white shadow-lg"
                            style={{ backgroundColor: accentColor }}
                          >
                            {language === 'en' ? 'Featured' : 'Unggulan'}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Project Content Info */}
                    <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        {/* Tags */}
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2.5 py-1 rounded-lg bg-zinc-800/90 text-[11px] font-bold text-zinc-300 border border-zinc-700/60 font-mono"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <h3 className="text-xl sm:text-2xl font-[family-name:var(--font-heading)] font-black text-white group-hover:text-zinc-200 transition-colors break-words">
                          {project.title}
                        </h3>

                        {project.tagline && (
                          <p className="text-sm font-medium text-zinc-400 break-words">
                            {project.tagline}
                          </p>
                        )}

                        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal whitespace-pre-line break-words">
                          {project.description}
                        </p>
                      </div>

                      {/* Project Action Links */}
                      <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80 flex-wrap">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md motion-safe:hover:scale-105"
                            style={{ backgroundColor: accentColor }}
                          >
                            <span>{t.viewStudy}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
                          >
                            <SocialIcon platform="github" className="w-3.5 h-3.5" />
                            <span>{t.sourceCode}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* EXPERIENCE & CREDENTIALS BENTO */}
        {(hasExperiences || hasCredentials) && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
            
            {/* Experience Bento */}
            {hasExperiences && (
              <div className={`${hasCredentials ? 'md:col-span-7' : 'md:col-span-12'} bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6`}>
                <div className="space-y-1">
                  <span className="text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-zinc-400 block">
                    {t.sections.experience}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-[family-name:var(--font-heading)] font-black text-white tracking-tight flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-zinc-400" />
                    <span>{t.sections.experience}</span>
                  </h2>
                </div>

                <div className="space-y-6 relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id || idx} className="relative pl-6 space-y-2 group">
                      <div
                        className="absolute -left-[1.35rem] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-zinc-950 transition-transform group-hover:scale-125"
                        style={{ backgroundColor: accentColor }}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-base font-bold text-white break-words font-[family-name:var(--font-heading)]">
                          {exp.position}
                        </h3>
                        <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">
                          {exp.startDate} — {exp.isCurrent ? t.present : exp.endDate || t.present}
                        </span>
                      </div>

                      <div className="text-xs font-bold text-zinc-300 flex items-center gap-2 flex-wrap">
                        {exp.companyUrl ? (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline flex items-center gap-1"
                          >
                            <span>{exp.company}</span>
                            <ArrowUpRight className="w-3 h-3 text-zinc-400" />
                          </a>
                        ) : (
                          <span>{exp.company}</span>
                        )}
                        {exp.location && <span>• {exp.location}</span>}
                        {exp.employmentType && (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-[10px] uppercase font-mono text-zinc-300">
                            {exp.employmentType}
                          </span>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed whitespace-pre-line pt-1 break-words">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Certs Bento */}
            {hasCredentials && (
              <div className={`${hasExperiences ? 'md:col-span-5' : 'md:col-span-12'} space-y-6`}>
                {/* Education */}
                {hasEducations && (
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5">
                    <div className="space-y-1">
                      <span className="text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-zinc-400 block">
                        {t.sections.education}
                      </span>
                      <h2 className="text-xl font-[family-name:var(--font-heading)] font-black text-white tracking-tight flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-zinc-400" />
                        <span>{t.sections.education}</span>
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {educations.map((edu, idx) => (
                        <div
                          key={edu.id || idx}
                          className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 space-y-1.5"
                        >
                          <h3 className="text-sm font-bold text-white font-[family-name:var(--font-heading)] break-words">
                            {edu.degree}
                          </h3>
                          <div className="text-xs text-zinc-300">
                            {edu.fieldOfStudy ? `${edu.fieldOfStudy} • ` : ''}{edu.institution}
                          </div>
                          <div className="text-[11px] font-mono text-zinc-400">
                            {edu.startDate} – {edu.isCurrent ? t.present : edu.endDate || ''}
                          </div>
                          {edu.gpa && (
                            <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                              {t.gpa}: {edu.gpa}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {hasCertifications && (
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-5">
                    <div className="space-y-1">
                      <span className="text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-zinc-400 block">
                        {t.sections.certifications}
                      </span>
                      <h2 className="text-xl font-[family-name:var(--font-heading)] font-black text-white tracking-tight flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>{t.sections.certifications}</span>
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {certifications.map((cert, idx) => (
                        <div
                          key={cert.id || idx}
                          className="p-4 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-white font-[family-name:var(--font-heading)] break-words">
                              {cert.title}
                            </h3>
                            <p className="text-xs font-medium text-zinc-400">
                              {cert.issuer} {cert.issueDate ? `• ${cert.issueDate}` : ''}
                            </p>
                            {cert.credentialId && (
                              <span className="text-[10px] text-zinc-500 font-mono block">
                                ID: {cert.credentialId}
                              </span>
                            )}
                          </div>

                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors shrink-0"
                              aria-label={t.verifyCredential}
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TESTIMONIALS */}
        {hasTestimonials && (
          <section className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6">
            <div className="space-y-1">
              <span className="text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-zinc-400 block">
                {t.sections.testimonials}
              </span>
              <h2 className="text-2xl sm:text-3xl font-[family-name:var(--font-heading)] font-black text-white tracking-tight flex items-center gap-2">
                <Quote className="w-6 h-6 text-zinc-400" />
                <span>{language === 'en' ? 'Collaborator Testimonials' : 'Rekomendasi & Testimoni'}</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.map((testi, idx) => (
                <div
                  key={testi.id || idx}
                  className="p-6 rounded-2xl bg-zinc-800/40 border border-zinc-700/60 flex flex-col justify-between space-y-4"
                >
                  <p className="text-sm sm:text-base text-zinc-200 italic font-normal leading-relaxed break-words">
                    &ldquo;{testi.quote}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    {testi.avatarUrl ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-zinc-700 relative shrink-0">
                        <Image
                          src={testi.avatarUrl}
                          alt={testi.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-white font-black text-sm shrink-0 font-[family-name:var(--font-heading)]">
                        {testi.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white break-words font-[family-name:var(--font-heading)]">
                        {testi.name}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {testi.role} {testi.company ? `at ${testi.company}` : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CALL TO ACTION / CONTACT */}
        <section
          className="rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-2xl border-2 border-zinc-800"
          style={{
            background: `radial-gradient(ellipse at top, ${accentColor}22 0%, #121316 70%)`,
          }}
        >
          <div className="max-w-2xl mx-auto space-y-4">
            <span
              className="px-3.5 py-1 rounded-full text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-white inline-block shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              {t.sections.contact}
            </span>
            <h2 className="text-3xl sm:text-5xl font-[family-name:var(--font-heading)] font-black text-white tracking-tight leading-tight break-words">
              {language === 'en' ? 'Have a visionary project in mind? Let’s collaborate.' : 'Punya proyek menarik? Mari berkolaborasi.'}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 font-normal max-w-xl mx-auto break-words">
              {t.subtitles.contact}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
            {hasEmail && contactInfo?.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center gap-2 h-12 px-7 rounded-full font-[family-name:var(--font-heading)] font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-200 transition-all shadow-xl motion-safe:hover:scale-105"
              >
                <Mail className="w-4 h-4" />
                <span>{contactInfo.email}</span>
              </a>
            )}

            {hasWhatsapp && contactInfo?.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-full font-[family-name:var(--font-heading)] font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xl motion-safe:hover:scale-105"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </section>

      </main>

      {/* Minimal Footer */}
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 text-center text-xs text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-900 mt-12 font-[family-name:var(--font-heading)]">
        <p>© {new Date().getFullYear()} {profile?.fullName || 'Portfolio'}. {t.footer.allRightsReserved}</p>
        <p className="flex items-center gap-1">
          <span>{t.footer.curatedWith}</span>
        </p>
      </footer>
    </div>
  );
}
