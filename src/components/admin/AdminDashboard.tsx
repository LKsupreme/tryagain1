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
} from 'lucide-react';
import { Project } from '../../types';
import { StorageService } from '../../services/storage';
import { ProjectFormModal } from './ProjectFormModal';
import { CloudflareSettingsModal } from './CloudflareSettingsModal';
import { MediaLibraryModal } from './MediaLibraryModal';
import { DomainConnectModal } from './DomainConnectModal';
import { SiteContentEditor } from './SiteContentEditor';

interface AdminDashboardProps {
  projects: Project[];
  onClose: () => void;
  onNavigateToProject: (slug: string) => void;
  initialTab?: 'projects' | 'site_content';
}

type TabType = 'all' | 'published' | 'drafts' | 'featured' | 'site_content';

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
  const [activeTab, setActiveTab] = useState<TabType>(
    initialTab === 'site_content' ? 'site_content' : 'all'
  );

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
    showToast('Backup JSON downloaded.');
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = StorageService.importProjectsFromJSON(importJsonText);
    if (result.success) {
      setImportModalOpen(false);
      setImportJsonText('');
      showToast(`Imported ${result.count} projects.`);
    } else {
      alert(`Import error: ${result.error}`);
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Reset portfolio projects to curated defaults? Your custom additions will be restored.'
      )
    ) {
      StorageService.resetToDefaults();
      showToast('Restored default portfolio.');
    }
  };

  // Filtered projects according to tabs
  const filteredProjects = useMemo(() => {
    if (activeTab === 'published') return projects.filter((p) => p.isPublished);
    if (activeTab === 'drafts') return projects.filter((p) => !p.isPublished);
    if (activeTab === 'featured') return projects.filter((p) => p.isPublished && p.isFeatured);
    return projects;
  }, [projects, activeTab]);

  // Passcode gate view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f9f8f5] flex items-center justify-center p-6 text-[#18181b]">
        <div className="w-full max-w-md border border-[#ded7cc] bg-white p-8 space-y-6 rounded-lg shadow-xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-[#787268] hover:text-[#18181b] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Website</span>
            </button>
            <div className="h-7 w-7 rounded-full bg-[#f4f1ea] flex items-center justify-center text-[#787268]">
              <Lock className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-editorial text-2xl font-light text-[#18181b]">Elle Kay Studio CMS</h2>
            <p className="text-xs text-[#787268]">
              Private dashboard to edit website copy, upload renders & videos, and manage projects.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[#787268] block">
                Passcode
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    setAuthError(false);
                  }}
                  placeholder="Enter passcode"
                  className="w-full bg-[#f4f1ea] border border-[#ded7cc] pl-3.5 pr-10 py-2.5 text-sm text-[#18181b] focus:border-[#18181b] focus:outline-none rounded font-mono"
                  autoComplete="current-password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-[#787268] hover:text-[#18181b] transition-colors"
                  aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {authError && <p className="text-xs text-red-600 font-medium">Incorrect passcode.</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#18181b] text-white font-medium text-xs uppercase tracking-wider py-3 hover:bg-neutral-800 transition-colors rounded shadow"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const draftCount = projects.filter((p) => !p.isPublished).length;
  const featuredCount = projects.filter((p) => p.isPublished && p.isFeatured).length;

  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#18181b] pb-24 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#18181b] text-white px-4 py-3 rounded-lg text-xs shadow-2xl">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Practical Header in Light Mode */}
      <header className="sticky top-0 z-40 border-b border-[#ded7cc] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs text-[#524d45] hover:text-[#18181b] border border-[#ded7cc] px-3 py-1.5 rounded bg-[#f4f1ea] hover:bg-[#ede7dd] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>View Portfolio</span>
            </button>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('elle_kay_admin_auth');
                  sessionStorage.removeItem('elle_kay_admin_auth');
                } catch (err) {}
                setIsAuthenticated(false);
                setPasscode('');
              }}
              className="flex items-center gap-1.5 text-xs text-[#787268] hover:text-rose-600 border border-[#ded7cc] px-2.5 py-1.5 rounded bg-[#f4f1ea] transition-colors"
              title="Lock CMS / Log out"
            >
              <Lock className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
            <span className="font-editorial text-lg text-[#18181b] hidden md:inline border-l border-[#ded7cc] pl-3">
              Elle Kay Studio CMS
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Media Library Button */}
            <button
              onClick={() => setMediaLibModalOpen(true)}
              className="flex items-center gap-1.5 border border-[#ded7cc] bg-white px-3 py-1.5 text-xs text-[#18181b] hover:bg-[#f4f1ea] rounded shadow-sm"
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

            {/* Site Content & Copy Editor Button */}
            <button
              onClick={() => setActiveTab(activeTab === 'site_content' ? 'all' : 'site_content')}
              className={`flex items-center gap-1.5 border px-3 py-1.5 text-xs rounded transition-colors shadow-sm ${
                activeTab === 'site_content'
                  ? 'bg-[#18181b] text-white border-[#18181b] font-semibold'
                  : 'border-[#ded7cc] bg-amber-50 text-[#877158] hover:bg-amber-100 font-medium'
              }`}
              title="Edit all text and upload section media across the entire website"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Site Text & Copy</span>
            </button>

            {/* Connect Wix Domain Button */}
            <button
              onClick={() => setDomainModalOpen(true)}
              className="flex items-center gap-1.5 border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 hover:bg-emerald-100 rounded transition-colors shadow-sm"
              title="Connect domain purchased on Wix"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Connect Wix Domain</span>
              <span className="sm:hidden">Domain</span>
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
      <main className="mx-auto max-w-7xl px-6 lg:px-12 pt-8 space-y-8">
        {/* Clear Tab Navigation (PROJECTS, DRAFTS, PUBLISHED, FEATURED, SITE CONTENT) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ded7cc] pb-4">
          <div className="flex items-center gap-2">
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

        {/* Site Content CMS or Projects List */}
        {activeTab === 'site_content' ? (
          <div className="border border-[#ded7cc] rounded-lg overflow-hidden bg-white shadow-sm">
            <SiteContentEditor onNavigateToPreview={onClose} />
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#ded7cc] rounded-lg bg-white">
            <p className="text-sm text-[#787268]">No projects found in this tab.</p>
          </div>
        ) : (
          <div className="border border-[#ded7cc] bg-white divide-y divide-[#ede7dd] rounded-lg overflow-hidden shadow-sm">
            {filteredProjects.map((project, idx) => (
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
                  <div className="h-14 w-20 bg-[#ede7dd] overflow-hidden shrink-0 border border-[#ded7cc] rounded relative">
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
                    <span className="absolute bottom-0.5 right-0.5 bg-black/75 text-[8px] text-white px-1 uppercase rounded">
                      {project.coverType === 'video' ? 'Video' : `${project.media?.length || 1} items`}
                    </span>
                  </div>

                  {/* Title & metadata */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-[#18181b] truncate">
                        {project.title}
                      </h3>
                      {project.isFeatured && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#787268] truncate">
                      {project.category} · {project.location} · {project.year}
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
            ))}
          </div>
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
            <p className="text-xs text-[#787268]">Paste raw project JSON array to restore.</p>
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
