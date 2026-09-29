import React, { useState, useRef } from 'react';
import { UploadCloud, Film, Image as ImageIcon, Loader2, Check, AlertCircle } from 'lucide-react';
import { MediaUploadService } from '../../services/mediaUpload';
import { MediaLibraryItem } from '../../types';

interface FileUploadDropzoneProps {
  onUploadSuccess: (item: MediaLibraryItem) => void;
  accept?: 'image' | 'video' | 'both';
  label?: string;
  category?: string;
  className?: string;
  compact?: boolean;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  onUploadSuccess,
  accept = 'both',
  label,
  category = 'Uploads',
  className = '',
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptMime =
    accept === 'image'
      ? 'image/*'
      : accept === 'video'
      ? 'video/*'
      : 'image/*,video/*';

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Check type restriction if specified
    if (accept === 'image' && !file.type.startsWith('image/')) {
      setUploadError('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }
    if (accept === 'video' && !file.type.startsWith('video/')) {
      setUploadError('Please select a video file (MP4, WebM, MOV, etc.)');
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setSuccessName(null);

    try {
      const item = await MediaUploadService.processUpload(file, file.name, category);
      setSuccessName(`${file.name} (${MediaUploadService.formatBytes(file.size)})`);
      onUploadSuccess(item);
      setTimeout(() => setSuccessName(null), 3500);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err?.message || 'Failed to process and store media file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (compact) {
    return (
      <div className={`relative ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptMime}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white hover:bg-[#f4f1ea] text-[#18181b] border border-[#ded7cc] rounded transition-colors shadow-sm disabled:opacity-50 font-medium"
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-[#877158]" />
          ) : accept === 'video' ? (
            <Film className="h-3.5 w-3.5 text-amber-600" />
          ) : (
            <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
          )}
          <span>{isUploading ? 'Uploading...' : label || 'Upload File'}</span>
        </button>
        {uploadError && <p className="text-[11px] text-red-600 font-medium mt-1">{uploadError}</p>}
        {successName && (
          <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
            <Check className="h-3 w-3" /> Uploaded {successName}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-emerald-600 bg-emerald-50'
          : 'border-[#ded7cc] hover:border-[#18181b] bg-[#faf8f5]'
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMime}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
        {isUploading ? (
          <Loader2 className="h-8 w-8 text-[#877158] animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-white border border-[#ded7cc] flex items-center justify-center text-[#18181b] shadow-sm">
              <UploadCloud className="h-5 w-5 text-[#524d45]" />
            </div>
            {accept === 'video' ? (
              <Film className="h-4 w-4 text-amber-600" />
            ) : accept === 'image' ? (
              <ImageIcon className="h-4 w-4 text-emerald-600" />
            ) : (
              <div className="flex gap-1">
                <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
                <Film className="h-3.5 w-3.5 text-amber-600" />
              </div>
            )}
          </div>
        )}

        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-[#18181b]">
            {isUploading
              ? 'Processing and uploading file...'
              : label || 'Drop Image or Video here, or click to browse'}
          </p>
          <p className="text-[11px] text-[#787268]">
            Supports high-resolution PNG, JPG, WebP images, and MP4 / WebM video reels
          </p>
        </div>

        {uploadError && (
          <div className="flex items-center gap-1 text-[11px] text-red-600 font-medium mt-2">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>{uploadError}</span>
          </div>
        )}

        {successName && (
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium mt-2">
            <Check className="h-3.5 w-3.5" />
            <span>Successfully uploaded {successName}</span>
          </div>
        )}
      </div>
    </div>
  );
};
