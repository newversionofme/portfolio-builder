'use client';

import React, { useState } from 'react';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { getDictionary, SupportedLanguage } from '@/lib/i18n/dictionary';
import {
  MapPin,
  Terminal,
  FileCode2,
  GitBranch,
  Sparkles,
  Briefcase,
  GraduationCap,
  Globe,
  User,
} from 'lucide-react';

interface ShareCardRendererProps {
  data: FullPortfolioData;
  pairing: { heading: string; body: string };
  avatarDataUri?: string | null;
}

export function ShareCardRenderer({
  data,
  pairing,
  avatarDataUri,
}: ShareCardRendererProps) {
  const {
    profile,
    about,
    skills = [],
    experiences = [],
    educations = [],
    accentColor = '#2563eb',
    templateId = 'minimalist',
    language = 'id',
    slug = 'portfolio',
  } = data;

  const t = getDictionary((language || 'id') as SupportedLanguage);
  const [avatarError, setAvatarError] = useState(false);

  const displayAvatar: string | null =
    (!avatarError && (avatarDataUri || profile?.avatarUrl)) || null;

  const getInitials = (name?: string | null) => {
    if (!name) return 'PB';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(profile?.fullName);
  const topSkills = skills.slice(0, 5);

  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return (b.startDate || '').localeCompare(a.startDate || '');
  });
  const currentRole = sortedExperiences[0];

  const sortedEducations = [...educations].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return (b.startDate || '').localeCompare(a.startDate || '');
  });
  const latestEducation = sortedEducations[0];

  // Dynamic domain resolution from window.location or env var
  const getDomain = () => {
    if (typeof window !== 'undefined' && window.location.host) {
      return window.location.host;
    }
    const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
    if (envUrl) {
      try {
        const u = new URL(envUrl.startsWith('http') ? envUrl : `https://${envUrl}`);
        return u.host;
      } catch {
        return envUrl.replace(/^https?:\/\//, '');
      }
    }
    return 'portfolio-builder.com';
  };

  const domain = getDomain();

  // Common wrapper ensuring exact 1200x630 dimensions, no animations, and CSS variables
  return (
    <div
      id="portfolio-share-card"
      className="w-[1200px] h-[630px] max-w-[1200px] max-h-[630px] overflow-hidden relative box-border select-none motion-reduce:animate-none transition-none"
      style={
        {
          width: '1200px',
          height: '630px',
          '--font-heading': pairing.heading,
          '--font-body': pairing.body,
          '--primary': accentColor,
          fontFamily: 'var(--font-body)',
        } as React.CSSProperties
      }
    >
      {templateId === 'developer' && (
        <DeveloperCard
          data={data}
          t={t}
          accentColor={accentColor}
          slug={slug}
          domain={domain}
          topSkills={topSkills}
          displayAvatar={displayAvatar}
          initials={initials}
          onAvatarError={() => setAvatarError(true)}
        />
      )}

      {templateId === 'bold' && (
        <BoldCard
          data={data}
          t={t}
          accentColor={accentColor}
          slug={slug}
          domain={domain}
          topSkills={topSkills}
          displayAvatar={displayAvatar}
          initials={initials}
          onAvatarError={() => setAvatarError(true)}
        />
      )}

      {templateId === 'elegant' && (
        <ElegantCard
          data={data}
          t={t}
          accentColor={accentColor}
          slug={slug}
          domain={domain}
          currentRole={currentRole}
          latestEducation={latestEducation}
          topSkills={topSkills}
          displayAvatar={displayAvatar}
          initials={initials}
          onAvatarError={() => setAvatarError(true)}
        />
      )}

      {(templateId === 'minimalist' ||
        !['developer', 'bold', 'elegant'].includes(templateId)) && (
        <MinimalistCard
          data={data}
          t={t}
          accentColor={accentColor}
          slug={slug}
          domain={domain}
          topSkills={topSkills}
          displayAvatar={displayAvatar}
          initials={initials}
          onAvatarError={() => setAvatarError(true)}
        />
      )}
    </div>
  );
}

/* =========================================================================
   1. MINIMALIST SHARE CARD (1200 x 630)
   ========================================================================= */
function MinimalistCard({
  data,
  t,
  accentColor,
  slug,
  domain,
  topSkills,
  displayAvatar,
  initials,
  onAvatarError,
}: {
  data: FullPortfolioData;
  t: ReturnType<typeof getDictionary>;
  accentColor: string;
  slug: string;
  domain: string;
  topSkills: FullPortfolioData['skills'];
  displayAvatar: string | null;
  initials: string;
  onAvatarError: () => void;
}) {
  const { profile, about } = data;

  return (
    <div className="w-[1200px] h-[630px] bg-[#FAFAFA] text-zinc-900 p-14 flex flex-col justify-between border-[12px] border-zinc-100 relative">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase font-[family-name:var(--font-heading)]">
            Portfolio
          </span>
        </div>

        {profile?.availableForHire && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{profile?.hireBadgeText || t.availableForHire}</span>
          </div>
        )}
      </div>

      {/* Main Body */}
      <div className="grid grid-cols-12 gap-10 items-center my-auto">
        {/* Left Information */}
        <div className="col-span-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tight text-zinc-900 font-[family-name:var(--font-heading)] line-clamp-2 leading-tight">
              {profile?.fullName || 'Portfolio'}
            </h1>
            <div
              className="h-1.5 w-20 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>

          <p className="text-2xl text-zinc-600 font-medium leading-snug line-clamp-2">
            {profile?.headline || t.subtitles.about}
          </p>

          {profile?.location && (
            <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
              <MapPin className="w-4 h-4 text-zinc-400" />
              <span>{profile.location}</span>
            </div>
          )}

          {/* Top Skill Badges */}
          {topSkills && topSkills.length > 0 && (
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {topSkills.map((sk) => (
                <span
                  key={sk.id}
                  className="px-3 py-1 rounded-md bg-white border border-zinc-200 text-xs font-medium text-zinc-700 shadow-xs"
                >
                  {sk.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Avatar */}
        <div className="col-span-4 flex justify-end">
          <div className="w-52 h-52 rounded-3xl overflow-hidden border-4 border-white shadow-xl bg-zinc-200 relative flex items-center justify-center">
            {displayAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayAvatar}
                alt={profile?.fullName || 'Avatar'}
                className="w-full h-full object-cover"
                onError={onAvatarError}
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Branding Bar */}
      <div className="pt-6 border-t border-zinc-200/80 flex items-center justify-between text-xs text-zinc-400 font-medium">
        <div className="flex items-center gap-2 text-zinc-600">
          <Globe className="w-3.5 h-3.5" />
          <span>{domain}/u/{slug}</span>
        </div>
        <span>{about?.bio ? about.bio.slice(0, 60) + '...' : ''}</span>
      </div>
    </div>
  );
}

/* =========================================================================
   2. DEVELOPER SHARE CARD (1200 x 630)
   ========================================================================= */
function DeveloperCard({
  data,
  t,
  accentColor,
  slug,
  domain,
  topSkills,
  displayAvatar,
  initials,
  onAvatarError,
}: {
  data: FullPortfolioData;
  t: ReturnType<typeof getDictionary>;
  accentColor: string;
  slug: string;
  domain: string;
  topSkills: FullPortfolioData['skills'];
  displayAvatar: string | null;
  initials: string;
  onAvatarError: () => void;
}) {
  const { profile } = data;

  return (
    <div className="w-[1200px] h-[630px] bg-[#0a0c10] text-zinc-200 p-10 flex flex-col justify-between relative border border-zinc-800">
      {/* Background Grid Pattern - solid SVG pattern for reliable canvas capture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d18_1px,transparent_1px),linear-gradient(to_bottom,#1f293d18_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Terminal Window Box */}
      <div className="w-full h-full rounded-2xl border border-zinc-800 bg-[#0d1117] flex flex-col justify-between shadow-2xl overflow-hidden relative z-10">
        {/* Terminal Header */}
        <div className="bg-[#161b22] px-6 py-4 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-300 font-[family-name:var(--font-heading)]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-red-500/90" />
              <span className="w-3.5 h-3.5 rounded-full bg-yellow-500/90" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/90" />
            </div>
            <span className="text-zinc-500">|</span>
            <span className="flex items-center gap-1.5 text-zinc-300 font-mono">
              <Terminal className="w-4 h-4 text-zinc-400" />
              <span>~/portfolio/{slug} — bash (1200×630)</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400 text-xs">
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            <span>main*</span>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-8 flex-1 flex flex-col justify-between">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left CLI Output */}
            <div className="col-span-8 space-y-4 font-[family-name:var(--font-heading)]">
              {/* whoami */}
              <div>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                  <span className="text-emerald-400 font-bold">➜</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-zinc-300">whoami</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-white pl-4 border-l-4 border-blue-500 mt-1 font-mono">
                  {profile?.fullName || 'Developer'}
                </h1>
              </div>

              {/* current role */}
              {profile?.headline && (
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span className="text-emerald-400 font-bold">➜</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-zinc-300">cat current_role.txt</span>
                  </div>
                  <p className="text-xl text-blue-400 font-medium pl-4 border-l-4 border-blue-500/30 mt-1 font-mono line-clamp-1">
                    {profile.headline}
                  </p>
                </div>
              )}

              {/* location & hire status */}
              <div className="flex items-center gap-4 pl-4 pt-1 text-xs">
                {profile?.location && (
                  <div className="flex items-center gap-1.5 text-zinc-400 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile?.availableForHire && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{profile?.hireBadgeText || t.availableForHire}</span>
                  </div>
                )}
              </div>

              {/* skills as json tags */}
              {topSkills && topSkills.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                    <span className="text-emerald-400 font-bold">➜</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-zinc-300">echo $TECH_STACK</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-2 pl-4">
                    {topSkills.map((sk) => (
                      <span
                        key={sk.id}
                        className="px-2.5 py-1 rounded bg-[#161b22] border border-zinc-700 text-xs font-mono text-zinc-300"
                      >
                        {sk.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Dev Avatar */}
            <div className="col-span-4 flex justify-end">
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-zinc-700 bg-zinc-900 shadow-xl relative flex items-center justify-center">
                  {displayAvatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={displayAvatar}
                      alt={profile?.fullName || 'Avatar'}
                      className="w-full h-full object-cover"
                      onError={onAvatarError}
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-4xl font-bold font-mono text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {initials}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-700 text-[11px] text-zinc-300 font-mono shadow-md">
                  dev.avatar
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Prompt Bar */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">➜</span>
              <span className="text-zinc-400">
                open {typeof window !== 'undefined' ? window.location.origin : `https://${domain}`}/u/{slug}
              </span>
              <span className="w-2 h-4 bg-zinc-400 inline-block" />
            </div>
            <span className="text-zinc-500">exit code 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   3. BOLD SHARE CARD (1200 x 630)
   ========================================================================= */
function BoldCard({
  data,
  t,
  accentColor,
  slug,
  domain,
  topSkills,
  displayAvatar,
  initials,
  onAvatarError,
}: {
  data: FullPortfolioData;
  t: ReturnType<typeof getDictionary>;
  accentColor: string;
  slug: string;
  domain: string;
  topSkills: FullPortfolioData['skills'];
  displayAvatar: string | null;
  initials: string;
  onAvatarError: () => void;
}) {
  const { profile } = data;

  return (
    <div
      className="w-[1200px] h-[630px] bg-zinc-950 text-zinc-100 p-12 flex flex-col justify-between relative border border-zinc-800"
      style={{ '--accent-theme': accentColor } as React.CSSProperties}
    >
      {/* Solid gradient fallback (no blur filters to prevent canvas rendering flaws) */}
      <div
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Top Bento Nav Pill */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <span
            className="px-3.5 py-1.5 rounded-full text-xs font-[family-name:var(--font-heading)] font-black uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            {data.language === 'en' ? 'Featured Portfolio' : 'Portofolio Unggulan'}
          </span>
          {profile?.location && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>

        {profile?.availableForHire && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{profile?.hireBadgeText || t.availableForHire}</span>
          </div>
        )}
      </div>

      {/* Middle Bento Hero Block */}
      <div className="grid grid-cols-12 gap-8 items-center my-auto relative z-10">
        <div className="col-span-8 space-y-4">
          <h1 className="text-6xl font-[family-name:var(--font-heading)] font-black tracking-tight text-white leading-tight line-clamp-2">
            {profile?.fullName || 'Portfolio'}
          </h1>

          {profile?.headline && (
            <p className="text-2xl font-[family-name:var(--font-heading)] font-bold text-zinc-300 leading-snug line-clamp-2">
              {profile.headline}
            </p>
          )}

          {topSkills && topSkills.length > 0 && (
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              {topSkills.map((sk) => (
                <span
                  key={sk.id}
                  className="px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-200"
                >
                  {sk.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Avatar with Accent Ring */}
        <div className="col-span-4 flex justify-end">
          <div
            className="w-52 h-52 rounded-3xl overflow-hidden border-4 bg-zinc-900 shadow-2xl relative flex items-center justify-center"
            style={{ borderColor: accentColor }}
          >
            {displayAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayAvatar}
                alt={profile?.fullName || 'Avatar'}
                className="w-full h-full object-cover"
                onError={onAvatarError}
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-5xl font-black text-white"
                style={{ backgroundColor: accentColor }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bento Footer */}
      <div className="pt-6 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-semibold relative z-10">
        <div className="flex items-center gap-2 text-zinc-300">
          <Globe className="w-4 h-4 text-zinc-400" />
          <span>{domain}/u/{slug}</span>
        </div>
        <span className="uppercase tracking-widest text-[11px] text-zinc-500">
          Bold / Creative Edition
        </span>
      </div>
    </div>
  );
}

/* =========================================================================
   4. ELEGANT SHARE CARD (1200 x 630)
   ========================================================================= */
function ElegantCard({
  data,
  t,
  accentColor,
  slug,
  domain,
  currentRole,
  latestEducation,
  topSkills,
  displayAvatar,
  initials,
  onAvatarError,
}: {
  data: FullPortfolioData;
  t: ReturnType<typeof getDictionary>;
  accentColor: string;
  slug: string;
  domain: string;
  currentRole?: FullPortfolioData['experiences'][0];
  latestEducation?: FullPortfolioData['educations'][0];
  topSkills: FullPortfolioData['skills'];
  displayAvatar: string | null;
  initials: string;
  onAvatarError: () => void;
}) {
  const { profile } = data;

  return (
    <div
      className="w-[1200px] h-[630px] bg-[#FDFCF7] text-stone-900 p-12 flex flex-col justify-between relative border border-stone-300/80"
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      {/* Top Accent Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: accentColor }}
      />

      {/* Masthead Header */}
      <div className="flex items-center justify-between pt-2 border-b border-stone-200/90 pb-4">
        <div className="flex items-center gap-2 text-stone-500 font-[family-name:var(--font-heading)] text-xs uppercase tracking-widest">
          <span>{t.cvDossier}</span>
          <span>•</span>
          <span>
            {data.language === 'en' ? 'Editorial Edition' : 'Edisi Editorial'}
          </span>
        </div>

        {profile?.availableForHire && (
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>{profile?.hireBadgeText || t.availableForHire}</span>
          </span>
        )}
      </div>

      {/* Main Body Grid */}
      <div className="grid grid-cols-12 gap-10 items-center my-auto">
        <div className="col-span-8 space-y-4">
          <h1 className="text-5xl font-[family-name:var(--font-heading)] font-bold text-stone-950 tracking-tight leading-tight line-clamp-2">
            {profile?.fullName || 'Portfolio'}
          </h1>

          <p className="text-2xl font-[family-name:var(--font-heading)] italic text-stone-700 leading-relaxed line-clamp-2">
            {profile?.headline || t.subtitles.about}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1 font-medium">
            {profile?.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-500" />
                <span>{profile.location}</span>
              </div>
            )}
            {currentRole && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  {currentRole.position} @ {currentRole.company}
                </span>
              </div>
            )}
            {latestEducation && (
              <div className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-stone-500" />
                <span>
                  {latestEducation.degree} • {latestEducation.institution}
                </span>
              </div>
            )}
          </div>

          {/* Top skills chips */}
          {topSkills && topSkills.length > 0 && (
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              {topSkills.map((sk) => (
                <span
                  key={sk.id}
                  className="px-3 py-1 rounded-sm border border-stone-300 bg-white text-stone-700 text-xs font-medium"
                >
                  {sk.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Avatar */}
        <div className="col-span-4 flex justify-end">
          <div className="w-48 h-48 rounded-xl overflow-hidden border-2 border-stone-300 bg-stone-100 shadow-md relative flex items-center justify-center">
            {displayAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={displayAvatar}
                alt={profile?.fullName || 'Avatar'}
                className="w-full h-full object-cover"
                onError={onAvatarError}
                crossOrigin="anonymous"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-4xl font-serif text-white"
                style={{ backgroundColor: accentColor }}
              >
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Elegant Footer */}
      <div className="pt-4 border-t border-stone-200/90 flex items-center justify-between text-xs text-stone-500 font-serif">
        <div className="flex items-center gap-2 text-stone-700">
          <Globe className="w-3.5 h-3.5 text-stone-500" />
          <span>{domain}/u/{slug}</span>
        </div>
        <span>Curated with Portfolio Builder</span>
      </div>
    </div>
  );
}
