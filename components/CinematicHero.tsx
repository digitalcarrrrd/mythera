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
      <span className="text-[#d6e8aa]">STUDIO.</span>
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
  return (
    <section className="relative min-h-[95vh] flex items-center justify-start pt-32 pb-24 px-6 sm:px-12 lg:px-16 overflow-hidden bg-[#0c0e0d]">
      {/* Background Image with Cinematic Gradient Shade */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={backgroundImage}
          alt="MYTHRA cinematic fantasy universe"
          className="w-full h-full object-cover object-[center_40%] animate-cinema-zoom opacity-80 scale-105"
        />
        {/* Multilayer gradient shade for optimal readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0e0d]/90 via-[#0c0e0d]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e0d] via-transparent to-[#0c0e0d]/60" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {/* Eyebrow with horizontal dash line */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-6 h-[1.5px] bg-[#d6e8aa]" />
          <span className="text-[11px] sm:text-xs font-mono font-semibold tracking-[0.25em] text-[#d6e8aa] uppercase">
            {eyebrow}
          </span>
          {badge && (
            <span className="text-[9px] uppercase tracking-widest bg-[#141714] border border-[#d6e8aa]/30 text-[#d6e8aa] px-2.5 py-0.5 rounded-full ml-2">
              {badge}
            </span>
          )}
        </div>

        {/* Big Bold Headline */}
        <h1 className="font-sans text-5xl sm:text-7xl md:text-8xl font-black tracking-[-0.04em] text-[#f3f3eb] leading-[0.96] uppercase drop-shadow-lg">
          {headline}
        </h1>

        {/* Subtitle Lead & Support */}
        <div className="mt-8 space-y-2 max-w-xl">
          {lead && (
            <p className="text-xl sm:text-2xl text-[#f3f3eb] font-medium tracking-tight">
              {lead}
            </p>
          )}
          {support && (
            <p className="text-sm sm:text-base text-[#9ea399] font-normal leading-relaxed">
              {support}
            </p>
          )}
        </div>

        {/* High-Contrast Pill Action Buttons */}
        <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-5">
          <Link
            href={primaryCtaHref}
            className="btn-pill-primary text-sm sm:text-base"
          >
            <span>{primaryCtaText}</span>
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </Link>

          {secondaryCtaText && (
            <Link
              href={secondaryCtaHref}
              className="btn-pill-secondary text-sm sm:text-base"
            >
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center -ml-1">
                <Play className="w-3 h-3 fill-current ml-0.5 text-[#d6e8aa]" />
              </div>
              <span>{secondaryCtaText}</span>
            </Link>
          )}
        </div>

        {/* Bottom Banner Note */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-[11px] uppercase tracking-widest text-[#9ea399]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d6e8aa] animate-pulse" />
            <span>THE FUTURE OF FILM IS INDEPENDENT.</span>
          </div>
          <div className="hidden sm:block text-[#727b66]">
            MYTHRA UNIVERSE · ORIGINAL CINEMA
          </div>
        </div>
      </div>
    </section>
  );
}
