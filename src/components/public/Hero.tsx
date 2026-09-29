import React, { useRef, useState } from 'react';
import { ArrowDown, Volume2, VolumeX, Edit3 } from 'lucide-react';
import { HeroContent } from '../../types';

interface HeroProps {
  onExploreClick: () => void;
  content: HeroContent;
  isEditMode?: boolean;
  onEditSection?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  content,
  isEditMode,
  onEditSection,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className={`relative min-h-[92vh] w-full overflow-hidden bg-[#ede8e1] flex items-end ${isEditMode ? 'ring-2 ring-amber-400/60 ring-inset' : ''}`}>
      {/* Edit Mode Badge */}
      {isEditMode && (
        <button
          onClick={onEditSection}
          className="absolute top-24 left-6 lg:left-12 z-30 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Hero Headline & Video</span>
        </button>
      )}

      {/* Full-screen cinematic video / render */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          poster={content.posterUrl || "/src/assets/images/hero_arch_viz_1790605520563.jpg"}
          className="h-full w-full object-cover object-center"
        >
          <source
            src={content.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-modern-architectural-building-facade-42777-large.mp4"}
            type="video/mp4"
          />
        </video>
        {/* Soft, low-contrast warm scrim at base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f9f8f5] via-black/25 to-black/10 pointer-events-none" />
      </div>

      {/* Floating video sound toggle */}
      <button
        onClick={toggleSound}
        className="absolute top-24 right-6 lg:right-12 z-20 p-2.5 rounded-full bg-white/70 text-[#1a1a1d] hover:bg-white backdrop-blur-md transition-colors shadow-sm"
        aria-label="Toggle reel sound"
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>

      {/* Hero Content — Restrained Editorial Typography */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 pt-32 lg:px-12">
        <div className="space-y-4 max-w-2xl">
          <p className="text-[11px] tracking-[0.28em] uppercase text-[#1a1a1d] font-semibold">
            {content.tagline}
          </p>

          <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-[#1a1a1d] leading-[1.05] tracking-tight">
            {content.heading}
          </h1>
        </div>

        {/* Quiet scroll trigger directly into work */}
        <div className="mt-12 flex items-center justify-between pt-5 border-t border-[#1a1a1d]/15 text-xs text-[#524d45]">
          <button
            onClick={onExploreClick}
            className="group flex items-center gap-2 text-[#1a1a1d] hover:text-[#877158] transition-colors"
          >
            <span className="uppercase tracking-[0.22em] text-[11px] font-medium">
              {content.viewWorkText || 'View Work'}
            </span>
            <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
          </button>

          <span className="text-[11px] tracking-[0.2em] uppercase opacity-75 hidden sm:inline">
            {content.badge}
          </span>
        </div>
      </div>
    </section>
  );
};

