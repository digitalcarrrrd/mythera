import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '../../../lib/adapters/payment';
import { mythraOffers } from '../../../lib/offers';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, any>;
    const { offerCode, customerEmail, customerName, successUrl, cancelUrl } = body;

    // Find offer by code across all paths
    const allOffers = [...mythraOffers.you, ...mythraOffers.filmmaker, ...mythraOffers.studios];
    const offer = allOffers.find((o) => o.code === offerCode) || mythraOffers.you[1]; // default Trailer

    const payment = getPaymentProvider();
    const session = await payment.createCheckoutSession({
      offerCode: offer.code,
      offerName: offer.name,
      amountCents: offer.price * 100,
      currency: 'USD',
      customerEmail: customerEmail || 'guest@mythra.com',
      customerName: customerName || 'Valued Guest',
      successUrl: successUrl || `${req.nextUrl.origin}/you/onboarding`,
      cancelUrl: cancelUrl || `${req.nextUrl.origin}/you`,
      metadata: {
        offerCode: offer.code,
        persona: offer.persona,
      },
    });

    return NextResponse.json({
      sessionId: session.sessionId,
      url: session.url,
      isMock: session.isMock,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error?.message || 'Checkout failed' }, { status: 500 });
  }
}
