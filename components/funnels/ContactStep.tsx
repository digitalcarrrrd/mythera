'use client';

import React from 'react';
import { LeadContact } from '../../lib/lead-scoring';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';

export interface ContactStepProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  contact: LeadContact;
  onChange: (contact: LeadContact) => void;
  onSubmit: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  showOrganizationFields?: boolean;
}

export default function ContactStep({
  eyebrow = 'FINAL STEP · SECURE DISPATCH',
  title = 'WHERE SHOULD WE DELIVER YOUR RECOMMENDATION?',
  subtitle = 'We will analyze your requirements, calculate production feasibility, and dispatch your tailored roadmap.',
  contact,
  onChange,
  onSubmit,
  submitLabel = 'Generate My Production Recommendation',
  isSubmitting = false,
  showOrganizationFields = true,
}: ContactStepProps) {
  const handleChange = (field: keyof LeadContact, value: string | boolean) => {
    onChange({ ...contact, [field]: value });
  };

  const isFormValid =
    contact.firstName.trim().length > 0 &&
    contact.lastName.trim().length > 0 &&
    contact.email.includes('@') &&
    contact.email.includes('.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {eyebrow && <span className="eyebrow-text block mb-2">{eyebrow}</span>}
      <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#f3f3eb] mb-3 tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="text-sm text-[#a3a89e] mb-8">{subtitle}</p>}

      <div className="space-y-5 mb-8">
        {/* Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-1.5 font-semibold">
              First Name *
            </label>
            <input
              type="text"
              required
              value={contact.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder="e.g. Jordan"
              className="w-full bg-[#141714] border border-[#252a24] focus:border-[#d6e8aa] rounded-xl px-4 py-3.5 text-sm text-[#f3f3eb] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-1.5 font-semibold">
              Last Name *
            </label>
            <input
              type="text"
              required
              value={contact.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder="e.g. Hayes"
              className="w-full bg-[#141714] border border-[#252a24] focus:border-[#d6e8aa] rounded-xl px-4 py-3.5 text-sm text-[#f3f3eb] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Email & WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-1.5 font-semibold">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={contact.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="jordan@company.com"
              className="w-full bg-[#141714] border border-[#252a24] focus:border-[#d6e8aa] rounded-xl px-4 py-3.5 text-sm text-[#f3f3eb] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-1.5 font-semibold">
              WhatsApp / Phone (With Country Code)
            </label>
            <input
              type="tel"
              value={contact.whatsapp || ''}
              onChange={(e) => handleChange('whatsapp', e.target.value)}
              placeholder="+1 555 019 2834"
              className="w-full bg-[#141714] border border-[#252a24] focus:border-[#d6e8aa] rounded-xl px-4 py-3.5 text-sm text-[#f3f3eb] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Optional Organization / Website */}
        {showOrganizationFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-1.5 font-semibold">
                Company / Organization / Channel
              </label>
              <input
                type="text"
                value={contact.organization || ''}
                onChange={(e) => handleChange('organization', e.target.value)}
                placeholder="e.g. Nexus Studios / @ChannelName"
                className="w-full bg-[#141714] border border-[#252a24] focus:border-[#d6e8aa] rounded-xl px-4 py-3.5 text-sm text-[#f3f3eb] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-1.5 font-semibold">
                Your Role / Title
              </label>
              <input
                type="text"
                value={contact.role || ''}
                onChange={(e) => handleChange('role', e.target.value)}
                placeholder="e.g. Founder, CMO, Director"
                className="w-full bg-[#141714] border border-[#252a24] focus:border-[#d6e8aa] rounded-xl px-4 py-3.5 text-sm text-[#f3f3eb] outline-none transition-colors"
              />
            </div>
          </div>
        )}

        {/* Project Message */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-1.5 font-semibold">
            Concise Project Context or Notes
          </label>
          <textarea
            rows={3}
            value={contact.message || ''}
            onChange={(e) => handleChange('message', e.target.value)}
            placeholder="Tell us any specific story goals, deadline requirements, or creative ideas..."
            className="w-full bg-[#141714] border border-[#252a24] focus:border-[#d6e8aa] rounded-xl p-4 text-sm text-[#f3f3eb] outline-none resize-none transition-colors"
          />
        </div>

        {/* Marketing Consent Checkbox */}
        <label className="flex items-start gap-3 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={contact.consentMarketing || false}
            onChange={(e) => handleChange('consentMarketing', e.target.checked)}
            className="mt-1 rounded bg-[#141714] border-[#252a24] text-[#d6e8aa] focus:ring-0"
          />
          <span className="text-xs text-[#a3a89e] leading-relaxed">
            I agree to receive the personalized production brief and occasional studio insights from MYTHRA. (Unsubscribe anytime).
          </span>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#252a24]">
        <div className="flex items-center gap-2 text-xs text-[#727b66]">
          <Lock className="w-4 h-4 text-[#d6e8aa]" />
          <span>SSL 256-bit encrypted · Privacy guaranteed</span>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className={`btn-pill-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 ${
            !isFormValid || isSubmitting ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          <span>{isSubmitting ? 'Evaluating Requirements...' : submitLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
