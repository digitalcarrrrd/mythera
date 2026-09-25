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

const DEFAULT_GHL_API_KEY = process.env.GHL_API_KEY || 'pit-a90d2e32-948d-4726-b9a9-5a76fd8852eb';
const DEFAULT_GHL_LOCATION_ID = process.env.GHL_LOCATION_ID || 'AeIZDAxEhTypA4Eja6j6';
const DEFAULT_GHL_PIPELINE_ID = process.env.GHL_PIPELINE_ID || 'upL94xEQbDfaAiIRlyiD';
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || process.env.GHL_NOTIFY_EMAIL || 'info@gmail.com';

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
      // 0. If GHL Inbound Webhook is configured, fire workflow automation directly
      const webhookUrl = process.env.GHL_WEBHOOK_URL;
      if (webhookUrl) {
        try {
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'mythra_lead_submitted',
              contact: {
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.phone,
                company: contact.companyName,
                tags: contact.tags,
                source: contact.source,
                ...contact.customFields,
              },
              opportunity,
              notifyEmail: NOTIFY_EMAIL,
              submittedAt: new Date().toISOString(),
            }),
          });
        } catch (webhookErr) {
          console.warn('GHL Webhook trigger error:', webhookErr);
        }
      }

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
        console.warn(`GHL Contact API error: ${contactRes.status} - ${errorText}`);
        return {
          success: false,
          error: `GHL API ${contactRes.status}: ${errorText}`,
          syncedAt: new Date().toISOString(),
        };
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
        let targetPipelineId = this.pipelineId;
        let targetStageId = this.pipelineStageId;

        // Auto-discover 'mythra' pipeline if present in the account
        try {
          const pipeRes = await fetch(`https://services.leadconnectorhq.com/opportunities/pipelines?locationId=${this.locationId}`, {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              Version: '2021-07-28',
            },
          });
          if (pipeRes.ok) {
            const pipeData = (await pipeRes.json()) as any;
            const pipelines = pipeData.pipelines || [];
            const mythraPipe = pipelines.find((p: any) =>
              p.name && (p.name.toLowerCase().includes('mythra') || p.name.toLowerCase().includes('methrya'))
            );
            if (mythraPipe) {
              targetPipelineId = mythraPipe.id;
              if (mythraPipe.stages && mythraPipe.stages.length > 0) {
                targetStageId = mythraPipe.stages[0].id;
              }
            }
          }
        } catch (pipeErr) {
          console.warn('GHL pipeline auto-lookup notice:', pipeErr);
        }

        const oppRes = await fetch('https://services.leadconnectorhq.com/opportunities/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationId: this.locationId,
            pipelineId: targetPipelineId,
            pipelineStageId: targetStageId,
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

      // 4. Send internal notification email to info@zetomate.com via GHL conversation API
      try {
        const adminContactRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            Version: '2021-07-28',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            locationId: this.locationId,
            firstName: 'MYTHRA',
            lastName: 'Notifications',
            email: NOTIFY_EMAIL,
          }),
        });
        const adminData = (await adminContactRes.json()) as any;
        const adminContactId = adminData.contact?.id;

        if (adminContactId) {
          const custom = contact.customFields || {};
          await fetch('https://services.leadconnectorhq.com/conversations/messages', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              Version: '2021-07-28',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'Email',
              contactId: adminContactId,
              emailTo: NOTIFY_EMAIL,
              subject: `🔥 New MYTHRA Lead: ${contact.firstName} ${contact.lastName} (${custom.mythra_recommended_offer || 'General'})`,
              html: `
                <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background:#ffffff;">
                  <div style="background:#000000;color:#d8ff44;padding:20px;text-align:center;">
                    <h1 style="margin:0;font-size:22px;letter-spacing:1px;">MYTHRA · NEW LEAD RECEIVED</h1>
                    <p style="margin:6px 0 0 0;color:#ffffff;font-size:14px;">Pipeline: methrya</p>
                  </div>
                  <div style="padding:24px;color:#1a1a1a;">
                    <h2 style="font-size:16px;border-bottom:2px solid #f0f0f0;padding-bottom:8px;margin-top:0;">Lead Details</h2>
                    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                      <tr><td style="padding:6px 0;width:140px;font-weight:bold;color:#555;">Name:</td><td>${contact.firstName} ${contact.lastName}</td></tr>
                      <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${contact.email}" style="color:#2563eb;">${contact.email}</a></td></tr>
                      <tr><td style="padding:6px 0;font-weight:bold;color:#555;">WhatsApp/Phone:</td><td>${contact.phone || 'N/A'}</td></tr>
                      <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Country:</td><td>${custom.mythra_country || 'N/A'}</td></tr>
                      <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Recommended:</td><td><strong>${custom.mythra_recommended_offer || 'N/A'}</strong></td></tr>
                      <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Tags:</td><td>${contact.tags.join(', ')}</td></tr>
                    </table>
                  </div>
                </div>
              `,
            }),
          });
        }
      } catch (notifyErr) {
        console.warn('GHL notification email warning:', notifyErr);
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
