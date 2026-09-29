import React from 'react';
import { ArrowUpRight, MessageCircle, Mail, Instagram } from 'lucide-react';

export const Contact: React.FC = () => {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    'Hello Elle, I would like to discuss an upcoming visual project with you.'
  )}`;

  return (
    <section id="contact" className="relative w-full bg-[#f9f8f5] py-32 px-6 lg:px-12 border-t border-[#e5dfd5]">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="space-y-4 max-w-3xl">
          <span className="text-[11px] uppercase tracking-[0.28em] text-[#877158] font-medium">
            Initiate Project
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-light text-[#1a1a1d] leading-tight">
            Let's create.
          </h2>

          <div className="pt-2 text-xs uppercase tracking-[0.2em] text-[#787268] flex flex-wrap gap-x-4 gap-y-2">
            <span>AI Creative</span>
            <span className="text-[#ded7cc]">·</span>
            <span>3D Visualization</span>
            <span className="text-[#ded7cc]">·</span>
            <span>Interior Visualization</span>
            <span className="text-[#ded7cc]">·</span>
            <span>Architectural Visualization</span>
            <span className="text-[#ded7cc]">·</span>
            <span>Visual Development</span>
          </div>
        </div>

        {/* Minimal Direct Channels (No giant contact form) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-[#e5dfd5]">
          {/* Email */}
          <a
            href="mailto:connect.ellekay@gmail.com"
            className="group py-6 border-b border-[#e5dfd5] sm:border-b-0 flex items-center justify-between hover:border-[#877158] transition-colors"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#787268] block">
                Direct Inquiries
              </span>
              <span className="font-editorial text-2xl text-[#1a1a1d] group-hover:text-[#877158] transition-colors">
                connect.ellekay@gmail.com
              </span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#787268] group-hover:text-[#1a1a1d] transition-colors" />
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
                Direct Chat
              </span>
              <span className="font-editorial text-2xl text-[#1a1a1d] group-hover:text-[#877158] transition-colors">
                WhatsApp
              </span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#787268] group-hover:text-[#1a1a1d] transition-colors" />
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group py-6 flex items-center justify-between hover:border-[#877158] transition-colors"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#787268] block">
                Visual Feed
              </span>
              <span className="font-editorial text-2xl text-[#1a1a1d] group-hover:text-[#877158] transition-colors">
                Instagram
              </span>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#787268] group-hover:text-[#1a1a1d] transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
};
