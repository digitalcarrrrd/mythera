// Transactional Email Provider Interface & Adapters (Resend + Mock)
export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  isMock?: boolean;
}

export interface EmailProvider {
  sendEmail(params: SendEmailParams): Promise<SendEmailResult>;
}

export class MockEmailProvider implements EmailProvider {
  async sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
    console.log(`[Mock Email] Sent to ${params.to} | Subject: "${params.subject}"`);
    return {
      success: true,
      messageId: `mock_msg_${Date.now()}`,
      isMock: true,
    };
  }
}

export function getEmailProvider(): EmailProvider {
  return new MockEmailProvider();
}

export function renderWelcomeTemplate(name: string, offerName: string, onboardingUrl?: string): string {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #090909; color: #F4F0E8; padding: 40px 30px; border-radius: 4px;">
      <h1 style="color: #C8965B; font-size: 24px; letter-spacing: 0.05em; text-transform: uppercase;">MYTHRA STUDIO</h1>
      <p style="font-size: 16px; line-height: 1.6; color: #A7A39B; margin-top: 20px;">
        Hello ${name},
      </p>
      <p style="font-size: 16px; line-height: 1.6; color: #F4F0E8;">
        Your order for <strong>${offerName}</strong> is confirmed and entered into the production queue.
      </p>
      ${
        onboardingUrl
          ? `<p style="margin-top: 30px;">
              <a href="${onboardingUrl}" style="display: inline-block; background: #C8965B; color: #090909; padding: 14px 28px; text-decoration: none; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; font-size: 14px;">
                Complete Secure Onboarding & Upload Assets &rarr;
              </a>
            </p>`
          : ''
      }
      <p style="font-size: 13px; line-height: 1.6; color: #727b66; margin-top: 40px; border-top: 1px solid #222; padding-top: 20px;">
        MYTHRA AI-Native Film Studio · Private & Encrypted · Strict Likeness Protection
      </p>
    </div>
  `;
}
