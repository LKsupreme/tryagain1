import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Check,
  Image as ImageIcon,
  Film,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  Layers,
  User,
  Phone,
  Briefcase,
  Compass,
  FolderOpen,
  AlertTriangle,
  Eye,
  EyeOff,
  Video,
} from 'lucide-react';
import {
  SiteContent,
  ServiceItemContent,
  AICreativeStudy,
  ClientRegionItem,
  AboutExperienceItem,
  MediaLibraryItem,
} from '../../types';
import { StorageService } from '../../services/storage';
import { INITIAL_SITE_CONTENT } from '../../data/initialSiteContent';
import { FileUploadDropzone } from './FileUploadDropzone';
import { MediaLibraryModal } from './MediaLibraryModal';
import { isPlaceholderUrl } from '../../services/mediaAudit';

interface SiteContentEditorProps {
  onSaved?: () => void;
}

type ContentTab =
  | 'hero'
  | 'showreel'
  | 'about'
  | 'services'
  | 'aiCreative'
  | 'clients'
  | 'contact'
  | 'footer';

export const SiteContentEditor: React.FC<SiteContentEditorProps> = ({ onSaved }) => {
  const [content, setContent] = useState<SiteContent>(() => StorageService.getSiteContent());
  const [activeTab, setActiveTab] = useState<ContentTab>('hero');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Media Library Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = useState<{
    section: ContentTab;
    field: string;
    index?: number;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    StorageService.saveSiteContent(content);
    showToast('✓ All changes saved and published to live website!');
    if (onSaved) onSaved();
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all website text and sections back to default content?')) {
      const def = StorageService.resetSiteContentToDefaults();
      setContent(def);
      showToast('Website content reset to editorial defaults.');
    }
  };

  const openLibraryForField = (section: ContentTab, field: string, index?: number) => {
    setMediaPickerTarget({ section, field, index });
    setMediaPickerOpen(true);
  };

  const handleMediaSelected = (item: MediaLibraryItem) => {
    if (!mediaPickerTarget) return;
    const { section, field, index } = mediaPickerTarget;

    if (section === 'hero') {
      if (field === 'videoUrl') {
        setContent((prev) => ({
          ...prev,
          hero: { ...prev.hero, videoUrl: item.url, isPlaceholder: false },
        }));
      } else if (field === 'posterUrl') {
        setContent((prev) => ({
          ...prev,
          hero: { ...prev.hero, posterUrl: item.url },
        }));
      }
    } else if (section === 'showreel') {
      if (field === 'videoUrl') {
        setContent((prev) => ({
          ...prev,
          showreel: {
            ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
            videoUrl: item.url,
            isPlaceholder: false,
          },
        }));
      } else if (field === 'posterUrl') {
        setContent((prev) => ({
          ...prev,
          showreel: {
            ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
            posterUrl: item.url,
          },
        }));
      }
    } else if (section === 'about' && field === 'portraitUrl') {
      setContent((prev) => ({
        ...prev,
        about: { ...prev.about, portraitUrl: item.url },
      }));
    } else if (section === 'services' && index !== undefined) {
      const items = [...content.services.items];
      items[index] = {
        ...items[index],
        mediaUrl: item.url,
        type: item.type,
        posterUrl: item.posterUrl,
        isPlaceholder: false,
      };
      setContent((prev) => ({
        ...prev,
        services: { ...prev.services, items },
      }));
    } else if (section === 'aiCreative' && index !== undefined) {
      const studies = [...content.aiCreative.studies];
      studies[index] = {
        ...studies[index],
        mediaUrl: item.url,
        type: item.type,
        posterUrl: item.posterUrl,
        isPlaceholder: false,
      };
      setContent((prev) => ({
        ...prev,
        aiCreative: { ...prev.aiCreative, studies },
      }));
    } else if (section === 'clients' && index !== undefined) {
      const regions = [...content.clients.regions];
      regions[index] = {
        ...regions[index],
        img: item.url,
        isPlaceholder: false,
      };
      setContent((prev) => ({
        ...prev,
        clients: { ...prev.clients, regions },
      }));
    }

    setMediaPickerTarget(null);
  };

  return (
    <div className="bg-white border border-[#ded7cc] rounded-lg shadow-sm overflow-hidden text-[#18181b]">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded7cc] bg-[#faf8f5] px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#18181b] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
              Universal Editor
            </span>
            <h3 className="text-base font-semibold text-[#18181b]">
              Homepage & Site Content Management
            </h3>
          </div>
          <p className="text-xs text-[#787268] mt-0.5">
            Modify any headline, narrative, video, or image across the entire public site without touching code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToDefaults}
            className="flex items-center gap-1.5 border border-[#ded7cc] bg-white text-[#524d45] hover:text-[#18181b] text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-[#18181b] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#ded7cc] bg-[#f4f1ea] px-4 overflow-x-auto">
        {[
          { id: 'hero', label: '1. Hero & Intro', icon: Sparkles },
          { id: 'showreel', label: '2. Showreel', icon: Video },
          { id: 'about', label: '3. About & Bio', icon: User },
          { id: 'services', label: '4. Services', icon: Briefcase },
          { id: 'aiCreative', label: '5. AI Creative', icon: Layers },
          { id: 'clients', label: '6. International', icon: Compass },
          { id: 'contact', label: '7. Contact & Links', icon: Phone },
          { id: 'footer', label: '8. Footer & Branding', icon: ExternalLink },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ContentTab)}
              className={`flex items-center gap-1.5 py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-[#18181b] text-[#18181b] bg-white'
                  : 'border-transparent text-[#787268] hover:text-[#18181b]'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Editor Content Area */}
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-white">
        {/* TAB 1: HERO */}
        {activeTab === 'hero' && (
          <div className="space-y-6 max-w-4xl">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#faf8f5] border border-[#ded7cc] rounded-lg">
              <div>
                <span className="text-xs font-semibold text-[#18181b] block">Hero Section Visibility</span>
                <span className="text-[11px] text-[#787268]">Display hero headline and background video on homepage</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, visibility: prev.hero.visibility === false },
                  }))
                }
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold border ${
                  content.hero.visibility !== false
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                }`}
              >
                {content.hero.visibility !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                <span>{content.hero.visibility !== false ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Hero Eyebrow Tagline
                </label>
                <input
                  type="text"
                  value={content.hero.tagline}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, tagline: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Experience Badge (Bottom Right)
                </label>
                <input
                  type="text"
                  value={content.hero.badge}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                Main Headline
              </label>
              <textarea
                rows={2}
                value={content.hero.heading}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, heading: e.target.value },
                  }))
                }
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-base font-editorial text-[#18181b] rounded focus:outline-none focus:border-[#18181b]"
              />
            </div>

            {/* Hero Background Video & Poster */}
            <div className="border border-[#ded7cc] bg-[#faf8f5] p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                    Hero Cinematic Background Video
                  </span>
                  {(content.hero.isPlaceholder || isPlaceholderUrl(content.hero.videoUrl)) && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                      <AlertTriangle className="h-3 w-3 text-amber-700" />
                      PLACEHOLDER MEDIA — REPLACE
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openLibraryForField('hero', 'videoUrl')}
                  className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Choose from Library</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#524d45] font-medium">MP4 / WebM Video URL</label>
                  <input
                    type="text"
                    value={content.hero.videoUrl}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          videoUrl: e.target.value,
                          isPlaceholder: isPlaceholderUrl(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded font-mono"
                  />
                  <FileUploadDropzone
                    compact
                    accept="video"
                    label="Upload Real Hero Video"
                    category="Hero Video"
                    onUploadSuccess={(item) => {
                      setContent((prev) => ({
                        ...prev,
                        hero: {
                          ...prev.hero,
                          videoUrl: item.url,
                          posterUrl: item.posterUrl || prev.hero.posterUrl,
                          isPlaceholder: false,
                        },
                      }));
                      showToast('Hero video uploaded.');
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#524d45] font-medium">Video Fallback Poster Image</label>
                  <input
                    type="text"
                    value={content.hero.posterUrl}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, posterUrl: e.target.value },
                      }))
                    }
                    className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded font-mono"
                  />
                  <FileUploadDropzone
                    compact
                    accept="image"
                    label="Upload Hero Poster"
                    category="Hero Poster"
                    onUploadSuccess={(item) => {
                      setContent((prev) => ({
                        ...prev,
                        hero: { ...prev.hero, posterUrl: item.url },
                      }));
                      showToast('Hero poster image updated.');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHOWREEL */}
        {activeTab === 'showreel' && (
          <div className="space-y-6 max-w-4xl">
            {/* Visibility Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#faf8f5] border border-[#ded7cc] rounded-lg">
              <div>
                <span className="text-xs font-semibold text-[#18181b] block">Showreel Section Visibility</span>
                <span className="text-[11px] text-[#787268]">Showcase dedicated full-width walkthrough video on homepage</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    showreel: {
                      ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
                      visibility: prev.showreel?.visibility === false,
                    },
                  }))
                }
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold border ${
                  content.showreel?.visibility !== false
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                }`}
              >
                {content.showreel?.visibility !== false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                <span>{content.showreel?.visibility !== false ? 'Visible' : 'Hidden'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={content.showreel?.heading || ''}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      showreel: {
                        ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
                        heading: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Badge / Tagline
                </label>
                <input
                  type="text"
                  value={content.showreel?.badge || ''}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      showreel: {
                        ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
                        badge: e.target.value,
                      },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                Showreel Narrative Description
              </label>
              <textarea
                rows={2}
                value={content.showreel?.description || ''}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    showreel: {
                      ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
                      description: e.target.value,
                    },
                  }))
                }
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded leading-relaxed"
              />
            </div>

            {/* Video file & poster */}
            <div className="border border-[#ded7cc] bg-[#faf8f5] p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                    Showreel Walkthrough Video File (MP4/WebM)
                  </span>
                  {(content.showreel?.isPlaceholder || isPlaceholderUrl(content.showreel?.videoUrl)) && (
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                      <AlertTriangle className="h-3 w-3 text-amber-700" />
                      PLACEHOLDER MEDIA — REPLACE
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openLibraryForField('showreel', 'videoUrl')}
                  className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Choose from Library</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#524d45]">Video Stream or File URL</label>
                  <input
                    type="text"
                    value={content.showreel?.videoUrl || ''}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        showreel: {
                          ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
                          videoUrl: e.target.value,
                          isPlaceholder: isPlaceholderUrl(e.target.value),
                        },
                      }))
                    }
                    className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded font-mono"
                  />
                  <FileUploadDropzone
                    compact
                    accept="video"
                    label="Upload Real Showreel Video"
                    category="Showreel Video"
                    onUploadSuccess={(item) => {
                      setContent((prev) => ({
                        ...prev,
                        showreel: {
                          ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
                          videoUrl: item.url,
                          posterUrl: item.posterUrl || prev.showreel?.posterUrl || '',
                          isPlaceholder: false,
                        },
                      }));
                      showToast('Showreel video uploaded.');
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#524d45]">Showreel Poster Image URL</label>
                  <input
                    type="text"
                    value={content.showreel?.posterUrl || ''}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        showreel: {
                          ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
                          posterUrl: e.target.value,
                        },
                      }))
                    }
                    className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded font-mono"
                  />
                  <FileUploadDropzone
                    compact
                    accept="image"
                    label="Upload Showreel Poster"
                    category="Showreel Poster"
                    onUploadSuccess={(item) => {
                      setContent((prev) => ({
                        ...prev,
                        showreel: {
                          ...(prev.showreel || INITIAL_SITE_CONTENT.showreel!),
                          posterUrl: item.url,
                        },
                      }));
                      showToast('Showreel poster updated.');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ABOUT */}
        {activeTab === 'about' && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Practitioner Name
                </label>
                <input
                  type="text"
                  value={content.about.name}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, name: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Professional Subtitle / Role
                </label>
                <input
                  type="text"
                  value={content.about.role}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      about: { ...prev.about, role: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                Creative Philosophy Quote
              </label>
              <textarea
                rows={2}
                value={content.about.quote}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    about: { ...prev.about, quote: e.target.value },
                  }))
                }
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-base font-editorial text-[#18181b] rounded"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                Full Biography Narrative
              </label>
              <textarea
                rows={5}
                value={content.about.bio}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    about: { ...prev.about, bio: e.target.value },
                  }))
                }
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded leading-relaxed font-light"
              />
            </div>

            {/* Portrait Image Uploader */}
            <div className="border border-[#ded7cc] bg-[#faf8f5] p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Practitioner Portrait Photograph
                </span>
                <button
                  type="button"
                  onClick={() => openLibraryForField('about', 'portraitUrl')}
                  className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium"
                >
                  <FolderOpen className="h-3.5 w-3.5" />
                  <span>Choose from Library</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-3 aspect-[4/5] bg-neutral-200 rounded overflow-hidden max-h-36">
                  <img
                    src={content.about.portraitUrl}
                    alt={content.about.name}
                    className="h-full w-full object-cover filter grayscale"
                  />
                </div>

                <div className="sm:col-span-9 space-y-2">
                  <input
                    type="text"
                    value={content.about.portraitUrl}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, portraitUrl: e.target.value },
                      }))
                    }
                    className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded font-mono"
                  />
                  <FileUploadDropzone
                    compact
                    accept="image"
                    label="Upload Real Portrait Photo"
                    category="Studio Portrait"
                    onUploadSuccess={(item) => {
                      setContent((prev) => ({
                        ...prev,
                        about: { ...prev.about, portraitUrl: item.url },
                      }));
                      showToast('Portrait photo updated.');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={content.services.heading}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      services: { ...prev.services, heading: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={content.services.badge}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      services: { ...prev.services, badge: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>
            </div>

            {/* Individual Services */}
            <div className="space-y-4">
              {content.services.items.map((srv, idx) => {
                const isItemPlaceholder = srv.isPlaceholder || isPlaceholderUrl(srv.mediaUrl);

                return (
                  <div
                    key={srv.id || idx}
                    className="border border-[#ded7cc] bg-[#faf8f5] p-4 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-editorial text-lg text-[#877158]">{srv.number}</span>
                        <span className="text-xs font-semibold text-[#18181b]">{srv.title}</span>
                        {isItemPlaceholder && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                            <AlertTriangle className="h-3 w-3 text-amber-700" />
                            PLACEHOLDER MEDIA
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => openLibraryForField('services', 'mediaUrl', idx)}
                        className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
                      >
                        <FolderOpen className="h-3 w-3" />
                        <span>Pick Media</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => {
                          const items = [...content.services.items];
                          items[idx].title = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            services: { ...prev.services, items },
                          }));
                        }}
                        placeholder="Service title..."
                        className="bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded"
                      />
                      <input
                        type="text"
                        value={srv.scope}
                        onChange={(e) => {
                          const items = [...content.services.items];
                          items[idx].scope = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            services: { ...prev.services, items },
                          }));
                        }}
                        placeholder="Scope deliverables..."
                        className="bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => {
                        const items = [...content.services.items];
                        items[idx].description = e.target.value;
                        setContent((prev) => ({
                          ...prev,
                          services: { ...prev.services, items },
                        }));
                      }}
                      placeholder="Service description narrative..."
                      className="w-full bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded"
                    />

                    {/* Media URL & Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 items-center">
                      <input
                        type="text"
                        value={srv.mediaUrl}
                        onChange={(e) => {
                          const items = [...content.services.items];
                          items[idx].mediaUrl = e.target.value;
                          items[idx].isPlaceholder = isPlaceholderUrl(e.target.value);
                          setContent((prev) => ({
                            ...prev,
                            services: { ...prev.services, items },
                          }));
                        }}
                        placeholder="Visual URL (Image or MP4)"
                        className="sm:col-span-8 bg-white border border-[#ded7cc] px-2.5 py-1 text-xs font-mono text-[#18181b] rounded"
                      />
                      <div className="sm:col-span-4">
                        <FileUploadDropzone
                          compact
                          accept="both"
                          label="Upload Service Visual"
                          category="Services"
                          onUploadSuccess={(item) => {
                            const items = [...content.services.items];
                            items[idx].mediaUrl = item.url;
                            items[idx].type = item.type;
                            items[idx].isPlaceholder = false;
                            setContent((prev) => ({
                              ...prev,
                              services: { ...prev.services, items },
                            }));
                            showToast(`Updated service #${srv.number} visual.`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: AI CREATIVE */}
        {activeTab === 'aiCreative' && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={content.aiCreative.heading}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      aiCreative: { ...prev.aiCreative, heading: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={content.aiCreative.badge}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      aiCreative: { ...prev.aiCreative, badge: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>
            </div>

            <div className="space-y-4">
              {content.aiCreative.studies.map((study, idx) => {
                const isItemPlaceholder = study.isPlaceholder || isPlaceholderUrl(study.mediaUrl);

                return (
                  <div
                    key={study.id || idx}
                    className="border border-[#ded7cc] bg-[#faf8f5] p-4 rounded-lg space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#18181b]">{study.title}</span>
                        {isItemPlaceholder && (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                            <AlertTriangle className="h-3 w-3 text-amber-700" />
                            PLACEHOLDER MEDIA
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => openLibraryForField('aiCreative', 'mediaUrl', idx)}
                        className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
                      >
                        <FolderOpen className="h-3 w-3" />
                        <span>Pick Media</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={study.title}
                        onChange={(e) => {
                          const studies = [...content.aiCreative.studies];
                          studies[idx].title = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            aiCreative: { ...prev.aiCreative, studies },
                          }));
                        }}
                        placeholder="Study title..."
                        className="bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded"
                      />
                      <input
                        type="text"
                        value={study.category}
                        onChange={(e) => {
                          const studies = [...content.aiCreative.studies];
                          studies[idx].category = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            aiCreative: { ...prev.aiCreative, studies },
                          }));
                        }}
                        placeholder="Category (e.g. Spatial Concept, Motion)..."
                        className="bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded"
                      />
                    </div>

                    <textarea
                      rows={2}
                      value={study.prompt}
                      onChange={(e) => {
                        const studies = [...content.aiCreative.studies];
                        studies[idx].prompt = e.target.value;
                        setContent((prev) => ({
                          ...prev,
                          aiCreative: { ...prev.aiCreative, studies },
                        }));
                      }}
                      placeholder="Prompt engineering formula or visual narrative..."
                      className="w-full bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded font-mono text-[11px]"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 items-center">
                      <input
                        type="text"
                        value={study.mediaUrl}
                        onChange={(e) => {
                          const studies = [...content.aiCreative.studies];
                          studies[idx].mediaUrl = e.target.value;
                          studies[idx].isPlaceholder = isPlaceholderUrl(e.target.value);
                          setContent((prev) => ({
                            ...prev,
                            aiCreative: { ...prev.aiCreative, studies },
                          }));
                        }}
                        placeholder="Render or Video URL"
                        className="sm:col-span-8 bg-white border border-[#ded7cc] px-2.5 py-1 text-xs font-mono text-[#18181b] rounded"
                      />
                      <div className="sm:col-span-4">
                        <FileUploadDropzone
                          compact
                          accept="both"
                          label="Upload AI Visual"
                          category="AI Creative"
                          onUploadSuccess={(item) => {
                            const studies = [...content.aiCreative.studies];
                            studies[idx].mediaUrl = item.url;
                            studies[idx].type = item.type;
                            studies[idx].isPlaceholder = false;
                            setContent((prev) => ({
                              ...prev,
                              aiCreative: { ...prev.aiCreative, studies },
                            }));
                            showToast(`Updated AI Study #${idx + 1}.`);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: CLIENTS & REGIONS */}
        {activeTab === 'clients' && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={content.clients.heading}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      clients: { ...prev.clients, heading: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={content.clients.badge}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      clients: { ...prev.clients, badge: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.clients.regions.map((reg, idx) => (
                <div
                  key={reg.id || idx}
                  className="border border-[#ded7cc] bg-[#faf8f5] p-3 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#18181b]">{reg.region}</span>
                    <button
                      type="button"
                      onClick={() => openLibraryForField('clients', 'img', idx)}
                      className="text-xs text-blue-700 hover:text-blue-900 font-medium flex items-center gap-1"
                    >
                      <FolderOpen className="h-3 w-3" />
                      <span>Pick Photo</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    value={reg.region}
                    onChange={(e) => {
                      const regions = [...content.clients.regions];
                      regions[idx].region = e.target.value;
                      setContent((prev) => ({
                        ...prev,
                        clients: { ...prev.clients, regions },
                      }));
                    }}
                    placeholder="Region name..."
                    className="w-full bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded"
                  />

                  <input
                    type="text"
                    value={reg.desc}
                    onChange={(e) => {
                      const regions = [...content.clients.regions];
                      regions[idx].desc = e.target.value;
                      setContent((prev) => ({
                        ...prev,
                        clients: { ...prev.clients, regions },
                      }));
                    }}
                    placeholder="Projects description..."
                    className="w-full bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded"
                  />

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={reg.img}
                      onChange={(e) => {
                        const regions = [...content.clients.regions];
                        regions[idx].img = e.target.value;
                        setContent((prev) => ({
                          ...prev,
                          clients: { ...prev.clients, regions },
                        }));
                      }}
                      placeholder="Image URL..."
                      className="flex-1 bg-white border border-[#ded7cc] px-2.5 py-1 text-xs font-mono text-[#18181b] rounded"
                    />
                    <FileUploadDropzone
                      compact
                      accept="image"
                      label="Upload"
                      category="Clients"
                      onUploadSuccess={(item) => {
                        const regions = [...content.clients.regions];
                        regions[idx].img = item.url;
                        setContent((prev) => ({
                          ...prev,
                          clients: { ...prev.clients, regions },
                        }));
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: CONTACT & LINKS */}
        {activeTab === 'contact' && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Contact Heading
                </label>
                <input
                  type="text"
                  value={content.contact.heading}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, heading: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Section Badge
                </label>
                <input
                  type="text"
                  value={content.contact.badge}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, badge: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Direct Email Address
                </label>
                <input
                  type="email"
                  value={content.contact.email}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, email: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={content.contact.whatsappNumber}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      contact: { ...prev.contact, whatsappNumber: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                WhatsApp Prefilled Message
              </label>
              <textarea
                rows={2}
                value={content.contact.whatsappMessage}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    contact: { ...prev.contact, whatsappMessage: e.target.value },
                  }))
                }
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* TAB 8: FOOTER & BRANDING */}
        {activeTab === 'footer' && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Brand Name (Header & Nav)
                </label>
                <input
                  type="text"
                  value={content.header.brandName}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      header: { ...prev.header, brandName: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Brand Subtitle / Title
                </label>
                <input
                  type="text"
                  value={content.header.brandTitle}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      header: { ...prev.header, brandTitle: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Footer Brand Title
                </label>
                <input
                  type="text"
                  value={content.footer.brandTitle}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, brandTitle: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                  Footer Tagline
                </label>
                <input
                  type="text"
                  value={content.footer.tagline}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      footer: { ...prev.footer, tagline: e.target.value },
                    }))
                  }
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#18181b]">
                Copyright Line
              </label>
              <input
                type="text"
                value={content.footer.copyright}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    footer: { ...prev.footer, copyright: e.target.value },
                  }))
                }
                className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-2 text-xs text-[#18181b] rounded font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#18181b] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-neutral-700 animate-fade-in">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Media Library Picker Modal */}
      {mediaPickerOpen && (
        <MediaLibraryModal
          isOpen={mediaPickerOpen}
          selectMode
          onClose={() => setMediaPickerOpen(false)}
          onSelectMedia={handleMediaSelected}
        />
      )}
    </div>
  );
};
