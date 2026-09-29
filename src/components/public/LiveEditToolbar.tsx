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
      {/* Floating Admin Controls Bar at bottom-right in Crisp Light Mode */}
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-white/95 border border-[#ded7cc] text-[#18181b] px-3 py-2 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono">
        <div className="flex items-center gap-2 pr-2 border-r border-[#ded7cc]">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-sans font-semibold text-[11px] text-[#18181b]">Admin</span>
        </div>

        {/* Toggle Live Edit Text Mode */}
        <button
          onClick={onToggleEditMode}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors font-sans text-xs border ${
            isEditMode
              ? 'bg-[#18181b] text-white border-[#18181b] font-semibold'
              : 'bg-[#faf8f5] hover:bg-[#f4f1ea] text-[#18181b] border-[#ded7cc]'
          }`}
          title="Toggle highlight on editable text and images across the website"
        >
          <Edit3 className="h-3.5 w-3.5 text-[#877158]" />
          <span>{isEditMode ? 'Edit Mode: ON' : 'Edit Text'}</span>
        </button>

        {/* Quick Upload Media Button */}
        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-1.5 bg-[#faf8f5] hover:bg-[#f4f1ea] text-[#18181b] border border-[#ded7cc] px-3 py-1 rounded-full transition-colors font-sans text-xs"
          title="Quickly upload an image or video to your studio library"
        >
          <UploadCloud className="h-3.5 w-3.5 text-emerald-600" />
          <span>Upload</span>
        </button>

        {/* Edit All Content */}
        <button
          onClick={onOpenContentEditor}
          className="flex items-center gap-1 bg-[#faf8f5] hover:bg-[#f4f1ea] text-[#18181b] border border-[#ded7cc] px-2.5 py-1 rounded-full transition-colors font-sans text-xs"
          title="Open Website Text & Copy Editor"
        >
          <Settings className="h-3.5 w-3.5 text-[#787268]" />
          <span className="hidden sm:inline">Site Copy</span>
        </button>

        {/* Open Full CMS */}
        <button
          onClick={onNavigateToAdmin}
          className="flex items-center gap-1 bg-[#18181b] hover:bg-neutral-800 text-white px-3 py-1 rounded-full font-semibold transition-colors font-sans text-[11px] shadow-sm"
        >
          <span>CMS</span>
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Quick Media Upload Modal in Light Mode */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg border border-[#ded7cc] bg-white rounded-lg shadow-2xl p-6 text-[#18181b] space-y-4">
            <div className="flex items-center justify-between border-b border-[#ded7cc] pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5 text-emerald-600" />
                <h3 className="font-semibold text-sm text-[#18181b]">Quick Upload Image or Video</h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-1 text-[#787268] hover:text-[#18181b] rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-[#787268]">
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
              <div className="p-3 bg-[#faf8f5] border border-[#ded7cc] rounded-lg text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" /> Media Ready
                  </span>
                  <span className="text-[10px] text-[#787268] uppercase font-mono">{recentUpload.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  {recentUpload.type === 'video' ? (
                    <div className="h-12 w-20 bg-[#ede7dd] border border-[#ded7cc] flex items-center justify-center rounded">
                      <Film className="h-5 w-5 text-amber-600" />
                    </div>
                  ) : (
                    <img
                      src={recentUpload.url}
                      alt={recentUpload.title}
                      className="h-12 w-20 object-cover rounded border border-[#ded7cc]"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#18181b] truncate font-semibold">{recentUpload.title}</p>
                    <p className="text-[11px] text-[#787268] truncate font-mono">{recentUpload.url}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#ded7cc]">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="bg-[#18181b] text-white px-4 py-1.5 text-xs font-semibold rounded hover:bg-neutral-800 transition-colors shadow-sm"
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
