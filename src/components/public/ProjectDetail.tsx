import React, { useState } from 'react';
import { Project, MediaItem } from '../../types';
import { ArrowLeft, X, ChevronLeft, ChevronRight, MessageCircle, Mail } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
  onBack: () => void;
  onSelectProject: (slug: string) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  allProjects,
  onBack,
  onSelectProject,
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  // Next / Previous navigation
  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  // Media sequence: use project.media or fallback to project.gallery or [cover]
  const mediaList: MediaItem[] =
    project.media && project.media.length > 0
      ? project.media
      : project.gallery && project.gallery.length > 0
      ? project.gallery
      : [
          {
            id: 'm-cover',
            type: project.coverType || 'image',
            url: project.coverUrl || project.coverImage || '',
            posterUrl: project.coverPosterUrl,
            caption: project.title,
            altText: project.coverAltText || project.title,
            aspect: '16:9',
          },
        ];

  // WhatsApp & Email direct CTAs
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hello Elle, I am reviewing your project "${project.title}" (${project.category}) and would like to discuss an upcoming visual commission.`
  )}`;

  const mailtoUrl = `mailto:connect.ellekay@gmail.com?subject=${encodeURIComponent(
    `Inquiry regarding ${project.title}`
  )}&body=${encodeURIComponent(
    `Hello Elle,\n\nI was reviewing your visual work on "${project.title}" and would like to discuss an upcoming project.\n`
  )}`;

  // Render video player
  const renderVideo = (item: MediaItem) => {
    const url = item.url;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1].split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      }
      return (
        <div className="aspect-video w-full overflow-hidden bg-black rounded">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={project.title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      );
    }

    if (url.includes('vimeo.com')) {
      const vimeoId = url.split('/').pop()?.split('?')[0];
      return (
        <div className="aspect-video w-full overflow-hidden bg-black rounded">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={project.title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      );
    }

    // HTML5 / Video Stream
    return (
      <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black rounded relative">
        <video
          controls={item.controls ?? true}
          autoPlay={item.autoplay ?? true}
          muted={item.muted ?? true}
          loop={item.loop ?? true}
          playsInline
          className="h-full w-full object-cover"
          src={url}
          poster={item.posterUrl || project.coverPosterUrl || project.coverImage}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

  const projectNarrative = project.fullDescription || project.description || '';

  return (
    <article className="min-h-screen bg-[#f9f8f5] text-[#18181b] pb-36">
      {/* Sticky discreet navigation bar */}
      <div className="sticky top-20 z-30 bg-[#f9f8f5]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:px-12 border-b border-[#e5dfd5]">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#787268] hover:text-[#18181b] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Works</span>
          </button>

          <div className="flex items-center gap-6 text-xs text-[#787268]">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#18181b] transition-colors uppercase tracking-[0.16em]"
            >
              WhatsApp
            </a>
            <a
              href={mailtoUrl}
              className="hover:text-[#18181b] transition-colors uppercase tracking-[0.16em]"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Project Title Block — Minimal, Elegant */}
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-12 lg:px-12 space-y-4">
        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-[#18181b] tracking-tight">
          {project.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase tracking-[0.2em] text-[#787268]">
          <span>{project.category}</span>
          <span>·</span>
          <span>{project.year}</span>
          <span>·</span>
          <span>{project.location}</span>
          {project.client && (
            <>
              <span>·</span>
              <span className="text-[#18181b]">Client: {project.client}</span>
            </>
          )}
          {project.role && (
            <>
              <span>·</span>
              <span className="text-[#877158]">Role: {project.role}</span>
            </>
          )}
        </div>

        {projectNarrative && (
          <p className="pt-4 text-base sm:text-lg text-[#524d45] font-light max-w-3xl leading-relaxed whitespace-pre-line">
            {projectNarrative}
          </p>
        )}

        {/* Software Stack Tags */}
        {project.softwareStack && project.softwareStack.length > 0 && (
          <div className="pt-4 flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#877158] font-medium mr-2">
              Production Stack:
            </span>
            {project.softwareStack.map((sw) => (
              <span
                key={sw}
                className="text-[11px] bg-white border border-[#ded7cc] text-[#524d45] px-2.5 py-0.5 rounded font-mono"
              >
                {sw}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Continuous Visual Flow: Images and Videos in Exact Sequence */}
      <div className="space-y-24 sm:space-y-36 max-w-[1700px] mx-auto px-0 sm:px-6 lg:px-12 pt-8">
        {mediaList.map((media, idx) => {
          if (media.type === 'video') {
            return (
              <div key={media.id || idx} className="w-full space-y-3">
                {renderVideo(media)}
                {media.caption && (
                  <p className="text-center text-xs text-[#787268] italic px-4">
                    {media.caption}
                  </p>
                )}
              </div>
            );
          }

          // Full-screen / Full-width Image
          return (
            <div
              key={media.id || idx}
              onClick={() => setActiveLightboxIndex(idx)}
              className="group cursor-pointer w-full space-y-3"
            >
              <div
                className={`relative w-full overflow-hidden bg-[#e8e3d8] rounded ${
                  idx === 0
                    ? 'aspect-[16/9] sm:aspect-[21/10]'
                    : media.aspect === '4:3'
                    ? 'aspect-[4/3] max-w-5xl mx-auto'
                    : 'aspect-[16/10]'
                }`}
              >
                <img
                  src={media.url}
                  alt={media.altText || media.caption || `${project.title} view ${idx + 1}`}
                  loading="lazy"
                  className="img-editorial h-full w-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {media.caption && (
                <p className="text-xs text-[#787268] italic text-center px-4">
                  {media.caption}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Prev / Next Project Switcher */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-12 border-t border-[#e5dfd5] mt-32 flex items-center justify-between">
        {prevProject ? (
          <button
            onClick={() => onSelectProject(prevProject.slug)}
            className="group text-left space-y-1"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#787268] block">
              ← Previous
            </span>
            <span className="font-editorial text-2xl text-[#18181b] group-hover:text-[#877158] transition-colors">
              {prevProject.title}
            </span>
          </button>
        ) : (
          <div />
        )}

        {nextProject ? (
          <button
            onClick={() => onSelectProject(nextProject.slug)}
            className="group text-right space-y-1"
          >
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#787268] block">
              Next →
            </span>
            <span className="font-editorial text-2xl text-[#18181b] group-hover:text-[#877158] transition-colors">
              {nextProject.title}
            </span>
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxIndex !== null && mediaList[activeLightboxIndex] && (
        <div
          onClick={() => setActiveLightboxIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 sm:p-10 backdrop-blur-md"
        >
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>

          <img
            src={mediaList[activeLightboxIndex].url}
            alt={mediaList[activeLightboxIndex].caption || project.title}
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </article>
  );
};
