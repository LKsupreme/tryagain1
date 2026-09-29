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
            caption: '',
            aspect: '16:9',
          },
        ];

  // WhatsApp & Email direct CTAs
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hello Elle, I am viewing your project "${project.title}" (${project.category}) and would like to discuss an upcoming visual commission.`
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
        <div className="aspect-video w-full overflow-hidden bg-black">
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
        <div className="aspect-video w-full overflow-hidden bg-black">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={project.title}
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      );
    }

    // HTML5 / Cloudflare Stream video
    return (
      <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-black relative">
        <video
          controls
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
          src={url}
          poster={item.posterUrl || project.coverImage}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };

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
      <header className="mx-auto max-w-7xl px-6 pt-20 pb-12 lg:px-12 space-y-2">
        <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-[#18181b] tracking-tight">
          {project.title}
        </h1>

        <p className="text-xs uppercase tracking-[0.22em] text-[#787268]">
          {project.category} · {project.year} · {project.location}
        </p>

        {project.description && (
          <p className="pt-4 text-base sm:text-lg text-[#524d45] font-light max-w-3xl leading-relaxed">
            {project.description}
          </p>
        )}
      </header>

      {/* Continuous 90% Visual Flow: Images and Videos in Storytelling Sequence */}
      <div className="space-y-24 sm:space-y-36 max-w-[1700px] mx-auto px-0 sm:px-6 lg:px-12">
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
                className={`relative w-full overflow-hidden bg-[#e8e3d8] ${
                  idx === 0
                    ? 'aspect-[16/9] sm:aspect-[21/10]'
                    : media.aspect === '4:3'
                    ? 'aspect-[4/3] max-w-5xl mx-auto'
                    : 'aspect-[16/10]'
                }`}
              >
                <img
                  src={media.url}
                  alt={media.caption || `${project.title} view ${idx + 1}`}
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
            className="absolute top-6 right-6 p-2 text-white/60 hover:text-white"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {mediaList.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex(
                  (activeLightboxIndex - 1 + mediaList.length) % mediaList.length
                );
              }}
              className="absolute left-6 p-2 text-white/60 hover:text-white"
              aria-label="Previous"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-6xl flex flex-col items-center"
          >
            {mediaList[activeLightboxIndex].type === 'video' ? (
              <video
                controls
                autoPlay
                className="max-h-[80vh] max-w-full"
                src={mediaList[activeLightboxIndex].url}
              />
            ) : (
              <img
                src={mediaList[activeLightboxIndex].url}
                alt={mediaList[activeLightboxIndex].caption || project.title}
                className="max-h-[80vh] max-w-full object-contain"
                referrerPolicy="no-referrer"
              />
            )}
            {mediaList[activeLightboxIndex].caption && (
              <p className="mt-4 text-center text-xs text-[#9c9588]">
                {mediaList[activeLightboxIndex].caption}
              </p>
            )}
          </div>

          {mediaList.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveLightboxIndex((activeLightboxIndex + 1) % mediaList.length);
              }}
              className="absolute right-6 p-2 text-white/60 hover:text-white"
              aria-label="Next"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </article>
  );
};
