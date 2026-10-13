'use client';

import { create } from 'zustand';

interface ExportModalStore {
  isCvModalOpen: boolean;
  isShareCardModalOpen: boolean;
  isFullPageModalOpen: boolean;
  openCvModal: () => void;
  closeCvModal: () => void;
  setCvModalOpen: (open: boolean) => void;
  openShareCardModal: () => void;
  closeShareCardModal: () => void;
  setShareCardModalOpen: (open: boolean) => void;
  openFullPageModal: () => void;
  closeFullPageModal: () => void;
  setFullPageModalOpen: (open: boolean) => void;
}

export const useExportModalStore = create<ExportModalStore>((set) => ({
  isCvModalOpen: false,
  isShareCardModalOpen: false,
  isFullPageModalOpen: false,
  openCvModal: () => set({ isCvModalOpen: true }),
  closeCvModal: () => set({ isCvModalOpen: false }),
  setCvModalOpen: (open: boolean) => set({ isCvModalOpen: open }),
  openShareCardModal: () => set({ isShareCardModalOpen: true }),
  closeShareCardModal: () => set({ isShareCardModalOpen: false }),
  setShareCardModalOpen: (open: boolean) => set({ isShareCardModalOpen: open }),
  openFullPageModal: () => set({ isFullPageModalOpen: true }),
  closeFullPageModal: () => set({ isFullPageModalOpen: false }),
  setFullPageModalOpen: (open: boolean) => set({ isFullPageModalOpen: open }),
}));
