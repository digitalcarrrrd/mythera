import { NextRequest, NextResponse } from 'next/server';
import { evaluateLead } from '../../../lib/lead-scoring';
import { getCrmProvider } from '../../../lib/adapters/crm';
import { buildGhlContactPayload, buildGhlOpportunityPayload } from '../../../lib/ghl-mapping';
import { db } from '../../../db';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, any>;
    const { persona, answers, contact } = body;

    if (!persona || !contact || !contact.email) {
      return NextResponse.json({ error: 'Missing required persona or contact fields' }, { status: 400 });
    }

    // Evaluate scoring
    const scoring = evaluateLead(persona, answers || {}, contact);

    // Save lead to store
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const newLead = {
      id: leadId,
      persona,
      branch: String(answers?.branch || answers?.tier || 'general'),
      status: 'new',
      score: scoring.score,
      qualification: scoring.category,
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email,
      whatsapp: contact.whatsapp || null,
      country: contact.country || null,
      organization: contact.organization || null,
      role: contact.role || null,
      website: contact.website || null,
      answersJson: JSON.stringify(answers || {}),
      recommendedOffer: scoring.recommendedOffer.name,
      source: `MYTHRA_${persona}_Funnel`,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      consentMarketingAt: contact.consentMarketing ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.store.leads.unshift(newLead);

    // Sync to CRM Provider (GoHighLevel)
    const crm = getCrmProvider();
    const ghlContact = buildGhlContactPayload(persona, contact, scoring, answers || {});
    const ghlOpportunity = buildGhlOpportunityPayload(persona, contact, scoring);

    const crmResult = await crm.syncContactAndOpportunity(ghlContact, ghlOpportunity);

    // Log CRM sync event
    db.store.crmSyncEvents.push({
      id: `crm_sync_${Date.now()}`,
      leadId,
      provider: 'GHL',
      status: crmResult.success ? 'success' : 'failed',
      contactId: crmResult.contactId || null,
      opportunityId: crmResult.opportunityId || null,
      payloadJson: JSON.stringify(ghlContact),
      errorMessage: crmResult.error || null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      leadId,
      scoring,
      crmSynced: crmResult.success,
    });
  } catch (error: any) {
    console.error('Lead processing error:', error);
    return NextResponse.json({ error: error?.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  // Admin read
  return NextResponse.json({
    leads: db.store.leads,
  });
}
