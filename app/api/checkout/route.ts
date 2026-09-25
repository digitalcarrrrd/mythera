import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '../../../lib/adapters/payment';
import { mythraOffers } from '../../../lib/offers';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, any>;
    const { offerCode, customerEmail, customerName, successUrl, cancelUrl } = body;

    // Check for product-specific Whop checkout link or global payout URL
    const offerKey = String(offerCode || '').toUpperCase().replace(/-/g, '_');
    const specificWhopUrl = process.env[`WHOP_URL_${offerKey}`];
    const globalPayoutUrl =
      specificWhopUrl ||
      process.env.WHOP_CHECKOUT_URL ||
      process.env.PAYOUT_URL ||
      process.env.STRIPE_PAYOUT_URL ||
      process.env.NEXT_PUBLIC_PAYOUT_URL;

    if (globalPayoutUrl) {
      return NextResponse.json({
        sessionId: `whop_${Date.now()}`,
        url: globalPayoutUrl,
        isPayoutLink: true,
      });
    }

    // Find offer by code or ID across all paths (YOU, CAST, FILMMAKER, STUDIOS)
    const allOffers = [
      ...mythraOffers.you,
      ...mythraOffers.cast,
      ...mythraOffers.filmmaker,
      ...mythraOffers.studios,
    ];
    const offer =
      allOffers.find((o) => o.code === offerCode || o.id === offerCode) ||
      mythraOffers.you[1]; // default Trailer

    // Return the dedicated /checkout dummy checkout link
    const dummyCheckoutUrl = `${req.nextUrl.origin}/checkout?tier=${offer.id}&code=${offer.code}&email=${encodeURIComponent(customerEmail || '')}&name=${encodeURIComponent(customerName || '')}`;

    return NextResponse.json({
      sessionId: `dummy_${Date.now()}`,
      url: dummyCheckoutUrl,
      isMock: true,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error?.message || 'Checkout failed' }, { status: 500 });
  }
}
