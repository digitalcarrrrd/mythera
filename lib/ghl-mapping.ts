// GoHighLevel (GHL) CRM and Pipeline Integration Mapping
import { LeadContact, ScoringResult, PersonaType } from './lead-scoring';

export interface GhlContactPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName?: string;
  tags: string[];
  customFields: Record<string, string | number | boolean>;
  source: string;
}

export interface GhlOpportunityPayload {
  pipelineId: string;
  stageId: string;
  name: string;
  monetaryValue?: number;
  status: 'open' | 'won' | 'lost' | 'abandoned';
  customFields: Record<string, string | number | boolean>;
}

export const GHL_PIPELINES: Record<PersonaType, { id: string; name: string; stages: Record<string, string> }> = {
  YOU: {
    id: 'pipe_mythra_you',
    name: 'MYTHRA YOU Pipeline',
    stages: {
      NEW_LEAD: 'stage_you_new_lead',
      CHECKOUT_PENDING: 'stage_you_checkout_pending',
      ONBOARDING_PENDING: 'stage_you_onboarding_pending',
      PRODUCTION_QUEUE: 'stage_you_production_queue',
      IN_REVISION: 'stage_you_in_revision',
      DELIVERED: 'stage_you_delivered',
    },
  },
  FILMMAKER: {
    id: 'pipe_mythra_filmmaker',
    name: 'MYTHRA FILMMAKER Pipeline',
    stages: {
      BLUEPRINT_OPTIN: 'stage_film_blueprint',
      STARTER_ENROLLED: 'stage_film_starter',
      COHORT_WAITLIST: 'stage_film_cohort_waitlist',
      COHORT_ENROLLED: 'stage_film_cohort_enrolled',
      ACCELERATOR_APPLIED: 'stage_film_accelerator_applied',
      ALUMNI_ACTIVE: 'stage_film_alumni',
    },
  },
  STUDIOS: {
    id: 'pipe_mythra_studios',
    name: 'MYTHRA STUDIOS B2B Pipeline',
    stages: {
      INQUIRY_RECEIVED: 'stage_studio_inquiry',
      QUALIFIED_BRIEF: 'stage_studio_qualified',
      DISCOVERY_CALL_BOOKED: 'stage_studio_call_booked',
      PROPOSAL_SENT: 'stage_studio_proposal_sent',
      CONTRACT_SIGNED: 'stage_studio_signed',
      IN_PRODUCTION: 'stage_studio_production',
      NURTURE_LONG_TERM: 'stage_studio_nurture',
    },
  },
};

export function buildGhlContactPayload(
  persona: PersonaType,
  contact: LeadContact,
  scoring: ScoringResult,
  answers: Record<string, unknown>
): GhlContactPayload {
  return {
    email: contact.email,
    firstName: contact.firstName,
    lastName: contact.lastName,
    phone: contact.whatsapp || undefined,
    companyName: contact.organization || undefined,
    tags: Array.from(new Set(scoring.tags)),
    customFields: {
      mythra_persona: persona,
      mythra_lead_score: scoring.score,
      mythra_qualification: scoring.category,
      mythra_recommended_offer: scoring.recommendedOffer.name,
      mythra_offer_code: scoring.recommendedOffer.code,
      mythra_country: contact.country || '',
      mythra_role: contact.role || '',
      mythra_website: contact.website || '',
      mythra_message: contact.message || '',
      mythra_answers_json: JSON.stringify(answers),
      mythra_scored_at: new Date().toISOString(),
    },
    source: `MYTHRA_${persona}_Funnel`,
  };
}

export function buildGhlOpportunityPayload(
  persona: PersonaType,
  contact: LeadContact,
  scoring: ScoringResult
): GhlOpportunityPayload {
  const pipeline = GHL_PIPELINES[persona];
  const firstStage = Object.values(pipeline.stages)[0] || 'stage_default';
  let stageId: string = firstStage;

  if (persona === 'STUDIOS') {
    stageId = scoring.category === 'priority'
      ? GHL_PIPELINES.STUDIOS.stages.QUALIFIED_BRIEF
      : scoring.category === 'qualified'
      ? GHL_PIPELINES.STUDIOS.stages.INQUIRY_RECEIVED
      : GHL_PIPELINES.STUDIOS.stages.NURTURE_LONG_TERM;
  }

  return {
    pipelineId: pipeline.id,
    stageId,
    name: `${contact.firstName} ${contact.lastName} — ${scoring.recommendedOffer.name}`,
    monetaryValue: scoring.recommendedOffer.price > 0 ? scoring.recommendedOffer.price : undefined,
    status: 'open',
    customFields: {
      qualification: scoring.category,
      score: scoring.score,
    },
  };
}
