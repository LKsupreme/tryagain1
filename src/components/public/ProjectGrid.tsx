import React, { useState, useMemo } from 'react';
import { Project } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (slug: string) => void;
}

type CategoryFilter = 'All' | '3D Visualization' | 'Architecture' | 'Interiors' | 'Animation & Video';

const CATEGORIES: CategoryFilter[] = [
  'All',
  '3D Visualization',
  'Architecture',
  'Interiors',
  'Animation & Video',
];

export const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter((p) => {
      const cat = p.category.toLowerCase();
      if (activeCategory === '3D Visualization') return cat.includes('3d') || cat.includes('visualization');
      if (activeCategory === 'Architecture') return cat.includes('arch');
      if (activeCategory === 'Interiors') return cat.includes('interior') || cat.includes('millwork');
      if (activeCategory === 'Animation & Video') return cat.includes('animation') || cat.includes('video') || p.coverType === 'video';
      return p.category === activeCategory;
    });
  }, [projects, activeCategory]);

  const renderMedia = (
    itemUrl: string,
    type: 'image' | 'video',
    posterUrl?: string,
    aspectClass = 'aspect-[16/9]'
  ) => {
    if (type === 'video') {
      return (
        <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#e8e3d8]`}>
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={posterUrl || '/src/assets/images/hero_arch_viz_1790605520563.jpg'}
            className="h-full w-full object-cover"
          >
            <source src={itemUrl} type="video/mp4" />
          </video>
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-2.5 py-1 text-[9px] tracking-widest uppercase text-[#18181b] rounded font-medium">
            Walkthrough Video
          </div>
        </div>
      );
    }

    return (
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-[#e8e3d8]`}>
        <img
          src={itemUrl}
          alt="Architectural Visual"
          loading="lazy"
          className="img-editorial h-full w-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  // Group filtered projects into editorial blocks
  type LayoutBlock =
    | { type: 'full-hero'; project: Project }
    | { type: 'asymmetric-duo'; projectA: Project; projectB?: Project }
    | { type: 'cinematic-wide'; project: Project }
    | { type: 'spread-duo'; projectA: Project; projectB?: Project };

  const layoutBlocks = useMemo(() => {
    const blocks: LayoutBlock[] = [];
    let i = 0;
    let blockIndex = 0;

    while (i < filteredProjects.length) {
      const pattern = blockIndex % 4;
      if (pattern === 0) {
        // Full width hero
        blocks.push({ type: 'full-hero', project: filteredProjects[i] });
        i += 1;
      } else if (pattern === 1) {
        // Asymmetric pair
        const projectA = filteredProjects[i];
        const projectB = i + 1 < filteredProjects.length ? filteredProjects[i + 1] : undefined;
        blocks.push({ type: 'asymmetric-duo', projectA, projectB });
        i += projectB ? 2 : 1;
      } else if (pattern === 2) {
        // Cinematic wide
        blocks.push({ type: 'cinematic-wide', project: filteredProjects[i] });
        i += 1;
      } else {
        // Spread duo
        const projectA = filteredProjects[i];
        const projectB = i + 1 < filteredProjects.length ? filteredProjects[i + 1] : undefined;
        blocks.push({ type: 'spread-duo', projectA, projectB });
        i += projectB ? 2 : 1;
      }
      blockIndex += 1;
    }

    return blocks;
  }, [filteredProjects]);

  return (
    <section id="work" className="relative w-full bg-[#f9f8f5] pt-24 pb-36 px-0 sm:px-6 lg:px-12">
      {/* Editorial Section Heading & Minimal Category Filters */}
      <div className="mx-auto max-w-7xl px-6 pb-12 flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#e5dfd5]">
        <div>
          <h2 className="font-editorial text-3xl sm:text-5xl font-light text-[#18181b]">
            Selected Work
          </h2>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#877158] font-medium block mt-1">
            3D · Architecture · Interiors · Video
          </span>
        </div>

        {/* Minimal Editorial Category Tabs (Zero SaaS pills) */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.18em]">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`py-1 transition-colors relative ${
                  isActive
                    ? 'text-[#18181b] font-medium'
                    : 'text-[#787268] hover:text-[#18181b]'
                }`}
              >
                <span>{cat}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#877158]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="mx-auto max-w-xl text-center py-24 px-6 space-y-3">
          <p className="font-editorial text-2xl text-[#18181b]">No projects in this category</p>
          <button
            onClick={() => setActiveCategory('All')}
            className="text-xs uppercase tracking-widest text-[#877158] hover:text-[#18181b]"
          >
            Show All Projects
          </button>
        </div>
      )}

      {/* 90% Visual Editorial Portfolio Sequence */}
      <div className="space-y-36 sm:space-y-48 mt-16 max-w-[1700px] mx-auto">
        {layoutBlocks.map((block, idx) => {
          if (block.type === 'full-hero') {
            const p = block.project;
            return (
              <div
                key={p.id || idx}
                onClick={() => onSelectProject(p.slug)}
                className="group cursor-pointer space-y-4 px-4 sm:px-0"
              >
                {renderMedia(
                  p.coverUrl || p.coverImage || '',
                  p.coverType,
                  p.coverPosterUrl,
                  'aspect-[16/9] sm:aspect-[21/10]'
                )}

                <div className="flex items-baseline justify-between pt-2 px-2 sm:px-0">
                  <div className="space-y-0.5">
                    <h3 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] group-hover:text-[#877158] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#787268]">
                      {p.category} · {p.year} {p.location ? `· ${p.location}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#787268] group-hover:text-[#18181b] transition-colors">
                    <span className="hidden sm:inline font-medium">View Project</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            );
          }

          if (block.type === 'asymmetric-duo') {
            const pA = block.projectA;
            const pB = block.projectB;

            return (
              <div
                key={pA.id || idx}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start px-4 sm:px-0"
              >
                {/* Project A: Large Image (8 cols) */}
                <div
                  onClick={() => onSelectProject(pA.slug)}
                  className={`group cursor-pointer space-y-4 ${
                    pB ? 'lg:col-span-8' : 'lg:col-span-10 lg:col-start-2'
                  }`}
                >
                  {renderMedia(
                    pA.coverUrl || pA.coverImage || '',
                    pA.coverType,
                    pA.coverPosterUrl,
                    'aspect-[16/10]'
                  )}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <h3 className="font-editorial text-2xl sm:text-3xl font-light text-[#18181b] group-hover:text-[#877158] transition-colors">
                        {pA.title}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#787268]">
                        {pA.category} · {pA.year}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#787268] group-hover:text-[#18181b] transition-colors" />
                  </div>
                </div>

                {/* Project B: Portrait Image (4 cols, staggered) */}
                {pB && (
                  <div
                    onClick={() => onSelectProject(pB.slug)}
                    className="group cursor-pointer space-y-4 lg:col-span-4 lg:pt-20"
                  >
                    {renderMedia(
                      pB.coverUrl || pB.coverImage || '',
                      pB.coverType,
                      pB.coverPosterUrl,
                      'aspect-[4/5]'
                    )}
                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <h3 className="font-editorial text-xl sm:text-2xl font-light text-[#18181b] group-hover:text-[#877158] transition-colors">
                          {pB.title}
                        </h3>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#787268]">
                          {pB.category} · {pB.year}
                        </p>
                      </div>
                      <ArrowUpRight className="h-3.5 w-3.5 text-[#787268] group-hover:text-[#18181b] transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            );
          }

          if (block.type === 'cinematic-wide') {
            const p = block.project;
            return (
              <div
                key={p.id || idx}
                onClick={() => onSelectProject(p.slug)}
                className="group cursor-pointer space-y-4 px-4 sm:px-0"
              >
                {renderMedia(
                  p.coverUrl || p.coverImage || '',
                  p.coverType,
                  p.coverPosterUrl,
                  'aspect-[16/9] sm:aspect-[21/9]'
                )}

                <div className="flex items-baseline justify-between pt-2 px-2 sm:px-0">
                  <div className="space-y-0.5">
                    <h3 className="font-editorial text-2xl sm:text-4xl font-light text-[#18181b] group-hover:text-[#877158] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#787268]">
                      {p.category} {p.location ? `· ${p.location}` : ''} · {p.year}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#787268] group-hover:text-[#18181b] transition-colors">
                    <span className="hidden sm:inline font-medium">View Project</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          }

          // spread-duo
          const pA = block.projectA;
          const pB = block.projectB;
          return (
            <div
              key={pA.id || idx}
              className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 px-4 sm:px-0"
            >
              {/* Project A */}
              <div
                onClick={() => onSelectProject(pA.slug)}
                className="group cursor-pointer space-y-4"
              >
                {renderMedia(
                  pA.coverUrl || pA.coverImage || '',
                  pA.coverType,
                  pA.coverPosterUrl,
                  'aspect-[4/3] sm:aspect-[5/4]'
                )}
                <div className="flex items-baseline justify-between pt-1">
                  <div>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-light text-[#18181b] group-hover:text-[#877158] transition-colors">
                      {pA.title}
                    </h3>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#787268]">
                      {pA.category} {pA.location ? `· ${pA.location}` : ''}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-[#787268] group-hover:text-[#18181b] transition-colors" />
                </div>
              </div>

              {/* Project B */}
              {pB && (
                <div
                  onClick={() => onSelectProject(pB.slug)}
                  className="group cursor-pointer space-y-4 md:pt-16"
                >
                  {renderMedia(
                    pB.coverUrl || pB.coverImage || '',
                    pB.coverType,
                    pB.coverPosterUrl,
                    'aspect-[4/3] sm:aspect-[5/4]'
                  )}
                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <h3 className="font-editorial text-2xl sm:text-3xl font-light text-[#18181b] group-hover:text-[#877158] transition-colors">
                        {pB.title}
                      </h3>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#787268]">
                        {pB.category} {pB.location ? `· ${pB.location}` : ''}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-[#787268] group-hover:text-[#18181b] transition-colors" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
