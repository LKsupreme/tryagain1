import React from 'react';
import { Edit3 } from 'lucide-react';
import { ServicesContent } from '../../types';

interface ServicesProps {
  content: ServicesContent;
  isEditMode?: boolean;
  onEditSection?: () => void;
}

export const Services: React.FC<ServicesProps> = ({
  content,
  isEditMode,
  onEditSection,
}) => {
  return (
    <section id="services" className={`relative w-full bg-[#f9f8f5] py-28 px-6 lg:px-12 border-t border-[#e5dfd5] ${isEditMode ? 'ring-2 ring-amber-400/60 ring-inset' : ''}`}>
      {/* Edit Mode Badge */}
      {isEditMode && (
        <button
          onClick={onEditSection}
          className="absolute top-8 right-6 lg:right-12 z-30 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Services & Visuals</span>
        </button>
      )}

      <div className="mx-auto max-w-7xl space-y-20">
        <div className="flex items-baseline justify-between border-b border-[#e5dfd5] pb-6">
          <h2 className="font-editorial text-3xl sm:text-5xl font-light text-[#1a1a1d]">
            {content.heading}
          </h2>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#877158] font-medium">
            {content.badge}
          </span>
        </div>

        {/* 5 Distinct Services: 1 short sentence + 1 visual */}
        <div className="space-y-24">
          {content.items?.map((srv) => (
            <div key={srv.id || srv.number} className="space-y-4">
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
              <div className="w-full overflow-hidden aspect-[21/9] sm:aspect-[24/9] bg-[#e8e3d8] relative group">
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

                {isEditMode && (
                  <button
                    onClick={onEditSection}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium"
                  >
                    <Edit3 className="h-4 w-4 text-amber-300" />
                    <span>Change Service Visual / Upload Media</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

