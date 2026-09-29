import React, { useState } from 'react';
import { ArrowUpRight, Edit3 } from 'lucide-react';
import { AboutContent } from '../../types';

interface AboutProps {
  content: AboutContent;
  isEditMode?: boolean;
  onEditSection?: () => void;
}

export const About: React.FC<AboutProps> = ({
  content,
  isEditMode,
  onEditSection,
}) => {
  const [showFullCV, setShowFullCV] = useState(false);

  return (
    <section id="about" className={`relative w-full bg-[#f9f8f5] py-28 px-6 lg:px-12 border-t border-[#e5dfd5] ${isEditMode ? 'ring-2 ring-amber-400/60 ring-inset' : ''}`}>
      {/* Edit Mode Quick Trigger */}
      {isEditMode && (
        <button
          onClick={onEditSection}
          className="absolute top-8 right-6 lg:right-12 z-30 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Bio & Portrait</span>
        </button>
      )}

      <div className="mx-auto max-w-7xl space-y-24">
        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Portrait Column */}
          <div className="lg:col-span-5 space-y-3">
            <div className="overflow-hidden aspect-[4/5] bg-[#e8e3d8] max-w-md relative group">
              <img
                src={content.portraitUrl || "/src/assets/images/elle_kay_portrait_1790605599434.jpg"}
                alt={content.name}
                loading="lazy"
                className="h-full w-full object-cover object-center filter grayscale contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
              {isEditMode && (
                <button
                  onClick={onEditSection}
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium"
                >
                  <Edit3 className="h-4 w-4 text-amber-300" />
                  <span>Change Portrait</span>
                </button>
              )}
            </div>
            <p className="text-xs text-[#787268] font-medium tracking-wider uppercase">
              {content.portraitCaption || `${content.name} · ${content.role}`}
            </p>
          </div>

          {/* Editorial Biography Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#877158] font-medium">
                {content.sectionBadge}
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#1a1a1d]">
                {content.name}
              </h2>
              <p className="text-xs uppercase tracking-[0.22em] text-[#787268]">
                {content.role}
              </p>
            </div>

            <p className="font-editorial text-2xl sm:text-3xl font-light text-[#1a1a1d] leading-relaxed">
              {content.quote}
            </p>

            <p className="text-sm sm:text-base text-[#524d45] font-light leading-relaxed max-w-xl whitespace-pre-line">
              {content.bio}
            </p>

            {/* Three Experience Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#e5dfd5]">
              <div className="space-y-0.5">
                <span className="font-editorial text-2xl sm:text-3xl text-[#1a1a1d] block">
                  {content.stat1Value}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#787268] block">
                  {content.stat1Label}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="font-editorial text-2xl sm:text-3xl text-[#1a1a1d] block">
                  {content.stat2Value}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#787268] block">
                  {content.stat2Label}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="font-editorial text-2xl sm:text-3xl text-[#1a1a1d] block">
                  {content.stat3Value}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#787268] block">
                  {content.stat3Label}
                </span>
              </div>
            </div>

            {/* Compact Work Experience */}
            <div className="pt-6 border-t border-[#e5dfd5] space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#877158] block font-medium">
                Professional Experience
              </span>
              <div className="space-y-3 text-xs text-[#524d45]">
                {content.experiences?.map((exp) => (
                  <div key={exp.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <span className="font-medium text-[#1a1a1d]">
                      {exp.company} — {exp.role}
                    </span>
                    <span className="text-[#787268] font-mono">{exp.period}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* View Full Experience Toggle */}
            <div>
              <button
                onClick={() => setShowFullCV(!showFullCV)}
                className="text-xs uppercase tracking-wider text-[#877158] hover:text-[#1a1a1d] transition-colors underline decoration-[#ded7cc]"
              >
                {showFullCV ? 'Hide detailed profile' : 'View tools, certifications & education →'}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Tools & Certifications */}
        {showFullCV && (
          <div className="p-8 bg-[#f4f1ea] border border-[#e5dfd5] space-y-8 rounded-sm animate-fade-in">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#877158] font-medium block">
                Tools I Work With
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {content.software?.map((tool) => (
                  <span
                    key={tool}
                    className="border border-[#ded7cc] bg-[#f9f8f5] px-3.5 py-1.5 text-[#1a1a1d] rounded-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#524d45] pt-4 border-t border-[#ded7cc]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#1a1a1d] font-semibold block">
                    ADOBE CREATIVE
                  </span>
                  <p>Photoshop · Premiere Pro · After Effects · Lightroom · Illustrator · InDesign</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#1a1a1d] font-semibold block">
                    GENERATIVE AI
                  </span>
                  <p>Midjourney · Runway · ComfyUI · Stable Diffusion · ChatGPT · Claude</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#1a1a1d] font-semibold block">
                    3D & ARCHITECTURE
                  </span>
                  <p>3ds Max · Corona Renderer · Unreal Engine 5 · Twinmotion · Blender</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

