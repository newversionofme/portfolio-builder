'use client';

import React from 'react';
import Image from 'next/image';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { getDictionary } from '@/lib/i18n/dictionary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SocialIcon } from '@/components/ui/social-icon';
import {
  GraduationCap,
  Award,
  Quote,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Sparkles,
} from 'lucide-react';

interface TemplateProps {
  data: FullPortfolioData;
}

export function MinimalistTemplate({ data }: TemplateProps) {
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

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
    const cat = skill.category || t.sections.skills;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-body)] transition-colors duration-200">
      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-24 space-y-16">
        {/* Header / Profile */}
        <header className="space-y-6">
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-3xl sm:text-4xl font-[family-name:var(--font-heading)] font-bold tracking-tight text-zinc-900 dark:text-white">
                  {profile?.fullName || 'Portfolio'}
                </h1>
                {profile?.availableForHire && (
                  <Badge
                    variant="outline"
                    className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400 font-medium text-xs flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" />
                    {profile?.hireBadgeText || t.availableForHire}
                  </Badge>
                )}
              </div>

              <p className="text-lg text-zinc-600 dark:text-zinc-300 font-medium">
                {profile?.headline || t.subtitles.about}
              </p>

              {profile?.location && (
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {profile?.avatarUrl && (
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-2 ring-zinc-200 dark:ring-zinc-800 shadow-sm shrink-0">
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName || 'Avatar'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              {socialLinks.map((s, idx) => (
                <a
                  key={s.id || idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:border-zinc-700 shadow-2xs transition-all"
                >
                  <SocialIcon platform={s.platform} className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                  <span className="capitalize">{s.platform}</span>
                </a>
              ))}
            </div>
          )}
        </header>

        {/* About Section */}
        {about?.bio && (
          <section className="space-y-4">
            <h2 className="text-xs font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.sections.about}
            </h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line text-sm sm:text-base">
              {about.bio}
            </div>

            {about.keyHighlights && about.keyHighlights.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {about.keyHighlights.map((hl, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs font-normal bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    <Sparkles className="w-3 h-3 mr-1 text-zinc-400" />
                    {hl}
                  </Badge>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Projects Section */}
        {projects.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.sections.projects}
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-2xs hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-[family-name:var(--font-heading)] font-semibold text-zinc-900 dark:text-white">
                          {proj.title}
                        </h3>
                        {proj.isFeatured && (
                          <Badge
                            style={{ backgroundColor: accentColor, color: '#fff' }}
                            className="text-[10px] px-2 py-0.2"
                          >
                            {language === 'en' ? 'Featured' : 'Unggulan'}
                          </Badge>
                        )}
                      </div>
                      {proj.tagline && (
                        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                          {proj.tagline}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {proj.githubUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1.5"
                          asChild
                        >
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer">
                            <SocialIcon platform="github" className="w-3.5 h-3.5" />
                            <span>{t.sourceCode}</span>
                          </a>
                        </Button>
                      )}
                      {proj.liveUrl && (
                        <Button
                          size="sm"
                          style={{ backgroundColor: accentColor, color: '#fff' }}
                          className="h-8 text-xs gap-1.5 hover:opacity-90"
                          asChild
                        >
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{t.viewStudy}</span>
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>

                  {proj.imageUrl && (
                    <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                      <Image
                        src={proj.imageUrl}
                        alt={proj.title}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                    {proj.description}
                  </p>

                  {proj.tags && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.sections.skills}
            </h2>
            <div className="space-y-4">
              {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                <div key={category} className="space-y-2">
                  <h4 className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                    {category}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((sk, idx) => (
                      <Badge
                        key={sk.id || idx}
                        variant="outline"
                        className="px-3 py-1 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs font-medium border-zinc-200 dark:border-zinc-800"
                      >
                        {sk.name}
                        {sk.level && (
                          <span className="ml-1.5 text-[10px] text-zinc-400 font-normal">
                            • {sk.level}
                          </span>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {experiences.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.sections.experience}
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-zinc-200 dark:before:bg-zinc-800">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="relative pl-8 space-y-1.5">
                  <div
                    className="absolute left-1 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-950"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-base font-[family-name:var(--font-heading)] font-semibold text-zinc-900 dark:text-white">
                      {exp.position}
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">
                      {exp.startDate} — {exp.isCurrent ? t.present : exp.endDate || t.present}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <span>{exp.company}</span>
                    {exp.location && <span>• {exp.location}</span>}
                    {exp.employmentType && <span>• {exp.employmentType}</span>}
                  </div>

                  {exp.description && (
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 pt-1 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xs font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.sections.education}
            </h2>
            <div className="space-y-6">
              {educations.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm sm:text-base font-[family-name:var(--font-heading)] font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-zinc-400" />
                      {edu.institution}
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">
                      {edu.startDate} — {edu.isCurrent ? t.present : edu.endDate || t.present}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                    {edu.gpa && ` • ${t.gpa}: ${edu.gpa}`}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-zinc-500 leading-relaxed pt-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certifications.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.sections.certifications}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certifications.map((cert, idx) => (
                <div
                  key={cert.id || idx}
                  className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs sm:text-sm font-[family-name:var(--font-heading)] font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-500 shrink-0" />
                      {cert.title}
                    </h4>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    {cert.issuer} • {t.issued} {cert.issueDate}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {testimonials.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.sections.testimonials}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testimonials.map((test, idx) => (
                <div
                  key={test.id || idx}
                  className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3 flex flex-col justify-between"
                >
                  <Quote className="w-5 h-5 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 italic leading-relaxed">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    {test.avatarUrl && (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                        <Image src={test.avatarUrl} alt={test.name} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-[family-name:var(--font-heading)] font-semibold text-zinc-900 dark:text-white">
                        {test.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500">
                        {test.role} {test.company && `at ${test.company}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        {contactInfo && (contactInfo.email || contactInfo.phone || contactInfo.whatsapp) && (
          <footer className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
            <h2 className="text-xs font-[family-name:var(--font-heading)] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {t.sections.contact}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm">
              {contactInfo.email && (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Mail className="w-4 h-4" />
                  <span>{contactInfo.email}</span>
                </a>
              )}
              {contactInfo.phone && (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Phone className="w-4 h-4" />
                  <span>{contactInfo.phone}</span>
                </a>
              )}
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
