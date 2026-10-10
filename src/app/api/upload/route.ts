import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { auth } from '@/lib/auth/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Harap login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'Tidak ada file yang diunggah.' },
        { status: 400 }
      );
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate and save file via StorageProvider abstraction
    const result = await storage.upload(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengunggah file.';
    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}
