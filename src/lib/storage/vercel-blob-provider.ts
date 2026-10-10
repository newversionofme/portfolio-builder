import { put, del } from '@vercel/blob';
import path from 'path';
import crypto from 'crypto';
import { IStorageProvider, UploadResult } from './types';
import { DEFAULT_MAX_SIZE, DEFAULT_ALLOWED_MIME_TYPES } from './local-provider';

export class VercelBlobStorageProvider implements IStorageProvider {
  private maxSizeBytes: number;
  private allowedTypes: string[];

  constructor() {
    this.maxSizeBytes = process.env.UPLOAD_MAX_FILE_SIZE_MB
      ? parseFloat(process.env.UPLOAD_MAX_FILE_SIZE_MB) * 1024 * 1024
      : DEFAULT_MAX_SIZE;
    this.allowedTypes = process.env.UPLOAD_ALLOWED_TYPES
      ? process.env.UPLOAD_ALLOWED_TYPES.split(',').map((t) => t.trim())
      : DEFAULT_ALLOWED_MIME_TYPES;
  }

  validate(fileSize: number, mimeType: string): { valid: boolean; error?: string } {
    if (!this.allowedTypes.includes(mimeType)) {
      return {
        valid: false,
        error: `Format file tidak didukung (${mimeType}). Hanya file JPG, PNG, dan WebP yang diizinkan.`,
      };
    }

    if (fileSize > this.maxSizeBytes) {
      const maxMb = this.maxSizeBytes / (1024 * 1024);
      return {
        valid: false,
        error: `Ukuran file terlalu besar (${(fileSize / (1024 * 1024)).toFixed(2)} MB). Maksimal ukuran file adalah ${maxMb} MB.`,
      };
    }

    return { valid: true };
  }

  async upload(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResult> {
    const validation = this.validate(buffer.length, mimeType);
    if (!validation.valid) {
      throw new Error(validation.error || 'Validasi file gagal');
    }

    // Generate unique safe filename
    const ext = path.extname(originalName) || `.${mimeType.split('/')[1] || 'jpg'}`;
    const randomHash = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const safeBaseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const finalFilename = `uploads/${safeBaseName}-${timestamp}-${randomHash}${ext}`;

    const blob = await put(finalFilename, buffer, {
      access: 'public',
      contentType: mimeType,
    });

    return {
      url: blob.url,
      filename: finalFilename,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith('http://') && !fileUrl.startsWith('https://')) {
        return false;
      }
      await del(fileUrl);
      return true;
    } catch {
      return false;
    }
  }
}
