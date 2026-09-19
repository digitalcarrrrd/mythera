'use server';

export async function createOpportunity(d: any, i: any) {
  try {
    const contact = d?.contact || {};
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
      throw new Error('Failed to create contact');
    }

    const contactData = await ghlRes.json();
    const contactId = contactData.contact?.id;

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

      await fetch('https://services.leadconnectorhq.com/opportunities/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28'
        },
        body: JSON.stringify(oppPayload)
      });
    }

    return { success: true };
  } catch (err) {
    return { error: 'Failed to process lead' };
  }
}
