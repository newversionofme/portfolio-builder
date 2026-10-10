import { IStorageProvider } from './types';
import { LocalStorageProvider } from './local-provider';
import { VercelBlobStorageProvider } from './vercel-blob-provider';

// Factory to resolve storage provider based on environment
function createStorageProvider(): IStorageProvider {
  const provider = (process.env.STORAGE_PROVIDER || '').toLowerCase();
  const isProduction = process.env.NODE_ENV === 'production';
  const hasBlobToken = !!process.env.BLOB_READ_WRITE_TOKEN;

  // Use Vercel Blob if explicitly selected or in production with Blob Token
  if (provider === 'blob' || provider === 'vercel-blob' || (isProduction && hasBlobToken)) {
    return new VercelBlobStorageProvider();
  }

  return new LocalStorageProvider();
}

export const storage: IStorageProvider = createStorageProvider();
export * from './types';
export * from './local-provider';
export * from './vercel-blob-provider';

