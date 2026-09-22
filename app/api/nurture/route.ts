import { questions, personas, recommendation as getRec, type Persona } from '@/lib/mythra';

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as any;
    const { d, i, action, contactId } = data; // d = draft, i = intelligence
    const contact = d?.contact || {};
    const persona = (d?.persona || 'GENERAL') as Persona;
    
    const locationId = 'AeIZDAxEhTypA4Eja6j6';
    const apiKey = 'pit-bc2b732d-2bb3-459e-b6aa-a544f50bb35e';
    const notifyEmail = 'shahid@zetomate.com';

    // Helper to format answers into readable text
    const formatAnswersText = () => {
      const qList = questions[persona] || [];
      const answers = d?.answers || {};
      const lines: string[] = [];

      for (const item of qList) {
        if (item.fields) {
          for (const f of item.fields) {
            const val = answers[f];
            if (val) lines.push(`• ${f}: ${val}`);
          }
        } else {
          const val = answers[item.key];
          if (val !== undefined && val !== null && val !== '') {
            const formattedVal = Array.isArray(val) ? val.join(', ') : String(val);
            lines.push(`• ${item.title}: ${formattedVal}`);
          }
        }
      }
      return lines.length ? lines.join('\n') : '• None provided';
    };

    const formatAnswersHtml = () => {
      const qList = questions[persona] || [];
      const answers = d?.answers || {};
      const rows: string[] = [];

      for (const item of qList) {
        if (item.fields) {
          for (const f of item.fields) {
            const val = answers[f];
            if (val) {
              rows.push(`<tr><td style="padding:6px 12px;font-weight:bold;color:#333;border-bottom:1px solid #eee;">${f}</td><td style="padding:6px 12px;color:#555;border-bottom:1px solid #eee;">${val}</td></tr>`);
            }
          }
        } else {
          const val = answers[item.key];
          if (val !== undefined && val !== null && val !== '') {
            const formattedVal = Array.isArray(val) ? val.join(', ') : String(val);
            rows.push(`<tr><td style="padding:6px 12px;font-weight:bold;color:#333;border-bottom:1px solid #eee;">${item.title}</td><td style="padding:6px 12px;color:#555;border-bottom:1px solid #eee;">${formattedVal}</td></tr>`);
          }
        }
      }
      return rows.join('');
    };

    let cleanWebsite = (contact.website || '').trim();
    if (cleanWebsite === 'https://' || cleanWebsite === 'http://') cleanWebsite = '';

    // ==========================================
    // STEP 1: CONTACT CREATION (Form Submitted)
    // ==========================================
    if (action === 'contact') {
      const tags = [...(i?.tags || [])];
      if (!tags.includes('mythra-lead')) tags.push('mythra-lead');
      if (d?.persona && !tags.includes(`mythra-persona-${d.persona.toLowerCase()}`)) {
        tags.push(`mythra-persona-${d.persona.toLowerCase()}`);
      }
      
      const payload = {
        locationId,
        firstName: (contact.firstName || '').trim(),
        lastName: (contact.lastName || '').trim(),
        email: (contact.email || '').trim(),
        phone: (contact.whatsapp || '').trim(),
        companyName: (contact.company || '').trim(),
        website: cleanWebsite,
        tags,
        source: 'MYTHRA Discovery Funnel'
      };

      // 1. Upsert Contact in GHL (handles new & existing emails smoothly)
      const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28'
        },
        body: JSON.stringify(payload)
      });

      if (!ghlRes.ok) {
        const errText = await ghlRes.text();
        console.error('GHL Contact Upsert Error:', errText);
        throw new Error('Failed to upsert contact: ' + errText);
      }

      const contactData = (await ghlRes.json()) as any;
      const newContactId = contactData.contact?.id;

      // 2. Add complete select options & answers to Contact Notes in GHL
      const personaObj = personas.find(p => p.id === persona);
      const personaLabel = personaObj ? `${personaObj.title} (${personaObj.label})` : persona;
      const rec = d?.persona ? getRec(persona, d.answers) : 'Custom Path';

      const noteBody = `🌟 NEW MYTHRA DISCOVERY LEAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTACT INFO:
• Name: ${contact.firstName || ''} ${contact.lastName || ''}
• Email: ${contact.email || 'N/A'}
• WhatsApp: ${contact.whatsapp || 'N/A'}
• Country: ${contact.country || 'N/A'}
• Company: ${contact.company || 'N/A'}
• Website: ${cleanWebsite || 'N/A'}
• Additional Notes: ${contact.message || 'None'}

🎯 COLLABORATION PERSONA:
• ${personaLabel}

📋 QUESTIONNAIRE & SELECTED OPTIONS:
${formatAnswersText()}

💡 SYSTEM INTELLIGENCE:
• Lead Score: ${i?.score || 0} (${i?.category || 'standard'})
• Recommended Path: ${rec}
• Consent to Updates: ${d?.consent ? 'Yes' : 'No'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submitted via mythralab.com`;

      if (newContactId) {
        fetch(`https://services.leadconnectorhq.com/contacts/${newContactId}/notes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28'
          },
          body: JSON.stringify({ body: noteBody })
        }).catch(e => console.error('Error adding contact note:', e));
      }

      // 3. Send Notification Email to shahid@zetomate.com via GHL email service
      try {
        const adminContactRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28'
          },
          body: JSON.stringify({
            locationId,
            firstName: 'Shahid',
            lastName: 'Notification',
            email: notifyEmail
          })
        });
        const adminData = (await adminContactRes.json()) as any;
        const adminContactId = adminData.contact?.id;

        if (adminContactId) {
          const emailHtml = `
          <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background:#ffffff;">
            <div style="background:#0a0a0a;color:#ffffff;padding:20px;text-align:center;">
              <h1 style="margin:0;font-size:22px;letter-spacing:1px;">MYTHRA · NEW LEAD RECEIVED</h1>
              <p style="margin:6px 0 0 0;color:#a3a3a3;font-size:14px;">Discovery Funnel Submission</p>
            </div>
            <div style="padding:24px;">
              <h2 style="font-size:16px;color:#171717;border-bottom:2px solid #f0f0f0;padding-bottom:8px;margin-top:0;">Contact Details</h2>
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
                <tr><td style="padding:6px 0;width:140px;font-weight:bold;color:#555;">Name:</td><td>${contact.firstName || ''} ${contact.lastName || ''}</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Email:</td><td><a href="mailto:${contact.email}" style="color:#2563eb;">${contact.email}</a></td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#555;">WhatsApp:</td><td><a href="https://wa.me/${(contact.whatsapp||'').replace(/[^0-9]/g,'')}" style="color:#2563eb;">${contact.whatsapp}</a></td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Country:</td><td>${contact.country || 'N/A'}</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Company:</td><td>${contact.company || 'N/A'}</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Website:</td><td>${cleanWebsite ? `<a href="${cleanWebsite}">${cleanWebsite}</a>` : 'N/A'}</td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Persona:</td><td><strong style="background:#f3f4f6;padding:2px 8px;border-radius:4px;">${personaLabel}</strong></td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Lead Score:</td><td><strong style="color:#16a34a;">${i?.score || 0} (${i?.category || 'standard'})</strong></td></tr>
                <tr><td style="padding:6px 0;font-weight:bold;color:#555;">Recommended:</td><td>${rec}</td></tr>
                ${contact.message ? `<tr><td style="padding:6px 0;font-weight:bold;color:#555;">Message:</td><td style="background:#f8fafc;padding:8px;border-radius:4px;border:1px solid #e2e8f0;">${contact.message}</td></tr>` : ''}
              </table>

              <h2 style="font-size:16px;color:#171717;border-bottom:2px solid #f0f0f0;padding-bottom:8px;">Questionnaire Answers & Options</h2>
              <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#fcfcfc;">
                ${formatAnswersHtml()}
              </table>

              <div style="background:#f8fafc;border:1px solid #e2e8f0;padding:12px 16px;border-radius:6px;font-size:13px;color:#64748b;text-align:center;">
                Lead recorded in GoHighLevel Contacts. Opportunity will be created when user confirms path.
              </div>
            </div>
          </div>
          `;

          await fetch('https://services.leadconnectorhq.com/conversations/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'Version': '2021-07-28'
            },
            body: JSON.stringify({
              type: 'Email',
              contactId: adminContactId,
              emailTo: notifyEmail,
              subject: `🔥 New MYTHRA Lead: ${contact.firstName || ''} ${contact.lastName || ''} (${persona})`,
              html: emailHtml
            })
          });
        }
      } catch (mailErr) {
        console.error('Email notification error:', mailErr);
      }

      return new Response(JSON.stringify({ success: true, contactId: newContactId }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ==========================================
    // STEP 2: OPPORTUNITY CREATION (Action Clicked)
    // ==========================================
    if (action === 'opportunity') {
      if (!contactId) throw new Error('Missing contactId');
      
      const oppPayload = {
        locationId,
        pipelineId: 'upL94xEQbDfaAiIRlyiD',
        pipelineStageId: '1565480e-e873-4bc4-89b5-c148dc986422',
        name: `MYTHRA Lead - ${(contact.firstName || 'Unknown').trim()} ${(contact.lastName || '').trim()} (${persona})`.trim(),
        status: 'open',
        contactId,
        monetaryValue: 0
      };

      const oppRes = await fetch('https://services.leadconnectorhq.com/opportunities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28'
        },
        body: JSON.stringify(oppPayload)
      });
      
      if (!oppRes.ok) {
        const oppErrText = await oppRes.text();
        console.error('GHL Opp Error:', oppErrText);
        throw new Error('Failed to create opportunity: ' + oppErrText);
      }

      // Add note on opportunity stage
      fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28'
        },
        body: JSON.stringify({
          body: `🚀 OPPORTUNITY ACTIVATED\nAction Requested: ${d?.requestedAction || 'Story Session / Collaboration Request'}\nTimestamp: ${new Date().toISOString()}`
        })
      }).catch(e => console.error('Error adding opp note:', e));

      // Send follow-up email to shahid@zetomate.com
      try {
        const adminContactRes = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'Version': '2021-07-28'
          },
          body: JSON.stringify({ locationId, firstName: 'Shahid', lastName: 'Notification', email: notifyEmail })
        });
        const adminData = (await adminContactRes.json()) as any;
        const adminContactId = adminData.contact?.id;

        if (adminContactId) {
          await fetch('https://services.leadconnectorhq.com/conversations/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
              'Version': '2021-07-28'
            },
            body: JSON.stringify({
              type: 'Email',
              contactId: adminContactId,
              emailTo: notifyEmail,
              subject: `⚡ Opportunity Created: ${contact.firstName || ''} ${contact.lastName || ''} (${d?.requestedAction || 'Requested Collaboration'})`,
              html: `
              <div style="font-family:Arial,sans-serif;padding:20px;max-width:600px;border:1px solid #eee;border-radius:8px;">
                <h2 style="color:#16a34a;margin-top:0;">⚡ Lead Moved to Opportunities Tab!</h2>
                <p><strong>Lead:</strong> ${contact.firstName || ''} ${contact.lastName || ''} (${contact.email})</p>
                <p><strong>Persona:</strong> ${persona}</p>
                <p><strong>Confirmed Action:</strong> ${d?.requestedAction || 'Action Button Clicked'}</p>
                <p><strong>Pipeline:</strong> MYTHRA Discovery Funnel</p>
                <p>The opportunity is now visible in the Opportunities tab in GoHighLevel.</p>
              </div>
              `
            })
          });
        }
      } catch (e) {
        console.error('Email opp notify error:', e);
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (err: any) {
    console.error('API Error:', err);
    return new Response(JSON.stringify({ error: err?.message || 'Failed to process lead' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
