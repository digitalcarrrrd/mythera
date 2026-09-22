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
                  ? 'bg-[#1e231e] border-[#d6e8aa] ring-2 ring-[#d6e8aa]/50 shadow-[0_4px_20px_rgba(214,232,170,0.15)]'
                  : 'bg-[#141714] border-[#252a24] hover:border-[#384036] hover:bg-[#181d18]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-serif text-lg font-bold text-[#f3f3eb]">
                    {option.title}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#d6e8aa] flex items-center justify-center text-[#11160e]">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                  {option.badge && !isSelected && (
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-[#252a24] text-[#a3a89e] px-2.5 py-1 rounded-full">
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
