import { INITIAL_PROJECTS, INITIAL_MEDIA_LIBRARY } from '../data/initialProjects';
import { INITIAL_SITE_CONTENT } from '../data/initialSiteContent';
import { CloudflareConfig, Project, MediaLibraryItem, SiteContent } from '../types';

const STORAGE_KEY = 'elle_kay_portfolio_projects_v4';
const MEDIA_LIB_KEY = 'elle_kay_media_library_v1';
const CF_CONFIG_KEY = 'elle_kay_cloudflare_config_v1';
const SITE_CONTENT_KEY = 'elle_kay_site_content_v1';
const UPDATE_EVENT_NAME = 'elle_kay_projects_updated';
const MEDIA_UPDATE_EVENT = 'elle_kay_media_updated';
const SITE_CONTENT_UPDATE_EVENT = 'elle_kay_site_content_updated';

const DEFAULT_CF_CONFIG: CloudflareConfig = {
  accountId: '',
  bucketName: 'elle-kay-portfolio-assets',
  publicCdnUrl: 'https://cdn.ellekay-studio.com',
  streamUrl: 'https://customer-stream.cloudflare.com',
  enabled: false,
};

// Normalize project to guarantee video-first media fields
function normalizeProject(p: any): Project {
  const coverUrl = p.coverUrl || p.coverImage || '/src/assets/images/hero_arch_viz_1790605520563.jpg';
  const coverType = p.coverType || (coverUrl.endsWith('.mp4') ? 'video' : 'image');
  
  let media = Array.isArray(p.media) ? p.media : [];
  if (media.length === 0 && Array.isArray(p.gallery)) {
    media = p.gallery.map((g: any) => ({
      id: g.id || `m-${Date.now()}-${Math.random()}`,
      type: g.type || 'image',
      url: g.url,
      posterUrl: g.posterUrl,
      caption: g.caption,
      aspect: g.aspect || '16:9',
    }));
  }

  // If still empty, add cover
  if (media.length === 0) {
    media = [
      {
        id: `m-init-${p.id}`,
        type: coverType,
        url: coverUrl,
        posterUrl: p.coverPosterUrl,
        caption: '',
        aspect: '16:9',
      },
    ];
  }

  return {
    ...p,
    coverUrl,
    coverType,
    coverImage: coverUrl,
    media,
    gallery: media,
  };
}

export const StorageService = {
  getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeProject).sort((a, b) => a.orderIndex - b.orderIndex);
        }
      }
    } catch (e) {
      console.error('Failed to parse projects from localStorage:', e);
    }
    // Initialize with defaults
    StorageService.saveAllProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS.map(normalizeProject);
  },

  getPublishedProjects(): Project[] {
    return StorageService.getProjects().filter((p) => p.isPublished);
  },

  getFeaturedProjects(): Project[] {
    return StorageService.getProjects().filter((p) => p.isPublished && p.isFeatured);
  },

  getProjectBySlug(slug: string): Project | undefined {
    return StorageService.getProjects().find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  },

  saveAllProjects(projects: Project[]): void {
    try {
      const normalized = projects.map(normalizeProject);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT_NAME, { detail: normalized }));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  },

  saveProject(project: Project): void {
    const projects = StorageService.getProjects();
    const index = projects.findIndex((p) => p.id === project.id);
    const normalized = normalizeProject(project);

    if (index >= 0) {
      projects[index] = { ...normalized, updatedAt: new Date().toISOString() };
    } else {
      projects.push({
        ...normalized,
        orderIndex: projects.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    StorageService.saveAllProjects(projects);
  },

  deleteProject(id: string): void {
    const projects = StorageService.getProjects().filter((p) => p.id !== id);
    const reindexed = projects.map((p, idx) => ({ ...p, orderIndex: idx + 1 }));
    StorageService.saveAllProjects(reindexed);
  },

  duplicateProject(id: string): Project | null {
    const projects = StorageService.getProjects();
    const source = projects.find((p) => p.id === id);
    if (!source) return null;

    const newSlug = `${source.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newProject: Project = {
      ...source,
      id: `proj-${Date.now()}`,
      slug: newSlug,
      title: `${source.title} (Copy)`,
      isPublished: false,
      orderIndex: projects.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.push(newProject);
    StorageService.saveAllProjects(projects);
    return newProject;
  },

  togglePublishStatus(id: string): void {
    const projects = StorageService.getProjects();
    const proj = projects.find((p) => p.id === id);
    if (proj) {
      proj.isPublished = !proj.isPublished;
      proj.updatedAt = new Date().toISOString();
      StorageService.saveAllProjects(projects);
    }
  },

  toggleFeaturedStatus(id: string): void {
    const projects = StorageService.getProjects();
    const proj = projects.find((p) => p.id === id);
    if (proj) {
      proj.isFeatured = !proj.isFeatured;
      proj.updatedAt = new Date().toISOString();
      StorageService.saveAllProjects(projects);
    }
  },

  moveProjectOrder(id: string, direction: 'up' | 'down'): void {
    const projects = StorageService.getProjects().sort((a, b) => a.orderIndex - b.orderIndex);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = projects[index].orderIndex;
      projects[index].orderIndex = projects[index - 1].orderIndex;
      projects[index - 1].orderIndex = temp;
    } else if (direction === 'down' && index < projects.length - 1) {
      const temp = projects[index].orderIndex;
      projects[index].orderIndex = projects[index + 1].orderIndex;
      projects[index + 1].orderIndex = temp;
    }

    StorageService.saveAllProjects(projects);
  },

  exportProjectsAsJSON(): string {
    const projects = StorageService.getProjects();
    return JSON.stringify(projects, null, 2);
  },

  importProjectsFromJSON(jsonString: string): { success: boolean; count?: number; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, error: 'Imported file must contain a JSON array of projects.' };
      }
      const valid = parsed.every((p) => p.id && p.title && p.slug);
      if (!valid) {
        return { success: false, error: 'JSON missing required project fields (id, title, or slug).' };
      }
      StorageService.saveAllProjects(parsed);
      return { success: true, count: parsed.length };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Invalid JSON syntax' };
    }
  },

  resetToDefaults(): void {
    StorageService.saveAllProjects(INITIAL_PROJECTS);
  },

  // Media Library Operations
  getMediaLibrary(): MediaLibraryItem[] {
    try {
      const stored = localStorage.getItem(MEDIA_LIB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(MEDIA_LIB_KEY, JSON.stringify(INITIAL_MEDIA_LIBRARY));
    return INITIAL_MEDIA_LIBRARY;
  },

  saveMediaLibrary(items: MediaLibraryItem[]): void {
    localStorage.setItem(MEDIA_LIB_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(MEDIA_UPDATE_EVENT, { detail: items }));
  },

  addMediaItem(item: Omit<MediaLibraryItem, 'id' | 'addedAt'>): MediaLibraryItem {
    const library = StorageService.getMediaLibrary();
    const newItem: MediaLibraryItem = {
      ...item,
      id: `lib-${Date.now()}`,
      addedAt: new Date().toISOString().split('T')[0],
    };
    library.unshift(newItem);
    StorageService.saveMediaLibrary(library);
    return newItem;
  },

  deleteMediaItem(id: string): void {
    const library = StorageService.getMediaLibrary().filter((m) => m.id !== id);
    StorageService.saveMediaLibrary(library);
  },

  onMediaChange(callback: (items: MediaLibraryItem[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<MediaLibraryItem[]>;
      callback(customEvent.detail || StorageService.getMediaLibrary());
    };
    window.addEventListener(MEDIA_UPDATE_EVENT, handler);
    return () => window.removeEventListener(MEDIA_UPDATE_EVENT, handler);
  },

  // Cloudflare R2 / Stream configuration
  getCloudflareConfig(): CloudflareConfig {
    try {
      const stored = localStorage.getItem(CF_CONFIG_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CF_CONFIG;
  },

  saveCloudflareConfig(config: CloudflareConfig): void {
    localStorage.setItem(CF_CONFIG_KEY, JSON.stringify(config));
  },

  // Custom Domain Configuration
  getCustomDomain(): string {
    return localStorage.getItem('elle_kay_custom_domain') || '';
  },

  saveCustomDomain(domain: string): void {
    const cleaned = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    localStorage.setItem('elle_kay_custom_domain', cleaned);
  },

  // Site Content Management (Universal Text & Section Media)
  getSiteContent(): SiteContent {
    try {
      const stored = localStorage.getItem(SITE_CONTENT_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Deep merge with initial content so newly added fields have defaults
        return {
          hero: { ...INITIAL_SITE_CONTENT.hero, ...(parsed.hero || {}) },
          about: {
            ...INITIAL_SITE_CONTENT.about,
            ...(parsed.about || {}),
            experiences: parsed.about?.experiences || INITIAL_SITE_CONTENT.about.experiences,
            software: parsed.about?.software || INITIAL_SITE_CONTENT.about.software,
          },
          services: {
            ...INITIAL_SITE_CONTENT.services,
            ...(parsed.services || {}),
            items: parsed.services?.items || INITIAL_SITE_CONTENT.services.items,
          },
          aiCreative: {
            ...INITIAL_SITE_CONTENT.aiCreative,
            ...(parsed.aiCreative || {}),
            studies: parsed.aiCreative?.studies || INITIAL_SITE_CONTENT.aiCreative.studies,
          },
          clients: {
            ...INITIAL_SITE_CONTENT.clients,
            ...(parsed.clients || {}),
            regions: parsed.clients?.regions || INITIAL_SITE_CONTENT.clients.regions,
          },
          contact: {
            ...INITIAL_SITE_CONTENT.contact,
            ...(parsed.contact || {}),
            subheadingTags: parsed.contact?.subheadingTags || INITIAL_SITE_CONTENT.contact.subheadingTags,
          },
          header: { ...INITIAL_SITE_CONTENT.header, ...(parsed.header || {}) },
          footer: { ...INITIAL_SITE_CONTENT.footer, ...(parsed.footer || {}) },
        };
      }
    } catch (e) {
      console.error('Failed to parse site content from localStorage:', e);
    }
    return INITIAL_SITE_CONTENT;
  },

  saveSiteContent(content: SiteContent): void {
    try {
      localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(content));
      window.dispatchEvent(new CustomEvent(SITE_CONTENT_UPDATE_EVENT, { detail: content }));
    } catch (e) {
      console.error('Failed to save site content to localStorage:', e);
    }
  },

  updateSiteContentSection<K extends keyof SiteContent>(
    section: K,
    data: Partial<SiteContent[K]>
  ): SiteContent {
    const current = StorageService.getSiteContent();
    const updated: SiteContent = {
      ...current,
      [section]: {
        ...current[section],
        ...data,
      },
    };
    StorageService.saveSiteContent(updated);
    return updated;
  },

  resetSiteContentToDefaults(): SiteContent {
    StorageService.saveSiteContent(INITIAL_SITE_CONTENT);
    return INITIAL_SITE_CONTENT;
  },

  onSiteContentChange(callback: (content: SiteContent) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContent>;
      callback(customEvent.detail || StorageService.getSiteContent());
    };
    window.addEventListener(SITE_CONTENT_UPDATE_EVENT, handler);
    return () => window.removeEventListener(SITE_CONTENT_UPDATE_EVENT, handler);
  },

  onProjectsChange(callback: (projects: Project[]) => void): () => void {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<Project[]>;
      callback(customEvent.detail || StorageService.getProjects());
    };
    window.addEventListener(UPDATE_EVENT_NAME, handler);
    return () => window.removeEventListener(UPDATE_EVENT_NAME, handler);
  },
};
