export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { d, i, r } = data; // d = draft, i = intelligence, r = recommendation
    const contact = d?.contact || {};
    
    // Construct GoHighLevel payload
    const tags = i?.tags || [];
    tags.push('mythra-lead');
    if (d?.persona) tags.push(`mythra-persona-${d.persona.toLowerCase()}`);
    
    const payload = {
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim(),
      email: contact.email || '',
      phone: contact.whatsapp || '',
      companyName: contact.company || '',
      website: contact.website || '',
      tags: tags,
      source: 'MYTHRA Discovery Funnel',
      customField: {
        'Message': contact.message || '',
        'Recommended Path': r || '',
        'Score': String(i?.score || 0)
      }
    };

    // Push to GoHighLevel API v1
    const ghlRes = await fetch('https://rest.gohighlevel.com/v1/contacts/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer pit-bc2b732d-2bb3-459e-b6aa-a544f50bb35e'
      },
      body: JSON.stringify(payload)
    });

    if (!ghlRes.ok) {
      console.error('GHL Error:', await ghlRes.text());
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('API Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to process lead' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
