// Database connection and memory storage helper
import * as schema from './schema';

export interface DatabaseStore {
  leads: Array<typeof schema.leads.$inferSelect>;
  orders: Array<typeof schema.orders.$inferSelect>;
  projects: Array<typeof schema.projects.$inferSelect>;
  mediaAssets: Array<typeof schema.mediaAssets.$inferSelect>;
  consentRecords: Array<typeof schema.consentRecords.$inferSelect>;
  proofMetrics: Array<typeof schema.proofMetrics.$inferSelect>;
  crmSyncEvents: Array<typeof schema.crmSyncEvents.$inferSelect>;
  auditLogs: Array<typeof schema.auditLogs.$inferSelect>;
}

// Global in-memory store for fast dev/edge execution & mock resilience
const globalStore: DatabaseStore = {
  leads: [
    {
      id: 'lead_demo_01',
      persona: 'YOU',
      branch: 'personalized_trailer',
      status: 'converted',
      score: 45,
      qualification: 'qualified',
      firstName: 'Elena',
      lastName: 'Vance',
      email: 'elena@example.com',
      whatsapp: '+14155550198',
      country: 'United States',
      organization: 'Black Mesa Media',
      role: 'Creative Director',
      website: 'https://blackmesa.test',
      answersJson: JSON.stringify({ format: 'Trailer', star: 'Me', genre: 'Sci-fi' }),
      recommendedOffer: 'MYTHRA TRAILER',
      source: 'MYTHRA_YOU_Funnel',
      utmSource: 'organic',
      utmMedium: 'direct',
      utmCampaign: 'launch',
      consentMarketingAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'lead_demo_02',
      persona: 'STUDIOS',
      branch: 'brand_drama',
      status: 'in_review',
      score: 65,
      qualification: 'priority',
      firstName: 'Marcus',
      lastName: 'Sterling',
      email: 'marcus@solisglobal.com',
      whatsapp: '+442079460912',
      country: 'United Kingdom',
      organization: 'Solis Global Automotive',
      role: 'VP Brand Marketing',
      website: 'https://solisglobal.test',
      answersJson: JSON.stringify({ branch: 'brand', budget: '$30K–$75K', timeline: 'Within 60 days', isDecisionMaker: true }),
      recommendedOffer: 'BRANDED SHORT FILM',
      source: 'MYTHRA_STUDIOS_Funnel',
      utmSource: 'linkedin',
      utmMedium: 'social',
      utmCampaign: 'q4_drama',
      consentMarketingAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'lead_demo_03',
      persona: 'FILMMAKER',
      branch: 'cohort_applicant',
      status: 'enrolled',
      score: 55,
      qualification: 'priority',
      firstName: 'Amina',
      lastName: 'Kareem',
      email: 'amina@storycraft.io',
      whatsapp: '+971501234567',
      country: 'United Arab Emirates',
      organization: 'StoryCraft UAE',
      role: 'Director / Editor',
      website: 'https://storycraft.test',
      answersJson: JSON.stringify({ currentStage: 'Making films', timeCommitment: '10+ hrs/wk' }),
      recommendedOffer: 'MYTHRA FILMMAKER COHORT',
      source: 'MYTHRA_FILMMAKER_Funnel',
      utmSource: 'youtube',
      utmMedium: 'video',
      utmCampaign: 'genesis_breakdown',
      consentMarketingAt: new Date().toISOString(),
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  orders: [
    {
      id: 'ord_demo_101',
      userId: 'usr_elena_01',
      leadId: 'lead_demo_01',
      offerCode: 'MYTHRA_TRAILER',
      amount: 29900,
      currency: 'USD',
      paymentStatus: 'paid',
      productionStatus: 'in_production',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      stripeSessionId: 'cs_test_mock_101',
      stripeCustomerId: 'cus_test_101',
      createdAt: new Date(Date.now() - 80000000).toISOString(),
    },
  ],
  projects: [
    {
      id: 'proj_demo_201',
      orderId: 'ord_demo_101',
      projectType: 'MYTHRA_TRAILER',
      title: 'Elena Vance — Cyberpunk Odyssey Trailer',
      briefJson: JSON.stringify({ theme: 'Retro Neo-Tokyo', leadVoice: 'Authorized clone approved' }),
      status: 'in_production',
      assignedOwner: 'Director Alex Reed',
      revisionRound: 1,
      deliveryUrl: null,
      createdAt: new Date(Date.now() - 75000000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  mediaAssets: [],
  consentRecords: [
    {
      id: 'consent_demo_301',
      projectId: 'proj_demo_201',
      subjectName: 'Elena Vance',
      subjectAgeBand: 'adult_18_plus',
      relationshipToCustomer: 'self',
      likenessAuthorized: true,
      voiceAuthorized: true,
      commercialUseAuthorized: false,
      modelTrainingOptIn: false,
      disclosureAcknowledged: true,
      termsVersion: 'v1.0-2026',
      ipAddressHash: 'e3b0c44298fc1c149afbf4c8996fb924',
      signedAt: new Date(Date.now() - 74000000).toISOString(),
      withdrawnAt: null,
    },
  ],
  proofMetrics: [],
  crmSyncEvents: [
    {
      id: 'crm_sync_401',
      leadId: 'lead_demo_02',
      provider: 'GHL',
      status: 'success',
      contactId: 'ghl_cnt_99812',
      opportunityId: 'ghl_opp_44102',
      payloadJson: JSON.stringify({ score: 65, category: 'priority', tags: ['MYTHRA_STUDIOS', 'MYTHRA_STUDIOS_BRAND', 'MYTHRA_PRIORITY'] }),
      errorMessage: null,
      createdAt: new Date(Date.now() - 43000000).toISOString(),
    },
  ],
  auditLogs: [
    {
      id: 'audit_501',
      userId: 'system',
      action: 'LEAD_SCORED',
      resourceType: 'lead',
      resourceId: 'lead_demo_02',
      details: 'Score calculated: 65 (Category: priority)',
      createdAt: new Date(Date.now() - 43000000).toISOString(),
    },
  ],
};

export const db = {
  store: globalStore,
  schema,
};
