import React from 'react';
import { ArrowUpRight, MessageCircle, Mail, Instagram, Edit3 } from 'lucide-react';
import { ContactContent } from '../../types';

interface ContactProps {
  content: ContactContent;
  isEditMode?: boolean;
  onEditSection?: () => void;
}

export const Contact: React.FC<ContactProps> = ({
  content,
  isEditMode,
  onEditSection,
}) => {
  const whatsappUrl = `https://wa.me/${(content.whatsappNumber || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    content.whatsappMessage || 'Hello Elle, I would like to discuss an upcoming visual project with you.'
  )}`;

  return (
    <section id="contact" className={`relative w-full bg-[#f9f8f5] py-32 px-6 lg:px-12 border-t border-[#e5dfd5] ${isEditMode ? 'ring-2 ring-amber-400/60 ring-inset' : ''}`}>
      {/* Edit Mode Badge */}
      {isEditMode && (
        <button
          onClick={onEditSection}
          className="absolute top-8 right-6 lg:right-12 z-30 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Contact Channels & Links</span>
        </button>
      )}

      <div className="mx-auto max-w-7xl space-y-16">
        <div className="space-y-4 max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#877158] font-medium">
            {content.badge}
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-[#1a1a1d] leading-tight">
            {content.heading}
          </h2>

          <div className="pt-2 text-xs uppercase tracking-[0.2em] text-[#787268] flex flex-wrap gap-x-4 gap-y-2">
            {content.subheadingTags?.map((tag, idx) => (
              <React.Fragment key={tag}>
                <span>{tag}</span>
                {idx < content.subheadingTags.length - 1 && <span className="text-[#ded7cc]">·</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Minimal Direct Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#e5dfd5]">
          {/* Email */}
          <a
            href={`mailto:${content.email}`}
            className="group py-6 border-b border-[#e5dfd5] sm:border-b-0 flex items-center justify-between hover:border-[#877158] transition-colors"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#787268] block">
                {content.emailLabel || 'Direct Inquiries'}
              </span>
              <span className="font-editorial text-xl sm:text-2xl text-[#1a1a1d] group-hover:text-[#877158] transition-colors break-all">
                {content.email}
              </span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#787268] group-hover:text-[#1a1a1d] transition-colors shrink-0" />
          </a>

          {/* WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group py-6 border-b border-[#e5dfd5] sm:border-b-0 flex items-center justify-between hover:border-[#877158] transition-colors"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#787268] block">
                {content.whatsappLabel || 'Direct Chat'}
              </span>
              <span className="font-editorial text-2xl text-[#1a1a1d] group-hover:text-[#877158] transition-colors">
                WhatsApp
              </span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#787268] group-hover:text-[#1a1a1d] transition-colors shrink-0" />
          </a>

          {/* Instagram */}
          <a
            href={content.instagramUrl || 'https://instagram.com'}
            target="_blank"
            rel="noopener noreferrer"
            className="group py-6 flex items-center justify-between hover:border-[#877158] transition-colors"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#787268] block">
                {content.instagramLabel || 'Visual Feed'}
              </span>
              <span className="font-editorial text-2xl text-[#1a1a1d] group-hover:text-[#877158] transition-colors">
                {content.instagram || 'Instagram'}
              </span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#787268] group-hover:text-[#1a1a1d] transition-colors shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
};

