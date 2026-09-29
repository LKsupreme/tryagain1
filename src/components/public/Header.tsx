import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { HeaderContent } from '../../types';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  content?: HeaderContent;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, content }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = content?.brandName || 'ELLE KAY';
  const brandTitle = content?.brandTitle || 'AI Creative · 3D Designer';
  const inquireText = content?.inquireButtonText || "Let's Create";

  const handleNavClick = (target: string, e: React.MouseEvent) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (target.startsWith('#')) {
      if (currentPath !== '/') {
        onNavigate('/');
        setTimeout(() => {
          const el = document.querySelector(target);
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      onNavigate(target);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f9f8f5]/90 backdrop-blur-md transition-colors border-b border-[#e5dfd5]/60">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand Lockup */}
        <a
          href="/"
          onClick={(e) => handleNavClick('/', e)}
          className="group flex flex-col items-start"
        >
          <span className="font-editorial text-2xl font-normal tracking-[0.16em] text-[#18181b] group-hover:text-[#877158] transition-colors">
            {brandName}
          </span>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#787268] font-medium">
            {brandTitle}
          </span>
        </a>

        {/* Minimal Nav: WORK · AI · ABOUT · SERVICES · CONTACT */}
        <nav className="hidden items-center gap-10 md:flex">
          <a
            href="#work"
            onClick={(e) => handleNavClick('#work', e)}
            className="text-[12px] font-medium tracking-[0.18em] uppercase text-[#635e56] hover:text-[#18181b] transition-colors"
          >
            Work
          </a>
          <a
            href="#ai"
            onClick={(e) => handleNavClick('#ai', e)}
            className="text-[12px] font-medium tracking-[0.18em] uppercase text-[#635e56] hover:text-[#18181b] transition-colors"
          >
            AI
          </a>
          <a
            href="#about"
            onClick={(e) => handleNavClick('#about', e)}
            className="text-[12px] font-medium tracking-[0.18em] uppercase text-[#635e56] hover:text-[#18181b] transition-colors"
          >
            About
          </a>
          <a
            href="#services"
            onClick={(e) => handleNavClick('#services', e)}
            className="text-[12px] font-medium tracking-[0.18em] uppercase text-[#635e56] hover:text-[#18181b] transition-colors"
          >
            Services
          </a>
          <a
            href="#contact"
            onClick={(e) => handleNavClick('#contact', e)}
            className="text-[12px] font-medium tracking-[0.18em] uppercase text-[#635e56] hover:text-[#18181b] transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Action: LET'S CREATE → */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            onClick={(e) => handleNavClick('#contact', e)}
            className="hidden sm:inline-block text-[11px] font-medium uppercase tracking-[0.22em] text-[#18181b] hover:text-[#877158] transition-colors"
          >
            Let's Create →
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#635e56] hover:text-[#18181b] md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#e5dfd5] bg-[#f9f8f5] px-6 py-8 md:hidden">
          <div className="flex flex-col gap-5 text-center">
            <a
              href="#work"
              onClick={(e) => handleNavClick('#work', e)}
              className="text-sm font-medium tracking-[0.2em] uppercase text-[#635e56] hover:text-[#18181b]"
            >
              Work
            </a>
            <a
              href="#ai"
              onClick={(e) => handleNavClick('#ai', e)}
              className="text-sm font-medium tracking-[0.2em] uppercase text-[#635e56] hover:text-[#18181b]"
            >
              AI
            </a>
            <a
              href="#about"
              onClick={(e) => handleNavClick('#about', e)}
              className="text-sm font-medium tracking-[0.2em] uppercase text-[#635e56] hover:text-[#18181b]"
            >
              About
            </a>
            <a
              href="#services"
              onClick={(e) => handleNavClick('#services', e)}
              className="text-sm font-medium tracking-[0.2em] uppercase text-[#635e56] hover:text-[#18181b]"
            >
              Services
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick('#contact', e)}
              className="text-sm font-medium tracking-[0.2em] uppercase text-[#635e56] hover:text-[#18181b]"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
