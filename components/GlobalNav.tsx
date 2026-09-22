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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0c0e0d]/95 backdrop-blur-md border-b border-[#ffffff15] py-4 shadow-xl'
          : 'bg-transparent py-6 border-b border-[#ffffff15]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-start gap-1 text-white">
          <span className="font-sans text-2xl sm:text-3xl font-black tracking-[-0.05em] text-[#f3f3eb] group-hover:text-[#d6e8aa] transition-colors">
            MYTHRA
          </span>
          <span className="text-[10px] font-bold text-[#d6e8aa] mt-0.5">
            ®
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-[#d6e8aa] font-bold border-b-2 border-[#d6e8aa]'
                    : 'text-[#9ea399] hover:text-[#f3f3eb]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Case study link */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/genesis"
            className="text-xs text-[#9ea399] hover:text-[#f3f3eb] px-3 py-1.5 transition-colors font-medium"
          >
            Genesis Case
          </Link>
          <Link
            href="/#paths"
            className="btn-pill-primary text-xs !py-2.5 !px-5"
          >
            <span>Choose Your Path</span>
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#f3f3eb] hover:text-[#d6e8aa]"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0c0e0d] border-b border-[#ffffff20] px-6 py-6 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg text-[#f3f3eb] py-2 border-b border-[#1a1e19] hover:text-[#d6e8aa] font-semibold"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/genesis"
              className="text-sm text-[#9ea399] py-2 hover:text-white"
            >
              Genesis Case Study
            </Link>
            <Link
              href="/admin/funnel-test"
              className="text-xs text-[#d6e8aa] py-1 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Simulator & Controls
            </Link>
          </div>
          <Link
            href="/#paths"
            className="btn-pill-primary w-full text-center text-xs justify-center mt-4"
          >
            Choose Your Path &rarr;
          </Link>
        </div>
      )}
    </header>
  );
}
