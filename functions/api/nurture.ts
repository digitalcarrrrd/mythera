export async function onRequestPost(context: any) {
  try {
    const data = await context.request.json();
    const { d, i, r } = data; // d = draft, i = intelligence, r = recommendation
    const contact = d?.contact || {};
    
    // Construct GoHighLevel payload
    const tags = i?.tags || [];
    tags.push('mythra-lead');
    if (d?.persona) tags.push(`mythra-persona-${d.persona.toLowerCase()}`);
    
    const locationId = 'AeIZDAxEhTypA4Eja6j6';
    const apiKey = 'pit-bc2b732d-2bb3-459e-b6aa-a544f50bb35e';
    
    const payload = {
      locationId: locationId,
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.whatsapp || '',
      companyName: contact.company || '',
      website: contact.website || '',
      tags: tags,
      source: 'MYTHRA Discovery Funnel'
    };

    // 1. Create Contact in GHL v2
    const ghlRes = await fetch('https://services.leadconnectorhq.com/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Version': '2021-07-28'
      },
      body: JSON.stringify(payload)
    });

    if (!ghlRes.ok) {
      console.error('GHL Contact Error:', await ghlRes.text());
      throw new Error('Failed to create contact');
    }

    const contactData = await ghlRes.json();
    const contactId = contactData.contact?.id;

    // 2. Create Opportunity in GHL v2
    if (contactId) {
      const oppPayload = {
        locationId: locationId,
        pipelineId: 'upL94xEQbDfaAiIRlyiD',
        pipelineStageId: '1565480e-e873-4bc4-89b5-c148dc986422',
        name: `MYTHRA Lead - ${contact.firstName || 'Unknown'} ${contact.lastName || ''}`.trim(),
        status: 'open',
        contactId: contactId,
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
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to process lead' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
