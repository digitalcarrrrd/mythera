'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ArrowRight, ArrowUpRight, Sparkles, ChevronDown } from 'lucide-react';

interface CinematicHeroProps {
  eyebrow?: string;
  headline?: React.ReactNode;
  lead?: string;
  support?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  backgroundImage?: string;
  badge?: string;
}

export default function CinematicHero({
  eyebrow = 'INDEPENDENT MINDS. IMPOSSIBLE WORLDS.',
  headline = (
    <>
      A ONE-PERSON<br />
      HOLLYWOOD<br />
      <span className="text-[#d8ff44]">STUDIO.</span>
    </>
  ),
  lead = 'Original drama built for the AI era.',
  support = 'One creator. AI-native production. Studio-scale ambition.',
  primaryCtaText = 'Collaborate with MYTHRA',
  primaryCtaHref = '#paths',
  secondaryCtaText = 'Explore the experiment',
  secondaryCtaHref = '/genesis',
  backgroundImage = '/mythra-world.png',
  badge,
}: CinematicHeroProps) {
  const handlePrimaryClick = (e: React.MouseEvent) => {
    if (primaryCtaHref.startsWith('#')) {
      e.preventDefault();
      const targetId = primaryCtaHref.substring(1);
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = primaryCtaHref;
      }
    }
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-start pt-32 pb-24 px-6 sm:px-12 lg:px-16 overflow-hidden bg-[#000000]">
      {/* Background Image with Cinematic Gradient Shade */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={backgroundImage}
          alt="MYTHRA cinematic fantasy universe"
          className="w-full h-full object-cover object-[center_40%] animate-cinema-zoom opacity-85 scale-105"
        />
        {/* Multilayer gradient shade for pitch-black immersion and maximum contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#000000]/95 via-[#000000]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-[#000000]/70" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {/* Eyebrow with horizontal dash line */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[2px] bg-[#d8ff44]" />
          <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] text-[#d8ff44] uppercase">
            {eyebrow}
          </span>
          {badge && (
            <span className="text-[9px] uppercase tracking-widest bg-[#0a0d08] border border-[#d8ff44]/40 text-[#d8ff44] px-2.5 py-0.5 rounded-full ml-2">
              {badge}
            </span>
          )}
        </div>

        {/* Big Bold Headline */}
        <h1 className="font-sans text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] text-[#ffffff] leading-[0.96] uppercase drop-shadow-2xl">
          {headline}
        </h1>

        {/* Subtitle Lead & Support */}
        <div className="mt-8 space-y-2 max-w-xl">
          {lead && (
            <p className="text-xl sm:text-2xl text-[#f3f3eb] font-semibold tracking-tight">
              {lead}
            </p>
          )}
          {support && (
            <p className="text-sm sm:text-base text-[#a3a89e] font-normal leading-relaxed">
              {support}
            </p>
          )}
        </div>

        {/* High-Contrast Pill Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
          <a
            href={primaryCtaHref}
            onClick={handlePrimaryClick}
            className="btn-pill-primary text-sm sm:text-base"
          >
            <span>{primaryCtaText}</span>
            <ArrowUpRight className="w-5 h-5 stroke-[3]" />
          </a>

          {secondaryCtaText && (
            <a
              href={secondaryCtaHref}
              className="btn-pill-secondary text-sm sm:text-base"
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center -ml-1">
                <Play className="w-3 h-3 fill-current ml-0.5 text-[#d8ff44]" />
              </div>
              <span>{secondaryCtaText}</span>
            </a>
          )}
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-[11px] uppercase tracking-widest text-[#a3a89e]">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#d8ff44] animate-pulse" />
            <span>THE FUTURE OF FILM IS INDEPENDENT.</span>
          </div>
          <div className="hidden sm:block text-[#727b66] font-mono">
            MYTHRA UNIVERSE · ORIGINAL CINEMA
          </div>
        </div>
      </div>
    </section>
  );
}
