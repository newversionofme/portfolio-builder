import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { IStorageProvider, UploadResult } from './types';

export const DEFAULT_MAX_SIZE = 2 * 1024 * 1024; // 2 MB
export const DEFAULT_ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export class LocalStorageProvider implements IStorageProvider {
  private uploadDir: string;
  private publicPath: string;
  private maxSizeBytes: number;
  private allowedTypes: string[];

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    this.publicPath = '/uploads';
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

    // Ensure uploads directory exists
    await fs.mkdir(this.uploadDir, { recursive: true });

    // Generate unique safe filename
    const ext = path.extname(originalName) || `.${mimeType.split('/')[1] || 'jpg'}`;
    const randomHash = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    const safeBaseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    const finalFilename = `${safeBaseName}-${timestamp}-${randomHash}${ext}`;

    const filePath = path.join(this.uploadDir, finalFilename);
    await fs.writeFile(filePath, buffer);

    return {
      url: `${this.publicPath}/${finalFilename}`,
      filename: finalFilename,
      size: buffer.length,
      mimeType,
    };
  }

  async delete(fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl.startsWith(this.publicPath)) {
        return false;
      }
      const filename = path.basename(fileUrl);
      const filePath = path.join(this.uploadDir, filename);
      await fs.unlink(filePath);
      return true;
    } catch {
      return false;
    }
  }
}
