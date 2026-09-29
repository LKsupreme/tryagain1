import React from 'react';
import { ArrowUp } from 'lucide-react';
import { FooterContent } from '../../types';

interface FooterProps {
  onOpenSitemap: () => void;
  onOpenRobots: () => void;
  onNavigateToAdmin?: () => void;
  content?: FooterContent;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSitemap,
  onOpenRobots,
  onNavigateToAdmin,
  content,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const brandTitle = content?.brandTitle || 'ELLE KAY';
  const tagline = content?.tagline || 'AI Creative Artist · 3D Designer · Visual Creative';
  const copyright = content?.copyright || `© ${new Date().getFullYear()} Elle Kay. All rights reserved.`;

  return (
    <footer className="border-t border-[#ded7cc] bg-[#eee9df] py-20 px-6 lg:px-12 text-[#635e56]">
      <div className="mx-auto max-w-7xl space-y-16">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 pb-12 border-b border-[#ded7cc]">
          <div className="space-y-3">
            <span className="font-editorial text-3xl font-light tracking-[0.16em] text-[#18181b]">
              {brandTitle}
            </span>
            <p className="text-xs text-[#787268] max-w-sm font-light">
              {tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs uppercase tracking-[0.16em]">
            <a href="#work" className="hover:text-[#18181b] transition-colors">
              Work
            </a>
            <a href="#ai" className="hover:text-[#18181b] transition-colors">
              AI Creative
            </a>
            <a href="#services" className="hover:text-[#18181b] transition-colors">
              Services
            </a>
            <a href="#about" className="hover:text-[#18181b] transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-[#18181b] transition-colors">
              Contact
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-[#18181b] transition-colors ml-4 text-[11px]"
            >
              <span>Back to Top</span>
              <ArrowUp className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Quiet copyright & metadata */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#787268]">
          <p>{copyright}</p>

          <div className="flex items-center gap-4">
            <button onClick={onOpenSitemap} className="hover:text-[#18181b] transition-colors">
              Sitemap
            </button>
            <span>·</span>
            <button onClick={onOpenRobots} className="hover:text-[#18181b] transition-colors">
              Robots
            </button>
            {/* Discrete link for the designer at the very bottom right */}
            {onNavigateToAdmin && (
              <>
                <span>·</span>
                <button
                  onClick={onNavigateToAdmin}
                  className="hover:text-[#18181b] transition-colors text-[10px] opacity-40 hover:opacity-100"
                  title="Studio Portal"
                >
                  Studio Access
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
