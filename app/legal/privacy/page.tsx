import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 px-6 sm:px-8 bg-[#090909] text-[#F4F0E8]">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#A7A39B] hover:text-[#C8965B] mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Studio
        </Link>

        <h1 className="font-serif text-3xl sm:text-5xl font-bold uppercase mb-4">
          PRIVACY & BIOMETRIC DATA POLICY
        </h1>
        <p className="text-xs text-[#A7A39B] mb-12">
          Last Updated: August 2026 &bull; GDPR & CCPA Compliant
        </p>

        <div className="space-y-8 text-xs sm:text-sm text-[#A7A39B] leading-relaxed border-t border-[#1C1B19] pt-8">
          <p>
            MYTHRA Studio Inc. (&ldquo;MYTHRA&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;) is committed to the highest standards of biometric privacy and data protection. This Privacy Policy details how we collect, process, store, and delete media files submitted through our personalized cinema and B2B production funnels.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#F4F0E8] mt-6">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Contact Information:</strong> Name, email address, country, WhatsApp/phone number, and company information.</li>
            <li><strong>Project Briefs:</strong> Creative story parameters, scripts, and production preferences.</li>
            <li><strong>Biometric Reference Media:</strong> Photographs and voice samples provided exclusively for generating authorized film scenes.</li>
          </ul>

          <h2 className="font-serif text-xl font-bold text-[#F4F0E8] mt-6">2. Purpose Limitation</h2>
          <p>
            Reference media is used solely for the discrete production of your commissioned film order. We do not sell, rent, or trade personal data or biometric assets to any third party for advertising or model training purposes.
          </p>

          <h2 className="font-serif text-xl font-bold text-[#F4F0E8] mt-6">3. Data Retention & Deletion Windows</h2>
          <p>
            By default, all raw reference photos and audio clips are scheduled for automated deletion 30 days after final film delivery. Customers may select immediate purge upon delivery in their onboarding settings or contact privacy@mythra.com to trigger instant deletion.
          </p>
        </div>
      </div>
    </div>
  );
}
