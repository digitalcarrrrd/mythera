'use client';

import React from 'react';
import { Check } from 'lucide-react';

export interface OptionCard {
  id: string;
  title: string;
  description?: string;
  badge?: string;
}

interface SingleChoiceStepProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  options: OptionCard[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  onNext?: () => void;
}

export default function SingleChoiceStep({
  eyebrow,
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
  onNext,
}: SingleChoiceStepProps) {
  const handleOptionClick = (id: string) => {
    onSelect(id);
    if (onNext) {
      setTimeout(() => onNext(), 150);
    }
  };

  return (
    <div>
      {eyebrow && <span className="eyebrow-text block mb-2">{eyebrow}</span>}
      <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#f3f3eb] mb-3 tracking-tight">
        {title}
      </h2>
      {subtitle && <p className="text-sm text-[#a3a89e] mb-8">{subtitle}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedValue === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleOptionClick(option.id)}
              className={`text-left p-6 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#11160e] border-[#d8ff44] ring-2 ring-[#d8ff44]/50 shadow-[0_4px_20px_rgba(216,255,68,0.2)]'
                  : 'bg-[#0d100c] border-[#ffffff15] hover:border-[#d8ff44]/40 hover:bg-[#121611]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-serif text-lg font-bold text-[#f3f3eb]">
                    {option.title}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#d8ff44] flex items-center justify-center text-[#000000]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  {option.badge && !isSelected && (
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-[#1a1e19] text-[#a3a89e] px-2.5 py-1 rounded-full border border-[#ffffff10]">
                      {option.badge}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="text-xs text-[#a3a89e] leading-relaxed">
                    {option.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
