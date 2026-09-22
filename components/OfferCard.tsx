'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, ArrowUpRight, Clock, RefreshCw, Mic } from 'lucide-react';
import { OfferTier } from '../lib/offers';

interface OfferCardProps {
  offer: OfferTier;
  accentColor?: string;
  onSelect?: (offer: OfferTier) => void;
}

export default function OfferCard({ offer, onSelect }: OfferCardProps) {
  const isRecommended = offer.isRecommended;

  return (
    <div
      className={`relative flex flex-col justify-between p-8 sm:p-10 rounded-2xl transition-all duration-300 ${
        isRecommended
          ? 'bg-[#141714] border-2 border-[#d6e8aa] shadow-2xl shadow-[#d6e8aa]/15 -translate-y-2 ring-1 ring-[#d6e8aa]'
          : 'bg-[#141714] border-2 border-[#ffffff15] hover:border-[#ffffff30] shadow-lg'
      }`}
    >
      {/* Recommended Ribbon */}
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d6e8aa] text-[#11160e] text-[10px] uppercase tracking-widest font-black px-4 py-1 rounded-full shadow-md">
          Recommended Choice
        </div>
      )}

      <div>
        {/* Tier Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase block text-[#d6e8aa] font-bold">
              {offer.persona} OFFER
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-black text-[#f3f3eb] mt-1">
              {offer.name}
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#d6e8aa] font-semibold tracking-wide mb-6">
          {offer.tagline}
        </p>

        {/* Price display */}
        <div className="mb-6 pb-6 border-b border-[#ffffff15]">
          <div className="font-sans text-4xl sm:text-5xl font-black text-[#f3f3eb]">
            {offer.priceDisplay}
          </div>
          <span className="text-[11px] text-[#9ea399] block mt-1">
            {offer.isStartingPrice ? 'Custom scoped after feasibility review' : 'Fixed studio production package'}
          </span>
        </div>

        {/* Summary Description */}
        <p className="text-xs text-[#9ea399] leading-relaxed mb-6">
          {offer.description}
        </p>

        {/* Meta Specifications */}
        <div className="grid grid-cols-2 gap-3 py-3 px-4 bg-[#1a1e19] rounded-xl border border-[#ffffff10] text-[11px] text-[#9ea399] mb-6">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#d6e8aa]" />
            <span>{offer.turnaround}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-[#d6e8aa]" />
            <span>{offer.revisions}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Mic className="w-3.5 h-3.5 text-[#d6e8aa]" />
            <span>
              {offer.voiceCloningIncluded ? 'Authorized Voice Clone Option' : 'Narration / Text Only (No Clone)'}
            </span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="space-y-3 mb-8">
          <span className="text-[10px] uppercase tracking-widest text-[#9ea399] font-bold block">
            What is included:
          </span>
          {offer.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#f3f3eb]">
              <div className="w-4 h-4 rounded-full bg-[#d6e8aa]/20 flex items-center justify-center text-[#d6e8aa] shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pill CTA Button */}
      <div className="pt-6 border-t border-[#ffffff15]">
        <Link
          href={offer.ctaHref}
          onClick={() => onSelect && onSelect(offer)}
          className={`w-full text-center ${
            isRecommended ? 'btn-pill-primary' : 'btn-pill-secondary'
          } text-xs uppercase tracking-wider justify-center`}
        >
          <span>{offer.ctaText}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
}
