import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '../../../../lib/adapters/payment';
import { db } from '../../../../db';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature') || '';

    const payment = getPaymentProvider();
    const verifiedEvent = await payment.verifyWebhook(rawBody, signature);

    if (!verifiedEvent.valid) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const idempotencyKey = `wh_${verifiedEvent.type}_${verifiedEvent.orderId || Date.now()}`;

    // Check duplicate webhook handling
    const existing = db.store.orders.find((o) => o.stripeSessionId === verifiedEvent.orderId);
    if (existing) {
      return NextResponse.json({ message: 'Order already processed (idempotent)', orderId: existing.id });
    }

    // Create Order Record
    const newOrderId = `ord_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    db.store.orders.push({
      id: newOrderId,
      userId: `usr_${Date.now()}`,
      leadId: verifiedEvent.leadId || null,
      offerCode: verifiedEvent.metadata?.offerCode || 'MYTHRA_TRAILER',
      amount: verifiedEvent.amountTotal || 29900,
      currency: 'USD',
      paymentStatus: 'paid',
      productionStatus: 'onboarding_pending',
      dueDate: new Date(Date.now() + 10 * 86400000).toISOString(),
      stripeSessionId: verifiedEvent.orderId || null,
      stripeCustomerId: null,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderId: newOrderId,
    });
  } catch (error: any) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: error?.message || 'Webhook processing failed' }, { status: 500 });
  }
}
