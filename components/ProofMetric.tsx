'use client';

import React from 'react';
import { mythraProof, ProofMetricItem } from '../lib/proof';
import { ShieldCheck, Info, ExternalLink } from 'lucide-react';

interface ProofMetricProps {
  showAll?: boolean;
}

export default function ProofMetric({ showAll = false }: ProofMetricProps) {
  const productionMetrics: ProofMetricItem[] = [
    mythraProof.runtime,
    mythraProof.productionTime,
    mythraProof.experimentalCost,
  ];

  const reachMetrics: ProofMetricItem[] = [
    mythraProof.firstEpisodeViews,
    mythraProof.officialYouTubeViews,
    mythraProof.officialFacebookViews,
    mythraProof.ecosystemTranslatedViews,
  ];

  return (
    <section className="py-20 px-6 sm:px-12 bg-[#0c0e0d] border-y border-[#ffffff15]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-[#d6e8aa]" />
            <span className="eyebrow-text text-xs text-[#d6e8aa]">VERIFIED PROOF & TRUTH CONTROLS</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[#f3f3eb] uppercase">
            ONE CREATOR. ONE ORIGINAL DRAMA. A GLOBAL SIGNAL.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#9ea399] max-w-3xl">
            In our Genesis experiment, we tested whether an AI-native production pipeline could carry a full 28-minute emotional drama. All metrics below are audited and strictly labeled by source.
          </p>
        </div>

        {/* Part 1: Production Economics */}
        <div className="mb-12">
          <div className="text-xs font-mono tracking-widest uppercase mb-4 text-[#d6e8aa] font-bold">
            01 / PRODUCTION BENCHMARKS (GENESIS EXPERIMENT)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {productionMetrics.map((metric) => (
              <div
                key={metric.key}
                className="p-8 bg-[#141714] border-2 border-[#ffffff15] rounded-2xl relative group hover:border-[#d6e8aa] transition-colors shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-[#9ea399] font-semibold">
                    {metric.label}
                  </span>
                  {metric.verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#11160e] font-bold bg-[#d6e8aa] px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Audited
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#9ea399] bg-[#1a1e19] px-2 py-0.5 rounded-full">
                      Unverified
                    </span>
                  )}
                </div>
                <div className="font-sans text-4xl sm:text-6xl font-black text-[#f3f3eb] tracking-tight">
                  {metric.value}
                </div>
                {metric.methodologyNote && (
                  <p className="mt-3 text-xs text-[#727b66] leading-relaxed">
                    {metric.methodologyNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Part 2: Audience & Distribution Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-xs font-mono tracking-widest uppercase text-[#d6e8aa] font-bold">
              02 / DISTRIBUTION & REACH (SEPARATED BY ATTRIBUTION CATEGORY)
            </div>
            <div className="text-[11px] text-[#727b66] hidden sm:block">
              *Never combined into misleading aggregated totals
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reachMetrics.map((metric) => {
              const isEcosystem = metric.category === 'observed_ecosystem';
              return (
                <div
                  key={metric.key}
                  className={`p-6 border-2 rounded-2xl relative flex flex-col justify-between shadow-lg ${
                    isEcosystem
                      ? 'bg-[#181c17] border-[#d6e8aa]/30'
                      : 'bg-[#141714] border-[#ffffff15]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#f3f3eb]">
                        {metric.label}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[#9ea399] block mb-3 font-mono">
                      {metric.category === 'official_owned'
                        ? 'Official Owned Channel'
                        : metric.category === 'licensed_partner'
                        ? 'Licensed Channel Partner'
                        : 'Observed Ecosystem Reach'}
                    </span>
                    <div className="font-sans text-4xl sm:text-5xl font-black text-[#f3f3eb]">
                      {metric.value}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#ffffff15]">
                    <p className="text-[11px] text-[#9ea399] leading-relaxed">
                      {metric.methodologyNote}
                    </p>
                    {metric.evidenceUrl && (
                      <a
                        href={metric.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-[#d6e8aa] hover:underline mt-2 font-bold"
                      >
                        <span>Evidence reference</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
