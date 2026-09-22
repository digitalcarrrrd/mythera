import React from 'react';
import Link from 'next/link';
import CinematicHero from '../../components/CinematicHero';
import OfferCard from '../../components/OfferCard';
import FilmGallery from '../../components/FilmGallery';
import TrustPanel from '../../components/TrustPanel';
import FAQAccordion, { FAQItem } from '../../components/FAQAccordion';
import StickyMobileCTA from '../../components/StickyMobileCTA';
import { mythraOffers } from '../../lib/offers';
import { Heart, Sparkles, Trophy, Users, Gift, Crown, ArrowRight, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function MythraYouPage() {
  const useCases = [
    {
      icon: Sparkles,
      title: 'Hero of a Fantasy World',
      desc: 'Step into an epic world of mythical lore, star-systems, or time-bending quests with customized costume and set design.',
    },
    {
      icon: Heart,
      title: 'Turn a Love Story Into Cinema',
      desc: 'Celebrate an anniversary, proposal, or milestone with a high-romance trailer capturing how you met and what you built.',
    },
    {
      icon: Gift,
      title: 'Give Someone a Life Trailer',
      desc: 'The ultimate gift for birthdays or retirements—transforming personal triumphs and memories into a cinematic blockbuster.',
    },
    {
      icon: Trophy,
      title: 'A Founder’s Journey Film',
      desc: 'Tell the dramatic story behind your company’s breakthrough, late nights, sacrifices, and ultimate industry vision.',
    },
    {
      icon: Users,
      title: 'Family Legacy Story',
      desc: 'Immortalize generations of heritage, grandparents’ stories, and family memories in an enduring cinematic heirloom.',
    },
    {
      icon: Crown,
      title: 'Wedding Premiere Film',
      desc: 'Reimagine your wedding or elopement as a golden-age Italian or modern Hollywood feature film for the reception screen.',
    },
  ];

  const steps = [
    { num: '01', title: 'Choose the Kind of Story', desc: 'Select your genre: Fantasy, Romance, Sci-fi, Founder, Wedding, or Historical Drama.' },
    { num: '02', title: 'Tell Us Who the Star Is', desc: 'Confirm yourself or a consenting loved one with explicit likeness authorization.' },
    { num: '03', title: 'Approve Creative Direction', desc: 'Review story premise beats, tone references, and character costume styling.' },
    { num: '04', title: 'Securely Provide Photos & Voice', desc: 'Upload 5–10 clear photos and an optional clean audio sample to private storage.' },
    { num: '05', title: 'Review the First Cut', desc: 'Watch your private preview cut and request consolidated adjustments.' },
    { num: '06', title: 'Receive Your Master Film', desc: 'Download your full HD/4K master file, vertical social cut, and key art poster stills.' },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'How accurate will my likeness look in the film?',
      answer: 'We balance recognizable facial identity with the cinematic lighting, atmosphere, and artistic stylization of your chosen genre. We do not produce synthetic counterfeit clones; we create elevated cinematic representations designed to look like you are the star of a real Hollywood movie.',
    },
    {
      question: 'How does voice cloning and authorization work?',
      answer: 'Voice cloning is optional and available on Trailer, Story, and Legacy tiers. You must provide explicit recorded or signed authorization to clone any voice. If you prefer not to clone a voice, our directors use cinema-grade voiceover actors or dramatic soundtrack scores with titles.',
    },
    {
      question: 'Can I purchase a film as a gift for someone else?',
      answer: 'Yes. You can purchase a gift voucher or reserve the production queue. However, before production begins, the depicted person (or legal guardian for minors) must complete our secure likeness authorization form.',
    },
    {
      question: 'What are the delivery turnarounds and revisions?',
      answer: 'MYTHRA Moment takes 3–5 business days (1 revision round). MYTHRA Trailer takes 7–10 business days (2 revision rounds). Bespoke Stories and Legacy films take 2–6 weeks with dedicated creative director milestones.',
    },
    {
      question: 'Can I use this for commercial advertising or my company?',
      answer: 'Personal tier pricing covers personal, social, and family non-commercial use. If you intend to run paid advertising or commercial brand broadcasts, a commercial usage license is required and scoped transparently.',
    },
    {
      question: 'What happens to my uploaded photos after delivery?',
      answer: 'Your media is stored in encrypted private buckets. Following final film approval, your raw source photos and voice samples are automatically purged according to your selected retention setting (30 days or immediate upon request). We never train public AI models on your files.',
    },
  ];

  return (
    <div>
      {/* Hero with background artwork */}
      <CinematicHero
        backgroundImage="/mythra-world.png"
        eyebrow="MYTHRA YOU — PERSONALIZED CINEMA"
        badge="STARRING YOU"
        headline={
          <>
            YOU'VE WATCHED MOVIES YOUR WHOLE LIFE.<br />
            <span className="text-[#d8ff44]">NOW ENTER ONE.</span>
          </>
        }
        lead="Your face. Your voice. Your story. Made cinematic."
        support="MYTHRA turns your authorized likeness and memories into a cinematic scene, movie trailer, or bespoke original short film."
        primaryCtaText="CREATE MY FILM"
        primaryCtaHref="/you/start"
        secondaryCtaText="SEE EXAMPLES"
        secondaryCtaHref="#gallery"
      />

      {/* Emotional Use Cases */}
      <section className="py-24 px-6 sm:px-12 bg-[#000000]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#d8ff44]" />
              <span className="eyebrow-text text-xs text-[#d8ff44]">
                EMOTIONAL CINEMA & MILESTONES
              </span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              STORIES BUILT AROUND YOU.
            </h2>
            <p className="mt-4 text-base text-[#9ea399]">
              From high-fantasy odysseys to heartfelt legacy documentaries—we craft personalized films with emotional weight and narrative craft.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <div
                  key={i}
                  className="p-8 bg-[#080a08] border-2 border-[#ffffff15] hover:border-[#d8ff44] rounded-2xl transition-all shadow-lg group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0d100c] border border-[#d8ff44]/30 flex items-center justify-center mb-6 text-[#d8ff44] group-hover:bg-[#d8ff44] group-hover:text-[#000000] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans text-2xl font-black text-[#f3f3eb] mb-3">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-[#9ea399] leading-relaxed">
                    {uc.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filterable Example Gallery */}
      <div id="gallery">
        <FilmGallery />
      </div>

      {/* How It Works (6 Steps) */}
      <section className="py-24 px-6 sm:px-12 bg-[#000000] border-t border-[#ffffff15]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#d8ff44]" />
              <span className="eyebrow-text text-xs text-[#d8ff44]">THE PRODUCTION PROCESS</span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              HOW YOUR FILM IS MADE.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div
                key={s.num}
                className="p-8 bg-[#080a08] border-2 border-[#ffffff15] rounded-2xl relative shadow-lg hover:border-[#d8ff44] transition-colors"
              >
                <span className="font-mono text-xs text-[#d8ff44] font-bold block mb-4 px-2.5 py-1 bg-[#0d100c] rounded-full border border-[#d8ff44]/30 w-fit">
                  STEP {s.num}
                </span>
                <h3 className="font-sans text-2xl font-black text-[#f3f3eb] mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-[#9ea399] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Ladder */}
      <section id="pricing" className="py-24 px-6 sm:px-12 bg-[#000000] border-t border-[#ffffff15]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow-text block mb-3 text-[#d8ff44]">PUBLIC PRICING LADDER</span>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              CHOOSE YOUR CINEMATIC FORMAT.
            </h2>
            <p className="mt-4 text-base text-[#9ea399]">
              All packages include verified likeness integration, custom sound design, and consolidated revision rounds.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-16">
            {mythraOffers.you.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Add-ons Row */}
          <div className="p-8 bg-[#080a08] border-2 border-[#ffffff15] rounded-2xl shadow-xl">
            <h3 className="font-sans text-2xl font-black text-[#f3f3eb] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d8ff44]" />
              <span>Available Production Add-Ons</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
              {mythraOffers.youAddOns.map((addon) => (
                <div key={addon.id} className="p-5 bg-[#0d100c] rounded-xl border border-[#ffffff10]">
                  <strong className="block text-[#f3f3eb] text-sm mb-1">{addon.name}</strong>
                  <span className="text-[#d8ff44] font-mono font-bold block mb-2">{addon.priceDisplay}</span>
                  <p className="text-[#9ea399]">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Likeness Block */}
      <TrustPanel />

      {/* FAQ Section */}
      <FAQAccordion items={faqs} />

      {/* Final Sticky Mobile CTA */}
      <StickyMobileCTA
        label="MYTHRA YOU · Movie Trailer"
        price="$299"
        href="/you/start?tier=you-trailer"
      />
    </div>
  );
}
