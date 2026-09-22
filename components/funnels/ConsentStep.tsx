'use client';

import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, ArrowRight } from 'lucide-react';

export interface ConsentFormData {
  subjectName: string;
  relationship: 'self' | 'authorized_adult' | 'child_guardian';
  likenessAuthorized: boolean;
  voiceAuthorized: boolean;
  commercialUseAuthorized: boolean;
  modelTrainingOptIn: boolean;
  disclosureAcknowledged: boolean;
}

interface ConsentStepProps {
  formData: ConsentFormData;
  onChange: (data: ConsentFormData) => void;
  onNext: () => void;
  requireVoice?: boolean;
}

export default function ConsentStep({
  formData,
  onChange,
  onNext,
  requireVoice = false,
}: ConsentStepProps) {
  const updateField = (field: keyof ConsentFormData, value: unknown) => {
    onChange({ ...formData, [field]: value });
  };

  const isComplete =
    formData.subjectName.trim().length > 0 &&
    formData.likenessAuthorized &&
    formData.disclosureAcknowledged &&
    (!requireVoice || formData.voiceAuthorized);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="w-4 h-4 text-[#d8ff44]" />
        <span className="eyebrow-text text-[#d8ff44]">LEGAL & ETHICAL CONSENT VERIFICATION</span>
      </div>
      <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#f3f3eb] mb-3 tracking-tight">
        AUTHORIZATION & LIKENESS PROTOCOL
      </h2>
      <p className="text-sm text-[#a3a89e] mb-8">
        MYTHRA strictly requires legal consent for any individual depicted. Your digital assets remain private and will never be shared or used to train public AI models.
      </p>

      <div className="space-y-6 mb-8">
        {/* Depicted Person's Name */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-1.5 font-semibold">
            Full Legal Name of Depicted Star *
          </label>
          <input
            type="text"
            required
            value={formData.subjectName}
            onChange={(e) => updateField('subjectName', e.target.value)}
            placeholder="e.g. Marcus Vance"
            className="w-full bg-[#0d100c] border border-[#ffffff15] focus:border-[#d8ff44] rounded-xl px-4 py-3.5 text-sm text-[#f3f3eb] outline-none transition-colors"
          />
        </div>

        {/* Depicted Relationship */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-[#a3a89e] mb-2 font-semibold">
            Authorization Relationship *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'self', label: 'I am the depicted adult', desc: 'Starring myself' },
              { id: 'authorized_adult', label: 'Consenting Adult', desc: 'I have written permission' },
              { id: 'child_guardian', label: 'Parent / Legal Guardian', desc: 'Under 18 with guardian consent' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => updateField('relationship', r.id)}
                className={`text-left p-4 rounded-xl border transition-all text-xs ${
                  formData.relationship === r.id
                    ? 'bg-[#11160e] border-[#d8ff44] text-[#f3f3eb] ring-2 ring-[#d8ff44]/40'
                    : 'bg-[#0d100c] border-[#ffffff15] text-[#a3a89e] hover:border-[#384036]'
                }`}
              >
                <strong className="block text-[#f3f3eb] mb-1 text-sm">{r.label}</strong>
                <span>{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Checkbox Group */}
        <div className="p-6 rounded-2xl bg-[#0d100c] border border-[#ffffff15] space-y-4 text-xs">
          {/* Likeness Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.likenessAuthorized}
              onChange={(e) => updateField('likenessAuthorized', e.target.checked)}
              className="mt-0.5 rounded bg-[#000000] border-[#ffffff15] text-[#d8ff44] focus:ring-0"
            />
            <span className="text-[#f3f3eb] leading-relaxed">
              <strong>Explicit Likeness Authorization (Required):</strong> I authorize MYTHRA to generate cinematic images and video scenes depicting the authorized subject solely for this film project.
            </span>
          </label>

          {/* Voice Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.voiceAuthorized}
              onChange={(e) => updateField('voiceAuthorized', e.target.checked)}
              className="mt-0.5 rounded bg-[#000000] border-[#ffffff15] text-[#d8ff44] focus:ring-0"
            />
            <span className="text-[#f3f3eb] leading-relaxed">
              <strong>Voice Synthesis Authorization (Optional/Tier Dependent):</strong> I grant permission for MYTHRA to synthesize and match dialogue to the authorized voice sample provided.
            </span>
          </label>

          {/* AI Disclosure Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={formData.disclosureAcknowledged}
              onChange={(e) => updateField('disclosureAcknowledged', e.target.checked)}
              className="mt-0.5 rounded bg-[#000000] border-[#ffffff15] text-[#d8ff44] focus:ring-0"
            />
            <span className="text-[#f3f3eb] leading-relaxed">
              <strong>AI & Creative Stylization Disclosure (Required):</strong> I understand MYTHRA creates dramatic cinematic interpretations and does not guarantee counterfeit photorealism. Prohibited uses (deepfakes of non-consenting public figures, fraud, or defamation) will result in immediate termination with no refund.
            </span>
          </label>

          {/* Non-training Opt-in */}
          <label className="flex items-start gap-3 cursor-pointer pt-3 border-t border-[#ffffff15]">
            <input
              type="checkbox"
              checked={formData.modelTrainingOptIn}
              onChange={(e) => updateField('modelTrainingOptIn', e.target.checked)}
              className="mt-0.5 rounded bg-[#000000] border-[#ffffff15] text-[#d8ff44] focus:ring-0"
            />
            <span className="text-[#a3a89e] leading-relaxed">
              (Optional) I explicitly opt-in to allowing MYTHRA research team to refine internal visual consistency models on these project stills. (Default is OFF).
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-[#ffffff15]">
        <button
          type="button"
          disabled={!isComplete}
          onClick={onNext}
          className={`btn-pill-primary inline-flex items-center gap-2 ${
            !isComplete ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          <span>Sign & Proceed to Onboarding</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
