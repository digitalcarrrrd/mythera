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
    const outboundWhopUrl =
      specificWhopUrl ||
      process.env.WHOP_CHECKOUT_URL ||
      process.env.PAYOUT_URL ||
      process.env.STRIPE_PAYOUT_URL ||
      process.env.NEXT_PUBLIC_PAYOUT_URL ||
      'https://whop.com';

    return NextResponse.json({
      sessionId: `whop_${Date.now()}`,
      url: outboundWhopUrl,
      isPayoutLink: true,
      offerCode: offerKey,
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error?.message || 'Checkout failed' }, { status: 500 });
  }
}
