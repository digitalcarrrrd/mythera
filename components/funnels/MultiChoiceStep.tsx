'use client';

import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export interface MultiOption {
  id: string;
  label: string;
  desc?: string;
}

interface MultiChoiceStepProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  options: MultiOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  onNext: () => void;
  minSelections?: number;
}

export default function MultiChoiceStep({
  eyebrow,
  title,
  subtitle,
  options,
  selectedValues = [],
  onChange,
  onNext,
  minSelections = 1,
}: MultiChoiceStepProps) {
  const toggleOption = (id: string) => {
    if (selectedValues.includes(id)) {
      onChange(selectedValues.filter((v) => v !== id));
    } else {
      onChange([...selectedValues, id]);
    }
  };

  const isValid = selectedValues.length >= minSelections;

  return (
    <div>
      {eyebrow && <span className="eyebrow-text block mb-2">{eyebrow}</span>}
      <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#f3f3eb] mb-3 tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="text-sm text-[#a3a89e] mb-8">{subtitle}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {options.map((opt) => {
          const isSelected = selectedValues.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption(opt.id)}
              className={`text-left p-5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                isSelected
                  ? 'bg-[#11160e] border-[#d8ff44] ring-2 ring-[#d8ff44]/40 shadow-[0_4px_16px_rgba(216,255,68,0.2)]'
                  : 'bg-[#0d100c] border-[#ffffff15] hover:border-[#d8ff44]/40 hover:bg-[#121611]'
              }`}
            >
              <div>
                <span className="text-sm font-semibold text-[#f3f3eb] block">
                  {opt.label}
                </span>
                {opt.desc && (
                  <span className="text-xs text-[#a3a89e] block mt-1">
                    {opt.desc}
                  </span>
                )}
              </div>
              <div
                className={`w-6 h-6 rounded-lg shrink-0 border flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[#d8ff44] border-[#d8ff44] text-[#000000]'
                    : 'border-[#384036] bg-[#000000]'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end pt-4 border-t border-[#ffffff15]">
        <button
          type="button"
          disabled={!isValid}
          onClick={onNext}
          className={`btn-pill-primary inline-flex items-center gap-2 ${
            !isValid ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
