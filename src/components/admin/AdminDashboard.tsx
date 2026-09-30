import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Edit3,
  Copy,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown,
  Star,
  CheckCircle,
  Download,
  Upload,
  RotateCcw,
  Cloud,
  ArrowLeft,
  Lock,
  EyeOff,
  FolderOpen,
  Film,
  Image as ImageIcon,
  Globe,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { Project } from '../../types';
import { StorageService } from '../../services/storage';
import { ProjectFormModal } from './ProjectFormModal';
import { CloudflareSettingsModal } from './CloudflareSettingsModal';
import { MediaLibraryModal } from './MediaLibraryModal';
import { DomainConnectModal } from './DomainConnectModal';
import { SiteContentEditor } from './SiteContentEditor';
import { projectHasPlaceholderMedia, countProjectPlaceholders } from '../../services/mediaAudit';

interface AdminDashboardProps {
  projects: Project[];
  onClose: () => void;
  onNavigateToProject: (slug: string) => void;
  initialTab?: 'projects' | 'site_content' | 'media_library';
}

type TabType = 'all' | 'published' | 'drafts' | 'featured' | 'placeholders' | 'site_content' | 'media_library';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  onClose,
  onNavigateToProject,
  initialTab,
}) => {
  // Authentication gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('elle_kay_admin_auth') === 'true' ||
      sessionStorage.getItem('elle_kay_admin_auth') === 'true'
    );
  });
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active filter tab
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (initialTab === 'site_content') return 'site_content';
    if (initialTab === 'media_library') return 'media_library';
    return 'all';
  });

  // Modals state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [mediaLibModalOpen, setMediaLibModalOpen] = useState(false);
  const [cfModalOpen, setCfModalOpen] = useState(false);
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'redrazai@L12') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('elle_kay_admin_auth', 'true');
        sessionStorage.setItem('elle_kay_admin_auth', 'true');
      } catch (err) {
        // Fallback for private browsing storage restrictions
      }
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleCreateNew = () => {
    setEditingProject(null);
    setFormModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormModalOpen(true);
  };

  const handleDuplicate = (id: string) => {
    const dup = StorageService.duplicateProject(id);
    if (dup) {
      showToast(`Duplicated "${dup.title}". Saved as draft.`);
    }
  };

  const handleDelete = (project: Project) => {
    if (window.confirm(`Permanently delete "${project.title}"?`)) {
      StorageService.deleteProject(project.id);
      showToast(`Deleted "${project.title}".`);
    }
  };

  const handleTogglePublish = (id: string) => {
    StorageService.togglePublishStatus(id);
    showToast('Publication state updated.');
  };

  const handleToggleFeatured = (id: string) => {
    StorageService.toggleFeaturedStatus(id);
    showToast('Featured status updated.');
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    StorageService.moveProjectOrder(id, direction);
  };

  const handleExportJSON = () => {
    const dataStr = StorageService.exportProjectsAsJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `elle-kay-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Backup JSON bundle downloaded.');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = StorageService.importProjectsFromJSON(importJsonText);
    if (result.success) {
      setImportModalOpen(false);
      setImportJsonText('');
      showToast(`Imported ${result.count} projects successfully.`);
    } else {
      alert(`Import error: ${result.error}`);
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Reset portfolio projects and site content to default state? Custom uploaded media in the library will be preserved.'
      )
    ) {
      StorageService.resetToDefaults();
      showToast('Restored default projects and site copy.');
    }
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    switch (activeTab) {
      case 'published':
        return projects.filter((p) => p.isPublished);
      case 'drafts':
        return projects.filter((p) => !p.isPublished);
      case 'featured':
        return projects.filter((p) => p.isFeatured);
      case 'placeholders':
        return projects.filter((p) => projectHasPlaceholderMedia(p));
      default:
        return projects;
    }
  }, [projects, activeTab]);

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const draftCount = projects.filter((p) => !p.isPublished).length;
  const featuredCount = projects.filter((p) => p.isFeatured).length;
  const placeholdersCount = projects.filter((p) => projectHasPlaceholderMedia(p)).length;

  // Passcode gate view (in clean Light Mode)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f9f8f5] text-[#18181b] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-sm space-y-8 bg-white border border-[#ded7cc] p-8 rounded-lg shadow-xl text-center">
          <div className="space-y-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#787268] font-mono block">
              Elle Kay Portfolio Studio
            </span>
            <h1 className="font-editorial text-2xl font-light text-[#18181b]">Studio CMS Access</h1>
            <p className="text-xs text-[#524d45]">
              Enter authorized administrator passcode to manage projects and website content
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Passcode..."
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError(false);
                }}
                className={`w-full bg-[#f4f1ea] border px-3 py-2 text-xs text-[#18181b] rounded focus:outline-none transition-colors ${
                  authError
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-[#ded7cc] focus:border-[#18181b]'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-[#787268] hover:text-[#18181b]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {authError && (
              <p className="text-[11px] text-red-600 font-medium">Incorrect administrator passcode.</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#18181b] text-white py-2 text-xs font-semibold uppercase tracking-wider rounded hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Authenticate & Open CMS
            </button>
          </form>

          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 text-xs text-[#787268] hover:text-[#18181b] transition-colors mx-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Portfolio</span>
          </button>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard (100% Light Mode)
  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#18181b] pb-24 font-sans selection:bg-[#18181b] selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#18181b] border border-neutral-700 text-white px-4 py-2 rounded-full shadow-2xl text-xs font-mono animate-fade-in">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-[#ded7cc] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          {/* Brand & Mode info */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-[#787268] hover:text-[#18181b] transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              <span>Public Site</span>
            </button>
            <span className="text-[#ded7cc]">/</span>
            <div className="flex items-center gap-2">
              <span className="font-editorial text-lg tracking-tight text-[#18181b]">Studio CMS</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold">
                Light Mode
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Lock button */}
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('elle_kay_admin_auth');
                  sessionStorage.removeItem('elle_kay_admin_auth');
                } catch (err) {}
                setIsAuthenticated(false);
                setPasscode('');
              }}
              className="flex items-center gap-1.5 border border-[#ded7cc] bg-white text-[#524d45] hover:text-[#18181b] px-3 py-1.5 text-xs rounded transition-colors shadow-sm"
              title="Lock Admin Session"
            >
              <Lock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            {/* Media Library Modal Trigger */}
            <button
              onClick={() => setMediaLibModalOpen(true)}
              className="flex items-center gap-1.5 border border-[#ded7cc] bg-white px-3 py-1.5 text-xs text-[#18181b] hover:bg-[#f4f1ea] rounded shadow-sm font-medium"
            >
              <FolderOpen className="h-3.5 w-3.5 text-blue-600" />
              <span>Media Library</span>
            </button>

            {/* Cloudflare R2 Storage Button */}
            <button
              onClick={() => setCfModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 border border-[#ded7cc] bg-white px-3 py-1.5 text-xs text-[#18181b] hover:bg-[#f4f1ea] rounded shadow-sm"
            >
              <Cloud className="h-3.5 w-3.5 text-amber-600" />
              <span>R2 Storage</span>
            </button>

            {/* Connect Wix Domain Button */}
            <button
              onClick={() => setDomainModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100 rounded transition-colors shadow-sm"
              title="Connect domain purchased on Wix"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              <span>Connect Wix Domain</span>
            </button>

            {/* New Project */}
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 bg-[#18181b] text-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded shadow"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 lg:px-12 pt-8 space-y-6">
        {/* Placeholder Audit Banner (if any project has placeholders) */}
        {placeholdersCount > 0 && (
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded text-amber-800 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  {placeholdersCount} Projects Contain Placeholder Media
                </h4>
                <p className="text-xs text-amber-800">
                  Plan A Production and other projects have demo preview videos or stock placeholders.
                  Click below to view and replace them with real portfolio media.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('placeholders')}
              className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors shrink-0 flex items-center gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Review Placeholders ({placeholdersCount})</span>
            </button>
          </div>
        )}

        {/* Clear Tab Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded7cc] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'bg-white border border-[#ded7cc] text-[#524d45] hover:text-[#18181b]'
              }`}
            >
              ALL PROJECTS ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'published'
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'bg-white border border-[#ded7cc] text-[#524d45] hover:text-[#18181b]'
              }`}
            >
              PUBLISHED ({publishedCount})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'drafts'
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'bg-white border border-[#ded7cc] text-[#524d45] hover:text-[#18181b]'
              }`}
            >
              DRAFTS ({draftCount})
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'featured'
                  ? 'bg-[#18181b] text-white shadow-sm'
                  : 'bg-white border border-[#ded7cc] text-[#524d45] hover:text-[#18181b]'
              }`}
            >
              FEATURED ({featuredCount})
            </button>
            <button
              onClick={() => setActiveTab('placeholders')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'placeholders'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 border border-amber-300 text-amber-900 hover:bg-amber-100'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>PLACEHOLDERS ({placeholdersCount})</span>
            </button>

            <span className="text-[#ded7cc] hidden md:inline">|</span>

            <button
              onClick={() => setActiveTab('site_content')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 shadow-sm ${
                activeTab === 'site_content'
                  ? 'bg-[#877158] text-white font-semibold'
                  : 'bg-white text-[#877158] hover:bg-[#f4f1ea] border border-[#ded7cc]'
              }`}
            >
              <Edit3 className="h-3 w-3" />
              <span>EDIT SITE TEXT & COPY</span>
            </button>

            <button
              onClick={() => setActiveTab('media_library')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 shadow-sm ${
                activeTab === 'media_library'
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-white text-blue-700 hover:bg-[#f4f1ea] border border-[#ded7cc]'
              }`}
            >
              <FolderOpen className="h-3 w-3" />
              <span>MEDIA LIBRARY</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setDomainModalOpen(true)}
              className="flex items-center gap-1 border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-emerald-800 hover:bg-emerald-100 rounded"
              title="Connect custom domain from Wix"
            >
              <Globe className="h-3 w-3 text-emerald-600" />
              <span>Wix Domain</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 border border-[#ded7cc] bg-white px-2.5 py-1 text-[#524d45] hover:text-[#18181b] rounded shadow-sm"
              title="Download backup"
            >
              <Download className="h-3 w-3" />
              <span>Backup</span>
            </button>
            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-1 border border-[#ded7cc] bg-white px-2.5 py-1 text-[#524d45] hover:text-[#18181b] rounded shadow-sm"
              title="Import backup"
            >
              <Upload className="h-3 w-3" />
              <span>Import</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1 border border-red-200 bg-red-50 px-2.5 py-1 text-red-700 hover:bg-red-100 rounded"
              title="Restore initial projects"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Tab View 1: Site Content CMS */}
        {activeTab === 'site_content' && (
          <div className="border border-[#ded7cc] rounded-lg overflow-hidden bg-white shadow-sm">
            <SiteContentEditor onSaved={() => showToast('Changes published.')} />
          </div>
        )}

        {/* Tab View 2: Media Library */}
        {activeTab === 'media_library' && (
          <div className="border border-[#ded7cc] rounded-lg overflow-hidden bg-white shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#ded7cc]">
              <div>
                <h3 className="text-base font-semibold text-[#18181b]">Studio Media Library</h3>
                <p className="text-xs text-[#787268]">Manage, replace, and upload all images and videos</p>
              </div>
              <button
                onClick={() => setMediaLibModalOpen(true)}
                className="bg-[#18181b] text-white px-4 py-2 text-xs font-semibold rounded hover:bg-neutral-800 flex items-center gap-1.5 shadow"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Open Full Media Manager</span>
              </button>
            </div>
            <p className="text-xs text-[#524d45]">
              Click the button above or use the header quick link to upload, preview, replace, or delete any image or video in the library.
            </p>
          </div>
        )}

        {/* Tab View 3: Projects List */}
        {activeTab !== 'site_content' && activeTab !== 'media_library' && (
          <>
            {filteredProjects.length === 0 ? (
              <div className="py-20 text-center border border-dashed border-[#ded7cc] rounded-lg bg-white space-y-2">
                <p className="text-sm text-[#787268]">No projects found in this filter.</p>
                {activeTab === 'placeholders' && (
                  <p className="text-xs text-emerald-700 font-medium">
                    ✓ All projects have custom media! No placeholder files remaining.
                  </p>
                )}
              </div>
            ) : (
              <div className="border border-[#ded7cc] bg-white divide-y divide-[#ede7dd] rounded-lg overflow-hidden shadow-sm">
                {filteredProjects.map((project, idx) => {
                  const hasPlaceholder = projectHasPlaceholderMedia(project);
                  const placeholderCount = countProjectPlaceholders(project);

                  return (
                    <div
                      key={project.id}
                      className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#faf7f2] transition-colors"
                    >
                      {/* Left: Thumbnail & details */}
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        {/* Order control */}
                        <div className="flex flex-col gap-0.5 text-[#787268] shrink-0">
                          <button
                            onClick={() => handleMove(project.id, 'up')}
                            disabled={idx === 0}
                            className="hover:text-[#18181b] disabled:opacity-20 p-0.5"
                            title="Move up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(project.id, 'down')}
                            disabled={idx === filteredProjects.length - 1}
                            className="hover:text-[#18181b] disabled:opacity-20 p-0.5"
                            title="Move down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Thumbnail with video badge */}
                        <div className="h-16 w-24 bg-black overflow-hidden shrink-0 border border-[#ded7cc] rounded relative">
                          {project.coverType === 'video' ? (
                            <video
                              src={project.coverUrl}
                              poster={project.coverPosterUrl}
                              className="h-full w-full object-cover"
                              muted
                            />
                          ) : (
                            <img
                              src={project.coverUrl || project.coverImage}
                              alt={project.title}
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono text-white px-1 uppercase rounded">
                            {project.coverType === 'video' ? 'Video' : `${project.media?.length || 1} items`}
                          </span>
                        </div>

                        {/* Title & metadata */}
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-sm text-[#18181b] truncate">
                              {project.title}
                            </h3>
                            {project.isFeatured && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded font-medium">
                                Featured
                              </span>
                            )}
                            {hasPlaceholder && (
                              <button
                                onClick={() => handleEdit(project)}
                                className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded hover:bg-amber-200 transition-colors"
                                title="Click to replace placeholder video/images"
                              >
                                <AlertTriangle className="h-3 w-3 text-amber-700" />
                                <span>PLACEHOLDER MEDIA ({placeholderCount}) — REPLACE</span>
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-[#787268] truncate">
                            {project.category} · {project.location} · {project.year} {project.client ? `· Client: ${project.client}` : ''}
                          </p>
                          <span className="text-[11px] font-mono text-[#8a847b] block truncate">
                            /project/{project.slug}
                          </span>
                        </div>
                      </div>

                      {/* Status: Published / Draft */}
                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          onClick={() => handleTogglePublish(project.id)}
                          className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                            project.isPublished
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {project.isPublished ? 'Published' : 'Draft'}
                        </button>

                        <button
                          onClick={() => handleToggleFeatured(project.id)}
                          className={`p-1.5 rounded transition-colors ${
                            project.isFeatured
                              ? 'text-amber-500'
                              : 'text-[#a8a196] hover:text-[#18181b]'
                          }`}
                          title={project.isFeatured ? 'Featured on homepage' : 'Mark featured'}
                        >
                          <Star className={`h-4 w-4 ${project.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => onNavigateToProject(project.slug)}
                          className="p-1.5 border border-[#ded7cc] text-[#524d45] hover:text-[#18181b] rounded hover:bg-[#f4f1ea] transition-colors"
                          title="View public page"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDuplicate(project.id)}
                          className="p-1.5 border border-[#ded7cc] text-[#524d45] hover:text-[#18181b] rounded hover:bg-[#f4f1ea] transition-colors"
                          title="Duplicate project"
                        >
                          <Copy className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleEdit(project)}
                          className="flex items-center gap-1.5 bg-[#18181b] hover:bg-neutral-800 text-white px-3 py-1.5 text-xs font-medium rounded transition-colors shadow-sm"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>

                        <button
                          onClick={() => handleDelete(project)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* Project Form Modal (Create / Edit) */}
      <ProjectFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={(updatedProject) => {
          StorageService.saveProject(updatedProject);
          showToast(`Saved "${updatedProject.title}".`);
        }}
        projectToEdit={editingProject}
        existingCount={projects.length}
      />

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={mediaLibModalOpen}
        onClose={() => setMediaLibModalOpen(false)}
      />

      {/* Cloudflare Settings Modal */}
      <CloudflareSettingsModal
        isOpen={cfModalOpen}
        onClose={() => setCfModalOpen(false)}
      />

      {/* Domain Connect Modal for Wix / Custom Domain */}
      <DomainConnectModal
        isOpen={domainModalOpen}
        onClose={() => setDomainModalOpen(false)}
      />

      {/* Import JSON Modal in Light Mode */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white border border-[#ded7cc] p-6 space-y-4 rounded-lg shadow-2xl">
            <h3 className="text-base font-semibold text-[#18181b]">Import Portfolio Backup</h3>
            <p className="text-xs text-[#787268]">Paste raw project JSON array or complete backup bundle to restore.</p>
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <textarea
                rows={8}
                required
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="[ { &quot;id&quot;: &quot;proj-1&quot;, ... } ]"
                className="w-full bg-[#f4f1ea] border border-[#ded7cc] p-3 text-xs text-[#18181b] font-mono focus:outline-none rounded focus:border-[#18181b]"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#787268] hover:text-[#18181b]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#18181b] text-white px-4 py-1.5 text-xs font-semibold rounded hover:bg-neutral-800"
                >
                  Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
