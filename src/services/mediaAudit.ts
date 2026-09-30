import { Project, SiteContent, MediaItem } from '../types';

/**
 * Checks if a given media URL is a placeholder/demo/stock file
 */
export function isPlaceholderUrl(url?: string): boolean {
  if (!url || typeof url !== 'string') return true;
  const lower = url.toLowerCase().trim();
  if (lower === '' || lower === '#' || lower === 'about:blank') return true;
  
  // Mixkit demo preview videos
  if (lower.includes('assets.mixkit.co')) return true;

  // Unsplash demo photos
  if (lower.includes('images.unsplash.com')) return true;

  // Generic placeholder strings
  if (
    lower.includes('placeholder') ||
    lower.includes('/demo') ||
    lower.includes('demo_') ||
    lower.includes('sample_') ||
    lower.includes('test_video')
  ) {
    return true;
  }

  return false;
}

/**
 * Checks if a project contains any placeholder cover or gallery media
 */
export function projectHasPlaceholderMedia(project: Project): boolean {
  if (project.coverIsPlaceholder || isPlaceholderUrl(project.coverUrl)) {
    return true;
  }
  const mediaList = project.media || project.gallery || [];
  return mediaList.some((m) => m.isPlaceholder || isPlaceholderUrl(m.url));
}

/**
 * Counts how many placeholder items exist in a project
 */
export function countProjectPlaceholders(project: Project): number {
  let count = 0;
  if (project.coverIsPlaceholder || isPlaceholderUrl(project.coverUrl)) count++;
  const mediaList = project.media || project.gallery || [];
  for (const m of mediaList) {
    if (m.isPlaceholder || isPlaceholderUrl(m.url)) count++;
  }
  return count;
}

export interface PlaceholderAuditItem {
  id: string;
  sourceType: 'project' | 'hero' | 'showreel' | 'services' | 'aiCreative' | 'clients' | 'about';
  sourceTitle: string;
  fieldLabel: string;
  mediaType: 'image' | 'video';
  currentUrl: string;
  projectSlug?: string;
}

/**
 * Complete audit of all placeholder media across the entire site
 */
export function auditAllPlaceholderMedia(
  projects: Project[],
  siteContent: SiteContent
): PlaceholderAuditItem[] {
  const placeholders: PlaceholderAuditItem[] = [];

  // 1. Projects Audit
  projects.forEach((proj) => {
    if (proj.coverIsPlaceholder || isPlaceholderUrl(proj.coverUrl)) {
      placeholders.push({
        id: `p-${proj.id}-cover`,
        sourceType: 'project',
        sourceTitle: proj.title,
        fieldLabel: 'Project Cover Media',
        mediaType: proj.coverType || 'image',
        currentUrl: proj.coverUrl,
        projectSlug: proj.slug,
      });
    }

    const mediaList = proj.media || proj.gallery || [];
    mediaList.forEach((m, idx) => {
      if (m.isPlaceholder || isPlaceholderUrl(m.url)) {
        placeholders.push({
          id: `p-${proj.id}-media-${m.id || idx}`,
          sourceType: 'project',
          sourceTitle: proj.title,
          fieldLabel: m.caption ? `Media: ${m.caption}` : `Gallery Item #${idx + 1}`,
          mediaType: m.type,
          currentUrl: m.url,
          projectSlug: proj.slug,
        });
      }
    });
  });

  // 2. Hero Section
  if (siteContent.hero) {
    if (siteContent.hero.isPlaceholder || isPlaceholderUrl(siteContent.hero.videoUrl)) {
      placeholders.push({
        id: 'hero-video',
        sourceType: 'hero',
        sourceTitle: 'Homepage Hero',
        fieldLabel: 'Hero Background Video',
        mediaType: 'video',
        currentUrl: siteContent.hero.videoUrl,
      });
    }
  }

  // 3. Showreel Section
  if (siteContent.showreel) {
    if (siteContent.showreel.isPlaceholder || isPlaceholderUrl(siteContent.showreel.videoUrl)) {
      placeholders.push({
        id: 'showreel-video',
        sourceType: 'showreel',
        sourceTitle: 'Homepage Showreel',
        fieldLabel: 'Showreel Walkthrough Video',
        mediaType: 'video',
        currentUrl: siteContent.showreel.videoUrl,
      });
    }
  }

  // 4. Services Section
  siteContent.services?.items?.forEach((srv, idx) => {
    if (srv.isPlaceholder || isPlaceholderUrl(srv.mediaUrl)) {
      placeholders.push({
        id: `srv-${srv.id || idx}`,
        sourceType: 'services',
        sourceTitle: `Service: ${srv.title}`,
        fieldLabel: 'Service Visual Media',
        mediaType: srv.type || 'image',
        currentUrl: srv.mediaUrl,
      });
    }
  });

  // 5. AI Creative Studies
  siteContent.aiCreative?.studies?.forEach((study, idx) => {
    if (study.isPlaceholder || isPlaceholderUrl(study.mediaUrl)) {
      placeholders.push({
        id: `ai-${study.id || idx}`,
        sourceType: 'aiCreative',
        sourceTitle: `AI Study: ${study.title}`,
        fieldLabel: 'Study Media (Render or Video)',
        mediaType: study.type || 'image',
        currentUrl: study.mediaUrl,
      });
    }
  });

  // 6. Clients & Regional Stills
  siteContent.clients?.regions?.forEach((reg, idx) => {
    if (reg.isPlaceholder || isPlaceholderUrl(reg.img)) {
      placeholders.push({
        id: `reg-${reg.id || idx}`,
        sourceType: 'clients',
        sourceTitle: `Region: ${reg.region}`,
        fieldLabel: 'Regional Preview Still',
        mediaType: 'image',
        currentUrl: reg.img,
      });
    }
  });

  return placeholders;
}
