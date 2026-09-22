import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateUploadFile } from '../../lib/adapters/storage';

describe('Biometric Media Validation Guard', () => {
  it('should accept valid JPEG/PNG photos under 15MB', () => {
    const mockFile = {
      name: 'portrait.jpg',
      type: 'image/jpeg',
      size: 5 * 1024 * 1024,
    } as unknown as File;

    const result = validateUploadFile(mockFile, 'likeness_photo');
    assert.equal(result.valid, true);
  });

  it('should reject non-image files uploaded as likeness photo', () => {
    const mockFile = {
      name: 'document.pdf',
      type: 'application/pdf',
      size: 1 * 1024 * 1024,
    } as unknown as File;

    const result = validateUploadFile(mockFile, 'likeness_photo');
    assert.equal(result.valid, false);
    assert.ok(result.error?.includes('JPG, PNG, or WebP'));
  });

  it('should accept clean WAV audio for voice samples under 30MB', () => {
    const mockFile = {
      name: 'voice_sample.wav',
      type: 'audio/wav',
      size: 10 * 1024 * 1024,
    } as unknown as File;

    const result = validateUploadFile(mockFile, 'voice_sample');
    assert.equal(result.valid, true);
  });
});
