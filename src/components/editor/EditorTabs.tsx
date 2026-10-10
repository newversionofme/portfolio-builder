'use client';

import React, { useEffect, useRef } from 'react';
import { usePortfolioStore, getPortfolioComparableJson } from '@/lib/store/portfolio-store';
import { savePortfolio } from '@/actions/portfolio';
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
} from 'lucide-react';

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

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(false);
  const isSavingRef = useRef(false);
  const hasPendingSaveRef = useRef(false);
  const lastSavedPayloadRef = useRef<string>('');
  const lastManualTriggerRef = useRef<number>(manualSaveTrigger);

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
          error: 'Penyimpanan melebihi batas waktu (timeout 15 detik). Silakan coba lagi.',
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
        const errorMsg = res?.error || 'Gagal menyimpan perubahan.';
        console.error('[EditorTabs Save Failed]:', errorMsg);
        setSaveStatus('error', errorMsg);
        toast.error(`Autosave gagal: ${errorMsg}`);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Terjadi kendala jaringan saat menyimpan.';
      console.error('[EditorTabs Autosave Exception]:', err);
      setSaveStatus('error', errorMsg);
      toast.error(`Autosave error: ${errorMsg}`);
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
      // No actual content differences from last saved snapshot
      return;
    }

    // Set status to saving immediately when typing/modifying
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

  const tabs = [
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
  ];

  return (
    <div className="w-full lg:w-[460px] xl:w-[500px] border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col h-[calc(100vh-4rem)] shrink-0">
      {/* Horizontal Scrollable Tabs Bar */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-zinc-50/50 dark:bg-zinc-900/30 shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Form Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
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
      </div>
    </div>
  );
}
