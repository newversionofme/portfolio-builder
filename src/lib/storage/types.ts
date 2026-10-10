export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface FileValidationOptions {
  maxSizeInBytes: number;
  allowedMimeTypes: string[];
}

export interface IStorageProvider {
  upload(
    buffer: Buffer,
    originalName: string,
    mimeType: string
  ): Promise<UploadResult>;
  
  delete(fileUrl: string): Promise<boolean>;
  
  validate(
    fileSize: number,
    mimeType: string
  ): { valid: boolean; error?: string };
}
