import React, { useState, useEffect } from 'react';
import { Project, SiteContent } from './types';
import { StorageService } from './services/storage';
import { Header } from './components/public/Header';
import { Hero } from './components/public/Hero';
import { Showreel } from './components/public/Showreel';
import { ProjectGrid } from './components/public/ProjectGrid';
import { ProjectDetail } from './components/public/ProjectDetail';
import { AICreative } from './components/public/AICreative';
import { Services } from './components/public/Services';
import { About } from './components/public/About';
import { Clients } from './components/public/Clients';
import { Contact } from './components/public/Contact';
import { Footer } from './components/public/Footer';
import { SitemapModal } from './components/public/SitemapModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LiveEditToolbar } from './components/public/LiveEditToolbar';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => StorageService.getProjects());
  const [siteContent, setSiteContent] = useState<SiteContent>(() => StorageService.getSiteContent());
  const [isEditMode, setIsEditMode] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<'projects' | 'site_content' | 'media_library'>('projects');

  const getResolvedPath = () => {
    if (typeof window === 'undefined') return '/';
    if (
      window.location.pathname === '/admin' ||
      window.location.hash === '#admin' ||
      window.location.search.includes('admin')
    ) {
      return '/admin';
    }
    return window.location.pathname;
  };

  const [currentPath, setCurrentPath] = useState<string>(getResolvedPath);

  // Check if admin is currently authenticated (localStorage + sessionStorage)
  const checkAdminAuth = () => {
    if (typeof window === 'undefined') return false;
    return (
      localStorage.getItem('elle_kay_admin_auth') === 'true' ||
      sessionStorage.getItem('elle_kay_admin_auth') === 'true'
    );
  };

  const [isAdmin, setIsAdmin] = useState<boolean>(checkAdminAuth);

  // Sitemap/robots modal state
  const [sitemapModalOpen, setSitemapModalOpen] = useState(false);
  const [sitemapMode, setSitemapMode] = useState<'sitemap' | 'robots'>('sitemap');

  // Sync projects and site content from storage events across components and tabs
  useEffect(() => {
    const unsubProjects = StorageService.onProjectsChange((updated) => setProjects(updated));
    const unsubContent = StorageService.onSiteContentChange((updated) => setSiteContent(updated));
    return () => {
      unsubProjects();
      unsubContent();
    };
  }, []);

  // Sync auth state whenever navigating or storage changes
  useEffect(() => {
    setIsAdmin(checkAdminAuth());
  }, [currentPath]);

  // Sync URL popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getResolvedPath());
      setIsAdmin(checkAdminAuth());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path.startsWith('/#') || path.startsWith('#')) {
      const id = path.replace(/^\/?#/, '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    if (path === '/admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    setIsAdmin(checkAdminAuth());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContentEditor = () => {
    setAdminInitialTab('site_content');
    navigate('/admin');
  };

  // Dynamic SEO title updater
  useEffect(() => {
    if (currentPath === '/admin') {
      document.title = 'Studio CMS Admin · Elle Kay 3D Visualizer';
    } else if (currentPath.startsWith('/project/')) {
      const slug = currentPath.replace('/project/', '');
      const proj = projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
      if (proj) {
        document.title = proj.seoTitle || `${proj.title} · Elle Kay · AI Creative Artist & 3D Designer`;
      } else {
        document.title = 'Project Not Found · Elle Kay Studio';
      }
    } else {
      document.title = `${siteContent.header.brandName} – ${siteContent.header.brandTitle}`;
    }
  }, [currentPath, projects, siteContent]);

  // Route 1: Admin Dashboard at /admin
  if (currentPath === '/admin') {
    return (
      <AdminDashboard
        projects={projects}
        initialTab={adminInitialTab}
        onClose={() => {
          setAdminInitialTab('projects');
          navigate('/');
        }}
        onNavigateToProject={(slug) => navigate(`/project/${slug}`)}
      />
    );
  }

  // Route 2: Individual Project Page at /project/:slug
  if (currentPath.startsWith('/project/')) {
    const slug = currentPath.replace('/project/', '');
    const project = projects.find((p) => p.slug.toLowerCase() === slug.toLowerCase());

    if (!project) {
      return (
        <div className="min-h-screen bg-[#f9f8f5] text-[#18181b] flex flex-col items-center justify-center p-6 text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#787268]">404 Not Found</span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-[#18181b]">Project Not Found</h1>
          <p className="text-sm text-[#524d45] max-w-md">
            The project with slug <code className="text-[#18181b] font-mono">"{slug}"</code> does not exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 border border-[#ded7cc] px-5 py-2.5 text-xs uppercase tracking-wider text-[#18181b] hover:border-[#18181b] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Portfolio</span>
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f9f8f5] text-[#18181b]">
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          content={siteContent.header}
        />
        <ProjectDetail
          project={project}
          allProjects={projects.filter((p) => p.isPublished)}
          onBack={() => navigate('/')}
          onSelectProject={(newSlug) => navigate(`/project/${newSlug}`)}
        />
        <Footer
          onOpenSitemap={() => {
            setSitemapMode('sitemap');
            setSitemapModalOpen(true);
          }}
          onOpenRobots={() => {
            setSitemapMode('robots');
            setSitemapModalOpen(true);
          }}
          onNavigateToAdmin={() => navigate('/admin')}
          content={siteContent.footer}
        />
        <SitemapModal
          projects={projects}
          isOpen={sitemapModalOpen}
          onClose={() => setSitemapModalOpen(false)}
          mode={sitemapMode}
        />
      </div>
    );
  }

  // Route 3: Homepage (Default)
  const homepageProjects = projects.filter(
    (p) => p.isPublished && p.homepageVisibility !== false
  );

  return (
    <div className="min-h-screen bg-[#f9f8f5] text-[#18181b]">
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        content={siteContent.header}
      />

      <main>
        {/* Full-bleed Luxury Hero */}
        {siteContent.hero.visibility !== false && (
          <Hero
            content={siteContent.hero}
            isEditMode={isEditMode}
            onEditSection={handleOpenContentEditor}
            onExploreClick={() => {
              const el = document.getElementById('work');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        {/* Selected Works - pulls published/homepage visible projects from CMS */}
        <ProjectGrid
          projects={homepageProjects}
          onSelectProject={(slug) => navigate(`/project/${slug}`)}
        />

        {/* Cinematic Showreel & Walkthrough sequence */}
        {siteContent.showreel?.visibility !== false && (
          <Showreel
            content={siteContent.showreel}
            isEditMode={isEditMode}
            onEditSection={handleOpenContentEditor}
          />
        )}

        {/* Generative AI Practice & Prompt Workflows */}
        {siteContent.aiCreative.visibility !== false && (
          <AICreative
            content={siteContent.aiCreative}
            isEditMode={isEditMode}
            onEditSection={handleOpenContentEditor}
          />
        )}

        {/* Studio Services & Scope */}
        {siteContent.services.visibility !== false && (
          <Services
            content={siteContent.services}
            isEditMode={isEditMode}
            onEditSection={handleOpenContentEditor}
          />
        )}

        {/* Studio Biography & Philosophy */}
        {siteContent.about.visibility !== false && (
          <About
            content={siteContent.about}
            isEditMode={isEditMode}
            onEditSection={handleOpenContentEditor}
          />
        )}

        {/* Global Collaborations */}
        {siteContent.clients.visibility !== false && (
          <Clients
            content={siteContent.clients}
            isEditMode={isEditMode}
            onEditSection={handleOpenContentEditor}
          />
        )}

        {/* Direct Inquiries & WhatsApp CTA */}
        {siteContent.contact.visibility !== false && (
          <Contact
            content={siteContent.contact}
            isEditMode={isEditMode}
            onEditSection={handleOpenContentEditor}
          />
        )}
      </main>

      {/* Floating Live Edit & Media Upload Toolbar */}
      <LiveEditToolbar
        isAdmin={isAdmin}
        isEditMode={isEditMode}
        onToggleEditMode={() => setIsEditMode(!isEditMode)}
        onNavigateToAdmin={() => navigate('/admin')}
        onOpenContentEditor={handleOpenContentEditor}
      />

      {/* Editorial Footer */}
      <Footer
        onOpenSitemap={() => {
          setSitemapMode('sitemap');
          setSitemapModalOpen(true);
        }}
        onOpenRobots={() => {
          setSitemapMode('robots');
          setSitemapModalOpen(true);
        }}
        onNavigateToAdmin={() => navigate('/admin')}
        content={siteContent.footer}
      />

      {/* SEO Sitemap & Robots Modal */}
      <SitemapModal
        projects={projects}
        isOpen={sitemapModalOpen}
        onClose={() => setSitemapModalOpen(false)}
        mode={sitemapMode}
      />
    </div>
  );
}
