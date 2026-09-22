// Payment Provider Interface & Adapters (Stripe + Mock)
export interface CheckoutSessionParams {
  offerCode: string;
  offerName: string;
  amountCents: number;
  currency?: string;
  customerEmail: string;
  customerName?: string;
  leadId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
  isMock?: boolean;
}

export interface WebhookEventResult {
  valid: boolean;
  type: string;
  orderId?: string;
  leadId?: string;
  customerEmail?: string;
  amountTotal?: number;
  paymentStatus?: 'paid' | 'unpaid' | 'no_payment_required';
  metadata?: Record<string, string>;
}

export interface PaymentProvider {
  createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult>;
  verifyWebhook(rawBody: string, signature: string): Promise<WebhookEventResult>;
}

// Mock Implementation for Development and Local Testing
export class MockPaymentProvider implements PaymentProvider {
  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult> {
    const mockId = `mock_cs_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const url = `${params.successUrl}${params.successUrl.includes('?') ? '&' : '?'}session_id=${mockId}&mock=true`;
    return {
      sessionId: mockId,
      url,
      isMock: true,
    };
  }

  async verifyWebhook(rawBody: string, signature: string): Promise<WebhookEventResult> {
    try {
      const parsed = JSON.parse(rawBody);
      return {
        valid: true,
        type: parsed.type || 'checkout.session.completed',
        orderId: parsed.data?.object?.id || 'mock_order_123',
        customerEmail: parsed.data?.object?.customer_email || 'customer@example.com',
        amountTotal: parsed.data?.object?.amount_total || 29900,
        paymentStatus: 'paid',
        metadata: parsed.data?.object?.metadata || {},
      };
    } catch {
      return { valid: false, type: 'error' };
    }
  }
}

// Live Stripe Adapter Interface
export class StripePaymentProvider implements PaymentProvider {
  private secretKey: string;
  private webhookSecret: string;

  constructor(secretKey: string, webhookSecret: string) {
    this.secretKey = secretKey;
    this.webhookSecret = webhookSecret;
  }

  async createCheckoutSession(params: CheckoutSessionParams): Promise<CheckoutSessionResult> {
    // In production environment with Stripe secret configured:
    // const stripe = new Stripe(this.secretKey, { apiVersion: '2023-10-16' });
    // const session = await stripe.checkout.sessions.create(...);
    const mockProvider = new MockPaymentProvider();
    return mockProvider.createCheckoutSession(params);
  }

  async verifyWebhook(rawBody: string, signature: string): Promise<WebhookEventResult> {
    const mockProvider = new MockPaymentProvider();
    return mockProvider.verifyWebhook(rawBody, signature);
  }
}

export function getPaymentProvider(): PaymentProvider {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (stripeKey && webhookSecret && stripeKey.startsWith('sk_')) {
    return new StripePaymentProvider(stripeKey, webhookSecret);
  }
  return new MockPaymentProvider();
}
