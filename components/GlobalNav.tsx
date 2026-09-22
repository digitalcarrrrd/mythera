'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function GlobalNav() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Stories', href: '/stories' },
    { name: 'The Method', href: '/method' },
    { name: 'For You', href: '/you' },
    { name: 'Filmmaker', href: '/filmmaker' },
    { name: 'Studios', href: '/studios' },
  ];

  const handleScrollToPaths = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/' || window.location.pathname === '') {
        e.preventDefault();
        const el = document.getElementById('paths');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.location.href = '/#paths';
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#000000]/95 backdrop-blur-md border-b border-[#ffffff15] py-4 shadow-2xl'
          : 'bg-[#000000]/60 backdrop-blur-sm py-6 border-b border-[#ffffff10]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="group flex items-start gap-1 text-white no-underline">
          <span className="font-sans text-2xl sm:text-3xl font-black tracking-[-0.05em] text-[#ffffff] group-hover:text-[#d8ff44] transition-colors">
            MYTHRA
          </span>
          <span className="text-[10px] font-bold text-[#d8ff44] mt-0.5">
            ®
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 no-underline ${
                  isActive
                    ? 'text-[#d8ff44] font-bold border-b-2 border-[#d8ff44]'
                    : 'text-[#a3a89e] hover:text-[#ffffff]'
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Action Button & Case study link */}
        <div className="hidden md:flex items-center gap-5">
          <a
            href="/genesis"
            className="text-xs text-[#a3a89e] hover:text-[#ffffff] px-2 py-1.5 transition-colors font-semibold no-underline"
          >
            Genesis Case
          </a>
          <a
            href="/#paths"
            onClick={handleScrollToPaths}
            className="btn-pill-primary text-xs !py-2.5 !px-5"
          >
            <span>Choose Your Path</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#ffffff] hover:text-[#d8ff44]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#000000] border-b border-[#ffffff20] px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg text-[#ffffff] py-2 border-b border-[#1a1e19] hover:text-[#d8ff44] font-bold no-underline"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/genesis"
              className="text-sm text-[#a3a89e] py-2 hover:text-white no-underline font-medium"
            >
              Genesis Case Study
            </a>
            <a
              href="/admin/funnel-test"
              className="text-xs text-[#d8ff44] py-1 flex items-center gap-1.5 no-underline font-mono"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Simulator & Controls
            </a>
          </div>
          <a
            href="/#paths"
            onClick={(e) => {
              setMobileMenuOpen(false);
              handleScrollToPaths(e);
            }}
            className="btn-pill-primary w-full text-center text-xs justify-center mt-4"
          >
            Choose Your Path &rarr;
          </a>
        </div>
      )}
    </header>
  );
}
