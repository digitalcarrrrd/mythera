'use client';

import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQAccordionProps {
  title?: string;
  subtitle?: string;
  items: FAQItem[];
}

export default function FAQAccordion({
  title = 'FREQUENTLY ASKED QUESTIONS',
  subtitle = 'Clear answers regarding production, likeness authorization, revisions, and timelines.',
  items,
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 px-6 sm:px-8 bg-[#090909]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="eyebrow-text block mb-3">CLARITY & GOVERNANCE</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F0E8] uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-[#A7A39B] max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion list */}
        <div className="divide-y divide-[#262522] border-y border-[#262522]">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-6">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl font-medium text-[#F4F0E8] group-hover:text-[#C8965B] transition-colors">
                    {item.question}
                  </span>
                  <div className="w-7 h-7 rounded border border-[#262522] flex items-center justify-center text-[#A7A39B] group-hover:text-[#F4F0E8] shrink-0 transition-colors">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pr-12 text-sm text-[#A7A39B] leading-relaxed animate-in fade-in duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
