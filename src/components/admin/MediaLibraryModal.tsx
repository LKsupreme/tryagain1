import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Search, Trash2, Check, Image as ImageIcon, Film, Filter, UploadCloud } from 'lucide-react';
import { MediaLibraryItem } from '../../types';
import { StorageService } from '../../services/storage';
import { FileUploadDropzone } from './FileUploadDropzone';

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
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New media form state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'image' | 'video'>('image');
  const [newUrl, setNewUrl] = useState('');
  const [newPosterUrl, setNewPosterUrl] = useState('');

  useEffect(() => {
    const unsub = StorageService.onMediaChange((updated) => setItems(updated));
    return () => unsub();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [items, filterType, searchQuery]);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    StorageService.addMediaItem({
      title: newTitle.trim() || (newType === 'video' ? 'Architectural Reel' : 'Visual Render'),
      type: newType,
      url: newUrl.trim(),
      posterUrl: newPosterUrl.trim() || undefined,
      category: 'General',
    });

    setNewTitle('');
    setNewUrl('');
    setNewPosterUrl('');
    setIsAdding(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove asset from media library?')) {
      StorageService.deleteMediaItem(id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col border border-[#2b2b35] bg-[#121216] rounded-md shadow-2xl overflow-hidden text-[#e4e4e7]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#22222a] px-6 py-4 bg-[#16161c]">
          <div>
            <h3 className="text-base font-semibold text-white">
              Studio Media Library
            </h3>
            <p className="text-xs text-[#9b9ba4]">
              {selectMode
                ? 'Click an image or video to insert into project'
                : 'Upload, manage, and reuse renders and video reels'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 text-xs font-semibold rounded hover:bg-neutral-200 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{isAdding ? 'Cancel' : 'Add Asset'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#9b9ba4] hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Add New Asset Drawer */}
        {isAdding && (
          <div className="border-b border-[#22222a] bg-[#1a1a22] p-5 space-y-4">
            <span className="text-xs uppercase tracking-wider text-white font-medium block">
              + Add New Media to Library
            </span>

            {/* Direct File Dropzone */}
            <FileUploadDropzone
              accept="both"
              label="Drop image or video here to instantly upload and add to library"
              category="Media Library"
              onUploadSuccess={(item) => {
                setIsAdding(false);
              }}
            />

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-[#2a2a35]" />
              <span className="text-[10px] uppercase font-mono text-[#71717a]">Or Add via URL</span>
              <div className="flex-1 border-t border-[#2a2a35]" />
            </div>

            <form onSubmit={handleAddNew} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="text"
                  placeholder="Asset title (e.g. Nordic Dusk Facade)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="sm:col-span-3 bg-[#121216] border border-[#2b2b35] px-3 py-1.5 text-xs text-white rounded focus:outline-none"
                />
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'image' | 'video')}
                  className="sm:col-span-2 bg-[#121216] border border-[#2b2b35] px-2 py-1.5 text-xs text-white rounded focus:outline-none"
                >
                  <option value="image">Image (Render)</option>
                  <option value="video">Video (Reel / MP4)</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Media URL (R2, CDN, local path, or MP4)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="sm:col-span-4 bg-[#121216] border border-[#2b2b35] px-3 py-1.5 text-xs text-white rounded focus:outline-none font-mono"
                />
                <input
                  type="text"
                  placeholder="Video poster URL (optional)"
                  value={newPosterUrl}
                  onChange={(e) => setNewPosterUrl(e.target.value)}
                  className="sm:col-span-3 bg-[#121216] border border-[#2b2b35] px-3 py-1.5 text-xs text-white rounded focus:outline-none font-mono"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-1.5 text-xs font-semibold rounded hover:bg-neutral-200"
                >
                  Save URL to Library
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar: Filter & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-[#22222a] bg-[#141418]">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filterType === 'all'
                  ? 'bg-[#2b2b35] text-white font-medium'
                  : 'text-[#8e8e98] hover:text-white'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filterType === 'image'
                  ? 'bg-[#2b2b35] text-white font-medium'
                  : 'text-[#8e8e98] hover:text-white'
              }`}
            >
              Images ({items.filter((i) => i.type === 'image').length})
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                filterType === 'video'
                  ? 'bg-[#2b2b35] text-white font-medium'
                  : 'text-[#8e8e98] hover:text-white'
              }`}
            >
              Videos ({items.filter((i) => i.type === 'video').length})
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#65636f]" />
            <input
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1a22] border border-[#2b2b35] pl-8 pr-3 py-1 text-xs text-white rounded focus:outline-none w-56"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredItems.length === 0 ? (
            <div className="py-20 text-center text-xs text-[#71717a]">
              No media found. Click "+ Add Asset" above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (selectMode && onSelectMedia) {
                      onSelectMedia(item);
                      onClose();
                    }
                  }}
                  className={`group relative overflow-hidden bg-[#18181f] border border-[#252530] rounded-md transition-all ${
                    selectMode
                      ? 'cursor-pointer hover:border-white hover:ring-1 hover:ring-white'
                      : ''
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-black relative">
                    {item.type === 'video' ? (
                      <video
                        src={item.url}
                        poster={item.posterUrl}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}

                    {/* Badge */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white rounded flex items-center gap-1">
                      {item.type === 'video' ? (
                        <>
                          <Film className="h-2.5 w-2.5" />
                          <span>Video</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-2.5 w-2.5" />
                          <span>Image</span>
                        </>
                      )}
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="absolute top-2 right-2 p-1 bg-black/70 text-red-400 hover:bg-red-950/80 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete asset"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="p-2.5 space-y-0.5">
                    <p className="text-xs font-medium text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-[#65636f] truncate font-mono">
                      {item.url}
                    </p>
                  </div>

                  {selectMode && (
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 flex items-center justify-center pointer-events-none">
                      <span className="bg-white text-black text-xs font-semibold px-3 py-1 rounded shadow">
                        Insert
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
