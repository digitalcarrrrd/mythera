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
    <section className="py-20 px-6 sm:px-8 bg-background border-t border-[var(--border-subtle)]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="eyebrow-text block mb-3 text-primary">CLARITY & GOVERNANCE</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground uppercase">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Accordion list */}
        <div className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
          {items.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-6">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between gap-4 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl font-medium text-foreground group-hover:text-primary transition-colors">
                    {item.question}
                  </span>
                  <div className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'border-primary text-primary bg-primary/10' : 'border-border text-muted-foreground group-hover:text-foreground'
                  }`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-4 pr-12 text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-200">
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
