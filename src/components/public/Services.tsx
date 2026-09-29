import React from 'react';

const SERVICES = [
  {
    number: '01',
    title: 'AI Creative',
    scope: 'AI imagery · AI video · Prompt development · Visual development',
    description: 'Transforming creative briefs into generative imagery, cinematic concept motion, and rapid visual ideation.',
    mediaUrl: '/src/assets/images/hero_arch_viz_1790605520563.jpg',
    type: 'image',
  },
  {
    number: '02',
    title: '3D Visualization',
    scope: 'Architectural · Interior · Environment · Product',
    description: 'Translating spatial design into photorealistic exterior and interior perspectives with natural daylight.',
    mediaUrl: '/src/assets/images/project_nordic_sanctuary_1790605538249.jpg',
    type: 'image',
  },
  {
    number: '03',
    title: 'Animation & Video',
    scope: 'Walkthroughs · Cinematic sequences · Camera direction · Video editing',
    description: 'Dynamic architectural fly-throughs and spatial walkthroughs highlighting light movement and scale.',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-architectural-building-facade-42777-large.mp4',
    posterUrl: '/src/assets/images/project_nordic_sanctuary_1790605538249.jpg',
    type: 'video',
  },
  {
    number: '04',
    title: 'Interior & Architectural Design',
    scope: 'Spatial development · Material direction · Visual presentation',
    description: 'Bespoke residential and commercial interior spaces, millwork articulation, and cohesive material palettes.',
    mediaUrl: '/src/assets/images/project_monolith_interior_1790605581695.jpg',
    type: 'image',
  },
  {
    number: '05',
    title: 'Technical Visualization',
    scope: 'CAD documentation · Design development · Presentation drawings',
    description: 'Precise shop drawings, millwork details, and submission-ready 2D/3D documentation.',
    mediaUrl: '/src/assets/images/project_solis_residence_1790605551876.jpg',
    type: 'image',
  },
];

export const Services: React.FC = () => {
  return (
    <section id="services" className="relative w-full bg-[#f9f8f5] py-28 px-6 lg:px-12 border-t border-[#e5dfd5]">
      <div className="mx-auto max-w-7xl space-y-20">
        <div className="flex items-baseline justify-between border-b border-[#e5dfd5] pb-6">
          <h2 className="font-editorial text-3xl sm:text-5xl font-light text-[#1a1a1d]">
            Services
          </h2>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#877158] font-medium">
            Scope & Capabilities
          </span>
        </div>

        {/* 5 Distinct Services: 1 short sentence + 1 visual */}
        <div className="space-y-24">
          {SERVICES.map((srv) => (
            <div key={srv.number} className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-[#ece6dc] pb-3">
                <div className="flex items-baseline gap-4">
                  <span className="font-editorial text-xl sm:text-2xl text-[#877158] font-light">
                    {srv.number}
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl font-light text-[#1a1a1d]">
                    {srv.title}
                  </h3>
                </div>

                <div className="text-xs text-[#524d45] space-y-0.5 md:text-right">
                  <p className="font-medium text-[#1a1a1d]">{srv.scope}</p>
                  <p className="text-[#787268]">{srv.description}</p>
                </div>
              </div>

              {/* One Large Visual Per Service */}
              <div className="w-full overflow-hidden aspect-[21/9] sm:aspect-[24/9] bg-[#e8e3d8]">
                {srv.type === 'video' ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={srv.posterUrl}
                    className="h-full w-full object-cover"
                  >
                    <source src={srv.mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={srv.mediaUrl}
                    alt={srv.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
