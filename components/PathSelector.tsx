'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, UserCheck, Film, Building2, HelpCircle, X, Sparkles, CheckCircle2, Star } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export default function PathSelector() {
  const [modalOpen, setModalOpen] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ path: string; name: string; desc: string; href: string } | null>(null);

  const handleDoorClick = (doorName: string, path: string) => {
    trackEvent('path_selected', {
      persona: doorName === 'YOU' ? 'YOU' : doorName === 'FILMMAKER' ? 'FILMMAKER' : 'STUDIOS',
      source: 'homepage_doors',
    });
  };

  const handleQuizAnswer = (questionKey: string, optionValue: string) => {
    const updated = { ...quizAnswers, [questionKey]: optionValue };
    setQuizAnswers(updated);

    if (quizStep < 2) {
      setQuizStep(quizStep + 1);
    } else {
      // Router outcome
      let result = {
        path: 'MYTHRA YOU',
        name: 'Personalized Film starring you or someone you know',
        desc: 'Best for creating a personalized movie trailer, memorable gift, or starring role using verified likeness.',
        href: '/you',
      };

      if (updated.objective === 'learn_system' || updated.role === 'creator') {
        result = {
          path: 'MYTHRA FILMMAKER',
          name: 'The One-Person Studio System & Cohort',
          desc: 'Best for learning the 12-step Drama Method to write, direct, and produce your own AI films.',
          href: '/filmmaker',
        };
      } else if (updated.objective === 'commission_studio' || updated.role === 'brand_or_ip') {
        result = {
          path: 'MYTHRA STUDIOS',
          name: 'B2B Production, Branded Drama & Co-Production',
          desc: 'Best for companies, authors, and media networks looking for turnkey films, series, or IP adaptation.',
          href: '/studios',
        };
      }
      setQuizResult(result);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizResult(null);
  };

  return (
    <section id="paths" className="py-24 px-6 sm:px-12 bg-[#0c0e0d] border-t border-[#ffffff15]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-5 h-[1.5px] bg-[#d6e8aa]" />
              <span className="eyebrow-text text-xs text-[#d6e8aa]">THREE COMMERCIAL DOORS</span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-[-0.03em] text-[#f3f3eb] uppercase">
              WHAT DO YOU WANT TO CREATE?
            </h2>
          </div>
          <button
            onClick={() => {
              resetQuiz();
              setModalOpen(true);
            }}
            className="btn-pill-secondary text-xs !py-3 !px-5 self-start md:self-auto"
          >
            <HelpCircle className="w-4 h-4 text-[#d6e8aa]" />
            <span>Help Me Choose (30s)</span>
          </button>
        </div>

        {/* The 3 Doors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Door 1: MYTHRA YOU */}
          <div className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[#141714] border-2 border-[#ffffff15] hover:border-[#d6e8aa] rounded-2xl transition-all duration-300 hover:translate-y-[-4px] shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d6e8aa]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#d6e8aa]/20 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-[#d6e8aa] font-bold px-2.5 py-1 bg-[#1a1e19] rounded-full border border-[#d6e8aa]/30">
                  DOOR 01
                </span>
                <UserCheck className="w-6 h-6 text-[#9ea399] group-hover:text-[#d6e8aa] transition-colors" />
              </div>
              <span className="text-[11px] font-mono tracking-widest block mb-2 text-[#9ea399] uppercase">
                I WANT TO BE IN A FILM
              </span>
              <h3 className="font-sans text-3xl font-black text-[#f3f3eb] mb-3">
                MYTHRA YOU
              </h3>
              <p className="text-sm text-[#9ea399] leading-relaxed">
                Your face. Your voice. Your story. Made cinematic. Transform personal milestones, weddings, and founder stories into Hollywood-level trailers.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-[#ffffff15]">
              <Link
                href="/you"
                onClick={() => handleDoorClick('YOU', '/you')}
                className="btn-pill-primary w-full text-center text-sm"
              >
                <span>Enter MYTHRA YOU</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Door 2: MYTHRA FILMMAKER */}
          <div className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[#141714] border-2 border-[#d6e8aa] rounded-2xl transition-all duration-300 hover:translate-y-[-4px] shadow-2xl overflow-hidden ring-1 ring-[#d6e8aa]">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d6e8aa] text-[#11160e] text-[10px] uppercase tracking-widest font-extrabold px-4 py-1 rounded-full shadow-md">
              FEATURED COHORT
            </div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#d6e8aa]/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-[#d6e8aa] font-bold px-2.5 py-1 bg-[#1a1e19] rounded-full border border-[#d6e8aa]/30">
                  DOOR 02
                </span>
                <Film className="w-6 h-6 text-[#d6e8aa]" />
              </div>
              <span className="text-[11px] font-mono tracking-widest block mb-2 text-[#9ea399] uppercase">
                I WANT TO MAKE FILMS
              </span>
              <h3 className="font-sans text-3xl font-black text-[#f3f3eb] mb-3">
                MYTHRA FILMMAKER
              </h3>
              <p className="text-sm text-[#9ea399] leading-relaxed">
                Learn the production system behind an AI-native one-person studio. Master the Drama Method, character consistency, and publish your own film.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-[#ffffff15]">
              <Link
                href="/filmmaker"
                onClick={() => handleDoorClick('FILMMAKER', '/filmmaker')}
                className="btn-pill-primary w-full text-center text-sm !bg-[#d6e8aa]"
              >
                <span>Explore Filmmaker</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Door 3: MYTHRA STUDIOS */}
          <div className="group relative flex flex-col justify-between p-8 sm:p-10 bg-[#141714] border-2 border-[#ffffff15] hover:border-[#ffffff50] rounded-2xl transition-all duration-300 hover:translate-y-[-4px] shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-all" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-[#d6e8aa] font-bold px-2.5 py-1 bg-[#1a1e19] rounded-full border border-[#d6e8aa]/30">
                  DOOR 03
                </span>
                <Building2 className="w-6 h-6 text-[#9ea399] group-hover:text-white transition-colors" />
              </div>
              <span className="text-[11px] font-mono tracking-widest block mb-2 text-[#9ea399] uppercase">
                I WANT MYTHRA TO MAKE ONE
              </span>
              <h3 className="font-sans text-3xl font-black text-[#f3f3eb] mb-3">
                MYTHRA STUDIOS
              </h3>
              <p className="text-sm text-[#9ea399] leading-relaxed">
                Original films, branded drama, and scalable story worlds built for brands, media networks, and IP owners. Studio engagements begin from $7,500.
              </p>
            </div>

            <div className="mt-10 pt-6 border-t border-[#ffffff15]">
              <Link
                href="/studios"
                onClick={() => handleDoorClick('STUDIOS', '/studios')}
                className="btn-pill-white w-full text-center text-sm"
              >
                <span>Start Studio Brief</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3-Question "Help Me Choose" Modal with Pill Buttons */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#141714] border-2 border-[#d6e8aa]/40 rounded-2xl p-6 sm:p-8 text-[#f3f3eb] shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 text-[#9ea399] hover:text-white p-1 rounded-full bg-[#1a1e19]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!quizResult ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#d6e8aa]" />
                  <span className="text-[11px] uppercase font-mono tracking-widest text-[#d6e8aa] font-bold">
                    QUESTION {quizStep + 1} OF 3
                  </span>
                </div>

                {quizStep === 0 && (
                  <div>
                    <h3 className="font-sans text-2xl font-black mb-6">
                      What is your primary goal right now?
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'star_in_film', text: 'I want to star in a cinematic film or give one as a gift' },
                        { key: 'learn_system', text: 'I want to learn how to produce AI films myself' },
                        { key: 'commission_studio', text: 'I want a studio to produce a film or series for my company/IP' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleQuizAnswer('objective', opt.key)}
                          className="w-full text-left p-4 rounded-xl bg-[#1a1e19] hover:bg-[#222721] border-2 border-[#ffffff15] hover:border-[#d6e8aa] text-sm font-semibold text-[#f3f3eb] transition-all flex items-center justify-between"
                        >
                          <span>{opt.text}</span>
                          <ArrowRight className="w-4 h-4 text-[#d6e8aa]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 1 && (
                  <div>
                    <h3 className="font-sans text-2xl font-black mb-6">
                      Which best describes who you are?
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'individual', text: 'Individual, founder, or gift-giver' },
                        { key: 'creator', text: 'Creator, video editor, or aspiring director' },
                        { key: 'brand_or_ip', text: 'Brand executive, author, agency, or media owner' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleQuizAnswer('role', opt.key)}
                          className="w-full text-left p-4 rounded-xl bg-[#1a1e19] hover:bg-[#222721] border-2 border-[#ffffff15] hover:border-[#d6e8aa] text-sm font-semibold text-[#f3f3eb] transition-all flex items-center justify-between"
                        >
                          <span>{opt.text}</span>
                          <ArrowRight className="w-4 h-4 text-[#d6e8aa]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {quizStep === 2 && (
                  <div>
                    <h3 className="font-sans text-2xl font-black mb-6">
                      What kind of investment are you considering?
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'personal_budget', text: 'Personal budget ($79 – $1,500)' },
                        { key: 'education_budget', text: 'Education / cohort training ($149 – $997)' },
                        { key: 'commercial_budget', text: 'Commercial production budget ($7,500+)' },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          onClick={() => handleQuizAnswer('budget', opt.key)}
                          className="w-full text-left p-4 rounded-xl bg-[#1a1e19] hover:bg-[#222721] border-2 border-[#ffffff15] hover:border-[#d6e8aa] text-sm font-semibold text-[#f3f3eb] transition-all flex items-center justify-between"
                        >
                          <span>{opt.text}</span>
                          <ArrowRight className="w-4 h-4 text-[#d6e8aa]" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-[#d6e8aa] text-xs uppercase font-bold mb-2">
                  <CheckCircle2 className="w-4 h-4" /> Recommended Door
                </div>
                <h3 className="font-sans text-3xl font-black text-[#f3f3eb] mb-2">
                  {quizResult.path}
                </h3>
                <p className="text-sm text-[#f3f3eb] font-semibold mb-3">
                  {quizResult.name}
                </p>
                <p className="text-xs text-[#9ea399] leading-relaxed mb-6">
                  {quizResult.desc}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={quizResult.href}
                    onClick={() => setModalOpen(false)}
                    className="btn-pill-primary flex-1 text-center justify-center text-xs"
                  >
                    Enter {quizResult.path} &rarr;
                  </Link>
                  <button
                    onClick={resetQuiz}
                    className="px-4 py-2 rounded-full border border-[#ffffff20] text-xs text-[#9ea399] hover:text-white"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
