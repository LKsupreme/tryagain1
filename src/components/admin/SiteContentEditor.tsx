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
} from 'lucide-react';
import { SiteContent, ServiceItemContent, AICreativeStudy, ClientRegionItem, AboutExperienceItem } from '../../types';
import { StorageService } from '../../services/storage';
import { FileUploadDropzone } from './FileUploadDropzone';

interface SiteContentEditorProps {
  onClose?: () => void;
  onNavigateToPreview?: () => void;
}

type ContentTab = 'hero' | 'about' | 'services' | 'aiCreative' | 'clients' | 'contact' | 'branding';

export const SiteContentEditor: React.FC<SiteContentEditorProps> = ({
  onClose,
  onNavigateToPreview,
}) => {
  const [content, setContent] = useState<SiteContent>(() => StorageService.getSiteContent());
  const [activeTab, setActiveTab] = useState<ContentTab>('hero');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    StorageService.saveSiteContent(content);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Reset all website text and copy back to original editorial defaults?')) {
      const reset = StorageService.resetSiteContentToDefaults();
      setContent(reset);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 2500);
    }
  };

  // Helper updates
  const updateHero = (field: keyof SiteContent['hero'], value: any) => {
    setContent((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateAbout = (field: keyof SiteContent['about'], value: any) => {
    setContent((prev) => ({ ...prev, about: { ...prev.about, [field]: value } }));
  };

  const updateContact = (field: keyof SiteContent['contact'], value: any) => {
    setContent((prev) => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  };

  const updateBranding = (section: 'header' | 'footer', field: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f8f5] text-[#18181b]">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded7cc] bg-white px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-editorial text-lg text-[#18181b]">Website Text &amp; Media CMS</h3>
            <span className="text-[10px] font-mono tracking-wider bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-2 py-0.5 rounded">
              Universal Editor
            </span>
          </div>
          <p className="text-xs text-[#787268]">
            Edit headlines, biography, services, contact channels, and upload custom images or videos.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#524d45] hover:text-[#18181b] border border-[#ded7cc] rounded hover:bg-[#f4f1ea] bg-white transition-colors shadow-sm font-medium"
            title="Reset site text to original defaults"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          {onNavigateToPreview && (
            <button
              type="button"
              onClick={onNavigateToPreview}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#524d45] hover:text-[#18181b] border border-[#ded7cc] rounded hover:bg-[#f4f1ea] bg-white transition-colors shadow-sm font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Preview Site</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            className="flex items-center gap-1.5 bg-[#18181b] text-white px-4 py-1.5 text-xs font-semibold rounded hover:bg-neutral-800 transition-colors shadow"
          >
            {savedSuccess ? <Check className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
            <span>{savedSuccess ? 'Changes Saved' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex border-b border-[#ded7cc] bg-[#faf8f5] px-6 overflow-x-auto">
        {[
          { id: 'hero', label: '1. Hero Section', icon: Compass },
          { id: 'about', label: '2. Biography & About', icon: User },
          { id: 'services', label: '3. Services (5 Cards)', icon: Briefcase },
          { id: 'aiCreative', label: '4. AI Creative Studies', icon: Sparkles },
          { id: 'clients', label: '5. Client Regions', icon: Layers },
          { id: 'contact', label: '6. Contact & Socials', icon: Phone },
          { id: 'branding', label: '7. Header & Footer', icon: Compass },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ContentTab)}
              className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-[#18181b] text-[#18181b] bg-white font-semibold shadow-sm'
                  : 'border-transparent text-[#787268] hover:text-[#18181b]'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#18181b]' : 'text-[#a8a196]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Body */}
      <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-8 bg-[#f9f8f5]">
        {/* ================= HERO TAB ================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="border border-[#ded7cc] bg-white p-5 rounded-lg space-y-5 shadow-sm">
              <h4 className="text-sm font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                Hero Section Copy &amp; Cinematics
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                    Top Sub-Tagline
                  </label>
                  <input
                    type="text"
                    value={content.hero.tagline}
                    onChange={(e) => updateHero('tagline', e.target.value)}
                    placeholder="e.g. AI Creative Artist · 3D Designer"
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded focus:border-[#18181b] focus:outline-none focus:bg-white shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                    Bottom Badge / Experience Note
                  </label>
                  <input
                    type="text"
                    value={content.hero.badge}
                    onChange={(e) => updateHero('badge', e.target.value)}
                    placeholder="e.g. 7+ Years Experience · Generative AI Workflows"
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded focus:border-[#18181b] focus:outline-none focus:bg-white shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                  Main Editorial Headline
                </label>
                <textarea
                  rows={2}
                  value={content.hero.heading}
                  onChange={(e) => updateHero('heading', e.target.value)}
                  placeholder="e.g. Visualizing ideas across 3D, design and AI."
                  className="w-full bg-[#faf8f5] border border-[#ded7cc] p-3 text-sm text-[#18181b] font-editorial rounded focus:border-[#18181b] focus:outline-none focus:bg-white shadow-sm"
                />
              </div>

              {/* Hero Video & Poster Upload */}
              <div className="border-t border-[#ded7cc] pt-4 space-y-4">
                <span className="text-xs uppercase tracking-wider text-[#18181b] font-mono font-semibold block">
                  Hero Background Cinematic (Video / Render)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Video file upload */}
                  <div className="space-y-2 bg-[#faf8f5] p-3.5 rounded-lg border border-[#ded7cc]">
                    <label className="text-xs text-[#524d45] font-semibold block">
                      Background Video URL or Upload MP4
                    </label>
                    <input
                      type="text"
                      value={content.hero.videoUrl}
                      onChange={(e) => updateHero('videoUrl', e.target.value)}
                      placeholder="https://...mp4 or local path"
                      className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] font-mono rounded shadow-sm focus:outline-none focus:border-[#18181b]"
                    />
                    <FileUploadDropzone
                      accept="video"
                      label="Upload Hero Video (MP4 / WebM)"
                      category="Hero"
                      onUploadSuccess={(item) => updateHero('videoUrl', item.url)}
                    />
                  </div>

                  {/* Poster Image upload */}
                  <div className="space-y-2 bg-[#faf8f5] p-3.5 rounded-lg border border-[#ded7cc]">
                    <label className="text-xs text-[#524d45] font-semibold block">
                      Poster Image URL or Upload Image
                    </label>
                    <input
                      type="text"
                      value={content.hero.posterUrl}
                      onChange={(e) => updateHero('posterUrl', e.target.value)}
                      placeholder="Image URL shown while video loads"
                      className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] font-mono rounded shadow-sm focus:outline-none focus:border-[#18181b]"
                    />
                    <FileUploadDropzone
                      accept="image"
                      label="Upload Hero Poster (JPG / WebP)"
                      category="Hero"
                      onUploadSuccess={(item) => updateHero('posterUrl', item.url)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABOUT TAB ================= */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div className="border border-[#ded7cc] bg-white p-5 rounded-lg space-y-5 shadow-sm">
              <h4 className="text-sm font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                Studio Biography &amp; Creative Profile
              </h4>

              {/* Portrait Image */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                <div className="sm:col-span-4 space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                    Elle Kay Portrait
                  </span>
                  <div className="aspect-[4/5] bg-[#ede7dd] border border-[#ded7cc] overflow-hidden rounded relative shadow-sm">
                    <img
                      src={content.about.portraitUrl}
                      alt="Elle Kay portrait"
                      className="h-full w-full object-cover filter grayscale contrast-105"
                    />
                  </div>
                  <FileUploadDropzone
                    compact
                    accept="image"
                    label="Upload Portrait Image"
                    category="Bio"
                    onUploadSuccess={(item) => updateAbout('portraitUrl', item.url)}
                  />
                  <input
                    type="text"
                    value={content.about.portraitUrl}
                    onChange={(e) => updateAbout('portraitUrl', e.target.value)}
                    placeholder="Portrait URL"
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-2.5 py-1 text-[11px] text-[#18181b] font-mono rounded shadow-sm"
                  />
                </div>

                <div className="sm:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                        Artist Name
                      </label>
                      <input
                        type="text"
                        value={content.about.name}
                        onChange={(e) => updateAbout('name', e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded shadow-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                        Section Badge
                      </label>
                      <input
                        type="text"
                        value={content.about.sectionBadge}
                        onChange={(e) => updateAbout('sectionBadge', e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                      Professional Role Tagline
                    </label>
                    <input
                      type="text"
                      value={content.about.role}
                      onChange={(e) => updateAbout('role', e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                      Featured Quote / Manifesto
                    </label>
                    <input
                      type="text"
                      value={content.about.quote}
                      onChange={(e) => updateAbout('quote', e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-sm text-[#18181b] font-editorial rounded shadow-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase tracking-wider text-[#524d45] font-semibold block">
                      Editorial Biography (80–120 Words)
                    </label>
                    <textarea
                      rows={5}
                      value={content.about.bio}
                      onChange={(e) => updateAbout('bio', e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#ded7cc] p-3 text-xs leading-relaxed text-[#18181b] rounded focus:border-[#18181b] focus:outline-none shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* 3 Experience Stats */}
              <div className="border-t border-[#ded7cc] pt-5 space-y-3">
                <span className="text-xs uppercase tracking-wider text-[#18181b] font-mono font-semibold block">
                  Key Experience Indicators
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#faf8f5] p-3 border border-[#ded7cc] rounded-lg space-y-1.5 shadow-sm">
                    <input
                      type="text"
                      value={content.about.stat1Value}
                      onChange={(e) => updateAbout('stat1Value', e.target.value)}
                      className="w-full bg-white text-sm text-[#18181b] font-editorial font-bold px-2 py-1 rounded border border-[#ded7cc]"
                    />
                    <input
                      type="text"
                      value={content.about.stat1Label}
                      onChange={(e) => updateAbout('stat1Label', e.target.value)}
                      className="w-full bg-transparent text-[11px] text-[#787268] px-1 font-medium"
                    />
                  </div>

                  <div className="bg-[#faf8f5] p-3 border border-[#ded7cc] rounded-lg space-y-1.5 shadow-sm">
                    <input
                      type="text"
                      value={content.about.stat2Value}
                      onChange={(e) => updateAbout('stat2Value', e.target.value)}
                      className="w-full bg-white text-sm text-[#18181b] font-editorial font-bold px-2 py-1 rounded border border-[#ded7cc]"
                    />
                    <input
                      type="text"
                      value={content.about.stat2Label}
                      onChange={(e) => updateAbout('stat2Label', e.target.value)}
                      className="w-full bg-transparent text-[11px] text-[#787268] px-1 font-medium"
                    />
                  </div>

                  <div className="bg-[#faf8f5] p-3 border border-[#ded7cc] rounded-lg space-y-1.5 shadow-sm">
                    <input
                      type="text"
                      value={content.about.stat3Value}
                      onChange={(e) => updateAbout('stat3Value', e.target.value)}
                      className="w-full bg-white text-sm text-[#18181b] font-editorial font-bold px-2 py-1 rounded border border-[#ded7cc]"
                    />
                    <input
                      type="text"
                      value={content.about.stat3Label}
                      onChange={(e) => updateAbout('stat3Label', e.target.value)}
                      className="w-full bg-transparent text-[11px] text-[#787268] px-1 font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SERVICES TAB ================= */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="border border-[#ded7cc] bg-white p-5 rounded-lg space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                    Services &amp; Visual Scope
                  </h4>
                  <p className="text-xs text-[#787268]">
                    Edit titles, scope tags, descriptions, and upload unique renders/videos for each service.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#ded7cc]">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Section Title</label>
                  <input
                    type="text"
                    value={content.services.heading}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        services: { ...prev.services, heading: e.target.value },
                      }))
                    }
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Section Badge</label>
                  <input
                    type="text"
                    value={content.services.badge}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        services: { ...prev.services, badge: e.target.value },
                      }))
                    }
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
              </div>

              {/* Service Cards List */}
              <div className="space-y-6 pt-2">
                {content.services.items.map((srv, index) => (
                  <div
                    key={srv.id || index}
                    className="border border-[#ded7cc] bg-[#faf8f5] p-4 rounded-lg space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-[#ded7cc] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-editorial text-[#877158] font-bold text-base">
                          {srv.number}
                        </span>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => {
                            const newItems = [...content.services.items];
                            newItems[index].title = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              services: { ...prev.services, items: newItems },
                            }));
                          }}
                          className="bg-transparent font-editorial text-lg text-[#18181b] focus:outline-none border-b border-dashed border-[#ded7cc] focus:border-[#18181b] px-1 font-semibold"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={srv.type}
                          onChange={(e) => {
                            const newItems = [...content.services.items];
                            newItems[index].type = e.target.value as 'image' | 'video';
                            setContent((prev) => ({
                              ...prev,
                              services: { ...prev.services, items: newItems },
                            }));
                          }}
                          className="bg-white border border-[#ded7cc] text-xs text-[#18181b] px-2 py-1 rounded shadow-sm font-medium"
                        >
                          <option value="image">Image Render</option>
                          <option value="video">Cinematic Video</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-[#524d45] font-mono font-semibold block">Scope Subtitle</label>
                        <input
                          type="text"
                          value={srv.scope}
                          onChange={(e) => {
                            const newItems = [...content.services.items];
                            newItems[index].scope = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              services: { ...prev.services, items: newItems },
                            }));
                          }}
                          className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded shadow-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-[#524d45] font-mono font-semibold block">Description</label>
                        <input
                          type="text"
                          value={srv.description}
                          onChange={(e) => {
                            const newItems = [...content.services.items];
                            newItems[index].description = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              services: { ...prev.services, items: newItems },
                            }));
                          }}
                          className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded shadow-sm"
                        />
                      </div>
                    </div>

                    {/* Media Upload for Service */}
                    <div className="pt-2 border-t border-[#ded7cc] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={srv.mediaUrl}
                          onChange={(e) => {
                            const newItems = [...content.services.items];
                            newItems[index].mediaUrl = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              services: { ...prev.services, items: newItems },
                            }));
                          }}
                          placeholder="Media URL (R2, CDN, or uploaded asset)"
                          className="w-full bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] font-mono rounded shadow-sm"
                        />
                      </div>
                      <FileUploadDropzone
                        compact
                        accept={srv.type}
                        label={`Upload ${srv.type === 'video' ? 'Video' : 'Render'}`}
                        category="Services"
                        onUploadSuccess={(item) => {
                          const newItems = [...content.services.items];
                          newItems[index].mediaUrl = item.url;
                          newItems[index].type = item.type;
                          setContent((prev) => ({
                            ...prev,
                            services: { ...prev.services, items: newItems },
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= AI CREATIVE TAB ================= */}
        {activeTab === 'aiCreative' && (
          <div className="space-y-6">
            <div className="border border-[#ded7cc] bg-white p-5 rounded-lg space-y-4 shadow-sm">
              <h4 className="text-sm font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                Generative AI Practice &amp; Prompt Studies
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#ded7cc]">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Section Heading</label>
                  <input
                    type="text"
                    value={content.aiCreative.heading}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        aiCreative: { ...prev.aiCreative, heading: e.target.value },
                      }))
                    }
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Section Badge</label>
                  <input
                    type="text"
                    value={content.aiCreative.badge}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        aiCreative: { ...prev.aiCreative, badge: e.target.value },
                      }))
                    }
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
              </div>

              {/* AI Studies List */}
              <div className="space-y-4 pt-2">
                {content.aiCreative.studies.map((study, idx) => (
                  <div
                    key={study.id || idx}
                    className="border border-[#ded7cc] bg-[#faf8f5] p-4 rounded-lg space-y-3 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-[#ded7cc] pb-2">
                      <input
                        type="text"
                        value={study.title}
                        onChange={(e) => {
                          const newStudies = [...content.aiCreative.studies];
                          newStudies[idx].title = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            aiCreative: { ...prev.aiCreative, studies: newStudies },
                          }));
                        }}
                        className="bg-transparent font-medium text-[#18181b] text-sm focus:outline-none border-b border-dashed border-[#ded7cc] px-1 font-semibold"
                        placeholder="Study Title"
                      />

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={study.category}
                          onChange={(e) => {
                            const newStudies = [...content.aiCreative.studies];
                            newStudies[idx].category = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              aiCreative: { ...prev.aiCreative, studies: newStudies },
                            }));
                          }}
                          placeholder="Category"
                          className="bg-white border border-[#ded7cc] text-xs text-amber-800 font-medium px-2 py-1 rounded shadow-sm"
                        />
                        <select
                          value={study.type}
                          onChange={(e) => {
                            const newStudies = [...content.aiCreative.studies];
                            newStudies[idx].type = e.target.value as 'image' | 'video';
                            setContent((prev) => ({
                              ...prev,
                              aiCreative: { ...prev.aiCreative, studies: newStudies },
                            }));
                          }}
                          className="bg-white border border-[#ded7cc] text-xs text-[#18181b] px-2 py-1 rounded shadow-sm font-medium"
                        >
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-[#524d45] font-mono font-semibold block">Generative Prompt</label>
                      <textarea
                        rows={2}
                        value={study.prompt}
                        onChange={(e) => {
                          const newStudies = [...content.aiCreative.studies];
                          newStudies[idx].prompt = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            aiCreative: { ...prev.aiCreative, studies: newStudies },
                          }));
                        }}
                        className="w-full bg-white border border-[#ded7cc] p-2 text-xs text-[#18181b] font-mono rounded shadow-sm"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="text"
                        value={study.mediaUrl}
                        onChange={(e) => {
                          const newStudies = [...content.aiCreative.studies];
                          newStudies[idx].mediaUrl = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            aiCreative: { ...prev.aiCreative, studies: newStudies },
                          }));
                        }}
                        placeholder="Media URL"
                        className="flex-1 bg-white border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] font-mono rounded shadow-sm"
                      />
                      <FileUploadDropzone
                        compact
                        accept={study.type}
                        label="Upload Asset"
                        category="AI Studies"
                        onUploadSuccess={(item) => {
                          const newStudies = [...content.aiCreative.studies];
                          newStudies[idx].mediaUrl = item.url;
                          newStudies[idx].type = item.type;
                          setContent((prev) => ({
                            ...prev,
                            aiCreative: { ...prev.aiCreative, studies: newStudies },
                          }));
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= CLIENTS TAB ================= */}
        {activeTab === 'clients' && (
          <div className="space-y-6">
            <div className="border border-[#ded7cc] bg-white p-5 rounded-lg space-y-4 shadow-sm">
              <h4 className="text-sm font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                International Clients &amp; Regional Presence
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#ded7cc]">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Heading Countries</label>
                  <input
                    type="text"
                    value={content.clients.heading}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        clients: { ...prev.clients, heading: e.target.value },
                      }))
                    }
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded font-editorial shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Section Badge</label>
                  <input
                    type="text"
                    value={content.clients.badge}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        clients: { ...prev.clients, badge: e.target.value },
                      }))
                    }
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {content.clients.regions.map((reg, index) => (
                  <div key={reg.id || index} className="bg-[#faf8f5] border border-[#ded7cc] p-3 rounded-lg space-y-2 shadow-sm">
                    <div className="aspect-[4/3] bg-[#ede7dd] overflow-hidden rounded relative">
                      <img src={reg.img} alt={reg.region} className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={reg.region}
                        onChange={(e) => {
                          const newRegions = [...content.clients.regions];
                          newRegions[index].region = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            clients: { ...prev.clients, regions: newRegions },
                          }));
                        }}
                        className="w-full bg-white text-xs font-semibold text-[#18181b] px-2 py-1 rounded border border-[#ded7cc] shadow-sm"
                      />
                      <input
                        type="text"
                        value={reg.desc}
                        onChange={(e) => {
                          const newRegions = [...content.clients.regions];
                          newRegions[index].desc = e.target.value;
                          setContent((prev) => ({
                            ...prev,
                            clients: { ...prev.clients, regions: newRegions },
                          }));
                        }}
                        className="w-full bg-transparent text-[11px] text-[#787268] px-1 font-medium"
                      />
                    </div>
                    <FileUploadDropzone
                      compact
                      accept="image"
                      label="Replace Image"
                      category="Clients"
                      onUploadSuccess={(item) => {
                        const newRegions = [...content.clients.regions];
                        newRegions[index].img = item.url;
                        setContent((prev) => ({
                          ...prev,
                          clients: { ...prev.clients, regions: newRegions },
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= CONTACT TAB ================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="border border-[#ded7cc] bg-white p-5 rounded-lg space-y-4 shadow-sm">
              <h4 className="text-sm font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                Contact Channels &amp; Inquiries
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Section Badge</label>
                  <input
                    type="text"
                    value={content.contact.badge}
                    onChange={(e) => updateContact('badge', e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Heading CTA</label>
                  <input
                    type="text"
                    value={content.contact.heading}
                    onChange={(e) => updateContact('heading', e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3 py-1.5 text-xs text-[#18181b] font-editorial rounded shadow-sm"
                  />
                </div>
              </div>

              {/* Direct channels */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#ded7cc]">
                <div className="bg-[#faf8f5] p-3 border border-[#ded7cc] rounded-lg space-y-2 shadow-sm">
                  <span className="text-[11px] font-mono uppercase text-amber-800 font-bold block">Email Inquiries</span>
                  <input
                    type="email"
                    value={content.contact.email}
                    onChange={(e) => updateContact('email', e.target.value)}
                    className="w-full bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded shadow-sm"
                  />
                  <input
                    type="text"
                    value={content.contact.emailLabel}
                    onChange={(e) => updateContact('emailLabel', e.target.value)}
                    className="w-full bg-transparent text-[10px] text-[#787268] px-1 font-medium"
                  />
                </div>

                <div className="bg-[#faf8f5] p-3 border border-[#ded7cc] rounded-lg space-y-2 shadow-sm">
                  <span className="text-[11px] font-mono uppercase text-emerald-800 font-bold block">WhatsApp Direct</span>
                  <input
                    type="text"
                    value={content.contact.whatsappNumber}
                    onChange={(e) => updateContact('whatsappNumber', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="w-full bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded shadow-sm"
                  />
                  <input
                    type="text"
                    value={content.contact.whatsappMessage}
                    onChange={(e) => updateContact('whatsappMessage', e.target.value)}
                    placeholder="Prefilled message"
                    className="w-full bg-transparent text-[10px] text-[#787268] px-1 font-medium"
                  />
                </div>

                <div className="bg-[#faf8f5] p-3 border border-[#ded7cc] rounded-lg space-y-2 shadow-sm">
                  <span className="text-[11px] font-mono uppercase text-purple-800 font-bold block">Instagram / Social</span>
                  <input
                    type="text"
                    value={content.contact.instagram}
                    onChange={(e) => updateContact('instagram', e.target.value)}
                    placeholder="@ellekay.design"
                    className="w-full bg-white border border-[#ded7cc] px-2.5 py-1 text-xs text-[#18181b] rounded shadow-sm"
                  />
                  <input
                    type="text"
                    value={content.contact.instagramUrl}
                    onChange={(e) => updateContact('instagramUrl', e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-transparent text-[10px] text-[#787268] px-1 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= BRANDING TAB ================= */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="border border-[#ded7cc] bg-white p-5 rounded-lg space-y-5 shadow-sm">
              <h4 className="text-sm font-semibold text-[#18181b] uppercase tracking-wider font-mono">
                Header &amp; Footer Studio Identity
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Logo / Brand Name</label>
                  <input
                    type="text"
                    value={content.header.brandName}
                    onChange={(e) => updateBranding('header', 'brandName', e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Header Subtitle</label>
                  <input
                    type="text"
                    value={content.header.brandTitle}
                    onChange={(e) => updateBranding('header', 'brandTitle', e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#ded7cc]">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Footer Studio Tagline</label>
                  <input
                    type="text"
                    value={content.footer.tagline}
                    onChange={(e) => updateBranding('footer', 'tagline', e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[#524d45] font-semibold block">Copyright Text</label>
                  <input
                    type="text"
                    value={content.footer.copyright}
                    onChange={(e) => updateBranding('footer', 'copyright', e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#ded7cc] px-3.5 py-2 text-xs text-[#18181b] rounded shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
