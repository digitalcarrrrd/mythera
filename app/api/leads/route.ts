import { NextRequest, NextResponse } from 'next/server';
import { evaluateLead } from '../../../lib/lead-scoring';
import { getCrmProvider } from '../../../lib/adapters/crm';
import { buildGhlContactPayload, buildGhlOpportunityPayload } from '../../../lib/ghl-mapping';
import { dispatchLeadEmails } from '../../../lib/adapters/email';
import { db } from '../../../db';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, any>;
    const { persona = 'YOU', answers = {}, contact = {} } = body;

    if (!contact || !contact.email) {
      return NextResponse.json({ error: 'Missing required contact email' }, { status: 400 });
    }

    // Normalize full name into firstName / lastName
    const rawFullName = (contact.fullName || contact.name || '').trim();
    const nameParts = rawFullName ? rawFullName.split(/\s+/) : [];
    const normalizedContact = {
      ...contact,
      firstName: contact.firstName || nameParts[0] || 'Lead',
      lastName: contact.lastName || nameParts.slice(1).join(' ') || '',
    };

    // Evaluate scoring
    const scoring = evaluateLead(persona, answers || {}, normalizedContact);

    // Save lead to store
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const recommendedOfferName = (answers.recommendedOffer as string) || scoring.recommendedOffer.name;
    const newLead = {
      id: leadId,
      persona,
      branch: String(answers?.door || answers?.branch || answers?.tier || 'general'),
      status: 'new',
      score: scoring.score,
      qualification: scoring.category,
      firstName: normalizedContact.firstName,
      lastName: normalizedContact.lastName,
      email: normalizedContact.email,
      whatsapp: normalizedContact.whatsapp || null,
      country: normalizedContact.country || null,
      organization: normalizedContact.organization || null,
      role: normalizedContact.role || null,
      website: normalizedContact.website || null,
      answersJson: JSON.stringify(answers || {}),
      recommendedOffer: recommendedOfferName,
      source: `MYTHRA_${persona}_Funnel`,
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      consentMarketingAt: normalizedContact.consentMarketing ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.store.leads.unshift(newLead);

    // Sync to CRM Provider (GoHighLevel)
    const crm = getCrmProvider();
    const ghlContact = buildGhlContactPayload(persona, normalizedContact, scoring, answers || {});
    const ghlOpportunity = buildGhlOpportunityPayload(persona, normalizedContact, scoring);

    const crmResult = await crm.syncContactAndOpportunity(ghlContact, ghlOpportunity);

    // Dispatch customer instant auto-reply (asking for 24h response) and admin notification
    const emailResult = await dispatchLeadEmails({
      customerName: `${normalizedContact.firstName} ${normalizedContact.lastName}`.trim(),
      customerEmail: normalizedContact.email,
      phone: normalizedContact.whatsapp,
      country: normalizedContact.country,
      persona,
      recommendedOffer: recommendedOfferName,
      offerPriceDisplay: scoring.recommendedOffer?.priceDisplay,
      leadScore: scoring.score,
      qualification: scoring.category,
      answersJson: JSON.stringify(answers || {}),
      message: normalizedContact.message,
      payoutUrl: process.env.PAYOUT_URL || process.env.STRIPE_PAYOUT_URL,
    });

    // Log CRM sync event
    db.store.crmSyncEvents.push({
      id: `crm_sync_${Date.now()}`,
      leadId,
      provider: 'GHL',
      status: crmResult.success ? 'success' : 'failed',
      contactId: crmResult.contactId || null,
      opportunityId: crmResult.opportunityId || null,
      payloadJson: JSON.stringify(ghlContact),
      errorMessage: crmResult.error || (emailResult.errors.length ? emailResult.errors.join('; ') : null),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      leadId,
      scoring,
      crmSynced: crmResult.success,
      emailSent: emailResult.customerNotified || emailResult.adminNotified,
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
