'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ArrowRight, Clock, Users } from 'lucide-react';
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
          ? 'bg-card border-2 border-primary shadow-2xl shadow-primary/20 -translate-y-2 ring-1 ring-primary'
          : 'bg-card border-2 border-[var(--border-subtle)] hover:border-primary/50 shadow-lg'
      }`}
    >
      {/* Recommended Ribbon */}
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-black px-4 py-1 rounded-full shadow-md">
          Recommended
        </div>
      )}

      <div>
        {/* Tier Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase block text-primary font-bold">
              {offer.persona} OFFER
            </span>
            <h3 className="font-sans text-2xl sm:text-3xl font-black text-foreground mt-1">
              {offer.name}
            </h3>
          </div>
        </div>

        <p className="text-xs text-primary font-semibold tracking-wide mb-6">
          {offer.tagline}
        </p>

        {/* Price display */}
        <div className="mb-6 pb-6 border-b border-[var(--border-subtle)]">
          <div className="font-sans text-4xl sm:text-5xl font-black text-foreground">
            {offer.priceDisplay}
          </div>
          {offer.standardPriceDisplay && (
            <span className="text-[11px] text-primary/80 font-mono block mt-1">
              Standard: {offer.standardPriceDisplay}
            </span>
          )}
          <span className="text-[11px] text-muted-foreground block mt-1">
            {offer.isStartingPrice
              ? 'Starting tier · Scoped to requirements'
              : offer.price === 0
              ? 'Executive alignment'
              : 'Direct production engagement'}
          </span>
        </div>

        {/* Summary Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-6">
          {offer.description}
        </p>

        {/* Availability / Turnaround Meta Badge if available */}
        {(offer.availability || offer.turnaround) && (
          <div className="py-2.5 px-4 bg-secondary rounded-xl border border-[var(--border-subtle)] text-[11px] text-muted-foreground mb-6 flex flex-wrap items-center gap-4">
            {offer.turnaround && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span>{offer.turnaround}</span>
              </div>
            )}
            {offer.availability && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span className="text-foreground font-semibold">{offer.availability}</span>
              </div>
            )}
          </div>
        )}

        {/* Features Checklist */}
        <div className="space-y-3 mb-8">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold block">
            What is included:
          </span>
          {offer.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground">
              <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pill CTA Button */}
      <div className="pt-6 border-t border-[var(--border-subtle)]">
        <a
          href={offer.ctaHref}
          onClick={() => onSelect && onSelect(offer)}
          className={`w-full text-center ${
            isRecommended ? 'btn-pill-primary' : 'btn-pill-secondary'
          } text-xs uppercase tracking-wider justify-center inline-flex items-center gap-2`}
        >
          <span>{offer.ctaText}</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </a>
      </div>
    </div>
  );
}
