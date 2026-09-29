import React, { useState } from 'react';
import { Sparkles, ArrowRight, Play, X } from 'lucide-react';

const AI_STUDIES = [
  {
    id: 'ai-1',
    title: 'Monolithic Travertine In Void',
    category: 'Spatial Concept',
    prompt: 'Brutalist Roman travertine pavilion suspended in mist, soft morning raking light, natural grain',
    mediaUrl: '/src/assets/images/project_monolith_interior_1790605581695.jpg',
    type: 'image',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'ai-2',
    title: 'Cinematic Architecture Facade',
    category: 'AI Video / Motion',
    prompt: 'Fluid daylight progression over modern architectural lattice, 4K camera glide',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-architectural-building-facade-42777-large.mp4',
    posterUrl: '/src/assets/images/hero_arch_viz_1790605520563.jpg',
    type: 'video',
    aspect: 'aspect-[16/9]',
  },
  {
    id: 'ai-3',
    title: 'Sub-Surface Light & Coastal Timber',
    category: 'Material Synthesis',
    prompt: 'Charred Japanese cedar screens catching golden reflection from shallow water basin',
    mediaUrl: '/src/assets/images/project_kyoto_pavilion_1790605566767.jpg',
    type: 'image',
    aspect: 'aspect-[16/10]',
  },
  {
    id: 'ai-4',
    title: 'Atmospheric Horizon Walkthrough',
    category: 'Generative Sequence',
    prompt: 'Drone sweep across cantilevered residential mirage at dusk, 35mm lens blur',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-residential-villa-with-pool-at-sunset-42778-large.mp4',
    posterUrl: '/src/assets/images/project_solis_residence_1790605551876.jpg',
    type: 'video',
    aspect: 'aspect-[16/9]',
  },
];

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

export const AICreative: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  return (
    <section id="ai" className="relative w-full bg-[#f4f1ea] py-32 px-6 lg:px-12 border-t border-[#e5dfd5]">
      <div className="mx-auto max-w-7xl space-y-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#ded7cc] pb-8">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#877158] font-medium">
              Generative Workflows · 2–3 Years Practice
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl font-light text-[#1a1a1d] tracking-tight">
              AI Creative
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
          {AI_STUDIES.map((study) => (
            <div key={study.id} className="space-y-3 group">
              <div className={`relative w-full ${study.aspect} overflow-hidden bg-[#e8e3d8]`}>
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
