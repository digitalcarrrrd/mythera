import React from 'react';
import Link from 'next/link';
import CinematicHero from '../../components/CinematicHero';
import OfferCard from '../../components/OfferCard';
import FAQAccordion, { FAQItem } from '../../components/FAQAccordion';
import StickyMobileCTA from '../../components/StickyMobileCTA';
import { mythraOffers } from '../../lib/offers';
import { Building2, BookOpen, Globe2, Film, TrendingUp, ArrowRight, ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MythraStudiosPage() {
  const intentCards = [
    {
      id: 'brand',
      icon: Building2,
      title: 'I Have a Brand or Product',
      desc: 'Turn a product launch or company ethos into a cinematic story audiences seek out and share.',
      href: '/studios/start?intent=brand',
    },
    {
      id: 'ip',
      icon: BookOpen,
      title: 'I Have a Story, Book, or IP',
      desc: 'Adapt written novels, game universes, or comic IP into high-fidelity AI-native cinema proof-of-concepts.',
      href: '/studios/start?intent=ip',
    },
    {
      id: 'media',
      icon: Globe2,
      title: 'I Have an Audience or Media Network',
      desc: 'Syndicate localized original dramas across your YouTube, social, or streaming network with revenue sharing.',
      href: '/studios/start?intent=media',
    },
    {
      id: 'production',
      icon: Film,
      title: 'I Need a Complete Film or Series',
      desc: 'Commission a turnkey narrative short film, social drama pilot, or multi-episode season master.',
      href: '/studios/start?intent=production',
    },
    {
      id: 'finance',
      icon: TrendingUp,
      title: 'I Want to Finance or Co-Produce Stories',
      desc: 'Partner on studio slate financing, co-productions, and international distribution rollouts.',
      href: '/studios/start?intent=finance',
    },
  ];

  const capabilities = [
    { title: 'Story Strategy & Treatment', desc: 'Audience psychology analysis, narrative premise engineering, and tone bibles.' },
    { title: 'Proprietary Drama Method', desc: 'Structural tension frameworks proven across millions of global viewers.' },
    { title: 'Character & World Asset Systems', desc: 'Reusable digital asset libraries maintaining flawless multi-episode consistency.' },
    { title: 'High-Velocity AI Production', desc: 'Cinema-grade visual generation, custom lighting control, and multi-angle scene locks.' },
    { title: 'Long-Form Edit, Foley & ScoreMix', desc: 'Full orchestral soundscapes, emotional pacing, dialogue synthesis, and 4K masters.' },
    { title: 'Global Localization & Dubbing', desc: 'Multi-language translation and lip-synced voice adaptation for worldwide release.' },
  ];

  const faqs: FAQItem[] = [
    {
      question: 'What is the starting investment for a studio production?',
      answer: 'Studio production engagements begin at $7,500 for a Social Drama Pilot. Original IP adaptations, episodic series systems, and long-form co-productions are scoped individually from $15,000 to $50,000+ depending on runtime, deliverables, and exclusivity rights.',
    },
    {
      question: 'What is the Story Concept Sprint ($2,500)?',
      answer: 'The Concept Sprint is an intensive strategic workshop where we develop the narrative opportunity, core premise, format bible, and visual treatment deck. If you contract a full production of $15,000+ within 30 days, 100% of the $2,500 sprint fee is credited toward your production invoice.',
    },
    {
      question: 'Who owns the IP and commercial rights of commissioned films?',
      answer: 'For branded productions and custom client commissions, you retain 100% of the commercial and distribution rights for agreed territories and channels. For original MYTHRA co-productions, distribution and rights frameworks are negotiated transparently in the term sheet.',
    },
    {
      question: 'How fast can a studio project be delivered?',
      answer: 'A Social Drama Pilot takes approximately 2–3 weeks from brief lock to final master. Branded short films (3–5 minutes) take 3–5 weeks. Episodic series systems take 6–8 weeks with recurring milestone delivery.',
    },
  ];

  return (
    <div>
      {/* Hero with background artwork */}
      <CinematicHero
        backgroundImage="/mythra-world.png"
        eyebrow="MYTHRA STUDIOS · B2B PRODUCTION & IP"
        badge="COMMERCIAL PRODUCTIONS"
        headline={
          <>
            DON'T MAKE ANOTHER AD.<br />
            <span className="text-[#d6e8aa]">BUILD A STORY PEOPLE CHOOSE TO WATCH.</span>
          </>
        }
        lead="Original AI-native films, branded drama, and scalable story worlds."
        support="Built for forward-thinking brands, media networks, and IP owners."
        primaryCtaText="START A STUDIO BRIEF"
        primaryCtaHref="/studios/start"
        secondaryCtaText="VIEW GENESIS CASE STUDY"
        secondaryCtaHref="/genesis"
      />

      {/* Public Pricing Anchor Rule Line */}
      <div className="bg-[#141714] border-y border-[#ffffff15] py-4 px-6 text-center text-xs sm:text-sm font-sans text-[#f3f3eb] font-semibold tracking-wide">
        Studio engagements begin at <strong className="text-[#d6e8aa] font-black">$7,500</strong>. Original IP and long-form productions are scoped individually.
      </div>

      {/* 5 Clear Intent Cards */}
      <section className="py-24 px-6 sm:px-12 bg-[#0c0e0d]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#d6e8aa]" />
              <span className="eyebrow-text text-xs text-[#d6e8aa]">
                HOW CAN WE WORK TOGETHER?
              </span>
            </div>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              FIVE WAYS TO ENGAGE THE STUDIO.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {intentCards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="p-8 bg-[#141714] border-2 border-[#ffffff15] hover:border-[#d6e8aa] rounded-2xl transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1"
                >
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#1a1e19] border border-[#d6e8aa]/30 flex items-center justify-center mb-6 text-[#d6e8aa] group-hover:bg-[#d6e8aa] group-hover:text-[#11160e] transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-sans text-xl font-black text-[#f3f3eb] mb-2 group-hover:text-[#d6e8aa] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#9ea399] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-[#ffffff15] flex items-center justify-between text-xs text-[#d6e8aa] font-bold uppercase tracking-wider">
                    <span>Explore &rarr;</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Studio Capabilities */}
      <section className="py-24 px-6 sm:px-12 bg-[#0c0e0d] border-t border-[#ffffff15]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <span className="eyebrow-text block mb-3 text-[#d6e8aa]">CORE CAPABILITIES</span>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              END-TO-END NARRATIVE ARCHITECTURE.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((c, i) => (
              <div key={i} className="p-8 bg-[#141714] border-2 border-[#ffffff15] rounded-2xl shadow-lg hover:border-[#d6e8aa] transition-colors">
                <span className="font-mono text-xs text-[#d6e8aa] font-bold block mb-3 px-2 py-0.5 bg-[#1a1e19] rounded-full border border-[#d6e8aa]/30 w-fit">
                  0{i + 1}
                </span>
                <h3 className="font-sans text-2xl font-black text-[#f3f3eb] mb-2">
                  {c.title}
                </h3>
                <p className="text-xs text-[#9ea399] leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagement Models (Tier Pricing & Starting Points) */}
      <section id="models" className="py-24 px-6 sm:px-12 bg-[#0c0e0d] border-t border-[#ffffff15]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="eyebrow-text block mb-3 text-[#d6e8aa]">ENGAGEMENT MODELS</span>
            <h2 className="font-sans text-4xl sm:text-6xl font-black tracking-tight text-[#f3f3eb] uppercase">
              PRODUCTION STARTING POINTS.
            </h2>
            <p className="mt-4 text-base text-[#9ea399]">
              Every engagement is custom-directed. We provide clear investment floors and scope deliverables upfront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch mb-12">
            {mythraOffers.studios.slice(0, 3).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>

          {/* Long Form & Co-production Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mythraOffers.studios.slice(3, 5).map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQAccordion
        title="STUDIO PRODUCTION FAQ"
        subtitle="Commercial terms, IP ownership, rights clearance, and production schedules."
        items={faqs}
      />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA
        label="MYTHRA STUDIOS · B2B Brief"
        price="From $7,500"
        href="/studios/start"
      />
    </div>
  );
}
