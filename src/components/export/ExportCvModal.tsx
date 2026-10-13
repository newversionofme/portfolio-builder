'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { getDictionary, SupportedLanguage } from '@/lib/i18n/dictionary';
import { sanitizePdfFilename } from '@/lib/pdf/sanitize-pdf-text';
import { imageToDataUri } from '@/lib/pdf/image-to-data-uri';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ExportCvModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ExportCvModal({
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ExportCvModalProps) {
  const { portfolio } = usePortfolioStore();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;
  const [includeAvatar, setIncludeAvatar] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const language = (portfolio.language || 'id') as SupportedLanguage;
  const t = getDictionary(language);

  const hasAvatar = !!portfolio.profile?.avatarUrl;

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      // 1. Process avatar if enabled
      let avatarDataUri: string | null = null;
      if (includeAvatar && hasAvatar) {
        avatarDataUri = await imageToDataUri(portfolio.profile?.avatarUrl);
      }

      // 2. Dynamic import @react-pdf/renderer and CvPdfDocument
      const { pdf } = await import('@react-pdf/renderer');
      const { CvPdfDocument } = await import('./CvPdfDocument');

      // Resolve origin/domain for full URL links in CV
      const appDomain =
        typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'https://portfolio-builder.com';

      // 3. Render PDF blob on client
      const docElement = (
        <CvPdfDocument
          portfolio={portfolio}
          language={language}
          avatarDataUri={avatarDataUri}
          appDomain={appDomain}
        />
      );

      const blob = await pdf(docElement).toBlob();

      // 4. Trigger download with sanitized filename
      const filename = sanitizePdfFilename(
        portfolio.profile?.fullName,
        portfolio.slug
      );

      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      setTimeout(() => {
        URL.revokeObjectURL(downloadUrl);
      }, 5000);

      toast.success(
        language === 'en'
          ? 'CV (PDF) successfully generated and downloaded!'
          : 'CV (PDF) berhasil dibuat dan diunduh!'
      );
      setOpen(false);
    } catch (err) {
      console.error('[ExportCvModal] PDF generation failed:', err);
      toast.error(
        language === 'en'
          ? 'Failed to generate PDF. Please try again.'
          : 'Gagal membuat dokumen PDF. Silakan coba lagi.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {(trigger || controlledOpen === undefined) && (
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              size="sm"
              className="h-10 sm:h-8 px-3 text-xs gap-1.5 cursor-pointer font-medium min-h-[40px] sm:min-h-[32px]"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t.cvExport.downloadCv}</span>
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
            <FileText className="w-5 h-5" />
          </div>
          <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-white">
            {t.cvExport.downloadCv}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-500">
            {language === 'en'
              ? 'Generate an ATS-friendly A4 curriculum vitae based on your portfolio data.'
              : 'Buat dokumen kurikulum vitae format A4 berbasis teks vektor yang ramah sistem pelacak pelamar (ATS).'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Document Summary Info */}
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">
                {language === 'en' ? 'Document Format:' : 'Format Dokumen:'}
              </span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                PDF (A4 595 × 842 pt, Selectable Text)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">
                {language === 'en' ? 'Language:' : 'Bahasa Dokumen:'}
              </span>
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {language === 'en' ? 'English (en)' : 'Bahasa Indonesia (id)'}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">
                {language === 'en' ? 'ATS Compliance:' : 'Kepatuhan ATS:'}
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === 'en' ? 'ATS-Friendly Vector Text' : 'Teks Vektor Ramah ATS'}
              </span>
            </div>
          </div>

          {/* Toggle Include Profile Photo */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
            <div className="space-y-0.5">
              <Label
                htmlFor="include-avatar-switch"
                className="text-xs font-semibold cursor-pointer text-zinc-900 dark:text-white"
              >
                {t.cvExport.includeAvatar}
              </Label>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {t.cvExport.includeAvatarHelp}
              </p>
              {!hasAvatar && (
                <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {language === 'en'
                    ? 'No profile photo found in Profile tab.'
                    : 'Belum ada foto profil di tab Profil.'}
                </p>
              )}
            </div>
            <Switch
              id="include-avatar-switch"
              checked={includeAvatar}
              onCheckedChange={setIncludeAvatar}
              disabled={!hasAvatar}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isGenerating}
            className="text-xs min-h-[40px] sm:min-h-[36px]"
          >
            {language === 'en' ? 'Cancel' : 'Batal'}
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleDownload}
            disabled={isGenerating}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1.5 min-h-[40px] sm:min-h-[36px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.cvExport.downloading}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{t.cvExport.downloadCv}</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
