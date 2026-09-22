// Lead scoring, qualification, tagging, and recommendation engine for MYTHRA
import { mythraOffers, OfferTier } from './offers';

export type PersonaType = 'YOU' | 'FILMMAKER' | 'STUDIOS';
export type QualificationCategory = 'nurture' | 'qualified' | 'priority';

export interface LeadContact {
  firstName: string;
  lastName: string;
  email: string;
  whatsapp?: string;
  country?: string;
  organization?: string;
  role?: string;
  website?: string;
  message?: string;
  consentMarketing?: boolean;
}

export type FunnelAnswers = Record<string, string | string[] | boolean | undefined>;

export interface ScoringResult {
  score: number;
  category: QualificationCategory;
  tags: string[];
  recommendedOffer: OfferTier;
  recommendedAction: string;
  rationale: string[];
  pipelineStage: string;
}

export function evaluateLead(
  persona: PersonaType,
  answers: FunnelAnswers,
  contact: LeadContact
): ScoringResult {
  let score = 0;
  const tags: string[] = [`MYTHRA_${persona}`];
  const rationale: string[] = [];

  // ==========================================
  // 1. PERSONA SPECIFIC SCORING & TAGS
  // ==========================================

  if (persona === 'STUDIOS') {
    const branch = String(answers.branch || answers.intent || 'brand');
    const budget = String(answers.budget || answers.budgetRange || '');
    const timeline = String(answers.timeline || answers.urgency || '');
    const assetsPrepared = String(answers.assetsPrepared || answers.stage || '');
    const isDecisionMaker = answers.isDecisionMaker === true || String(answers.decisionMakerStatus || '').includes('Decision');
    const audienceSize = String(answers.audienceSize || '');
    const strategicFit = String(answers.strategicContribution || answers.partnershipType || '');

    // Branch tag
    if (branch.toLowerCase().includes('brand') || branch.toLowerCase().includes('product')) {
      tags.push('MYTHRA_STUDIOS_BRAND');
    } else if (branch.toLowerCase().includes('ip') || branch.toLowerCase().includes('story') || branch.toLowerCase().includes('book')) {
      tags.push('MYTHRA_STUDIOS_IP');
    } else if (branch.toLowerCase().includes('media') || branch.toLowerCase().includes('audience') || branch.toLowerCase().includes('network')) {
      tags.push('MYTHRA_STUDIOS_MEDIA');
    } else if (branch.toLowerCase().includes('finance') || branch.toLowerCase().includes('capital') || branch.toLowerCase().includes('coprod')) {
      tags.push('MYTHRA_STUDIOS_FINANCE');
    }

    // Budget weighting
    if (['$30K–$75K', '$75K+', '$50,000+', '$30,000–$75,000', '$75,000+'].includes(budget)) {
      score += 30;
      rationale.push('High-value studio budget ($30K+) [+30]');
    } else if (['$15K–$30K', '$15,000–$30,000'].includes(budget)) {
      score += 20;
      rationale.push('Mid-tier studio budget ($15K–$30K) [+20]');
    } else if (['$7.5K–$15K', '$7,500–$15,000'].includes(budget)) {
      score += 10;
      rationale.push('Entry studio pilot budget ($7.5K–$15K) [+10]');
    }

    // Timeline readiness
    if (['Within 30 days', 'Within 60 days', 'Ready now', 'Immediate', '<60 days'].includes(timeline)) {
      score += 20;
      rationale.push('Ready within 60 days [+20]');
      tags.push('MYTHRA_READY_NOW');
    }

    // Rights / assets prepared
    if (
      assetsPrepared.toLowerCase().includes('ready') ||
      assetsPrepared.toLowerCase().includes('script') ||
      assetsPrepared.toLowerCase().includes('rights owned') ||
      assetsPrepared.toLowerCase().includes('brief prepared') ||
      answers.hasScript === true
    ) {
      score += 15;
      rationale.push('Script/rights/brief already prepared [+15]');
    }

    // Decision maker
    if (isDecisionMaker || contact.role?.toLowerCase().match(/(founder|ceo|cmo|vp|head|director|executive|owner|partner)/)) {
      score += 15;
      rationale.push('Executive or Decision Maker role [+15]');
    }

    // Audience reach (Media or Brand)
    if (['10M+', '10M–100M', '100M+'].includes(audienceSize)) {
      score += 20;
      rationale.push('Large distribution reach (10M+) [+20]');
      tags.push('MYTHRA_MEDIA_10M');
    } else if (['1M–10M', '1M+'].includes(audienceSize)) {
      score += 10;
      rationale.push('Mid-size distribution reach (1M–10M) [+10]');
      tags.push('MYTHRA_MEDIA_1M');
    }

    // Strategic distribution or finance fit
    if (strategicFit.length > 0 || branch.includes('finance') || branch.includes('coprod')) {
      score += 20;
      rationale.push('Strategic distribution or co-production fit [+20]');
    }
  } else if (persona === 'FILMMAKER') {
    const stage = String(answers.currentStage || answers.whereAreYou || '');
    const goal = String(answers.goal || answers.ambition || '');
    const timeCommitment = String(answers.timeCommitment || '');
    const block = String(answers.biggestBlock || '');

    if (stage.toLowerCase().includes('beginner')) {
      tags.push('MYTHRA_FILMMAKER_BEGINNER');
      score += 10;
    } else if (stage.toLowerCase().includes('team') || stage.toLowerCase().includes('agency') || stage.toLowerCase().includes('running a team')) {
      tags.push('MYTHRA_FILMMAKER_ACCELERATOR');
      score += 35;
      rationale.push('Existing agency or studio team candidate [+35]');
    } else {
      tags.push('MYTHRA_FILMMAKER_COHORT');
      score += 25;
      rationale.push('Active creator or editor seeking live cohort [+25]');
    }

    if (timeCommitment.includes('10+') || timeCommitment.includes('5–10')) {
      score += 15;
      rationale.push('Strong weekly time commitment committed [+15]');
    }
  } else if (persona === 'YOU') {
    const format = String(answers.format || answers.tier || '');
    const starCount = String(answers.star || answers.whoIsTheStar || '');

    if (format.toLowerCase().includes('story') || format.toLowerCase().includes('legacy')) {
      tags.push('MYTHRA_YOU_BESPOKE');
      score += 35;
      rationale.push('Bespoke or Legacy interest [+35]');
    } else if (format.toLowerCase().includes('trailer')) {
      tags.push('MYTHRA_YOU_TRAILER');
      score += 25;
      rationale.push('Trailer tier selection [+25]');
    } else {
      score += 15;
    }
  }

  // ==========================================
  // 2. CONTACT QUALITY SCORING (ALL PERSONAS)
  // ==========================================
  if (contact.email && !contact.email.match(/@(gmail|yahoo|hotmail|outlook|icloud)\./i) && contact.organization) {
    score += 15;
    rationale.push('Verified corporate email & organization [+15]');
  } else if (contact.organization || contact.website) {
    score += 10;
    rationale.push('Organization/Website provided [+10]');
  }

  if (contact.whatsapp && contact.whatsapp.length >= 8) {
    score += 5;
    rationale.push('WhatsApp phone provided for fast dispatch [+5]');
  }

  const messageLength = (contact.message || String(answers.projectMessage || answers.notes || '')).length;
  if (messageLength >= 60) {
    score += 10;
    rationale.push('Detailed project context submitted (>60 chars) [+10]');
  }

  // ==========================================
  // 3. QUALIFICATION BRACKET & CATEGORY
  // ==========================================
  let category: QualificationCategory = 'nurture';
  if (score >= 50) {
    category = 'priority';
    tags.push('MYTHRA_PRIORITY');
  } else if (score >= 25) {
    category = 'qualified';
    tags.push('MYTHRA_QUALIFIED');
  } else {
    category = 'nurture';
    tags.push('MYTHRA_NURTURE');
  }

  // ==========================================
  // 4. RECOMMENDATION SELECTION
  // ==========================================
  const recommendation = determineRecommendation(persona, answers, score);

  return {
    score,
    category,
    tags,
    recommendedOffer: recommendation.offer,
    recommendedAction: recommendation.action,
    rationale,
    pipelineStage: recommendation.pipelineStage,
  };
}

function determineRecommendation(
  persona: PersonaType,
  answers: FunnelAnswers,
  score: number
): { offer: OfferTier; action: string; pipelineStage: string } {
  if (persona === 'YOU') {
    const chosen = String(answers.format || answers.tier || '').toLowerCase();
    if (chosen.includes('moment')) {
      return {
        offer: mythraOffers.you.find((o) => o.id === 'you-moment') || mythraOffers.you[0],
        action: 'Instant 1080p Scene Booking',
        pipelineStage: 'YOU_MOMENT_CHECKOUT',
      };
    }
    if (chosen.includes('legacy') || chosen.includes('wedding') || chosen.includes('family')) {
      return {
        offer: mythraOffers.you.find((o) => o.id === 'you-legacy') || mythraOffers.you[3],
        action: 'Schedule Creative Director Discovery Call',
        pipelineStage: 'YOU_LEGACY_APPLICATION',
      };
    }
    if (chosen.includes('story') || chosen.includes('bespoke')) {
      return {
        offer: mythraOffers.you.find((o) => o.id === 'you-story') || mythraOffers.you[2],
        action: 'Submit Creative Questionnaire & 50% Scope Deposit',
        pipelineStage: 'YOU_STORY_BRIEF',
      };
    }
    // Default recommended hero
    return {
      offer: mythraOffers.you.find((o) => o.id === 'you-trailer') || mythraOffers.you[1],
      action: 'Create Your 60–90s Movie Trailer',
      pipelineStage: 'YOU_TRAILER_CHECKOUT',
    };
  }

  if (persona === 'FILMMAKER') {
    const stage = String(answers.currentStage || answers.whereAreYou || '').toLowerCase();
    const time = String(answers.timeCommitment || '').toLowerCase();

    if (stage.includes('team') || stage.includes('agency') || stage.includes('studio') || stage.includes('running a team')) {
      return {
        offer: mythraOffers.filmmaker.find((o) => o.id === 'film-accelerator') || mythraOffers.filmmaker[3],
        action: 'Submit Studio Accelerator Application',
        pipelineStage: 'FILMMAKER_ACCELERATOR_APPLY',
      };
    }
    if (stage.includes('beginner') && (time.includes('under 3') || time.includes('1-2'))) {
      return {
        offer: mythraOffers.filmmaker.find((o) => o.id === 'film-starter') || mythraOffers.filmmaker[1],
        action: 'Enroll in Self-Paced Starter',
        pipelineStage: 'FILMMAKER_STARTER_CHECKOUT',
      };
    }
    if (time.includes('workshop only') || answers.onlyFree === true) {
      return {
        offer: mythraOffers.filmmaker.find((o) => o.id === 'film-blueprint') || mythraOffers.filmmaker[0],
        action: 'Watch Free 45-Min Blueprint Workshop',
        pipelineStage: 'FILMMAKER_BLUEPRINT_ACCESS',
      };
    }
    // Default hero cohort
    return {
      offer: mythraOffers.filmmaker.find((o) => o.id === 'film-cohort') || mythraOffers.filmmaker[2],
      action: 'Reserve 6-Week Live Production Cohort Seat',
      pipelineStage: 'FILMMAKER_COHORT_RESERVE',
    };
  }

  // STUDIOS
  const branch = String(answers.branch || answers.intent || '').toLowerCase();
  const budget = String(answers.budget || answers.budgetRange || '').toLowerCase();

  if (branch.includes('finance') || branch.includes('coprod') || budget.includes('$50,000') || budget.includes('$75k')) {
    return {
      offer: mythraOffers.studios.find((o) => o.id === 'studio-coproduction') || mythraOffers.studios[4],
      action: 'Executive Co-Production & Slate Consultation',
      pipelineStage: 'STUDIOS_EXEC_DILIGENCE',
    };
  }
  if (branch.includes('ip') || branch.includes('series') || budget.includes('$30k')) {
    return {
      offer: mythraOffers.studios.find((o) => o.id === 'studio-episodic') || mythraOffers.studios[3],
      action: 'Book Series Format & IP Architecture Call',
      pipelineStage: 'STUDIOS_EPISODIC_SCOPE',
    };
  }
  if (budget.includes('$15k') || branch.includes('brand')) {
    return {
      offer: mythraOffers.studios.find((o) => o.id === 'studio-short') || mythraOffers.studios[2],
      action: 'Schedule Branded Short Film Creative Call',
      pipelineStage: 'STUDIOS_BRANDED_SHORT',
    };
  }
  if (budget.includes('$7.5k') || budget.includes('pilot')) {
    return {
      offer: mythraOffers.studios.find((o) => o.id === 'studio-pilot') || mythraOffers.studios[1],
      action: 'Request Social Drama Pilot Production Brief',
      pipelineStage: 'STUDIOS_PILOT_BRIEF',
    };
  }

  // Concept sprint / Discovery
  return {
    offer: mythraOffers.studios.find((o) => o.id === 'studio-concept-sprint') || mythraOffers.studios[0],
    action: 'Book Story Concept Sprint Workshop ($2,500)',
    pipelineStage: 'STUDIOS_CONCEPT_SPRINT',
  };
}
