import React, { useRef, useState } from 'react';
import { Volume2, VolumeX, Play, Edit3, Film } from 'lucide-react';
import { ShowreelContent } from '../../types';

interface ShowreelProps {
  content?: ShowreelContent;
  isEditMode?: boolean;
  onEditSection?: () => void;
}

export const Showreel: React.FC<ShowreelProps> = ({
  content,
  isEditMode,
  onEditSection,
}) => {
  const [isMuted, setIsMuted] = useState(content?.muted ?? true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (content && content.visibility === false) {
    return null;
  }

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const videoUrl =
    content?.videoUrl ||
    'https://assets.mixkit.co/videos/preview/mixkit-modern-architectural-building-facade-42777-large.mp4';
  const posterUrl =
    content?.posterUrl || '/src/assets/images/hero_arch_viz_1790605520563.jpg';

  return (
    <section
      id="showreel"
      className={`relative w-full bg-[#121215] text-[#f9f8f5] py-28 px-0 sm:px-6 lg:px-12 overflow-hidden ${
        isEditMode ? 'ring-2 ring-amber-400/60 ring-inset' : ''
      }`}
    >
      {/* Edit Mode Badge */}
      {isEditMode && (
        <button
          onClick={onEditSection}
          className="absolute top-8 right-6 lg:right-12 z-30 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Showreel Video & Sound</span>
        </button>
      )}

      <div className="mx-auto max-w-7xl px-6 space-y-12">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[#c5b59f] font-medium flex items-center gap-2">
              <Film className="h-3 w-3 text-amber-400" />
              <span>{content?.badge || 'Cinematic Showreel · 3D Walkthroughs'}</span>
            </span>
            <h2 className="font-editorial text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
              {content?.heading || 'Cinematic Showreel'}
            </h2>
          </div>

          <p className="font-editorial text-base sm:text-lg text-white/70 max-w-md leading-relaxed">
            {content?.description ||
              'A curated compilation of architectural walkthroughs, camera sequences, and spatial choreography.'}
          </p>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl group">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay={content?.autoplay ?? true}
            loop={content?.loop ?? true}
            muted={isMuted}
            playsInline
            className="h-full w-full object-cover"
          />

          {/* Floating Controls */}
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-md transition-colors"
              aria-label={isPlaying ? 'Pause showreel' : 'Play showreel'}
            >
              <Play className={`h-4 w-4 ${isPlaying ? 'opacity-50' : 'text-amber-400'}`} />
            </button>
            <button
              onClick={toggleSound}
              className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 backdrop-blur-md transition-colors"
              aria-label="Toggle showreel sound"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
            </button>
          </div>

          {/* Category watermark */}
          <div className="absolute top-5 left-5 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded text-[10px] tracking-[0.2em] uppercase text-white/80 font-mono">
            3D Walkthrough Sequence
          </div>
        </div>
      </div>
    </section>
  );
};
