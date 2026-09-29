import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, X, Edit3 } from 'lucide-react';
import { AICreativeContent } from '../../types';

interface AICreativeProps {
  content: AICreativeContent;
  isEditMode?: boolean;
  onEditSection?: () => void;
}

const WORKFLOW_STEPS = [
  { step: '01', name: 'Brief' },
  { step: '02', name: 'Prompt' },
  { step: '03', name: 'Composition' },
  { step: '04', name: 'Camera' },
  { step: '05', name: 'Light' },
  { step: '06', name: 'Generation' },
  { step: '07', name: 'Iteration' },
  { step: '08', name: 'Final' },
];

export const AICreative: React.FC<AICreativeProps> = ({
  content,
  isEditMode,
  onEditSection,
}) => {
  return (
    <section id="ai" className={`relative w-full bg-[#f4f1ea] py-32 px-6 lg:px-12 border-t border-[#e5dfd5] ${isEditMode ? 'ring-2 ring-amber-400/60 ring-inset' : ''}`}>
      {/* Edit Mode Badge */}
      {isEditMode && (
        <button
          onClick={onEditSection}
          className="absolute top-8 right-6 lg:right-12 z-30 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit AI Studies & Prompts</span>
        </button>
      )}

      <div className="mx-auto max-w-7xl space-y-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#ded7cc] pb-8">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#877158] font-medium">
              {content.badge}
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-light text-[#1a1a1d] tracking-tight">
              {content.heading}
            </h2>
          </div>

          <p className="font-editorial text-xl sm:text-2xl font-light text-[#635e56] max-w-md">
            "From brief to prompt to image, motion and final visual."
          </p>
        </div>

        {/* Visual Workflow Flow Strip */}
        <div className="py-6 border-y border-[#e5dfd5] overflow-x-auto">
          <div className="flex items-center gap-6 min-w-max text-xs uppercase tracking-[0.2em] text-[#787268]">
            {WORKFLOW_STEPS.map((s, idx) => (
              <React.Fragment key={s.step}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#877158] font-mono">{s.step}</span>
                  <span className="text-[#1a1a1d] font-medium">{s.name}</span>
                </div>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <span className="text-[#bbb3a5]">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Visual Experiments Archive (90% Visual) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
          {content.studies?.map((study) => (
            <div key={study.id} className="space-y-3 group">
              <div className={`relative w-full ${study.aspect || 'aspect-[16/9]'} overflow-hidden bg-[#e8e3d8]`}>
                {study.type === 'video' ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={study.posterUrl}
                    className="h-full w-full object-cover"
                  >
                    <source src={study.mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={study.mediaUrl}
                    alt={study.title}
                    loading="lazy"
                    className="img-editorial h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#1a1a1d] rounded">
                  {study.category}
                </div>

                {isEditMode && (
                  <button
                    onClick={onEditSection}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium"
                  >
                    <Edit3 className="h-4 w-4 text-amber-300" />
                    <span>Change Study Visual</span>
                  </button>
                )}
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <h3 className="font-editorial text-2xl font-light text-[#1a1a1d] group-hover:text-[#877158] transition-colors">
                  {study.title}
                </h3>
                <span className="text-[11px] text-[#787268] font-mono italic">
                  AI Synthesis
                </span>
              </div>

              <p className="text-xs text-[#787268] font-light italic max-w-lg">
                "{study.prompt}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
