// Private Storage Provider with Short-Lived Signed URLs
// Strictly enforces private biometric asset policies (Likeness photos & Voice samples)

export interface SignedUploadUrlParams {
  projectId: string;
  userId?: string;
  fileName: string;
  fileType: 'image/jpeg' | 'image/png' | 'image/webp' | 'audio/wav' | 'audio/mp3' | 'audio/m4a';
  fileSizeBytes: number;
  purpose: 'likeness_photo' | 'voice_sample' | 'brand_asset' | 'script_doc';
  expiresInSeconds?: number;
}

export interface SignedUploadResult {
  uploadUrl: string;
  storagePath: string;
  expiresAt: string;
  headers: Record<string, string>;
  isMock?: boolean;
}

export interface StorageProvider {
  createSignedUploadUrl(params: SignedUploadUrlParams): Promise<SignedUploadResult>;
  createSignedDownloadUrl(storagePath: string, expiresInSeconds?: number): Promise<string>;
  deleteAsset(storagePath: string): Promise<boolean>;
}

export class MockStorageProvider implements StorageProvider {
  async createSignedUploadUrl(params: SignedUploadUrlParams): Promise<SignedUploadResult> {
    const expiresSeconds = params.expiresInSeconds || 900; // 15 mins default
    const expiresAt = new Date(Date.now() + expiresSeconds * 1000).toISOString();
    const cleanName = params.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `private/${params.projectId}/${params.purpose}/${Date.now()}_${cleanName}`;

    return {
      uploadUrl: `/api/uploads/mock-upload?path=${encodeURIComponent(storagePath)}&token=mock_${Date.now()}`,
      storagePath,
      expiresAt,
      headers: {
        'Content-Type': params.fileType,
        'x-amz-server-side-encryption': 'AES256',
      },
      isMock: true,
    };
  }

  async createSignedDownloadUrl(storagePath: string, expiresInSeconds = 300): Promise<string> {
    return `/api/uploads/mock-download?path=${encodeURIComponent(storagePath)}&expires=${Date.now() + expiresInSeconds * 1000}`;
  }

  async deleteAsset(storagePath: string): Promise<boolean> {
    console.log(`[Storage] Deleted private asset at: ${storagePath}`);
    return true;
  }
}

export function getStorageProvider(): StorageProvider {
  return new MockStorageProvider();
}

// Client-side file validation guard
export function validateUploadFile(file: File, purpose: 'likeness_photo' | 'voice_sample'): { valid: boolean; error?: string } {
  const maxImageSize = 15 * 1024 * 1024; // 15MB
  const maxAudioSize = 30 * 1024 * 1024; // 30MB

  if (purpose === 'likeness_photo') {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload JPG, PNG, or WebP images only.' };
    }
    if (file.size > maxImageSize) {
      return { valid: false, error: 'Image file size exceeds maximum limit of 15MB.' };
    }
  } else if (purpose === 'voice_sample') {
    const validAudioTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/x-m4a'];
    if (!validAudioTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload clean WAV, MP3, or M4A audio files only.' };
    }
    if (file.size > maxAudioSize) {
      return { valid: false, error: 'Audio file size exceeds maximum limit of 30MB.' };
    }
  }

  return { valid: true };
}
