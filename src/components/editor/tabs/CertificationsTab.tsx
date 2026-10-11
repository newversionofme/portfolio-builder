'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { CertificationData, certificationSchema } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Award } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog';
import { ListItemActions } from '../common/ListItemActions';

const emptyCert: CertificationData = {
  title: '',
  issuer: '',
  issueDate: '',
  expiryDate: '',
  credentialId: '',
  credentialUrl: '',
  order: 0,
};

export function CertificationsTab() {
  const {
    portfolio,
    addCertification,
    updateCertification,
    removeCertification,
    moveItem,
  } = usePortfolioStore();
  const certifications = portfolio.certifications || [];

  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [localCert, setLocalCert] = useState<CertificationData>(emptyCert);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    title: string;
  } | null>(null);

  const startAdd = () => {
    setEditingIndex(null);
    setIsAdding(true);
    setLocalCert({
      ...emptyCert,
      order: certifications.length,
    });
    setErrors({});
  };

  const startEdit = (index: number) => {
    setIsAdding(false);
    setEditingIndex(index);
    setLocalCert({ ...certifications[index] });
    setErrors({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingIndex(null);
    setLocalCert(emptyCert);
    setErrors({});
  };

  const handleSave = () => {
    const validation = certificationSchema.safeParse(localCert);
    const newErrors: Record<string, string> = {};

    if (!localCert.title.trim()) {
      newErrors.title = 'Nama sertifikasi wajib diisi';
    }
    if (!localCert.issuer.trim()) {
      newErrors.issuer = 'Organisasi penerbit wajib diisi';
    }
    if (!localCert.issueDate.trim()) {
      newErrors.issueDate = 'Tanggal terbit wajib diisi';
    }

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const fieldName = String(issue.path[0] || 'title');
        newErrors[fieldName] = issue.message;
      });
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Silakan lengkapi kolom sertifikat yang wajib diisi');
      return;
    }

    if (editingIndex !== null) {
      updateCertification(editingIndex, localCert);
      toast.success(`Sertifikat "${localCert.title}" berhasil diperbarui!`);
    } else {
      addCertification(localCert);
      toast.success(`Sertifikat "${localCert.title}" berhasil ditambahkan!`);
    }

    handleCancel();
  };

  const handleDeleteConfirmed = () => {
    if (!deleteTarget) return;
    const { index, title } = deleteTarget;

    if (editingIndex === index) {
      handleCancel();
    } else if (editingIndex !== null && editingIndex > index) {
      setEditingIndex(editingIndex - 1);
    }

    removeCertification(index);
    toast.success(`Sertifikat "${title}" berhasil dihapus.`);
    setDeleteTarget(null);
  };

  const isFormOpen = isAdding || editingIndex !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Sertifikasi & Lisensi
          </h3>
          <p className="text-xs text-zinc-500">
            Sertifikat resmi dari AWS, Google, Meta, Coursera, dll.
          </p>
        </div>

        {!isFormOpen && (
          <Button
            size="sm"
            onClick={startAdd}
            className="gap-1.5 h-9 min-h-[38px] text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sertifikat</span>
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {editingIndex !== null ? 'Edit Sertifikasi' : 'Tambah Sertifikasi Baru'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                onClick={handleCancel}
              >
                Batal
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cert-title" className="text-xs">
                  Nama Sertifikasi *
                </Label>
                <Input
                  id="cert-title"
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={localCert.title}
                  onChange={(e) => {
                    setLocalCert({ ...localCert, title: e.target.value });
                    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
                  }}
                  className={errors.title ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-[11px] text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cert-issuer" className="text-xs">
                  Organisasi Penerbit *
                </Label>
                <Input
                  id="cert-issuer"
                  placeholder="e.g. Amazon Web Services"
                  value={localCert.issuer}
                  onChange={(e) => {
                    setLocalCert({ ...localCert, issuer: e.target.value });
                    if (errors.issuer) setErrors((prev) => ({ ...prev, issuer: '' }));
                  }}
                  className={errors.issuer ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.issuer && (
                  <p className="text-[11px] text-red-500">{errors.issuer}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cert-issuedate" className="text-xs">
                  Tanggal Terbit *
                </Label>
                <Input
                  id="cert-issuedate"
                  type="month"
                  value={localCert.issueDate}
                  onChange={(e) => {
                    setLocalCert({ ...localCert, issueDate: e.target.value });
                    if (errors.issueDate) setErrors((prev) => ({ ...prev, issueDate: '' }));
                  }}
                  className={errors.issueDate ? 'border-red-500 focus-visible:ring-red-500' : ''}
                />
                {errors.issueDate && (
                  <p className="text-[11px] text-red-500">{errors.issueDate}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cert-expirydate" className="text-xs">
                  Tanggal Kedaluwarsa (Opsional)
                </Label>
                <Input
                  id="cert-expirydate"
                  type="month"
                  value={localCert.expiryDate || ''}
                  onChange={(e) =>
                    setLocalCert({ ...localCert, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cert-credid" className="text-xs">
                  Credential ID
                </Label>
                <Input
                  id="cert-credid"
                  placeholder="e.g. AWS-12345"
                  value={localCert.credentialId || ''}
                  onChange={(e) =>
                    setLocalCert({ ...localCert, credentialId: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cert-credurl" className="text-xs">
                  Link Verifikasi Sertifikat
                </Label>
                <Input
                  id="cert-credurl"
                  placeholder="https://verify.cert.com/..."
                  value={localCert.credentialUrl || ''}
                  onChange={(e) =>
                    setLocalCert({ ...localCert, credentialUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 min-h-[38px] text-xs"
                onClick={handleCancel}
              >
                Batal
              </Button>
              <Button
                size="sm"
                className="h-9 min-h-[38px] bg-blue-600 hover:bg-blue-700 text-xs px-5"
                onClick={handleSave}
              >
                {editingIndex !== null ? 'Simpan Perubahan' : 'Simpan Sertifikat'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {certifications.length === 0 && !isFormOpen && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs space-y-2">
            <p>Belum ada sertifikasi yang ditambahkan.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={startAdd}
              className="gap-1.5 h-8 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Sertifikasi Pertama</span>
            </Button>
          </div>
        )}

        {certifications.map((cert, idx) => (
          <div
            key={cert.id || idx}
            className={`p-4 rounded-xl border bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 shadow-2xs transition-all ${
              editingIndex === idx
                ? 'border-blue-500 ring-2 ring-blue-500/20'
                : 'border-zinc-200 dark:border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
                  {cert.title}
                </h4>
                <p className="text-xs text-zinc-500 truncate">
                  {cert.issuer} • {cert.issueDate}
                  {cert.expiryDate && ` — ${cert.expiryDate}`}
                </p>
              </div>
            </div>

            <ListItemActions
              onMoveUp={() => moveItem('certifications', idx, 'up')}
              onMoveDown={() => moveItem('certifications', idx, 'down')}
              isFirst={idx === 0}
              isLast={idx === certifications.length - 1}
              onEdit={() => startEdit(idx)}
              onDelete={() =>
                setDeleteTarget({
                  index: idx,
                  title: cert.title,
                })
              }
            />
          </div>
        ))}
      </div>

      <ConfirmDeleteDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        itemName={deleteTarget?.title || ''}
        itemType="sertifikat"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  );
}
