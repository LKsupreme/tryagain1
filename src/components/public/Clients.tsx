import React from 'react';

const REGIONAL_STILLS = [
  { region: 'USA', desc: 'Dayton, Florida & Las Vegas projects', img: '/src/assets/images/project_solis_residence_1790605551876.jpg' },
  { region: 'CANADA', desc: 'Ontario Millwork Documentation', img: '/src/assets/images/project_monolith_interior_1790605581695.jpg' },
  { region: 'DUBAI', desc: 'High-rise & luxury living concepts', img: '/src/assets/images/hero_arch_viz_1790605520563.jpg' },
  { region: 'EGYPT', desc: "Mansoura Children's Hospital", img: '/src/assets/images/project_nordic_sanctuary_1790605538249.jpg' },
  { region: 'THAILAND', desc: 'Plan A Production Walkthrough', img: '/src/assets/images/project_kyoto_pavilion_1790605566767.jpg' },
  { region: 'INDIA', desc: 'Adani Group Smart Meters', img: '/src/assets/images/hero_arch_viz_1790605520563.jpg' },
];

export const Clients: React.FC = () => {
  return (
    <section className="relative w-full bg-[#f4f1ea] py-28 px-6 lg:px-12 border-t border-[#e5dfd5]">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 border-b border-[#ded7cc] pb-6">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#877158] font-medium">
            International Experience
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl font-light text-[#1a1a1d] tracking-wide">
            USA · CANADA · DUBAI · EGYPT · THAILAND · INDIA
          </h2>
        </div>

        {/* Minimal visual grid of regional project stills */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {REGIONAL_STILLS.map((item) => (
            <div key={item.region} className="space-y-2 group">
              <div className="aspect-[4/3] overflow-hidden bg-[#e0dad0] relative">
                <img
                  src={item.img}
                  alt={item.region}
                  loading="lazy"
                  className="img-editorial h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
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
