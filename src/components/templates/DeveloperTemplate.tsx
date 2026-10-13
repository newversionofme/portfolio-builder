'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { getDictionary } from '@/lib/i18n/dictionary';
import { Button } from '@/components/ui/button';
import { SocialIcon } from '@/components/ui/social-icon';
import {
  Terminal,
  GitBranch,
  FolderGit2,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Award,
  GraduationCap,
  Code2,
  Copy,
  Check,
  Star,
  FileCode2,
} from 'lucide-react';

interface TemplateProps {
  data: FullPortfolioData;
}

export function DeveloperTemplate({ data }: TemplateProps) {
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
  const hasSocials = socialLinks && socialLinks.length > 0;
  const isAvailableForHire = profile?.availableForHire === true;

  const handleCopyEmail = () => {
    if (contactInfo?.email) {
      navigator.clipboard.writeText(contactInfo.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#0a0c10] text-zinc-900 dark:text-zinc-200 font-[family-name:var(--font-body)] selection:bg-blue-500/30 selection:text-white pb-24 overflow-x-hidden w-full transition-colors duration-200">
      {/* Background Subtle Grid Effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f293d0d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0d_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50 dark:opacity-100" />

      {/* Terminal Top Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800/90 bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md px-3 sm:px-8 py-2.5 sm:py-3 w-full transition-colors duration-200">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          {/* Window Controls & Breadcrumb */}
          <div className="flex items-center gap-2 min-w-0 shrink">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/90 border border-red-600/40" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/90 border border-yellow-600/40" />
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/90 border border-emerald-600/40" />
            </div>
            <span className="text-xs text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)] flex items-center gap-1 truncate max-w-[140px] xs:max-w-[180px] sm:max-w-none">
              <Terminal className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span className="truncate">~/{data.slug || 'developer'}</span>
            </span>
          </div>

          {/* Hire Badge & Quick Contact */}
          <div className="flex items-center gap-2 shrink-0">
            {isAvailableForHire && (
              <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/80 text-emerald-800 dark:text-emerald-300 text-[11px] sm:text-xs font-[family-name:var(--font-heading)]">
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
                variant="outline"
                size="sm"
                className="h-7 px-2 sm:px-3 text-xs border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900/90 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-[family-name:var(--font-heading)]"
                onClick={handleCopyEmail}
                aria-label={t.contact.copyEmail}
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.contact.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1 text-zinc-500 dark:text-zinc-400" />
                    <span>Email</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-5xl mx-auto px-3.5 sm:px-8 pt-8 sm:pt-14 space-y-12 sm:space-y-20 w-full">
        
        {/* HERO SECTION - Terminal Window */}
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] overflow-hidden shadow-lg dark:shadow-2xl w-full transition-colors duration-200">
          {/* Terminal Window Header */}
          <div className="bg-zinc-100 dark:bg-[#161b22] px-3.5 sm:px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
            <div className="flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              <span>developer_profile.sh</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
              <GitBranch className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
              <span>main*</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-5 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row-reverse md:items-start md:justify-between gap-6">
              {/* Avatar Frame */}
              {profile?.avatarUrl && (
                <div className="relative group shrink-0">
                  <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 relative shadow-xl">
                    <Image
                      src={profile.avatarUrl}
                      alt={profile.fullName || 'Developer Avatar'}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-[10px] text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
                    dev.avatar
                  </div>
                </div>
              )}

              <div className="space-y-4 flex-1 min-w-0 w-full">
                {/* Command 1: whoami */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
                    <span className="text-emerald-500 dark:text-emerald-400 font-bold">➜</span>
                    <span className="text-blue-500 dark:text-blue-400">~</span>
                    <span className="text-zinc-700 dark:text-zinc-300">whoami</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-[family-name:var(--font-heading)] font-bold tracking-tight text-zinc-950 dark:text-white pl-3.5 border-l-2 border-blue-500 break-words leading-tight">
                    {profile?.fullName || 'Developer'}
                  </h1>
                </div>

                {/* Command 2: headline */}
                {profile?.headline && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
                      <span className="text-emerald-500 dark:text-emerald-400 font-bold">➜</span>
                      <span className="text-blue-500 dark:text-blue-400">~</span>
                      <span className="text-zinc-700 dark:text-zinc-300">cat current_role.txt</span>
                    </div>
                    <p className="text-sm sm:text-xl text-blue-600 dark:text-blue-400 font-medium pl-3.5 border-l-2 border-blue-500/40 break-words">
                      {profile.headline}
                    </p>
                  </div>
                )}

                {/* Location */}
                {profile?.location && (
                  <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 pl-3.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {/* Social Badges & Contact Actions */}
                <div className="pt-2 flex items-center gap-2.5 flex-wrap">
                  {hasEmail && (
                    <a
                      href={`mailto:${contactInfo!.email}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-[family-name:var(--font-heading)] font-medium transition-all shadow-md shadow-blue-600/20"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>contact_me()</span>
                    </a>
                  )}

                  {profile?.resumePdfUrl && (
                    <a
                      href={profile.resumePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-[family-name:var(--font-heading)] transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>resume.pdf</span>
                    </a>
                  )}

                  {hasSocials &&
                    socialLinks.map((link) => (
                      <a
                        key={link.id || link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/80 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all"
                        title={link.platform}
                        aria-label={link.platform}
                      >
                        <SocialIcon platform={link.platform} className="w-4 h-4" />
                      </a>
                    ))}
                </div>
              </div>
            </div>

            {/* About / Bio */}
            {about?.bio && (
              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 space-y-3">
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-[family-name:var(--font-heading)]">{'/* Bio & Philosophy */'}</div>
                <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800/80 whitespace-pre-line break-words">
                  {about.bio}
                </div>

                {about.keyHighlights && about.keyHighlights.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {about.keyHighlights.map((hl, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 text-xs font-[family-name:var(--font-heading)]"
                      >
                        ⚡ {hl}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* SKILLS SECTION */}
        {skills.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
              <span className="text-emerald-500 dark:text-emerald-400 font-bold">➜</span>
              <span className="text-blue-500 dark:text-blue-400">~</span>
              <span className="text-zinc-800 dark:text-zinc-200">cat tech_stack.json</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                <div
                  key={category}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] p-4 sm:p-5 space-y-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm dark:shadow-none"
                >
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 font-[family-name:var(--font-heading)] border-b border-zinc-100 dark:border-zinc-800/80 pb-2">
                    <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                      <Code2 className="w-3.5 h-3.5" />
                      {category}
                    </span>
                    <span>{catSkills.length} pkgs</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {catSkills.map((skill, idx) => (
                      <span
                        key={skill.id || idx}
                        className="px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 text-zinc-800 dark:text-zinc-200 text-xs font-[family-name:var(--font-heading)] border border-zinc-200 dark:border-zinc-700/60 flex items-center gap-1.5 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
                        {skill.name}
                        {skill.level && (
                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal">
                            ({skill.level})
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

        {/* PROJECTS SECTION - Git Repositories Style */}
        {projects.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
                <span className="text-emerald-500 dark:text-emerald-400 font-bold">➜</span>
                <span className="text-blue-500 dark:text-blue-400">~</span>
                <span className="text-zinc-800 dark:text-zinc-200">gh repo list --public</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-[family-name:var(--font-heading)]">
                {projects.length} {t.sections.projects}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project, idx) => (
                <div
                  key={project.id || idx}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] p-5 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderGit2 className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                        <h3 className="font-[family-name:var(--font-heading)] font-bold text-sm sm:text-base text-blue-600 dark:text-blue-400 group-hover:underline truncate">
                          {project.title}
                        </h3>
                      </div>

                      {project.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-[family-name:var(--font-heading)] bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 flex items-center gap-1 shrink-0">
                          <Star className="w-2.5 h-2.5 fill-amber-500 dark:fill-amber-300" />
                          <span>{language === 'en' ? 'Featured' : 'Unggulan'}</span>
                        </span>
                      )}
                    </div>

                    {project.tagline && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 font-medium break-words">
                        {project.tagline}
                      </p>
                    )}

                    {project.imageUrl && (
                      <div className="relative w-full h-36 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-[10px] font-[family-name:var(--font-heading)]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Links */}
                    <div className="flex items-center gap-2 pt-1">
                      {project.githubUrl && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 font-[family-name:var(--font-heading)]"
                        >
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <SocialIcon platform="github" className="w-3.5 h-3.5 mr-1" />
                            <span>{t.sourceCode}</span>
                          </a>
                        </Button>
                      )}

                      {project.liveUrl && (
                        <Button
                          asChild
                          size="sm"
                          className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white font-[family-name:var(--font-heading)]"
                        >
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <span>{t.viewStudy}</span>
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCE & EDUCATION SECTION */}
        {(experiences.length > 0 || educations.length > 0 || certifications.length > 0) && (
          <section className="space-y-8">
            {/* Work History */}
            {experiences.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">➜</span>
                  <span className="text-blue-500 dark:text-blue-400">~</span>
                  <span className="text-zinc-800 dark:text-zinc-200">git log --oneline --experience</span>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] p-4 sm:p-6 space-y-6 shadow-sm dark:shadow-none">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id || idx} className="relative pl-6 sm:pl-8 space-y-1.5 group">
                      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-[#0d1117] group-hover:scale-125 transition-transform" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className="font-[family-name:var(--font-heading)] font-bold text-sm sm:text-base text-zinc-950 dark:text-white break-words">
                          {exp.position}
                        </h4>
                        <span className="text-xs font-[family-name:var(--font-heading)] text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                          {exp.startDate} — {exp.isCurrent ? t.present : exp.endDate || t.present}
                        </span>
                      </div>

                      <div className="text-xs text-blue-600 dark:text-blue-400 font-[family-name:var(--font-heading)] flex items-center gap-2">
                        {exp.companyUrl ? (
                          <a href={exp.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            @{exp.company}
                          </a>
                        ) : (
                          <span>@{exp.company}</span>
                        )}
                        {exp.location && <span>• {exp.location}</span>}
                        {exp.employmentType && (
                          <span className="px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px]">
                            {exp.employmentType}
                          </span>
                        )}
                      </div>

                      {exp.description && (
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line pt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {educations.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">➜</span>
                  <span className="text-blue-500 dark:text-blue-400">~</span>
                  <span className="text-zinc-800 dark:text-zinc-200">cat education.log</span>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] p-5 space-y-4 shadow-sm dark:shadow-none">
                  {educations.map((edu, idx) => (
                    <div key={edu.id || idx} className="space-y-1 border-b border-zinc-100 dark:border-zinc-800/80 last:border-b-0 pb-3 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                          <h4 className="text-sm font-bold text-zinc-950 dark:text-white break-words">{edu.institution}</h4>
                        </div>
                        <span className="text-xs font-[family-name:var(--font-heading)] text-zinc-500 dark:text-zinc-400">
                          {edu.startDate} — {edu.isCurrent ? t.present : edu.endDate || t.present}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-300 pl-6">
                        {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                        {edu.gpa && ` • ${t.gpa}: ${edu.gpa}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
                  <span className="text-emerald-500 dark:text-emerald-400 font-bold">➜</span>
                  <span className="text-blue-500 dark:text-blue-400">~</span>
                  <span className="text-zinc-800 dark:text-zinc-200">cat certs.verify</span>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] p-5 space-y-4 shadow-sm dark:shadow-none">
                  {certifications.map((cert, idx) => (
                    <div key={cert.id || idx} className="space-y-1 border-b border-zinc-100 dark:border-zinc-800/80 last:border-b-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                          <h4 className="text-sm font-bold text-zinc-950 dark:text-white break-words">{cert.title}</h4>
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-[family-name:var(--font-heading)] shrink-0"
                          >
                            <span>{t.verifyCredential}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-300 pl-6">{cert.issuer}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-[family-name:var(--font-heading)] pl-6">
                        {t.issued}: {cert.issueDate}
                        {cert.credentialId && ` • ID: ${cert.credentialId}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* TESTIMONIALS */}
        {testimonials.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 font-[family-name:var(--font-heading)]">
              <span className="text-emerald-500 dark:text-emerald-400 font-bold">➜</span>
              <span className="text-blue-500 dark:text-blue-400">~</span>
              <span className="text-zinc-800 dark:text-zinc-200">cat peer_reviews.json</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((test, idx) => (
                <div
                  key={test.id || idx}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] p-5 space-y-4 flex flex-col justify-between shadow-sm dark:shadow-none"
                >
                  <div className="space-y-2">
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-[family-name:var(--font-heading)]">{'/** Peer Review **/'}</span>
                    <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed italic break-words">
                      &ldquo;{test.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                    {test.avatarUrl ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                        <Image src={test.avatarUrl} alt={test.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold font-[family-name:var(--font-heading)] shrink-0">
                        {test.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-zinc-950 dark:text-white truncate">{test.name}</div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-[family-name:var(--font-heading)] truncate">
                        {test.role} {test.company ? `@ ${test.company}` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT / TERMINAL FOOTER */}
        <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0d1117] p-6 sm:p-8 space-y-6 text-center shadow-lg dark:shadow-none">
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white font-[family-name:var(--font-heading)]">
              {language === 'en' ? 'Initialize Connection' : 'Inisialisasi Koneksi'}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
              {t.subtitles.contact}
            </p>
          </div>

          {(hasEmail || hasWhatsapp) && (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {hasEmail && (
                <a
                  href={`mailto:${contactInfo!.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-[family-name:var(--font-heading)] font-medium transition-all shadow-lg shadow-blue-600/20"
                >
                  <Mail className="w-4 h-4" />
                  <span>mailto:{contactInfo!.email}</span>
                </a>
              )}

              {hasWhatsapp && (
                <a
                  href={`https://wa.me/${contactInfo!.whatsapp!.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-emerald-600 dark:text-emerald-400 text-xs font-[family-name:var(--font-heading)] transition-all"
                >
                  <Phone className="w-4 h-4" />
                  <span>whatsapp://{contactInfo!.whatsapp}</span>
                </a>
              )}
            </div>
          )}

          <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-500 dark:text-zinc-400 font-[family-name:var(--font-heading)] flex items-center justify-center gap-2">
            <span>Powered by</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">Portfolio Builder</span>
            <span>•</span>
            <span>$ exit 0</span>
          </div>
        </section>

      </main>
    </div>
  );
}
