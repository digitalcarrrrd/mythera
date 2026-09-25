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
    <section className="py-20 px-6 sm:px-12 bg-background border-y border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="eyebrow-text text-xs text-primary">VERIFIED PROOF & TRUTH CONTROLS</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] uppercase">
            ONE CREATOR. ONE ORIGINAL DRAMA. A GLOBAL SIGNAL.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-secondary)] max-w-3xl">
            In our Genesis experiment, we tested whether an AI-native production pipeline could carry a full 28-minute emotional drama. All metrics below are audited and strictly labeled by source.
          </p>
        </div>

        {/* Part 1: Production Economics */}
        <div className="mb-12">
          <div className="text-xs font-mono tracking-widest uppercase mb-4 text-primary font-bold">
            01 / PRODUCTION BENCHMARKS (GENESIS EXPERIMENT)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {productionMetrics.map((metric) => (
              <div
                key={metric.key}
                className="p-8 bg-[var(--surface-elevated)] border-2 border-[var(--border-subtle)] rounded-2xl relative group hover:border-primary transition-colors shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest text-[var(--text-secondary)] font-semibold">
                    {metric.label}
                  </span>
                  {metric.verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-primary-foreground font-black bg-primary px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Audited
                    </span>
                  ) : (
                    <span className="text-[10px] text-[var(--text-secondary)] bg-secondary px-2 py-0.5 rounded-full">
                      Unverified
                    </span>
                  )}
                </div>
                <div className="font-sans text-4xl sm:text-6xl font-black text-[var(--text-primary)] tracking-tight">
                  {metric.value}
                </div>
                {metric.methodologyNote && (
                  <p className="mt-3 text-xs text-[var(--text-muted)] leading-relaxed">
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
            <div className="text-xs font-mono tracking-widest uppercase text-primary font-bold">
              02 / DISTRIBUTION & REACH (SEPARATED BY ATTRIBUTION CATEGORY)
            </div>
            <div className="text-[11px] text-[var(--text-muted)] hidden sm:block">
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
                      ? 'bg-primary/5 border-primary/40'
                      : 'bg-[var(--surface-elevated)] border-[var(--border-subtle)] hover:border-primary/60 transition-colors'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {metric.label}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] block mb-3 font-mono font-semibold">
                      {metric.category === 'official_owned'
                        ? 'Official Owned Channel'
                        : metric.category === 'licensed_partner'
                        ? 'Licensed Channel Partner'
                        : 'Observed Ecosystem Reach'}
                    </span>
                    {metric.key === 'officialFacebookViews' ? (
                      <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
                        <div className="flex items-baseline gap-1">
                          <span className="font-sans text-3xl sm:text-4xl font-black text-[var(--text-primary)]">4M</span>
                          <span className="text-[11px] font-mono font-bold text-primary">FB</span>
                        </div>
                        <span className="text-lg text-[var(--text-muted)] font-light">+</span>
                        <div className="flex items-baseline gap-1">
                          <span className="font-sans text-3xl sm:text-4xl font-black text-[var(--text-primary)]">5M</span>
                          <span className="text-[11px] font-mono font-bold text-primary">IG</span>
                        </div>
                      </div>
                    ) : (
                      <div className="font-sans text-4xl sm:text-5xl font-black text-[var(--text-primary)]">
                        {metric.value}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {metric.methodologyNote}
                    </p>
                    {metric.evidenceUrl && (
                      <a
                        href={metric.evidenceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline mt-2 font-bold"
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
