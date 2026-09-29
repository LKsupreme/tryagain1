import React from 'react';
import { Edit3 } from 'lucide-react';
import { ClientsContent } from '../../types';

interface ClientsProps {
  content: ClientsContent;
  isEditMode?: boolean;
  onEditSection?: () => void;
}

export const Clients: React.FC<ClientsProps> = ({
  content,
  isEditMode,
  onEditSection,
}) => {
  return (
    <section className={`relative w-full bg-[#f4f1ea] py-28 px-6 lg:px-12 border-t border-[#e5dfd5] ${isEditMode ? 'ring-2 ring-amber-400/60 ring-inset' : ''}`}>
      {/* Edit Mode Badge */}
      {isEditMode && (
        <button
          onClick={onEditSection}
          className="absolute top-8 right-6 lg:right-12 z-30 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Regions & Clients</span>
        </button>
      )}

      <div className="mx-auto max-w-7xl space-y-16">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#ded7cc] pb-6">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#877158] font-medium">
            {content.badge}
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-light text-[#1a1a1d] tracking-wide">
            {content.heading}
          </h2>
        </div>

        {/* Minimal visual grid of regional project stills */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {content.regions?.map((item) => (
            <div key={item.id || item.region} className="space-y-2 group">
              <div className="aspect-[4/3] overflow-hidden bg-[#e0dad0] relative">
                <img
                  src={item.img}
                  alt={item.region}
                  loading="lazy"
                  className="img-editorial h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {isEditMode && (
                  <button
                    onClick={onEditSection}
                    className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                  >
                    <Edit3 className="h-3 w-3 text-amber-300 mr-1" />
                    <span>Change</span>
                  </button>
                )}
              </div>
              <div className="text-left">
                <span className="font-editorial text-base text-[#1a1a1d] block">
                  {item.region}
                </span>
                <span className="text-[10px] text-[#787268] block truncate">
                  {item.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

