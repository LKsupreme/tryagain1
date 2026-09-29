import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export const About: React.FC = () => {
  const [showFullCV, setShowFullCV] = useState(false);

  return (
    <section id="about" className="relative w-full bg-[#f9f8f5] py-28 px-6 lg:px-12 border-t border-[#e5dfd5]">
      <div className="mx-auto max-w-7xl space-y-24">
        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Portrait Column */}
          <div className="lg:col-span-5 space-y-3">
            <div className="overflow-hidden aspect-[4/5] bg-[#e8e3d8] max-w-md">
              <img
                src="/src/assets/images/elle_kay_portrait_1790605599434.jpg"
                alt="Elle Kay"
                loading="lazy"
                className="h-full w-full object-cover object-center filter grayscale contrast-[1.05]"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-xs text-[#787268] font-medium tracking-wider uppercase">
              Elle Kay · AI Creative Artist & 3D Designer
            </p>
          </div>

          {/* Editorial Biography Column (80-120 words maximum) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#877158] font-medium">
                About The Practice
              </span>
              <h2 className="font-editorial text-4xl sm:text-5xl font-light text-[#1a1a1d]">
                Elle Kay
              </h2>
              <p className="text-xs uppercase tracking-[0.22em] text-[#787268]">
                AI Creative Artist · 3D Designer · Visual Creative
              </p>
            </div>

            <p className="font-editorial text-2xl sm:text-3xl font-light text-[#1a1a1d] leading-relaxed">
              "Visualizing ideas across 3D, design and generative AI."
            </p>

            {/* Exactly 80-120 words core biography */}
            <p className="text-sm sm:text-base text-[#524d45] font-light leading-relaxed max-w-xl">
              Elle Kay is an AI Creative Artist and 3D Designer working across visualization, interiors, architectural imagery and AI-assisted visual development. With 7+ years of professional experience and international project exposure, her work combines established 3D workflows with generative AI to develop images, animations, walkthroughs and visual concepts from early ideas to polished final outcomes.
            </p>

            {/* Three Quiet Experience Indicators (Not corporate stats) */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#e5dfd5]">
              <div className="space-y-0.5">
                <span className="font-editorial text-2xl sm:text-3xl text-[#1a1a1d] block">
                  7+ Years
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#787268] block">
                  Professional 3D & Design
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="font-editorial text-2xl sm:text-3xl text-[#1a1a1d] block">
                  2–3 Years
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#787268] block">
                  Generative AI Experience
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="font-editorial text-2xl sm:text-3xl text-[#1a1a1d] block">
                  Global
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#787268] block">
                  Client Commissions
                </span>
              </div>
            </div>

            {/* Compact Work Experience */}
            <div className="pt-6 border-t border-[#e5dfd5] space-y-4">
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#877158] block font-medium">
                Professional Experience
              </span>
              <div className="space-y-3 text-xs text-[#524d45]">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="font-medium text-[#1a1a1d]">
                    ELLEKAY — Founder · AI Creative Artist
                  </span>
                  <span className="text-[#787268] font-mono">2021–Present</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <span className="font-medium text-[#1a1a1d]">
                    KLANSKRAFT — Creative Director · Interior & 3D Design
                  </span>
                  <span className="text-[#787268] font-mono">2019–Present</span>
                </div>
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

        {/* Expandable Tools & Certifications (Compact, non-intrusive) */}
        {showFullCV && (
          <div className="p-8 bg-[#f4f1ea] border border-[#e5dfd5] space-y-8 rounded-sm animate-fade-in">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#877158] font-medium block">
                Tools I Work With
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#524d45]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#1a1a1d] font-semibold block">
                    ADOBE CREATIVE
                  </span>
                  <p>Photoshop · Premiere Pro · After Effects · Lightroom · Illustrator · InDesign · Canva</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#1a1a1d] font-semibold block">
                    GENERATIVE AI
                  </span>
                  <p>Google Veo · Google Flow · Nano Banana · ChatGPT · Claude · Gemini · DeepSeek · Perplexity · Midjourney · Runway · Kling · Krea · Luma</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-[#1a1a1d] font-semibold block">
                    3D & ARCHITECTURE
                  </span>
                  <p>SketchUp · Twinmotion · Unreal Engine · Lumion · V-Ray · Blender · Enscape · D5 Render · AutoCAD · Revit</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e0dad0] flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 text-xs text-[#787268]">
              <div>
                <span className="font-semibold text-[#1a1a1d]">Education: </span>
                <span>B.A.</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span>Adobe AI Creative Certification (2026)</span>
                <span>·</span>
                <span>Google Certifications (2026)</span>
                <span>·</span>
                <span>Udemy Real-Time 3D Architecture (2022)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
