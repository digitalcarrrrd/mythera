'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { trackEvent, AnalyticsEventType } from '../../lib/analytics';

interface FunnelShellProps {
  title: string;
  persona: 'YOU' | 'FILMMAKER' | 'STUDIOS';
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  canBack?: boolean;
  children: React.ReactNode;
}

export default function FunnelShell({
  title,
  persona,
  currentStep,
  totalSteps,
  onBack,
  canBack = true,
  children,
}: FunnelShellProps) {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  useEffect(() => {
    trackEvent('funnel_step_completed', {
      persona,
      stepNumber: currentStep,
      totalSteps,
    });
  }, [currentStep, totalSteps, persona]);

  return (
    <div className="min-h-screen bg-[#000000] text-[#f3f3eb] flex flex-col justify-between pt-28 pb-16 px-6 sm:px-8">
      <div className="max-w-3xl w-full mx-auto">
        {/* Top bar with back button & progress */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {canBack && onBack ? (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#a3a89e] hover:text-[#d8ff44] py-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <a
              href={`/${persona.toLowerCase()}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#a3a89e] hover:text-[#d8ff44] py-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Exit Funnel</span>
            </a>
          )}

          <div className="flex items-center gap-3 text-right">
            <span className="font-mono text-xs text-[#d8ff44] font-bold">
              STEP {currentStep} OF {totalSteps}
            </span>
            <span className="film-credit text-[10px] hidden sm:inline-block text-[#a3a89e]">
              MYTHRA {persona}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#0d100c] h-1.5 mb-10 rounded-full overflow-hidden">
          <div
            className="bg-[#d8ff44] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Main Content Area */}
        <div className="bg-[#080a08] border border-[#ffffff15] rounded-3xl p-8 sm:p-12 shadow-2xl relative">
          {children}
        </div>

        {/* Footer Guarantee Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#8e9587] border-t border-[#ffffff15] pt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#d8ff44]" />
            <span>Private & Encrypted Funnel · Zero Public Exposure</span>
          </div>
          <div>All answers auto-saved locally</div>
        </div>
      </div>
    </div>
  );
}
