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
  AlertTriangle,
  Upload,
  RefreshCw,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Project, MediaItem, MediaLibraryItem } from '../../types';
import { MediaLibraryModal } from './MediaLibraryModal';
import { FileUploadDropzone } from './FileUploadDropzone';
import { isPlaceholderUrl } from '../../services/mediaAudit';
import { MediaUploadService } from '../../services/mediaUpload';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
  projectToEdit?: Project | null;
  existingCount: number;
}

const CATEGORIES = [
  'Architectural Visualization',
  'Interior Visualization',
  'Architecture',
  'Interiors',
  '3D Visualization',
  'Animation & Video',
  'AI Creative',
  'Technical Visualization',
  'Hospitality & Pavilions',
  'Residential Architecture',
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  projectToEdit,
  existingCount,
}) => {
  const [activeTab, setActiveTab] = useState<'media' | 'info' | 'settings'>('media');

  // Form State: Info
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('3D Visualization');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [location, setLocation] = useState('');
  const [client, setClient] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  // Form State: Settings & SEO
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [homepageVisibility, setHomepageVisibility] = useState(true);
  const [orderIndex, setOrderIndex] = useState(1);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [softwareStack, setSoftwareStack] = useState<string[]>([]);
  const [softwareInput, setSoftwareInput] = useState('');

  // Cover Media
  const [coverType, setCoverType] = useState<'image' | 'video'>('image');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverPosterUrl, setCoverPosterUrl] = useState('');
  const [coverAltText, setCoverAltText] = useState('');

  // Media Story Stream (Images + Videos in exact sequence)
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  // Sub-inputs for adding media via URL
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaPosterUrl, setNewMediaPosterUrl] = useState('');
  const [newMediaCaption, setNewMediaCaption] = useState('');
  const [newMediaAspect, setNewMediaAspect] = useState<'16:9' | '4:3' | '21:9'>('16:9');

  // Media Library Picker state
  const [mediaLibPickerOpen, setMediaLibPickerOpen] = useState(false);
  const [pickingTarget, setPickingTarget] = useState<'cover' | 'gallery' | `item-${number}`>('gallery');

  // Item currently replacing
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setSlug(projectToEdit.slug);
      setCategory(projectToEdit.category || '3D Visualization');
      setYear(projectToEdit.year || '2026');
      setLocation(projectToEdit.location || '');
      setClient(projectToEdit.client || '');
      setRole(projectToEdit.role || 'Lead 3D Visualizer & Designer');
      setDescription(projectToEdit.description || '');
      setFullDescription(projectToEdit.fullDescription || projectToEdit.description || '');

      setIsPublished(projectToEdit.isPublished ?? true);
      setIsFeatured(projectToEdit.isFeatured ?? false);
      setHomepageVisibility(projectToEdit.homepageVisibility ?? true);
      setOrderIndex(projectToEdit.orderIndex || 1);
      setSeoTitle(projectToEdit.seoTitle || `${projectToEdit.title} · Elle Kay`);
      setSeoDescription(projectToEdit.seoDescription || projectToEdit.description || '');
      setSoftwareStack(projectToEdit.softwareStack || ['3ds Max', 'Unreal Engine', 'Photoshop']);

      setCoverType(projectToEdit.coverType || 'image');
      setCoverUrl(projectToEdit.coverUrl || projectToEdit.coverImage || '');
      setCoverPosterUrl(projectToEdit.coverPosterUrl || '');
      setCoverAltText(projectToEdit.coverAltText || projectToEdit.title);

      const items =
        projectToEdit.media && projectToEdit.media.length > 0
          ? projectToEdit.media
          : projectToEdit.gallery || [];
      setMediaList(items);
    } else {
      setTitle('');
      setSlug('');
      setCategory('3D Visualization');
      setYear(new Date().getFullYear().toString());
      setLocation('');
      setClient('');
      setRole('Lead 3D Visualizer & Designer');
      setDescription('');
      setFullDescription('');

      setIsPublished(true);
      setIsFeatured(false);
      setHomepageVisibility(true);
      setOrderIndex(existingCount + 1);
      setSeoTitle('');
      setSeoDescription('');
      setSoftwareStack(['Unreal Engine', 'Lumion', 'Photoshop']);

      setCoverType('image');
      setCoverUrl('/src/assets/images/project_solis_residence_1790605551876.jpg');
      setCoverPosterUrl('');
      setCoverAltText('');
      setMediaList([
        {
          id: `m-${Date.now()}`,
          type: 'image',
          url: '/src/assets/images/project_solis_residence_1790605551876.jpg',
          caption: 'Primary exterior render',
          altText: 'Primary exterior perspective',
          aspect: '16:9',
          isPlaceholder: false,
          showOnHomepage: true,
          showInGallery: true,
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
      setSeoTitle(`${val} · Elle Kay · AI Creative Artist & 3D Designer`);
    }
  };

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
    if (window.confirm('Remove this media item from the project?')) {
      setMediaList(mediaList.filter((_, idx) => idx !== index));
    }
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    const isVid = newMediaType === 'video' || newMediaUrl.toLowerCase().endsWith('.mp4') || newMediaUrl.toLowerCase().endsWith('.webm');
    const newItem: MediaItem = {
      id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: isVid ? 'video' : 'image',
      url: newMediaUrl.trim(),
      posterUrl: newMediaPosterUrl.trim() || undefined,
      caption: newMediaCaption.trim() || undefined,
      altText: newMediaCaption.trim() || title,
      aspect: newMediaAspect,
      isPlaceholder: isPlaceholderUrl(newMediaUrl),
      autoplay: true,
      loop: true,
      muted: true,
      controls: true,
      showOnHomepage: true,
      showInGallery: true,
    };
    setMediaList([...mediaList, newItem]);
    setNewMediaUrl('');
    setNewMediaPosterUrl('');
    setNewMediaCaption('');
  };

  const handleSelectFromLibrary = (item: MediaLibraryItem) => {
    if (pickingTarget === 'cover') {
      setCoverUrl(item.url);
      setCoverType(item.type);
      if (item.posterUrl) setCoverPosterUrl(item.posterUrl);
    } else if (pickingTarget.startsWith('item-')) {
      const idx = parseInt(pickingTarget.replace('item-', ''), 10);
      if (!isNaN(idx) && mediaList[idx]) {
        const updated = [...mediaList];
        updated[idx] = {
          ...updated[idx],
          url: item.url,
          type: item.type,
          posterUrl: item.posterUrl || updated[idx].posterUrl,
          isPlaceholder: false,
        };
        setMediaList(updated);
      }
    } else {
      const newItem: MediaItem = {
        id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: item.type,
        url: item.url,
        posterUrl: item.posterUrl,
        caption: item.title,
        altText: item.title,
        aspect: '16:9',
        isPlaceholder: false,
        autoplay: true,
        loop: true,
        muted: true,
        controls: true,
        showOnHomepage: true,
        showInGallery: true,
      };
      setMediaList([...mediaList, newItem]);
    }
  };

  const handleItemFileUpload = async (index: number, file: File) => {
    try {
      const uploaded = await MediaUploadService.processUpload(file, `${title} - Visual #${index + 1}`, 'Project Media', title);
      const updated = [...mediaList];
      updated[index] = {
        ...updated[index],
        url: uploaded.url,
        type: uploaded.type,
        posterUrl: uploaded.posterUrl || updated[index].posterUrl,
        isPlaceholder: false,
      };
      setMediaList(updated);
      setReplacingIndex(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSoftware = () => {
    if (softwareInput.trim() && !softwareStack.includes(softwareInput.trim())) {
      setSoftwareStack([...softwareStack, softwareInput.trim()]);
      setSoftwareInput('');
    }
  };

  const handleRemoveSoftware = (sw: string) => {
    setSoftwareStack(softwareStack.filter((s) => s !== sw));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      alert('Please provide a project title and URL slug.');
      return;
    }

    const project: Project = {
      id: projectToEdit ? projectToEdit.id : `proj-${Date.now()}`,
      slug: slug.trim(),
      title: title.trim(),
      category,
      year: year.trim() || '2026',
      location: location.trim() || 'Global',
      client: client.trim() || undefined,
      role: role.trim() || 'Lead 3D Visualizer',
      description: description.trim(),
      fullDescription: fullDescription.trim() || description.trim(),
      coverType,
      coverUrl: coverUrl.trim() || '/src/assets/images/hero_arch_viz_1790605520563.jpg',
      coverPosterUrl: coverPosterUrl.trim() || undefined,
      coverIsPlaceholder: isPlaceholderUrl(coverUrl),
      coverAltText: coverAltText.trim() || title.trim(),
      media: mediaList,
      coverImage: coverUrl.trim(),
      gallery: mediaList,
      isPublished,
      isFeatured,
      homepageVisibility,
      orderIndex: orderIndex || 1,
      seoTitle: seoTitle.trim() || `${title} · Elle Kay`,
      seoDescription: seoDescription.trim() || description.trim(),
      softwareStack,
      createdAt: projectToEdit ? projectToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(project);
    onClose();
  };

  const isCoverPlaceholder = isPlaceholderUrl(coverUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col border border-[#ded7cc] bg-white rounded-lg shadow-2xl overflow-hidden my-auto text-[#18181b]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ded7cc] px-6 py-4 bg-[#faf8f5]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-[#18181b]">
                {projectToEdit ? `Project Editor: ${projectToEdit.title}` : 'Create New Project'}
              </h3>
              {projectToEdit && (
                <span className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-[#ded7cc]">
                  /project/{slug}
                </span>
              )}
            </div>
            <p className="text-xs text-[#787268] mt-0.5">
              Upload real images, MP4/WebM videos, edit text, and manage media sequence
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#787268] hover:text-[#18181b] rounded transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#ded7cc] bg-[#f4f1ea] px-6 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'media'
                ? 'border-[#18181b] text-[#18181b] bg-white'
                : 'border-transparent text-[#787268] hover:text-[#18181b]'
            }`}
          >
            <Film className="h-3.5 w-3.5 text-amber-600" />
            <span>1. Media Sequence ({mediaList.length} items)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-[#18181b] text-[#18181b] bg-white'
                : 'border-transparent text-[#787268] hover:text-[#18181b]'
            }`}
          >
            <Sliders className="h-3.5 w-3.5 text-blue-600" />
            <span>2. Project Information & Text</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-[#18181b] text-[#18181b] bg-white'
                : 'border-transparent text-[#787268] hover:text-[#18181b]'
            }`}
          >
            <Eye className="h-3.5 w-3.5 text-emerald-600" />
            <span>3. Settings & SEO</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* TAB 1: MEDIA SEQUENCE */}
          {activeTab === 'media' && (
            <div className="space-y-8">
              {/* PRIMARY COVER MEDIA */}
              <div className="bg-[#faf8f5] border border-[#ded7cc] p-4 rounded-lg space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                      Primary Cover Media
                    </span>
                    {isCoverPlaceholder && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                        <AlertTriangle className="h-3 w-3 text-amber-700" />
                        PLACEHOLDER MEDIA — REPLACE
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPickingTarget('cover');
                        setMediaLibPickerOpen(true);
                      }}
                      className="flex items-center gap-1.5 text-xs text-[#524d45] hover:text-[#18181b] bg-white border border-[#ded7cc] px-2.5 py-1 rounded shadow-sm font-medium"
                    >
                      <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
                      <span>Pick from Media Library</span>
                    </button>
                  </div>
                </div>

                {/* Cover Live Preview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
                  <div className="md:col-span-4 aspect-[16/9] bg-black rounded overflow-hidden relative border border-[#ded7cc]">
                    {coverType === 'video' ? (
                      <video
                        src={coverUrl}
                        poster={coverPosterUrl}
                        controls
                        muted
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <img
                        src={coverUrl}
                        alt="Cover Preview"
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute top-1.5 left-1.5 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded uppercase">
                      {coverType}
                    </span>
                  </div>

                  <div className="md:col-span-8 space-y-2.5">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <select
                        value={coverType}
                        onChange={(e) => setCoverType(e.target.value as 'image' | 'video')}
                        className="sm:col-span-4 bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] font-medium"
                      >
                        <option value="image">Image Cover</option>
                        <option value="video">Cinematic Video Cover (MP4/WebM)</option>
                      </select>

                      <input
                        type="text"
                        required
                        placeholder="Cover URL (Image or MP4)"
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        className="sm:col-span-8 bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] font-mono"
                      />
                    </div>

                    {coverType === 'video' && (
                      <input
                        type="text"
                        placeholder="Video Poster / Thumbnail Image URL (optional)"
                        value={coverPosterUrl}
                        onChange={(e) => setCoverPosterUrl(e.target.value)}
                        className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] font-mono"
                      />
                    )}

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <FileUploadDropzone
                        compact
                        accept={coverType}
                        label={`Upload Real ${coverType === 'video' ? 'Video' : 'Cover Image'}`}
                        category="Project Covers"
                        onUploadSuccess={(item) => {
                          setCoverUrl(item.url);
                          setCoverType(item.type);
                          if (item.posterUrl) setCoverPosterUrl(item.posterUrl);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* MEDIA STORY SEQUENCE SECTION */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-[#18181b] flex items-center gap-2">
                      <span>Story Media Sequence ({mediaList.length} Renders / Videos)</span>
                    </h4>
                    <p className="text-[11px] text-[#787268]">
                      Displayed on the public project page in this exact sequential flow
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPickingTarget('gallery');
                        setMediaLibPickerOpen(true);
                      }}
                      className="flex items-center gap-1.5 bg-white border border-[#ded7cc] text-[#18181b] text-xs px-3 py-1.5 rounded hover:bg-[#faf8f5] shadow-sm font-medium"
                    >
                      <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
                      <span>Add from Media Library</span>
                    </button>
                  </div>
                </div>

                {/* Direct Dropzone for adding new files to project */}
                <FileUploadDropzone
                  accept="both"
                  label="+ Drop Images or MP4/WebM Videos here to append to project"
                  category="Project Media"
                  onUploadSuccess={(uploaded) => {
                    setMediaList((prev) => [
                      ...prev,
                      {
                        id: `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                        type: uploaded.type,
                        url: uploaded.url,
                        posterUrl: uploaded.posterUrl,
                        aspect: '16:9',
                        caption: uploaded.title,
                        altText: uploaded.title,
                        isPlaceholder: false,
                        autoplay: true,
                        loop: true,
                        muted: true,
                        controls: true,
                        showOnHomepage: true,
                        showInGallery: true,
                      },
                    ]);
                  }}
                />

                {/* Sequence Items List */}
                <div className="space-y-3">
                  {mediaList.map((item, idx) => {
                    const isItemPlaceholder = item.isPlaceholder || isPlaceholderUrl(item.url);
                    const isReplacing = replacingIndex === idx;

                    return (
                      <div
                        key={item.id || idx}
                        className={`bg-[#faf8f5] border p-3.5 rounded-lg transition-all ${
                          isItemPlaceholder
                            ? 'border-amber-300 ring-1 ring-amber-300/50 bg-amber-50/20'
                            : 'border-[#ded7cc] hover:border-[#18181b]'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                          {/* Reorder Up/Down */}
                          <div className="flex flex-row md:flex-col items-center gap-1 text-[#787268]">
                            <button
                              type="button"
                              onClick={() => moveMedia(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 hover:text-[#18181b] disabled:opacity-20"
                              title="Move earlier in sequence"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <span className="text-xs font-mono font-bold text-[#18181b] px-1">
                              {idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => moveMedia(idx, 'down')}
                              disabled={idx === mediaList.length - 1}
                              className="p-1 hover:text-[#18181b] disabled:opacity-20"
                              title="Move later in sequence"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          {/* Media Thumbnail & Player */}
                          <div className="h-16 w-24 sm:h-20 sm:w-32 bg-black rounded overflow-hidden shrink-0 border border-[#ded7cc] relative">
                            {item.type === 'video' ? (
                              <video
                                src={item.url}
                                poster={item.posterUrl}
                                muted
                                controls
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <img
                                src={item.url}
                                alt={item.caption || 'Project visual'}
                                className="h-full w-full object-cover"
                              />
                            )}
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[8px] font-mono px-1 rounded uppercase">
                              {item.type}
                            </span>
                          </div>

                          {/* Metadata & Controls */}
                          <div className="flex-1 min-w-0 space-y-2 w-full">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              {isItemPlaceholder ? (
                                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                                  <AlertTriangle className="h-3 w-3 text-amber-700" />
                                  PLACEHOLDER MEDIA — REPLACE
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                                  ✓ Custom Media
                                </span>
                              )}

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPickingTarget(`item-${idx}`);
                                    setMediaLibPickerOpen(true);
                                  }}
                                  className="text-[11px] bg-white border border-[#ded7cc] px-2 py-0.5 rounded text-[#524d45] hover:text-[#18181b] shadow-sm flex items-center gap-1 font-medium"
                                >
                                  <FolderOpen className="h-3 w-3 text-blue-600" />
                                  <span>Library</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setReplacingIndex(isReplacing ? null : idx)}
                                  className="text-[11px] bg-[#18181b] text-white px-2 py-0.5 rounded hover:bg-neutral-800 shadow-sm flex items-center gap-1 font-medium"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  <span>{isReplacing ? 'Close Replace' : 'Replace Media'}</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeMedia(idx)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete from project"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Caption & URL */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                              <input
                                type="text"
                                value={item.caption || ''}
                                onChange={(e) => {
                                  const updated = [...mediaList];
                                  updated[idx].caption = e.target.value;
                                  updated[idx].altText = e.target.value;
                                  setMediaList(updated);
                                }}
                                placeholder="Caption or descriptive title..."
                                className="sm:col-span-6 bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                              />
                              <input
                                type="text"
                                value={item.url}
                                onChange={(e) => {
                                  const updated = [...mediaList];
                                  updated[idx].url = e.target.value;
                                  updated[idx].isPlaceholder = isPlaceholderUrl(e.target.value);
                                  setMediaList(updated);
                                }}
                                placeholder="URL (Image or Video)"
                                className="sm:col-span-6 bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] font-mono text-[11px]"
                              />
                            </div>

                            {/* Quick Replace Drawer */}
                            {isReplacing && (
                              <div className="mt-2 p-3 bg-white border border-amber-300 rounded space-y-2">
                                <span className="text-[11px] font-semibold text-[#18181b] block">
                                  Upload real replacement file for item #{idx + 1}:
                                </span>
                                <input
                                  type="file"
                                  accept="image/*,video/mp4,video/webm"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleItemFileUpload(idx, file);
                                  }}
                                  className="text-xs text-[#18181b]"
                                />
                              </div>
                            )}

                            {/* Video-specific settings */}
                            {item.type === 'video' && (
                              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#524d45]">
                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={item.autoplay ?? true}
                                    onChange={(e) => {
                                      const updated = [...mediaList];
                                      updated[idx].autoplay = e.target.checked;
                                      setMediaList(updated);
                                    }}
                                    className="rounded"
                                  />
                                  <span>Autoplay</span>
                                </label>

                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={item.loop ?? true}
                                    onChange={(e) => {
                                      const updated = [...mediaList];
                                      updated[idx].loop = e.target.checked;
                                      setMediaList(updated);
                                    }}
                                    className="rounded"
                                  />
                                  <span>Loop</span>
                                </label>

                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={item.muted ?? true}
                                    onChange={(e) => {
                                      const updated = [...mediaList];
                                      updated[idx].muted = e.target.checked;
                                      setMediaList(updated);
                                    }}
                                    className="rounded"
                                  />
                                  <span>Muted</span>
                                </label>

                                <label className="flex items-center gap-1 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={item.controls ?? true}
                                    onChange={(e) => {
                                      const updated = [...mediaList];
                                      updated[idx].controls = e.target.checked;
                                      setMediaList(updated);
                                    }}
                                    className="rounded"
                                  />
                                  <span>Controls</span>
                                </label>

                                <span className="text-[#ded7cc]">|</span>

                                <input
                                  type="text"
                                  placeholder="Poster / Thumbnail URL"
                                  value={item.posterUrl || ''}
                                  onChange={(e) => {
                                    const updated = [...mediaList];
                                    updated[idx].posterUrl = e.target.value;
                                    setMediaList(updated);
                                  }}
                                  className="bg-white border border-[#ded7cc] px-2 py-0.5 text-[10px] rounded font-mono w-48"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sub-form to add media via URL */}
                <div className="border border-dashed border-[#ded7cc] p-4 rounded-lg bg-[#faf8f5] space-y-3">
                  <span className="text-xs uppercase tracking-wider text-[#18181b] font-semibold block">
                    + Add New Media Item via Direct URL
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <select
                      value={newMediaType}
                      onChange={(e) => setNewMediaType(e.target.value as 'image' | 'video')}
                      className="sm:col-span-2 bg-white border border-[#ded7cc] px-2 py-1.5 text-xs text-[#18181b] rounded font-medium"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video (MP4/WebM)</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Media URL..."
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      className="sm:col-span-5 bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded font-mono"
                    />

                    <input
                      type="text"
                      placeholder="Caption / Alt text (optional)"
                      value={newMediaCaption}
                      onChange={(e) => setNewMediaCaption(e.target.value)}
                      className="sm:col-span-3 bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded"
                    />

                    <button
                      type="button"
                      onClick={handleAddMedia}
                      disabled={!newMediaUrl.trim()}
                      className="sm:col-span-2 bg-[#18181b] text-white px-3 py-1.5 text-xs font-semibold rounded hover:bg-neutral-800 disabled:opacity-40 transition-colors"
                    >
                      + Add Item
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECT INFO & TEXT */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Plan A Production"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="plan-a-production"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                    Year
                  </label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Thailand"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                    Client / Studio
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Plan A Production"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Professional Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead 3D Visualizer & Walkthrough Artist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Short Summary Description (Grid Card)
                </label>
                <textarea
                  rows={2}
                  placeholder="1-2 sentences summarizing the project scope..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Full Narrative Description (Project Detail Page)
                </label>
                <textarea
                  rows={4}
                  placeholder="Comprehensive spatial narrative, workflow, camera decisions, and architectural notes..."
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] leading-relaxed"
                />
              </div>

              {/* Software Tools */}
              <div className="space-y-2 pt-2 border-t border-[#ded7cc]">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Software & Tools Stack
                </label>
                <div className="flex flex-wrap items-center gap-1.5">
                  {softwareStack.map((sw) => (
                    <span
                      key={sw}
                      className="bg-neutral-100 border border-[#ded7cc] text-[#18181b] text-xs px-2.5 py-1 rounded flex items-center gap-1.5"
                    >
                      <span>{sw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSoftware(sw)}
                        className="text-neutral-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 max-w-sm pt-1">
                  <input
                    type="text"
                    placeholder="Add tool (e.g. Lumion, Unreal Engine)..."
                    value={softwareInput}
                    onChange={(e) => setSoftwareInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSoftware();
                      }
                    }}
                    className="flex-1 bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddSoftware}
                    className="bg-[#18181b] text-white px-3 py-1.5 text-xs font-semibold rounded hover:bg-neutral-800"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & SEO */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Publication & Homepage Visibility */}
              <div className="bg-[#faf8f5] border border-[#ded7cc] p-4 rounded-lg space-y-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#18181b] block">
                  Visibility & Display Toggles
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label className="flex items-start gap-3 p-3 bg-white border border-[#ded7cc] rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="mt-0.5 rounded text-[#18181b]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#18181b] block">Published</span>
                      <span className="text-[11px] text-[#787268]">
                        Accessible to public visitors
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white border border-[#ded7cc] rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="mt-0.5 rounded text-[#18181b]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#18181b] block">Featured</span>
                      <span className="text-[11px] text-[#787268]">
                        Highlighted in top showcase
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 bg-white border border-[#ded7cc] rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={homepageVisibility}
                      onChange={(e) => setHomepageVisibility(e.target.checked)}
                      className="mt-0.5 rounded text-[#18181b]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-[#18181b] block">
                        Homepage Visible
                      </span>
                      <span className="text-[11px] text-[#787268]">
                        Show in main portfolio grid
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Index */}
              <div className="space-y-1.5 max-w-xs">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Display Order Index
                </label>
                <input
                  type="number"
                  min="1"
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b] font-mono"
                />
              </div>

              {/* SEO Meta */}
              <div className="space-y-4 pt-4 border-t border-[#ded7cc]">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#18181b] block">
                  Search Engine Optimization (SEO)
                </span>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#524d45] font-medium">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Page title displayed in Google search results..."
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#524d45] font-medium">SEO Meta Description</label>
                  <textarea
                    rows={2}
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Brief description for search engines and social shares..."
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-[#ded7cc] pt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#ded7cc] text-xs font-semibold text-[#524d45] rounded hover:text-[#18181b] hover:bg-[#faf8f5] transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="flex items-center gap-1.5 bg-[#18181b] text-white px-5 py-2 text-xs font-semibold rounded hover:bg-neutral-800 transition-colors shadow-sm"
              >
                <Check className="h-4 w-4" />
                <span>Save Project & Publish</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Media Library Picker Modal */}
      {mediaLibPickerOpen && (
        <MediaLibraryModal
          isOpen={mediaLibPickerOpen}
          selectMode
          onClose={() => setMediaLibPickerOpen(false)}
          onSelectMedia={handleSelectFromLibrary}
        />
      )}
    </div>
  );
};
