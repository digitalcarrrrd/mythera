'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ScoringResult } from '../../lib/lead-scoring';
import { ArrowRight, CheckCircle2, Clock, RefreshCw, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';

interface RecommendationViewProps {
  scoring: ScoringResult;
  onCheckout?: () => void;
  onBookCall?: () => void;
  isProcessing?: boolean;
}

export default function RecommendationView({
  scoring,
  onCheckout,
  onBookCall,
  isProcessing = false,
}: RecommendationViewProps) {
  const offer = scoring.recommendedOffer;
  const isInstant = offer.checkoutType === 'instant';
  const isFree = offer.checkoutType === 'free';
  const isDeposit = offer.checkoutType === 'deposit';

  const handleAction = () => {
    trackEvent('checkout_started', {
      persona: offer.persona,
      offerCode: offer.code,
      value: offer.price,
    });

    if (isInstant || isDeposit) {
      if (onCheckout) onCheckout();
    } else {
      if (onBookCall) onBookCall();
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#d8ff44]" />
        <span className="eyebrow-text text-[#d8ff44]">TAILORED PRODUCTION ROADMAP</span>
      </div>
      <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#f3f3eb] mb-4 tracking-tight uppercase">
        YOUR RECOMMENDED PATH
      </h2>
      <p className="text-sm sm:text-base text-[#a3a89e] mb-8">
        Based on your goals, format requirements, and timeline, here is the exact production tier designed for your project:
      </p>

      {/* Featured Offer Tier Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#080a08] border-2 border-[#d8ff44] shadow-2xl shadow-[#d8ff44]/15 mb-8 relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#ffffff15]">
          <div>
            <span className="film-credit text-[#a3a89e] block mb-1">
              MYTHRA {offer.persona} · {offer.tagline}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#f3f3eb]">
              {offer.name}
            </h3>
          </div>

          <div className="text-left md:text-right">
            <div className="font-serif text-4xl sm:text-5xl font-bold text-[#f3f3eb]">
              {offer.priceDisplay}
            </div>
            <span className="text-xs font-mono font-semibold text-[#d8ff44] block mt-1">
              {offer.turnaround} estimated delivery
            </span>
          </div>
        </div>

        {/* Deliverables & Specifications */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-[#ffffff15] text-xs">
          <div>
            <span className="font-semibold text-[#a3a89e] block uppercase tracking-wider mb-2.5">
              Deliverables:
            </span>
            <ul className="space-y-2 text-[#f3f3eb]">
              {offer.deliverables.map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#d8ff44] shrink-0" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="font-semibold text-[#a3a89e] block uppercase tracking-wider mb-2.5">
              Production SLA:
            </span>
            <div className="space-y-1.5 text-[#a3a89e]">
              <div>Turnaround: <strong className="text-[#f3f3eb]">{offer.turnaround}</strong></div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-xs text-[#a3a89e] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d8ff44] shrink-0" />
            <span>Strict likeness verification & 100% satisfaction revision policy</span>
          </div>

          <button
            onClick={handleAction}
            disabled={isProcessing}
            className="btn-pill-primary w-full sm:w-auto inline-flex items-center justify-center gap-3"
          >
            <span>{isProcessing ? 'Connecting...' : scoring.recommendedAction}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Rationale Checklist */}
      {scoring.rationale.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#080a08] border border-[#ffffff15] mb-6">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#a3a89e] block mb-3 font-bold">
            EVALUATION FACTORS & SCORING RATIONALE
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#a3a89e]">
            {scoring.rationale.map((r, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#d8ff44] shrink-0" />
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Secondary path option */}
      <div className="text-center pt-4">
        <a
          href={`/${offer.persona.toLowerCase()}`}
          className="text-xs text-[#a3a89e] hover:text-[#d8ff44] uppercase tracking-wider underline transition-colors"
        >
          &larr; View all {offer.persona} tiers and comparison table
        </a>
      </div>
    </div>
  );
}
