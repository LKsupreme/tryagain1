import React, { useState } from 'react';
import {
  Edit3,
  UploadCloud,
  Settings,
  X,
  Check,
  Image as ImageIcon,
  Film,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { FileUploadDropzone } from '../admin/FileUploadDropzone';
import { MediaLibraryItem } from '../../types';

interface LiveEditToolbarProps {
  isAdmin: boolean;
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onNavigateToAdmin: () => void;
  onOpenContentEditor: () => void;
}

export const LiveEditToolbar: React.FC<LiveEditToolbarProps> = ({
  isAdmin,
  isEditMode,
  onToggleEditMode,
  onNavigateToAdmin,
  onOpenContentEditor,
}) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [recentUpload, setRecentUpload] = useState<MediaLibraryItem | null>(null);

  if (!isAdmin) return null;

  return (
    <>
      {/* Floating Admin Controls Bar at bottom-right */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#121216]/95 border border-[#2e2e38] text-white px-3 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-2 pr-2 border-r border-[#2b2b35]">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-sans font-medium text-[11px] text-[#e4e4e7]">Admin</span>
        </div>

        {/* Toggle Live Edit Text Mode */}
        <button
          onClick={onToggleEditMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors font-sans text-xs ${
            isEditMode
              ? 'bg-amber-500 text-black font-semibold'
              : 'bg-[#1e1e26] hover:bg-[#282834] text-[#d4d4d8]'
          }`}
          title="Toggle highlight on editable text and images across the website"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>{isEditMode ? 'Edit Mode: ON' : 'Edit Text'}</span>
        </button>

        {/* Quick Upload Media Button */}
        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#1e1e26] hover:bg-[#282834] text-[#d4d4d8] hover:text-white px-3 py-1 rounded-full transition-colors font-sans text-xs"
          title="Quickly upload an image or video to your studio library"
        >
          <UploadCloud className="h-3.5 w-3.5 text-emerald-400" />
          <span>Upload</span>
        </button>

        {/* Edit All Content */}
        <button
          onClick={onOpenContentEditor}
          className="flex items-center gap-1 bg-[#1e1e26] hover:bg-[#282834] text-[#d4d4d8] hover:text-white px-2.5 py-1 rounded-full transition-colors font-sans text-xs"
          title="Open Website Text & Copy Editor"
        >
          <Settings className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Site Copy</span>
        </button>

        {/* Open Full CMS */}
        <button
          onClick={onNavigateToAdmin}
          className="flex items-center gap-1 bg-white hover:bg-neutral-200 text-black px-2.5 py-1 rounded-full font-semibold transition-colors font-sans text-[11px]"
        >
          <span>CMS</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Quick Media Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg border border-[#2b2b35] bg-[#121216] rounded-lg shadow-2xl p-6 text-[#e4e4e7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#22222a] pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">Quick Upload Image or Video</h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-[#9b9ba4] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#9b9ba4]">
              Upload any high-res architectural render, floor plan, or 4K video reel. It will be immediately available in your Studio Media Library and throughout the website.
            </p>

            <FileUploadDropzone
              accept="both"
              label="Drop render or video file here"
              category="Quick Upload"
              onUploadSuccess={(item) => {
                setRecentUpload(item);
              }}
            />

            {recentUpload && (
              <div className="p-3 bg-[#181820] border border-[#2a2a35] rounded text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Media Ready
                  </span>
                  <span className="text-[10px] text-[#71717a] uppercase font-mono">{recentUpload.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  {recentUpload.type === 'video' ? (
                    <div className="h-12 w-20 bg-black flex items-center justify-center rounded">
                      <Film className="h-5 w-5 text-amber-400" />
                    </div>
                  ) : (
                    <img
                      src={recentUpload.url}
                      alt={recentUpload.title}
                      className="h-12 w-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate font-medium">{recentUpload.title}</p>
                    <p className="text-[11px] text-[#8e8e99] truncate font-mono">{recentUpload.url}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#22222a]">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="px-4 py-1.5 text-xs text-[#9b9ba4] hover:text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
