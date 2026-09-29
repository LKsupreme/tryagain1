import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
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
  Unlock,
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

interface AdminDashboardProps {
  projects: Project[];
  onClose: () => void;
  onNavigateToProject: (slug: string) => void;
}

type TabType = 'all' | 'published' | 'drafts' | 'featured';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  projects,
  onClose,
  onNavigateToProject,
}) => {
  // Authentication gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('elle_kay_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active filter tab
  const [activeTab, setActiveTab] = useState<TabType>('all');

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
    if (passcode.trim().toLowerCase() === 'elle2026' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('elle_kay_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('elle_kay_admin_auth', 'true');
    setAuthError(false);
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
      <div className="min-h-screen bg-[#0d0d10] flex items-center justify-center p-6 text-white">
        <div className="w-full max-w-md border border-[#27272e] bg-[#141418] p-8 space-y-6 rounded-md shadow-2xl">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-[#9b9ba4] hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Website</span>
            </button>
            <Lock className="h-4 w-4 text-[#71717a]" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-white">Elle Kay Studio CMS</h2>
            <p className="text-xs text-[#9b9ba4]">
              Private dashboard to manage projects, videos, and media library.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#9b9ba4] block">
                Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Enter passcode (hint: elle2026)"
                className="w-full bg-[#1c1c22] border border-[#2e2e38] px-3.5 py-2.5 text-sm text-white focus:border-white focus:outline-none rounded"
              />
              {authError && <p className="text-xs text-red-400">Incorrect passcode.</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-medium text-xs uppercase tracking-wider py-2.5 hover:bg-neutral-200 transition-colors rounded"
            >
              Unlock Dashboard
            </button>

            <button
              type="button"
              onClick={handleQuickUnlock}
              className="w-full border border-[#2e2e38] bg-[#18181e] text-[#9b9ba4] text-xs py-2 hover:text-white transition-colors flex items-center justify-center gap-1.5 rounded"
            >
              <Unlock className="h-3.5 w-3.5" />
              <span>Quick Unlock (Owner)</span>
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
    <div className="min-h-screen bg-[#0d0d10] text-[#e4e4e7] pb-24 font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1c1c22] border border-[#3f3f4c] text-white px-4 py-3 rounded text-xs shadow-2xl">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Practical Header */}
      <header className="sticky top-0 z-40 border-b border-[#22222a] bg-[#121216]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-xs text-[#a1a1aa] hover:text-white border border-[#2b2b35] px-3 py-1.5 rounded bg-[#18181f]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>View Portfolio</span>
            </button>
            <span className="font-semibold text-sm text-white">Elle Kay CMS</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Media Library Button */}
            <button
              onClick={() => setMediaLibModalOpen(true)}
              className="flex items-center gap-1.5 border border-[#2b2b35] bg-[#18181f] px-3 py-1.5 text-xs text-[#d4d4d8] hover:border-[#444452] rounded"
            >
              <FolderOpen className="h-3.5 w-3.5 text-blue-400" />
              <span>Media Library</span>
            </button>

            {/* Cloudflare R2 Storage Button */}
            <button
              onClick={() => setCfModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 border border-[#2b2b35] bg-[#18181f] px-3 py-1.5 text-xs text-[#d4d4d8] hover:border-[#444452] rounded"
            >
              <Cloud className="h-3.5 w-3.5 text-orange-400" />
              <span>R2 Storage</span>
            </button>

            {/* Connect Wix Domain Button */}
            <button
              onClick={() => setDomainModalOpen(true)}
              className="flex items-center gap-1.5 border border-emerald-800/60 bg-emerald-950/40 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-900/40 hover:text-white rounded transition-colors"
              title="Connect domain purchased on Wix"
            >
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Connect Wix Domain</span>
              <span className="sm:hidden">Domain</span>
            </button>

            {/* New Project */}
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-1.5 bg-white text-black px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors rounded shadow"
            >
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-6 lg:px-12 pt-8 space-y-8">
        {/* Clear Tab Navigation (PROJECTS, DRAFTS, PUBLISHED, FEATURED) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22222a] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#2b2b35] text-white'
                  : 'text-[#8e8e98] hover:text-white'
              }`}
            >
              ALL PROJECTS ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'published'
                  ? 'bg-[#2b2b35] text-white'
                  : 'text-[#8e8e98] hover:text-white'
              }`}
            >
              PUBLISHED ({publishedCount})
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'drafts'
                  ? 'bg-[#2b2b35] text-white'
                  : 'text-[#8e8e98] hover:text-white'
              }`}
            >
              DRAFTS ({draftCount})
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'featured'
                  ? 'bg-[#2b2b35] text-white'
                  : 'text-[#8e8e98] hover:text-white'
              }`}
            >
              FEATURED ({featuredCount})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setDomainModalOpen(true)}
              className="flex items-center gap-1 border border-emerald-800/60 bg-emerald-950/30 px-2.5 py-1 text-emerald-300 hover:text-white rounded"
              title="Connect custom domain from Wix"
            >
              <Globe className="h-3 w-3 text-emerald-400" />
              <span>Wix Domain</span>
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1 border border-[#272730] bg-[#16161b] px-2.5 py-1 text-[#a1a1aa] hover:text-white rounded"
              title="Download backup"
            >
              <Download className="h-3 w-3" />
              <span>Backup</span>
            </button>
            <button
              onClick={() => setImportModalOpen(true)}
              className="flex items-center gap-1 border border-[#272730] bg-[#16161b] px-2.5 py-1 text-[#a1a1aa] hover:text-white rounded"
              title="Import backup"
            >
              <Upload className="h-3 w-3" />
              <span>Import</span>
            </button>
            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1 border border-[#272730] bg-[#16161b] px-2.5 py-1 text-red-400 hover:bg-red-950/30 rounded"
              title="Restore initial projects"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Project List */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[#2b2b35] rounded-lg">
            <p className="text-sm text-[#71717a]">No projects found in this tab.</p>
          </div>
        ) : (
          <div className="border border-[#22222a] bg-[#141418] divide-y divide-[#1e1e26] rounded-md overflow-hidden">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#18181e] transition-colors"
              >
                {/* Left: Thumbnail & details */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  {/* Order control */}
                  <div className="flex flex-col gap-0.5 text-[#71717a] shrink-0">
                    <button
                      onClick={() => handleMove(project.id, 'up')}
                      disabled={idx === 0}
                      className="hover:text-white disabled:opacity-20 p-0.5"
                      title="Move up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleMove(project.id, 'down')}
                      disabled={idx === filteredProjects.length - 1}
                      className="hover:text-white disabled:opacity-20 p-0.5"
                      title="Move down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Thumbnail with video badge */}
                  <div className="h-14 w-20 bg-[#22222a] overflow-hidden shrink-0 border border-[#2c2c36] rounded relative">
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
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] text-white px-1 uppercase rounded">
                      {project.coverType === 'video' ? 'Video' : `${project.media?.length || 1} items`}
                    </span>
                  </div>

                  {/* Title & metadata */}
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm text-white truncate">
                        {project.title}
                      </h3>
                      {project.isFeatured && (
                        <span className="text-[10px] bg-amber-950/60 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8e8e98] truncate">
                      {project.category} · {project.location} · {project.year}
                    </p>
                    <span className="text-[11px] font-mono text-[#65636f] block truncate">
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
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                        : 'bg-amber-950/60 text-amber-400 border border-amber-800/60'
                    }`}
                  >
                    {project.isPublished ? 'Published' : 'Draft'}
                  </button>

                  <button
                    onClick={() => handleToggleFeatured(project.id)}
                    className={`p-1.5 rounded transition-colors ${
                      project.isFeatured
                        ? 'text-amber-400'
                        : 'text-[#65636f] hover:text-[#a1a1aa]'
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
                    className="p-1.5 border border-[#2b2b35] text-[#9b9ba4] hover:text-white rounded hover:bg-[#202028]"
                    title="View public page"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDuplicate(project.id)}
                    className="p-1.5 border border-[#2b2b35] text-[#9b9ba4] hover:text-white rounded hover:bg-[#202028]"
                    title="Duplicate project"
                  >
                    <Copy className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleEdit(project)}
                    className="flex items-center gap-1.5 bg-[#272732] hover:bg-[#343442] text-white px-3 py-1.5 text-xs font-medium rounded"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(project)}
                    className="p-1.5 text-red-400 hover:bg-red-950/30 rounded"
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

      {/* Import JSON Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#141418] border border-[#272730] p-6 space-y-4 rounded-md shadow-2xl">
            <h3 className="text-base font-semibold text-white">Import Portfolio Backup</h3>
            <p className="text-xs text-[#9b9ba4]">Paste raw project JSON array to restore.</p>
            <form onSubmit={handleImportSubmit} className="space-y-4">
              <textarea
                rows={8}
                required
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder="[ { &quot;id&quot;: &quot;proj-1&quot;, ... } ]"
                className="w-full bg-[#1c1c22] border border-[#2b2b35] p-3 text-xs text-white font-mono focus:outline-none rounded"
              />
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#9b9ba4] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-1.5 text-xs font-semibold rounded"
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
