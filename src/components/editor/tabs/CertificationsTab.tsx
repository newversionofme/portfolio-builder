'use client';

import React, { useState } from 'react';
import { usePortfolioStore } from '@/lib/store/portfolio-store';
import { CertificationData } from '@/lib/validations/portfolio';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Award } from 'lucide-react';

export function CertificationsTab() {
  const { portfolio, addCertification, removeCertification } =
    usePortfolioStore();
  const certifications = portfolio.certifications || [];

  const [isAdding, setIsAdding] = useState(false);
  const [newCert, setNewCert] = useState<CertificationData>({
    title: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    order: certifications.length,
  });

  const handleCreate = () => {
    if (!newCert.title || !newCert.issuer || !newCert.issueDate) return;
    addCertification(newCert);
    setNewCert({
      title: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      order: certifications.length + 1,
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white">
            Sertifikasi & Lisensi
          </h3>
          <p className="text-xs text-zinc-500">
            Sertifikat resmi dari AWS, Google, Meta, Coursera, dll.
          </p>
        </div>

        {!isAdding && (
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sertifikat</span>
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20">
          <CardContent className="p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                Tambah Sertifikasi Baru
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setIsAdding(false)}
              >
                Batal
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Nama Sertifikasi *</Label>
                <Input
                  placeholder="e.g. AWS Certified Solutions Architect"
                  value={newCert.title}
                  onChange={(e) =>
                    setNewCert({ ...newCert, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Organisasi Penerbit *</Label>
                <Input
                  placeholder="e.g. Amazon Web Services"
                  value={newCert.issuer}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issuer: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Tanggal Terbit *</Label>
                <Input
                  type="month"
                  value={newCert.issueDate}
                  onChange={(e) =>
                    setNewCert({ ...newCert, issueDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Tanggal Kedaluwarsa (Opsional)</Label>
                <Input
                  type="month"
                  value={newCert.expiryDate || ''}
                  onChange={(e) =>
                    setNewCert({ ...newCert, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Credential ID</Label>
                <Input
                  placeholder="e.g. AWS-12345"
                  value={newCert.credentialId || ''}
                  onChange={(e) =>
                    setNewCert({ ...newCert, credentialId: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Link Verifikasi Sertifikat</Label>
                <Input
                  placeholder="https://verify.cert.com/..."
                  value={newCert.credentialUrl || ''}
                  onChange={(e) =>
                    setNewCert({ ...newCert, credentialUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleCreate}
              disabled={!newCert.title || !newCert.issuer || !newCert.issueDate}
            >
              Simpan Sertifikat
            </Button>
          </CardContent>
        </Card>
      )}

      {/* List */}
      <div className="space-y-3">
        {certifications.length === 0 && !isAdding && (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-400 text-xs">
            Belum ada sertifikasi.
          </div>
        )}

        {certifications.map((cert, idx) => (
          <div
            key={cert.id || idx}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {cert.title}
                </h4>
                <p className="text-xs text-zinc-500">
                  {cert.issuer} • {cert.issueDate}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-zinc-400 hover:text-red-600"
              onClick={() => removeCertification(idx)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
