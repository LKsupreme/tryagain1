import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Film,
  Image as ImageIcon,
  Check,
  FolderOpen,
} from 'lucide-react';
import { Project, ProjectCategory, MediaItem, MediaLibraryItem } from '../../types';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit?: Project | null;
  existingCount: number;
}

const CATEGORIES = [
  'Residential',
  'Architecture',
  'Interiors',
  'Hospitality',
  '3D & CGI',
  'AI Creative',
  'Animation & Film',
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
  existingCount,
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'details'>('media');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Residential');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [orderIndex, setOrderIndex] = useState(1);

  // Cover Media
  const [coverType, setCoverType] = useState<'image' | 'video'>('image');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverPosterUrl, setCoverPosterUrl] = useState('');

  // Mixed Media Story Stream (Images + Videos in exact sequence)
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  // Sub-inputs for adding media
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [newMediaAspect, setNewMediaAspect] = useState<'16:9' | '4:3' | '21:9'>('16:9');

  // Media Library Picker state
  const [mediaLibPickerOpen, setMediaLibPickerOpen] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<'cover' | 'gallery'>('gallery');

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setSlug(projectToEdit.slug);
      setCategory(projectToEdit.category || 'Residential');
      setYear(projectToEdit.year || '2026');
      setLocation(projectToEdit.location || '');
      setDescription(projectToEdit.description || '');
      setIsPublished(projectToEdit.isPublished ?? true);
      setIsFeatured(projectToEdit.isFeatured ?? false);
      setOrderIndex(projectToEdit.orderIndex || 1);

      setCoverType(projectToEdit.coverType || 'image');
      setCoverUrl(projectToEdit.coverUrl || projectToEdit.coverImage || '');
      setCoverPosterUrl(projectToEdit.coverPosterUrl || '');

      const items =
        projectToEdit.media && projectToEdit.media.length > 0
          ? projectToEdit.media
          : projectToEdit.gallery || [];
      setMediaList(items);
    } else {
      setTitle('');
      setSlug('');
      setCategory('Residential');
      setYear(new Date().getFullYear().toString());
      setLocation('');
      setDescription('');
      setIsPublished(true);
      setIsFeatured(false);
      setOrderIndex(existingCount + 1);

      setCoverType('image');
      setCoverUrl('/src/assets/images/project_solis_residence_1790605551876.jpg');
      setCoverPosterUrl('');
      setMediaList([
        {
          id: `m-${Date.now()}`,
          type: 'image',
          url: '/src/assets/images/project_solis_residence_1790605551876.jpg',
          caption: 'Main exterior view',
          aspect: '16:9',
        },
      ]);
    }
  }, [projectToEdit, existingCount, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!projectToEdit) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  // Move media item in sequence
  const moveMedia = (index: number, direction: 'up' | 'down') => {
    const list = [...mediaList];
    if (direction === 'up' && index > 0) {
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      setMediaList(list);
    } else if (direction === 'down' && index < list.length - 1) {
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      setMediaList(list);
    }
  };

  const removeMedia = (index: number) => {
    setMediaList(mediaList.filter((_, idx) => idx !== index));
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    const newItem: MediaItem = {
      id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type: newMediaType,
      url: newMediaUrl.trim(),
      caption: newMediaCaption.trim() || undefined,
      aspect: newMediaAspect,
    };
    setMediaList([...mediaList, newItem]);
    setNewMediaUrl('');
    setNewMediaCaption('');
  };

  const handleSelectFromLibrary = (item: MediaLibraryItem) => {
    if (pickingTarget === 'cover') {
      setCoverUrl(item.url);
      setCoverType(item.type);
      if (item.posterUrl) setCoverPosterUrl(item.posterUrl);
    } else {
      const newItem: MediaItem = {
        id: `m-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type: item.type,
        url: item.url,
        posterUrl: item.posterUrl,
        caption: item.title,
        aspect: '16:9',
      };
      setMediaList([...mediaList, newItem]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    const project: Project = {
      id: projectToEdit ? projectToEdit.id : `proj-${Date.now()}`,
      slug: slug.trim(),
      title: title.trim(),
      category,
      year: year.trim() || '2026',
      location: location.trim() || 'Global',
      description: description.trim(),
      coverType,
      coverUrl: coverUrl.trim() || '/src/assets/images/hero_arch_viz_1790605520563.jpg',
      coverPosterUrl: coverPosterUrl.trim() || undefined,
      media: mediaList,
      coverImage: coverUrl.trim(),
      gallery: mediaList,
      isPublished,
      isFeatured,
      orderIndex: orderIndex || 1,
      createdAt: projectToEdit ? projectToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(project);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col border border-[#2b2b35] bg-[#121216] rounded-md shadow-2xl overflow-hidden my-auto text-[#e4e4e7]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#22222a] px-6 py-4 bg-[#16161c]">
          <div>
            <h3 className="text-base font-semibold text-white">
              {projectToEdit ? `Editing: ${projectToEdit.title}` : 'New Media Project'}
            </h3>
            <p className="text-xs text-[#9b9ba4]">
              Add images, videos, and reels in your desired visual sequence
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-[#9b9ba4] hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#22222a] bg-[#141418] px-6">
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'media'
                ? 'border-white text-white'
                : 'border-transparent text-[#7e7e88] hover:text-white'
            }`}
          >
            1. Media Sequence ({mediaList.length} items)
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'details'
                ? 'border-white text-white'
                : 'border-transparent text-[#7e7e88] hover:text-white'
            }`}
          >
            2. Project Info & Publishing
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'media' && (
            <div className="space-y-8">
              {/* Cover Media Section */}
              <div className="bg-[#16161f] border border-[#272733] p-4 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-semibold text-white">
                    Primary Cover Media (Hero View)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setPickingTarget('cover');
                      setMediaLibPickerOpen(true);
                    }}
                    className="flex items-center gap-1.5 text-xs text-[#a1a1aa] hover:text-white bg-[#22222d] px-2.5 py-1 rounded"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span>Choose from Media Library</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <select
                    value={coverType}
                    onChange={(e) => setCoverType(e.target.value as 'image' | 'video')}
                    className="sm:col-span-3 bg-[#1c1c24] border border-[#2e2e3c] px-3 py-2 text-xs text-white rounded focus:outline-none"
                  >
                    <option value="image">Image Cover</option>
                    <option value="video">Cinematic Video Cover</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Cover URL (Image or MP4)"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="sm:col-span-9 bg-[#1c1c24] border border-[#2e2e3c] px-3 py-2 text-xs text-white rounded focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Media Story Stream Reorder Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-white">
                      Story Sequence ({mediaList.length} Renders / Videos)
                    </h4>
                    <p className="text-[11px] text-[#8e8e98]">
                      Displayed on the public project page in this exact order
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setPickingTarget('gallery');
                      setMediaLibPickerOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-[#252532] text-white text-xs px-3 py-1.5 rounded hover:bg-[#323242]"
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                    <span>Pick from Library</span>
                  </button>
                </div>

                {/* Media items sequence list */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {mediaList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-[#181820] border border-[#272733] p-2.5 rounded group"
                    >
                      {/* Move arrows */}
                      <div className="flex flex-col gap-0.5 text-[#65636f]">
                        <button
                          type="button"
                          onClick={() => moveMedia(idx, 'up')}
                          disabled={idx === 0}
                          className="hover:text-white disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveMedia(idx, 'down')}
                          disabled={idx === mediaList.length - 1}
                          className="hover:text-white disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Number */}
                      <span className="text-xs font-mono text-[#65636f] w-5 text-center">
                        {idx + 1}
                      </span>

                      {/* Thumbnail */}
                      <div className="h-12 w-16 bg-black overflow-hidden shrink-0 rounded border border-[#2b2b36] relative">
                        {item.type === 'video' ? (
                          <video
                            src={item.url}
                            className="h-full w-full object-cover"
                            muted
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt=""
                            className="h-full w-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-[8px] text-white px-1 uppercase rounded">
                          {item.type}
                        </span>
                      </div>

                      {/* Info & Caption Edit */}
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={item.caption || ''}
                          onChange={(e) => {
                            const updated = [...mediaList];
                            updated[idx].caption = e.target.value;
                            setMediaList(updated);
                          }}
                          placeholder="Optional visual caption..."
                          className="w-full bg-transparent text-xs text-white focus:outline-none placeholder-[#555]"
                        />
                        <span className="text-[10px] text-[#65636f] truncate block font-mono">
                          {item.url}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="p-1.5 text-red-400 hover:bg-red-950/30 rounded"
                        title="Remove from project"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Sub-form to add new media item via URL directly */}
                <div className="border border-dashed border-[#323242] p-4 rounded bg-[#14141a] space-y-3">
                  <span className="text-xs uppercase tracking-wider text-white font-medium block">
                    + Add New Media Item (Image or Video)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as 'image' | 'video')}
                      className="sm:col-span-3 bg-[#1c1c24] border border-[#2e2e3c] px-2.5 py-1.5 text-xs text-white rounded focus:outline-none"
                    >
                      <option value="image">Still Image</option>
                      <option value="video">Video Reel</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Image / Video URL"
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      className="sm:col-span-6 bg-[#1c1c24] border border-[#2e2e3c] px-3 py-1.5 text-xs text-white rounded focus:outline-none font-mono"
                    />

                    <input
                      type="text"
                      placeholder="Caption"
                      value={newMediaCaption}
                      onChange={(e) => setNewMediaCaption(e.target.value)}
                      className="sm:col-span-3 bg-[#1c1c24] border border-[#2e2e3c] px-3 py-1.5 text-xs text-white rounded focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddMedia}
                      className="bg-white text-black px-4 py-1.5 text-xs font-semibold rounded hover:bg-neutral-200"
                    >
                      Insert into Sequence
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#9b9ba4] block">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Villa Solis"
                    className="w-full bg-[#1c1c24] border border-[#2e2e3c] px-3.5 py-2 text-sm text-white rounded focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#9b9ba4] block">
                    Slug (/project/:slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="villa-solis"
                    className="w-full bg-[#1c1c24] border border-[#2e2e3c] px-3.5 py-2 text-sm text-white font-mono rounded focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#9b9ba4] block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#1c1c24] border border-[#2e2e3c] px-3 py-2 text-xs text-white rounded focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#9b9ba4] block">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-[#1c1c24] border border-[#2e2e3c] px-3 py-2 text-xs text-white rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider text-[#9b9ba4] block">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Cap d’Antibes, France"
                    className="w-full bg-[#1c1c24] border border-[#2e2e3c] px-3 py-2 text-xs text-white rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-[#9b9ba4] block">
                  Short Description (1–2 sentences)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Warm limestone, natural light, and indoor-outdoor living overlooking the Mediterranean."
                  className="w-full bg-[#1c1c24] border border-[#2e2e3c] p-3 text-xs text-white rounded focus:outline-none"
                />
              </div>

              {/* Visibility Controls */}
              <div className="bg-[#181820] border border-[#272733] p-4 rounded space-y-4">
                <div className="flex flex-wrap items-center gap-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="h-4 w-4 accent-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Published Live
                      </span>
                      <span className="text-[11px] text-[#71717a]">
                        Appears on public portfolio
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="h-4 w-4 accent-amber-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Featured on Homepage
                      </span>
                      <span className="text-[11px] text-[#71717a]">
                        Prioritized in homepage editorial flow
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Save Action */}
          <div className="pt-4 border-t border-[#22222a] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#9b9ba4] hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 bg-white text-black px-5 py-2 text-xs font-semibold rounded hover:bg-neutral-200 transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>{projectToEdit ? 'Save Changes' : 'Publish Project'}</span>
            </button>
          </div>
        </form>

        {/* Media Library Picker Sub-Modal */}
        <MediaLibraryModal
          isOpen={mediaLibPickerOpen}
          onClose={() => setMediaLibPickerOpen(false)}
          onSelectMedia={handleSelectFromLibrary}
          selectMode={true}
        />
      </div>
    </div>
  );
};
