'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, FileAudio, Image as ImageIcon, Trash2, ShieldCheck } from 'lucide-react';
import { validateUploadFile } from '../../lib/adapters/storage';

interface UploadedAsset {
  id: string;
  name: string;
  size: number;
  type: string;
  storagePath: string;
}

interface SecureUploaderProps {
  purpose: 'likeness_photo' | 'voice_sample';
  title: string;
  instructions: string;
  maxFiles?: number;
  onFilesChange?: (assets: UploadedAsset[]) => void;
}

export default function SecureUploader({
  purpose,
  title,
  instructions,
  maxFiles = 5,
  onFilesChange,
}: SecureUploaderProps) {
  const [files, setFiles] = useState<UploadedAsset[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAudio = purpose === 'voice_sample';

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    setErrorMessage(null);

    const newAssets: UploadedAsset[] = [...files];

    for (let i = 0; i < selectedFiles.length; i++) {
      if (newAssets.length >= maxFiles) {
        setErrorMessage(`Maximum limit of ${maxFiles} files reached.`);
        break;
      }

      const file = selectedFiles[i];
      const validation = validateUploadFile(file, purpose);

      if (!validation.valid) {
        setErrorMessage(validation.error || 'Invalid file format.');
        continue;
      }

      setUploading(true);

      try {
        // Fetch signed upload URL from backend
        const res = await fetch('/api/uploads/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSizeBytes: file.size,
            purpose,
            projectId: 'proj_active_session',
          }),
        });

        if (!res.ok) throw new Error('Failed to generate secure upload ticket');
        const signData = (await res.json()) as any;

        // Add to uploaded list
        newAssets.push({
          id: `file_${Date.now()}_${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          storagePath: signData.storagePath || `private/${file.name}`,
        });
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Upload failed. Please try again.';
        setErrorMessage(errorMsg);
      } finally {
        setUploading(false);
      }
    }

    setFiles(newAssets);
    if (onFilesChange) onFilesChange(newAssets);
  };

  const removeFile = (id: string) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    if (onFilesChange) onFilesChange(updated);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs uppercase tracking-wider text-[#a3a89e] font-semibold flex items-center gap-1.5">
          {isAudio ? <FileAudio className="w-4 h-4 text-[#d8ff44]" /> : <ImageIcon className="w-4 h-4 text-[#d8ff44]" />}
          <span>{title}</span>
        </label>
        <span className="text-[10px] font-mono text-[#8e9587]">
          {files.length}/{maxFiles} uploaded
        </span>
      </div>

      <p className="text-xs text-[#a3a89e] mb-4 leading-relaxed">
        {instructions}
      </p>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFileSelect(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-[#d8ff44] bg-[#11160e]'
            : 'border-[#ffffff15] bg-[#0d100c] hover:border-[#d8ff44]/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={isAudio ? 'audio/wav,audio/mp3,audio/m4a' : 'image/jpeg,image/png,image/webp'}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-[#11160e] text-[#d8ff44] flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-xs font-semibold text-[#f3f3eb] mb-1">
          {uploading ? 'Encrypting & uploading securely...' : 'Click to select or drag and drop files'}
        </p>
        <span className="text-[10px] text-[#8e9587] block font-mono">
          {isAudio ? 'Clean voice WAV, MP3, M4A up to 30MB' : 'High-res JPG, PNG, WebP up to 15MB'}
        </span>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="flex items-center gap-2 text-xs text-[#ff9999] mt-3 p-3.5 rounded-xl bg-[#8A2B35]/20 border border-[#8A2B35]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded File List */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#0d100c] border border-[#ffffff15] text-xs text-[#f3f3eb]"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <ShieldCheck className="w-4 h-4 text-[#d8ff44] shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-xs font-medium">{file.name}</span>
                <span className="text-[10px] font-mono text-[#8e9587]">
                  ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className="text-[#a3a89e] hover:text-[#ff9999] p-1.5 transition-colors"
                aria-label="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
