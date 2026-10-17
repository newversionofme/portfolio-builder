'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePortfolioStore, getPortfolioComparableJson } from '@/lib/store/portfolio-store';
import { savePortfolio } from '@/actions/portfolio';
import { FullPortfolioData } from '@/lib/validations/portfolio';
import { ProfileTab } from './tabs/ProfileTab';
import { AboutTab } from './tabs/AboutTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { EducationTab } from './tabs/EducationTab';
import { SkillsTab } from './tabs/SkillsTab';
import { ProjectsTab } from './tabs/ProjectsTab';
import { CertificationsTab } from './tabs/CertificationsTab';
import { TestimonialsTab } from './tabs/TestimonialsTab';
import { ContactTab } from './tabs/ContactTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useEditorText } from '@/lib/i18n/editor-copy';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Cpu,
  FolderGit2,
  Award,
  MessageSquareQuote,
  Mail,
  Palette,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  LayoutList,
} from 'lucide-react';

export const TABS = [
  { id: 'profile', label: 'Profil Utama', icon: User },
  { id: 'about', label: 'Tentang Saya', icon: FileText },
  { id: 'experience', label: 'Pengalaman', icon: Briefcase },
  { id: 'education', label: 'Pendidikan', icon: GraduationCap },
  { id: 'skills', label: 'Keahlian', icon: Cpu },
  { id: 'projects', label: 'Proyek', icon: FolderGit2 },
  { id: 'certifications', label: 'Sertifikat', icon: Award },
  { id: 'testimonials', label: 'Testimoni', icon: MessageSquareQuote },
  { id: 'contact', label: 'Kontak & Sosial', icon: Mail },
  { id: 'appearance', label: 'Tampilan & Tema', icon: Palette },
] as const;

export type TabId = (typeof TABS)[number]['id'];

function isTabFilled(tabId: string, portfolio: FullPortfolioData): boolean {
  switch (tabId) {
    case 'profile':
      return Boolean(portfolio.profile?.fullName?.trim() && portfolio.profile?.headline?.trim());
    case 'about':
      return Boolean(
        portfolio.about?.bio?.trim() ||
        (Array.isArray(portfolio.about?.keyHighlights) && portfolio.about.keyHighlights.length > 0)
      );
    case 'experience':
      return Boolean(portfolio.experiences && portfolio.experiences.length > 0);
    case 'education':
      return Boolean(portfolio.educations && portfolio.educations.length > 0);
    case 'skills':
      return Boolean(portfolio.skills && portfolio.skills.length > 0);
    case 'projects':
      return Boolean(portfolio.projects && portfolio.projects.length > 0);
    case 'certifications':
      return Boolean(portfolio.certifications && portfolio.certifications.length > 0);
    case 'testimonials':
      return Boolean(portfolio.testimonials && portfolio.testimonials.length > 0);
    case 'contact':
      return Boolean(
        portfolio.contactInfo?.email?.trim() ||
        portfolio.contactInfo?.phone?.trim() ||
        portfolio.contactInfo?.whatsapp?.trim() ||
        (portfolio.socialLinks && portfolio.socialLinks.length > 0)
      );
    case 'appearance':
      return Boolean(portfolio.templateId);
    default:
      return false;
  }
}

export function EditorTabs() {
  const {
    portfolio,
    isInitialized,
    activeTab,
    setActiveTab,
    setSaveStatus,
    markAsSaved,
    manualSaveTrigger,
  } = usePortfolioStore();

  const { t, language } = useLanguage();
  const tx = useEditorText();
  const localizedTabs = TABS.map((tab) => ({
    ...tab,
    label: t.editor.tabNames[tab.id as keyof typeof t.editor.tabNames] || tab.label,
  }));

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(false);
  const isSavingRef = useRef(false);
  const hasPendingSaveRef = useRef(false);
  const lastSavedPayloadRef = useRef<string>('');
  const lastManualTriggerRef = useRef<number>(manualSaveTrigger);

  // Mobile horizontal scroll state & refs
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);
  const activeMobileTabRef = useRef<HTMLButtonElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Perform the actual network save with a 15-second timeout guard
  const executeSave = async () => {
    if (isSavingRef.current) {
      hasPendingSaveRef.current = true;
      return;
    }

    const targetPortfolio = usePortfolioStore.getState().portfolio;
    const targetPayload = getPortfolioComparableJson(targetPortfolio);

    if (targetPayload === lastSavedPayloadRef.current) {
      return;
    }

    isSavingRef.current = true;
    hasPendingSaveRef.current = false;
    setSaveStatus('saving');

    const timeoutPromise = new Promise<{ success: false; error: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          success: false,
          error: tx('Penyimpanan melebihi batas waktu (timeout 15 detik). Silakan coba lagi.'),
        });
      }, 15000);
    });

    try {
      const savePromise = savePortfolio(targetPortfolio);
      const res = await Promise.race([savePromise, timeoutPromise]);

      if (res?.success) {
        lastSavedPayloadRef.current = targetPayload;
        markAsSaved(targetPortfolio);
      } else {
        const errorMsg = tx(res?.error || 'Gagal menyimpan perubahan.');
        console.error('[EditorTabs Save Failed]:', errorMsg);
        setSaveStatus('error', errorMsg);
        toast.error(`${tx('Autosave gagal:')} ${errorMsg}`);
      }
    } catch (err: unknown) {
      const errorMsg = tx(err instanceof Error ? err.message : 'Terjadi kendala jaringan saat menyimpan.');
      console.error('[EditorTabs Autosave Exception]:', err);
      setSaveStatus('error', errorMsg);
      toast.error(`${tx('Autosave error:')} ${errorMsg}`);
    } finally {
      isSavingRef.current = false;
      const currentNewestPayload = getPortfolioComparableJson(usePortfolioStore.getState().portfolio);
      if (hasPendingSaveRef.current || currentNewestPayload !== lastSavedPayloadRef.current) {
        hasPendingSaveRef.current = false;
        setTimeout(() => {
          executeSave();
        }, 500);
      }
    }
  };

  const executeSaveRef = useRef(executeSave);
  useEffect(() => {
    executeSaveRef.current = executeSave;
  });

  // Sync initial payload once initialized
  useEffect(() => {
    if (isInitialized && !isMountedRef.current) {
      isMountedRef.current = true;
      lastSavedPayloadRef.current = getPortfolioComparableJson(portfolio);
    }
  }, [isInitialized, portfolio]);

  // Debounced Autosave on user input
  useEffect(() => {
    if (!isInitialized || !isMountedRef.current) return;

    const currentPayload = getPortfolioComparableJson(portfolio);
    if (currentPayload === lastSavedPayloadRef.current) {
      return;
    }

    setSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSaveRef.current();
    }, 1200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [portfolio, isInitialized, setSaveStatus]);

  // Handle manual retry trigger
  useEffect(() => {
    if (!isInitialized) return;
    if (manualSaveTrigger > lastManualTriggerRef.current) {
      lastManualTriggerRef.current = manualSaveTrigger;
      executeSaveRef.current();
    }
  }, [manualSaveTrigger, isInitialized]);

  // Mobile horizontal scroll detection (gradasi fade & tombol panah)
  const checkScrollOverflow = useCallback(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = tabsScrollRef.current;
    if (!el) return;
    checkScrollOverflow();
    el.addEventListener('scroll', checkScrollOverflow, { passive: true });
    window.addEventListener('resize', checkScrollOverflow);
    return () => {
      el.removeEventListener('scroll', checkScrollOverflow);
      window.removeEventListener('resize', checkScrollOverflow);
    };
  }, [checkScrollOverflow]);

  // Auto-scroll active tab into view on mobile/tablet (respects prefers-reduced-motion)
  useEffect(() => {
    if (activeMobileTabRef.current) {
      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      activeMobileTabRef.current.scrollIntoView({
        behavior: isReducedMotion ? 'auto' : 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
    checkScrollOverflow();
  }, [activeTab, checkScrollOverflow]);

  const scrollTabs = (direction: 'left' | 'right') => {
    const el = tabsScrollRef.current;
    if (!el) return;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollAmount = 140;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: isReducedMotion ? 'auto' : 'smooth',
    });
  };

  // Keyboard navigation for tablist
  const handleKeyDown = (e: React.KeyboardEvent, index: number, isVertical: boolean) => {
    let targetIndex = -1;
    if (isVertical) {
      if (e.key === 'ArrowDown') targetIndex = (index + 1) % localizedTabs.length;
      else if (e.key === 'ArrowUp') targetIndex = (index - 1 + localizedTabs.length) % localizedTabs.length;
    } else {
      if (e.key === 'ArrowRight') targetIndex = (index + 1) % localizedTabs.length;
      else if (e.key === 'ArrowLeft') targetIndex = (index - 1 + localizedTabs.length) % localizedTabs.length;
    }

    if (e.key === 'Home') targetIndex = 0;
    if (e.key === 'End') targetIndex = localizedTabs.length - 1;

    if (targetIndex !== -1) {
      e.preventDefault();
      const nextTab = localizedTabs[targetIndex];
      setActiveTab(nextTab.id);
    }
  };

  // Calculations for completeness & navigation
  const filledCount = localizedTabs.filter((tab) => isTabFilled(tab.id, portfolio)).length;
  const currentIndex = localizedTabs.findIndex((t) => t.id === activeTab);
  const currentTab = localizedTabs[currentIndex];
  const prevTab = currentIndex > 0 ? localizedTabs[currentIndex - 1] : null;
  const nextTab = currentIndex < localizedTabs.length - 1 ? localizedTabs[currentIndex + 1] : null;

  return (
    <div className="w-full min-w-0 lg:min-w-[680px] xl:min-w-[740px] 2xl:min-w-[800px] lg:w-full border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col lg:flex-row h-full min-h-0 shrink-0">
      {/* ============================================================ */}
      {/* DESKTOP (>= 1024px): Vertical Sidebar Navigation               */}
      {/* ============================================================ */}
      <aside
        className="hidden lg:flex lg:w-56 xl:w-60 flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-3 shrink-0 h-full overflow-y-auto"
        aria-label={t.editor.sectionsList}
      >
        {/* Progress Summary */}
        <div className="mb-3 p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-zinc-500 dark:text-zinc-400">{t.editor.completeness}</span>
            <span className="font-semibold text-zinc-900 dark:text-white">
              {filledCount} / {localizedTabs.length} {t.editor.itemsFilled}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
              style={{ width: `${(filledCount / localizedTabs.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Vertical Tab List */}
        <div
          role="tablist"
          aria-orientation="vertical"
          className="space-y-1 flex-1"
        >
          {localizedTabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isComplete = isTabFilled(tab.id, portfolio);
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                id={`desktop-tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, idx, true)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left relative outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none',
                  isActive
                    ? 'bg-blue-50/90 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-semibold shadow-2xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-blue-600 dark:before:bg-blue-400 before:rounded-r'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0',
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'
                  )}
                />
                <span className="truncate flex-1">{tab.label}</span>
                {isComplete ? (
                  <span title={tx('Bagian sudah terisi')} className="shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </span>
                ) : (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0"
                    title={tx('Belum terisi')}
                  />
                )}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ============================================================ */}
      {/* MOBILE / TABLET (< 1024px): Horizontal Row Navigation        */}
      {/* ============================================================ */}
      <div className="lg:hidden flex flex-col border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
        {/* Top Header: Progress & Menu Dialog Button */}
        <div className="px-3 py-2 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-900/30">
          <div className="flex items-center gap-2.5">
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-zinc-900 dark:text-white">{filledCount} / {localizedTabs.length}</span> {t.editor.itemsFilled}
            </div>
            <div className="w-14 bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
                style={{ width: `${(filledCount / localizedTabs.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Dialog: Daftar Semua Bagian */}
          <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5 px-2.5 font-medium border-zinc-200 dark:border-zinc-800"
                aria-label={t.editor.allSections}
              >
                <LayoutList className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t.editor.allSections}</span>
                <Badge variant="secondary" className="h-4 px-1 text-[10px] ml-0.5">
                  {localizedTabs.length}
                </Badge>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm p-5 sm:rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-base font-semibold">
                  {t.editor.sectionsList}
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-500">
                  {filledCount} / {localizedTabs.length} {t.editor.sectionsListDesc}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-1.5 mt-2 max-h-[60vh] overflow-y-auto pr-1">
                {localizedTabs.map((tab, idx) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isComplete = isTabFilled(tab.id, portfolio);
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all text-left motion-reduce:transition-none',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shadow-2xs'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 border border-transparent'
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center shrink-0',
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="font-medium truncate">{tab.label}</p>
                          <p className="text-[10px] text-zinc-400">{t.editor.sectionNumber} {idx + 1}</p>
                        </div>
                      </div>
                      {isComplete ? (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-900 shrink-0 gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{tx('Terisi')}</span>
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[10px] text-zinc-400 border-zinc-200 dark:border-zinc-800 shrink-0"
                        >
                          {tx('Kosong')}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Horizontal Tab Bar with Left/Right Arrows and Edge Fades */}
        <div className="relative flex items-center px-1 py-1.5 bg-zinc-50/40 dark:bg-zinc-900/20">
          {/* Tombol Panah Kiri */}
          <button
            type="button"
            onClick={() => scrollTabs('left')}
            disabled={!canScrollLeft}
            aria-label={tx('Geser tab ke kiri')}
            className={cn(
              'h-8 w-8 flex items-center justify-center shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-opacity z-20 motion-reduce:transition-none',
              canScrollLeft ? 'opacity-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800' : 'opacity-20 cursor-not-allowed'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Gradasi Fade Kiri (pointer-events-none agar tidak menghalangi klik) */}
          <div
            className={cn(
              'pointer-events-none absolute left-9 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-50 dark:from-zinc-900 to-transparent transition-opacity duration-200 z-10 motion-reduce:transition-none',
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden="true"
          />

          {/* Scrollable horizontal tabs list */}
          <div
            ref={tabsScrollRef}
            role="tablist"
            aria-orientation="horizontal"
            className="flex-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1"
          >
            {localizedTabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isComplete = isTabFilled(tab.id, portfolio);
              return (
                <button
                  key={tab.id}
                  ref={isActive ? activeMobileTabRef : null}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  id={`mobile-tab-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx, false)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 motion-reduce:transition-none',
                    isActive
                      ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
                  )}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                  {isComplete ? (
                    <span title={tx('Terisi')} className="shrink-0 flex items-center">
                      <CheckCircle2
                        className={cn(
                          'w-3 h-3 shrink-0',
                          isActive ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'
                        )}
                      />
                    </span>
                  ) : (
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full shrink-0',
                        isActive ? 'bg-blue-300' : 'bg-zinc-300 dark:bg-zinc-700'
                      )}
                      title={tx('Belum terisi')}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Gradasi Fade Kanan (pointer-events-none agar tidak menghalangi klik) */}
          <div
            className={cn(
              'pointer-events-none absolute right-9 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-50 dark:from-zinc-900 to-transparent transition-opacity duration-200 z-10 motion-reduce:transition-none',
              canScrollRight ? 'opacity-100' : 'opacity-0'
            )}
            aria-hidden="true"
          />

          {/* Tombol Panah Kanan */}
          <button
            type="button"
            onClick={() => scrollTabs('right')}
            disabled={!canScrollRight}
            aria-label={tx('Geser tab ke kanan')}
            className={cn(
              'h-8 w-8 flex items-center justify-center shrink-0 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-opacity z-20 motion-reduce:transition-none',
              canScrollRight ? 'opacity-100 hover:bg-zinc-200/60 dark:hover:bg-zinc-800' : 'opacity-20 cursor-not-allowed'
            )}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* FORM TAB CONTENT & NAVIGATION FOOTER                         */}
      {/* ============================================================ */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
        tabIndex={0}
        className="flex-1 flex flex-col min-w-0 lg:min-w-[420px] overflow-y-auto bg-white dark:bg-zinc-950 focus:outline-none"
      >
        <div className="flex-1 p-4 sm:p-6 space-y-6">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'about' && <AboutTab />}
          {activeTab === 'experience' && <ExperienceTab />}
          {activeTab === 'education' && <EducationTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'certifications' && <CertificationsTab />}
          {activeTab === 'testimonials' && <TestimonialsTab />}
          {activeTab === 'contact' && <ContactTab />}
          {activeTab === 'appearance' && <AppearanceTab />}

          {/* Navigasi Bawah: Lanjut ke [nama tab berikutnya] & Kembali */}
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6 mt-8 flex flex-wrap items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => prevTab && setActiveTab(prevTab.id)}
              disabled={!prevTab}
              className="text-xs h-9 gap-1.5"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{t.editor.prev}</span>
            </Button>

            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
              {t.editor.sectionNumber} {currentIndex + 1} / {localizedTabs.length}:{' '}
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {currentTab?.label}
              </span>
            </div>

            {nextTab ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setActiveTab(nextTab.id)}
                className="text-xs h-9 gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-2xs"
              >
                <span>{t.editor.next} {nextTab.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.success(
                    tx(language === 'en'
                      ? 'All 10 portfolio sections configured!'
                      : 'Semua 10 bagian portofolio telah selesai dikonfigurasi!')
                  );
                }}
                className="text-xs h-9 gap-1.5 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.editor.allDone}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
