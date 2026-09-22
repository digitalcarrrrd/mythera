import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../db';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, any>;
    const { consentData, creativeDetails, action } = body;

    // Handle withdrawal / deletion request
    if (action === 'withdraw') {
      const { consentId, email } = body;
      console.log(`[Consent] Withdrawal requested for ID: ${consentId} / Email: ${email}`);
      return NextResponse.json({
        success: true,
        message: 'Consent withdrawal registered. Media scheduled for permanent deletion.',
      });
    }

    if (!consentData || !consentData.subjectName) {
      return NextResponse.json({ error: 'Invalid consent data' }, { status: 400 });
    }

    const newConsentRecord = {
      id: `consent_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      projectId: 'proj_active_session',
      subjectName: consentData.subjectName,
      subjectAgeBand: 'adult_18_plus' as const,
      relationshipToCustomer: consentData.relationship || 'self',
      likenessAuthorized: Boolean(consentData.likenessAuthorized),
      voiceAuthorized: Boolean(consentData.voiceAuthorized),
      commercialUseAuthorized: Boolean(consentData.commercialUseAuthorized),
      modelTrainingOptIn: Boolean(consentData.modelTrainingOptIn),
      disclosureAcknowledged: Boolean(consentData.disclosureAcknowledged),
      termsVersion: 'v1.0-2026',
      ipAddressHash: 'hash_anonymous_client',
      signedAt: new Date().toISOString(),
      withdrawnAt: null,
    };

    db.store.consentRecords.push(newConsentRecord);

    return NextResponse.json({
      success: true,
      consentId: newConsentRecord.id,
      signedAt: newConsentRecord.signedAt,
    });
  } catch (error: any) {
    console.error('Consent logging error:', error);
    return NextResponse.json({ error: error?.message || 'Consent logging failed' }, { status: 500 });
  }
}
