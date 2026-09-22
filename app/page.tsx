import React from 'react';
import Link from 'next/link';
import CinematicHero from '../components/CinematicHero';
import ProofMetric from '../components/ProofMetric';
import PathSelector from '../components/PathSelector';
import { ArrowRight, ArrowUpRight, Film, Sparkles, Repeat, Globe, CheckCircle2, ShieldCheck, Play } from 'lucide-react';

export default function HomePage() {
  const modelSteps = [
    { num: '01', title: 'Story Engine', desc: 'Emotion-first screenplay rooted in human stakes, moral dilemmas, and narrative tension.' },
    { num: '02', title: 'AI Production', desc: 'High-velocity AI-native scene orchestration with consistent character seeds.' },
    { num: '03', title: 'Audience Testing', desc: 'Real-time hook validation and emotional engagement retention mapping.' },
    { num: '04', title: 'Localization', desc: 'Culturally resonant voice synthesis and multi-language dubs for global audiences.' },
    { num: '05', title: 'Distribution', desc: 'Global digital network syndication across 16:9 cinema and 9:16 vertical feeds.' },
    { num: '06', title: 'Next Story', desc: 'Audience feedback loops fuel subsequent narrative universe expansions.' },
  ];

  return (
    <div>
      {/* SCREEN 1: Master Hero with GitHub Repo Image */}
      <CinematicHero
        backgroundImage="/mythra-world.png"
        eyebrow="INDEPENDENT MINDS. IMPOSSIBLE WORLDS."
        headline={
          <>
            A ONE-PERSON<br />
            HOLLYWOOD<br />
            <span className="text-[#d8ff44]">STUDIO.</span>
          </>
        }
        lead="Original drama built for the AI era."
        support="One creator. AI-native production. Studio-scale ambition."
        primaryCtaText="Collaborate with MYTHRA"
        primaryCtaHref="#paths"
        secondaryCtaText="Explore the experiment"
        secondaryCtaHref="/genesis"
      />

      {/* SCREEN 2: Verified Proof Teaser */}
      <ProofMetric />

      {/* Case Study Deep Link Banner */}
      <div className="bg-[#080a08] border-b border-[#ffffff15] py-8 px-6 sm:px-12 text-center">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="eyebrow-text block mb-1 text-[#d8ff44] font-bold">AUDITED FIRST-FILM BREAKDOWN</span>
            <p className="text-base font-bold text-[#f3f3eb]">
              Read how a 28-minute emotional drama was produced in under 72 hours with sub-$1,000 compute.
            </p>
          </div>
          <a
            href="/genesis"
            className="btn-pill-primary text-xs !py-3 !px-6 shrink-0"
          >
            <span>Explore Genesis Case Study</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </a>
        </div>
      </div>

      {/* SCREEN 3: Three Commercial Doors with Screenshot-Style Pill Buttons */}
      <PathSelector />

      {/* SCREEN 4: The Model — Story Engine */}
      <section className="py-24 px-6 sm:px-12 bg-[#000000] border-t border-[#ffffff15]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#d8ff44]" />
              <span className="eyebrow-text text-xs text-[#d8ff44]">THE REUSABLE STORY ENGINE</span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#ffffff] uppercase">
              THE FILM IS ONLY THE BEGINNING.
            </h2>
            <p className="mt-6 text-base sm:text-lg text-[#a3a89e] leading-relaxed">
              MYTHRA is not using AI to imitate an old studio more cheaply. We are redesigning how stories are created, tested, and carried across languages and audiences.
            </p>
          </div>

          {/* Model Flow Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {modelSteps.map((step) => (
              <div
                key={step.num}
                className="p-8 bg-[#0a0d08] border-2 border-[#ffffff15] hover:border-[#d8ff44] rounded-2xl transition-all shadow-lg relative group"
              >
                <span className="font-mono text-xs text-[#d8ff44] font-bold block mb-4 px-2.5 py-1 bg-[#141a10] rounded-full border border-[#d8ff44]/40 w-fit">
                  STAGE {step.num}
                </span>
                <h3 className="font-sans text-2xl font-black text-[#ffffff] mb-2 group-hover:text-[#d8ff44] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-[#a3a89e] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 sm:p-10 bg-[#0a0d08] border-2 border-[#d8ff44]/40 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div>
              <h4 className="font-sans text-2xl font-black text-[#ffffff] mb-1">
                Explore The Complete 12-Step Drama Method
              </h4>
              <p className="text-xs text-[#a3a89e]">
                Discover how character consistency, emotional stakes, and voice synthesis come together.
              </p>
            </div>
            <a
              href="/method"
              className="btn-pill-primary text-xs !py-3 !px-6 shrink-0"
            >
              <span>Explore The Method</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </a>
          </div>
        </div>
      </section>

      {/* SCREEN 5: Final CTA */}
      <section className="py-24 px-6 sm:px-12 bg-[#000000] border-t border-[#ffffff15] text-center">
        <div className="max-w-4xl mx-auto">
          <span className="eyebrow-text block mb-4 text-[#d8ff44]">THE NEXT CHAPTER</span>
          <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#ffffff] uppercase leading-tight">
            YOUR PLACE IN THE STORY STARTS HERE.
          </h2>
          <p className="mt-6 text-base text-[#a3a89e] max-w-xl mx-auto mb-12">
            Whether you want to star in personalized cinema, build your own one-person studio, or commission an original branded drama.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <a
              href="/you/start?tier=you-trailer"
              className="p-8 bg-[#0a0d08] border-2 border-[#ffffff15] hover:border-[#d8ff44] rounded-2xl transition-all group text-left shadow-xl hover:-translate-y-1 no-underline"
            >
              <span className="text-[10px] font-mono uppercase text-[#d8ff44] block mb-1 font-bold">FOR YOU</span>
              <strong className="font-sans text-xl font-black text-[#ffffff] block group-hover:text-[#d8ff44]">
                Create My Film &rarr;
              </strong>
              <span className="text-xs text-[#a3a89e] block mt-2">Trailer from $299</span>
            </a>

            <a
              href="/filmmaker/start?tier=film-cohort"
              className="p-8 bg-[#0a0d08] border-2 border-[#d8ff44] rounded-2xl transition-all group text-left shadow-2xl ring-1 ring-[#d8ff44] hover:-translate-y-1 no-underline"
            >
              <span className="text-[10px] font-mono uppercase text-[#d8ff44] block mb-1 font-bold">FOR CREATORS</span>
              <strong className="font-sans text-xl font-black text-[#ffffff] block group-hover:text-[#d8ff44]">
                Join Filmmaker &rarr;
              </strong>
              <span className="text-xs text-[#a3a89e] block mt-2">Cohort from $749</span>
            </a>

            <a
              href="/studios/start"
              className="p-8 bg-[#0a0d08] border-2 border-[#ffffff15] hover:border-white rounded-2xl transition-all group text-left shadow-xl hover:-translate-y-1 no-underline"
            >
              <span className="text-[10px] font-mono uppercase text-[#d8ff44] block mb-1 font-bold">FOR BRANDS & IP</span>
              <strong className="font-sans text-xl font-black text-[#ffffff] block group-hover:text-white">
                Start Studio Brief &rarr;
              </strong>
              <span className="text-xs text-[#a3a89e] block mt-2">Pilots from $7,500</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
