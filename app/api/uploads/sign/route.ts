import { NextRequest, NextResponse } from 'next/server';
import { getStorageProvider } from '../../../../lib/adapters/storage';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, any>;
    const { projectId, fileName, fileType, fileSizeBytes, purpose } = body;

    if (!fileName || !fileType || !purpose) {
      return NextResponse.json({ error: 'Missing required file upload parameters' }, { status: 400 });
    }

    const storage = getStorageProvider();
    const signedTicket = await storage.createSignedUploadUrl({
      projectId: projectId || 'proj_active',
      fileName,
      fileType,
      fileSizeBytes: fileSizeBytes || 1024,
      purpose,
      expiresInSeconds: 900,
    });

    return NextResponse.json(signedTicket);
  } catch (error: any) {
    console.error('Upload signing error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to sign upload' }, { status: 500 });
  }
}
