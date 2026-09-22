'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

interface StickyMobileCTAProps {
  label: string;
  price?: string;
  href: string;
}

export default function StickyMobileCTA({ label, price, href }: StickyMobileCTAProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#000000]/95 backdrop-blur-md border-t-2 border-[#ffffff15] p-4 animate-in slide-in-from-bottom duration-300 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#9ea399] block font-bold font-mono">
            {label}
          </span>
          {price && (
            <span className="font-sans text-xl font-black text-[#f3f3eb] leading-none">
              {price}
            </span>
          )}
        </div>
        <a
          href={href}
          className="btn-pill-primary text-xs !py-3 !px-5 inline-flex items-center gap-2"
        >
          <span>Start Now</span>
          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
        </a>
      </div>
    </div>
  );
}
