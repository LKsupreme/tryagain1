import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  Plus,
  Search,
  Trash2,
  Check,
  Image as ImageIcon,
  Film,
  Upload,
  AlertTriangle,
  RefreshCw,
  Copy,
  FolderOpen,
} from 'lucide-react';
import { MediaLibraryItem } from '../../types';
import { StorageService } from '../../services/storage';
import { FileUploadDropzone } from './FileUploadDropzone';
import { isPlaceholderUrl } from '../../services/mediaAudit';
import { MediaUploadService } from '../../services/mediaUpload';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (item: MediaLibraryItem) => void;
  selectMode?: boolean;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectMedia,
  selectMode = false,
}) => {
  const [items, setItems] = useState<MediaLibraryItem[]>(() =>
    StorageService.getMediaLibrary()
  );
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'placeholder'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New media drawer
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [newUrl, setNewUrl] = useState('');
  const [newPosterUrl, setNewPosterUrl] = useState('');

  // Replacing specific asset
  const [replacingItemId, setReplacingItemId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = StorageService.onMediaChange((updated) => setItems(updated));
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const isPlaceholder = item.isPlaceholder || isPlaceholderUrl(item.url);
      if (filterType === 'placeholder') {
        if (!isPlaceholder) return false;
      } else if (filterType !== 'all') {
        if (item.type !== filterType) return false;
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesUrl = item.url.toLowerCase().includes(q);
        const matchesProj = item.projectName?.toLowerCase().includes(q);
        const matchesCategory = item.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesUrl && !matchesProj && !matchesCategory) {
          return false;
        }
      }

      return true;
    });
  }, [items, filterType, searchQuery]);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    StorageService.addMediaItem({
      title: newTitle.trim() || (newType === 'video' ? 'Architectural Video Reel' : 'Visual Render'),
      type: newType,
      url: newUrl.trim(),
      posterUrl: newPosterUrl.trim() || undefined,
      category: 'General',
      projectName: newProject.trim() || undefined,
    });

    setNewTitle('');
    setNewProject('');
    setNewUrl('');
    setNewPosterUrl('');
    setIsAdding(false);
    showToast('Asset added to Media Library.');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Permanently remove this asset from media library?')) {
      StorageService.deleteMediaItem(id);
      showToast('Asset deleted.');
    }
  };

  const handleCopyUrl = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    showToast('Media URL copied to clipboard.');
  };

  const handleReplaceClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReplacingItemId(id);
    fileInputRef.current?.click();
  };

  const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replacingItemId) return;

    try {
      showToast('Uploading replacement file...');
      const targetItem = items.find((i) => i.id === replacingItemId);
      const uploaded = await MediaUploadService.processUpload(
        file,
        targetItem?.title || file.name,
        targetItem?.category || 'Replaced Media',
        targetItem?.projectName
      );

      // Update the existing item with the new URL and metadata
      StorageService.updateMediaItem(replacingItemId, {
        url: uploaded.url,
        type: uploaded.type,
        posterUrl: uploaded.posterUrl,
        isPlaceholder: false,
        fileSize: uploaded.fileSize,
      });

      showToast('Asset successfully replaced with real media!');
    } catch (err) {
      console.error(err);
      showToast('Error uploading replacement file.');
    } finally {
      setReplacingItemId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6 backdrop-blur-sm overflow-y-auto">
      {/* Hidden file input for Replace action */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/mp4,video/webm"
        className="hidden"
        onChange={handleReplaceFileChange}
      />

      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col border border-[#ded7cc] bg-white rounded-lg shadow-2xl overflow-hidden my-auto text-[#18181b]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ded7cc] px-6 py-4 bg-[#faf8f5]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#18181b]">
                Studio Media Library
              </h3>
              <span className="text-[11px] font-mono text-[#787268] bg-[#f4f1ea] px-2 py-0.5 rounded border border-[#ded7cc]">
                {items.length} Total Assets
              </span>
            </div>
            <p className="text-xs text-[#787268]">
              {selectMode
                ? 'Click an image or video to insert into project'
                : 'Upload, audit, replace, and reuse images and video reels across the portfolio'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 bg-[#18181b] text-white px-3 py-1.5 text-xs font-semibold rounded hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isAdding ? 'Close Uploader' : 'Upload Media'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#787268] hover:text-[#18181b] rounded transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Add New Asset Drawer */}
        {isAdding && (
          <div className="border-b border-[#ded7cc] bg-[#f4f1ea] p-5 space-y-4">
            <span className="text-xs uppercase tracking-wider text-[#18181b] font-semibold block">
              + Upload Media to Library (Images & MP4/WebM Videos)
            </span>

            {/* Direct File Dropzone */}
            <FileUploadDropzone
              accept="both"
              label="Drop image (JPG/PNG/WebP) or video (MP4/WebM) here to instantly upload"
              category="Media Library"
              onUploadSuccess={(item) => {
                showToast(`Uploaded "${item.title}" successfully.`);
                setIsAdding(false);
              }}
            />

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-[#ded7cc]" />
              <span className="text-[10px] uppercase font-mono text-[#787268]">
                Or Add via URL / Project Association
              </span>
              <div className="flex-1 border-t border-[#ded7cc]" />
            </div>

            <form onSubmit={handleAddNew} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  placeholder="Asset title (e.g. Plan A Production Walkthrough)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="sm:col-span-3 bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                />
                <input
                  type="text"
                  placeholder="Associated Project (optional)"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  className="sm:col-span-3 bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'image' | 'video')}
                  className="sm:col-span-2 bg-white border border-[#ded7cc] px-2 py-1.5 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                >
                  <option value="image">Image</option>
                  <option value="video">Video (MP4/WebM)</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="URL (Image or Video MP4)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="sm:col-span-4 bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] font-mono text-[11px]"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#18181b] text-white px-4 py-1.5 text-xs font-semibold rounded hover:bg-neutral-800 shadow-sm"
                >
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar: Filter & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[#ded7cc] bg-[#faf8f5]">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium ${
                filterType === 'all'
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'bg-white border border-[#ded7cc] text-[#524d45] hover:text-[#18181b]'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium ${
                filterType === 'image'
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'bg-white border border-[#ded7cc] text-[#524d45] hover:text-[#18181b]'
              }`}
            >
              Images ({items.filter((i) => i.type === 'image').length})
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium ${
                filterType === 'video'
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'bg-white border border-[#ded7cc] text-[#524d45] hover:text-[#18181b]'
              }`}
            >
              Videos ({items.filter((i) => i.type === 'video').length})
            </button>
            <button
              onClick={() => setFilterType('placeholder')}
              className={`px-3 py-1 text-xs rounded transition-colors font-medium flex items-center gap-1 ${
                filterType === 'placeholder'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="h-3 w-3 text-amber-700" />
              <span>
                Placeholders to Replace (
                {items.filter((i) => i.isPlaceholder || isPlaceholderUrl(i.url)).length})
              </span>
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#787268]" />
            <input
              type="text"
              placeholder="Search by title, project, URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-[#ded7cc] pl-8 pr-3 py-1 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] w-64 shadow-sm"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center text-xs text-[#787268] space-y-2">
              <p>No media found matching current filters.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="text-[#18181b] underline font-medium"
              >
                Upload or add an asset now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => {
                const isPlaceholder = item.isPlaceholder || isPlaceholderUrl(item.url);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      if (selectMode && onSelectMedia) {
                        onSelectMedia(item);
                        onClose();
                      }
                    }}
                    className={`group relative overflow-hidden bg-white border rounded-lg transition-all shadow-sm flex flex-col ${
                      isPlaceholder
                        ? 'border-amber-300 ring-1 ring-amber-300/40 bg-amber-50/10'
                        : 'border-[#ded7cc] hover:border-[#18181b]'
                    } ${
                      selectMode
                        ? 'cursor-pointer hover:ring-2 hover:ring-[#18181b]'
                        : ''
                    }`}
                  >
                    {/* Media Thumbnail Container */}
                    <div className="aspect-[16/10] w-full overflow-hidden bg-black relative">
                      {item.type === 'video' ? (
                        <video
                          src={item.url}
                          poster={item.posterUrl}
                          className="h-full w-full object-cover"
                          muted
                          controls
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      )}

                      {/* Type Badge */}
                      <div className="absolute top-2 left-2 bg-[#18181b]/80 backdrop-blur-sm px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white rounded flex items-center gap-1 font-mono">
                        {item.type === 'video' ? (
                          <>
                            <Film className="h-2.5 w-2.5 text-amber-300" />
                            <span>Video</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-2.5 w-2.5 text-emerald-300" />
                            <span>Image</span>
                          </>
                        )}
                      </div>

                      {/* Action buttons on hover */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => handleCopyUrl(item.url, e)}
                          className="p-1.5 bg-white/95 text-[#18181b] hover:bg-white rounded shadow text-[10px]"
                          title="Copy media URL"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 bg-white/95 text-red-600 hover:bg-red-50 rounded shadow text-[10px]"
                          title="Delete asset"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Placeholder Warning Badge */}
                      {isPlaceholder && (
                        <div className="absolute bottom-2 left-2 right-2 bg-amber-500/90 backdrop-blur-sm text-black text-[9px] font-bold px-2 py-0.5 rounded text-center tracking-wider uppercase flex items-center justify-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-black" />
                          <span>PLACEHOLDER MEDIA — REPLACE</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Card Footer */}
                    <div className="p-3 space-y-1.5 bg-white flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold text-[#18181b] truncate" title={item.title}>
                          {item.title}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-[#787268] pt-0.5">
                          <span className="truncate">{item.projectName || item.category || 'General'}</span>
                          <span>{item.addedAt}</span>
                        </div>
                      </div>

                      {/* Replace Button on each card */}
                      <div className="pt-2 border-t border-[#ded7cc] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => handleReplaceClick(item.id, e)}
                          className="text-[10px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Replace File</span>
                        </button>

                        {selectMode && (
                          <span className="text-[10px] font-bold bg-[#18181b] text-white px-2 py-0.5 rounded">
                            Select ↵
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 bg-[#18181b] text-white text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
