// CRM Provider Interface & Adapters (GoHighLevel + Mock)
import { GhlContactPayload, GhlOpportunityPayload } from '../ghl-mapping';

export interface CrmSyncResult {
  success: boolean;
  contactId?: string;
  opportunityId?: string;
  error?: string;
  isMock?: boolean;
  syncedAt: string;
}

export interface CrmProvider {
  syncContactAndOpportunity(
    contact: GhlContactPayload,
    opportunity?: GhlOpportunityPayload
  ): Promise<CrmSyncResult>;
}

export class MockCrmProvider implements CrmProvider {
  async syncContactAndOpportunity(
    contact: GhlContactPayload,
    opportunity?: GhlOpportunityPayload
  ): Promise<CrmSyncResult> {
    // Generates simulated idempotent IDs for testing
    const mockContactId = `ghl_cnt_${Date.now()}`;
    const mockOppId = opportunity ? `ghl_opp_${Date.now()}` : undefined;

    return {
      success: true,
      contactId: mockContactId,
      opportunityId: mockOppId,
      isMock: true,
      syncedAt: new Date().toISOString(),
    };
  }
}

const DEFAULT_GHL_API_KEY = 'pit-bc2b732d-2bb3-459e-b6aa-a544f50bb35e';
const DEFAULT_GHL_LOCATION_ID = 'AeIZDAxEhTypA4Eja6j6';
const DEFAULT_GHL_PIPELINE_ID = 'upL94xEQbDfaAiIRlyiD';
const DEFAULT_GHL_STAGE_ID = '1565480e-e873-4bc4-89b5-c148dc986422';
const NOTIFY_EMAIL = 'shahid@zetomate.com';

export class GhlCrmProvider implements CrmProvider {
  private apiKey: string;
  private locationId: string;
  private pipelineId: string;
  private pipelineStageId: string;

  constructor(apiKey: string, locationId: string, pipelineId?: string, pipelineStageId?: string) {
    this.apiKey = apiKey;
    this.locationId = locationId;
    this.pipelineId = pipelineId || process.env.GHL_PIPELINE_ID || DEFAULT_GHL_PIPELINE_ID;
    this.pipelineStageId = pipelineStageId || process.env.GHL_STAGE_ID || DEFAULT_GHL_STAGE_ID;
  }

  async syncContactAndOpportunity(
    contact: GhlContactPayload,
    opportunity?: GhlOpportunityPayload
  ): Promise<CrmSyncResult> {
    try {
      // 1. Direct REST call to GoHighLevel Contacts Upsert v2 API
      const contactRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          Version: '2021-07-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          locationId: this.locationId,
          email: contact.email,
          firstName: contact.firstName,
          lastName: contact.lastName,
          phone: contact.phone,
          companyName: contact.companyName,
          tags: contact.tags,
          source: contact.source || 'MYTHRA Website Funnel',
          customFields: Object.entries(contact.customFields).map(([key, value]) => ({
            key,
            field_value: value,
          })),
        }),
      });

      if (!contactRes.ok) {
        const errorText = await contactRes.text();
        throw new Error(`GHL Contact API error: ${contactRes.status} - ${errorText}`);
      }

      const contactData = (await contactRes.json()) as { contact?: { id?: string } };
      const contactId = contactData.contact?.id;

      if (!contactId) {
        throw new Error('GHL responded without a valid contact ID');
      }

      // 2. Add detailed lead dossier Note in GoHighLevel for follow-up
      try {
        const custom = contact.customFields || {};
        const noteContent = `🌟 NEW MYTHRA LEAD DOSSIER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTACT:
• Name: ${contact.firstName} ${contact.lastName}
• Email: ${contact.email}
• WhatsApp/Phone: ${contact.phone || 'None'}
• Company: ${contact.companyName || 'None'}
• Role: ${custom.mythra_role || 'None'}
• Country: ${custom.mythra_country || 'None'}

🎯 INTENT & ROUTING:
• Persona: MYTHRA ${custom.mythra_persona || 'UNKNOWN'}
• Lead Score: ${custom.mythra_lead_score || 0} (${custom.mythra_qualification || 'Standard'})
• Recommended Offer: ${custom.mythra_recommended_offer || 'Custom Scope'}
• Offer Code: ${custom.mythra_offer_code || 'N/A'}

📋 LEAD QUESTIONNAIRE ANSWERS:
${custom.mythra_answers_json ? JSON.stringify(JSON.parse(String(custom.mythra_answers_json)), null, 2) : 'None'}

📝 PROJECT MESSAGE / NOTES:
${custom.mythra_message || 'None provided'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted via MYTHRA Live Funnel`;

        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body: noteContent }),
        });
      } catch (noteErr) {
        console.warn('GHL Note sync warning:', noteErr);
      }

      // 3. Create or sync Opportunity in GoHighLevel Pipeline for active deal tracking
      let opportunityId: string | undefined;
      try {
        const oppRes = await fetch('https://services.leadconnectorhq.com/opportunities/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationId: this.locationId,
            pipelineId: this.pipelineId,
            pipelineStageId: this.pipelineStageId,
            name: `${contact.firstName} ${contact.lastName} — ${contact.customFields?.mythra_recommended_offer || 'Production Lead'}`,
            status: 'open',
            contactId,
            monetaryValue: typeof opportunity?.monetaryValue === 'number' ? opportunity.monetaryValue : 0,
          }),
        });

        if (oppRes.ok) {
          const oppData = (await oppRes.json()) as { opportunity?: { id?: string } };
          opportunityId = oppData.opportunity?.id;
        } else {
          console.warn('GHL Opp create warning:', await oppRes.text());
        }
      } catch (oppErr) {
        console.warn('GHL Opportunity sync warning:', oppErr);
      }

      return {
        success: true,
        contactId,
        opportunityId,
        isMock: false,
        syncedAt: new Date().toISOString(),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown CRM error';
      console.error('GHL CRM Error:', errorMsg);
      return {
        success: false,
        error: errorMsg,
        syncedAt: new Date().toISOString(),
      };
    }
  }
}

export function getCrmProvider(): CrmProvider {
  const ghlApiKey = process.env.GHL_API_KEY || DEFAULT_GHL_API_KEY;
  const ghlLocationId = process.env.GHL_LOCATION_ID || DEFAULT_GHL_LOCATION_ID;

  if (ghlApiKey && ghlLocationId) {
    return new GhlCrmProvider(ghlApiKey, ghlLocationId);
  }
  return new MockCrmProvider();
}
