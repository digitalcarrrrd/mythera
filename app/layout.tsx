import type { Metadata } from 'next';
import './globals.css';
import GlobalNav from '../components/GlobalNav';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MYTHRA — AI-Native Film & Drama Studio',
  description:
    'Stories anyone can enter. Studios anyone can build. Films brands can own. Original AI-native cinema, personalized films, and filmmaker education.',
  metadataBase: new URL('https://mythra.com'),
  openGraph: {
    title: 'MYTHRA — AI-Native Film & Drama Studio',
    description: 'Original films, personalized cinema and the production system behind a one-person studio.',
    url: 'https://mythra.com',
    siteName: 'MYTHRA Studio',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col justify-between bg-[#000000] text-[#F4F0E8] antialiased">
        {/* Subtle Film Grain Texture Overlay */}
        <div className="film-grain" />

        {/* Global Navigation Bar */}
        <GlobalNav />

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Cinematic Master Footer */}
        <footer className="border-t border-[#ffffff15] bg-[#000000] pt-16 pb-12 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <a href="/" className="font-serif text-2xl font-bold tracking-tight text-[#F4F0E8] hover:text-[#d8ff44] transition-colors">
                MYTHRA
              </a>
              <p className="text-xs text-[#A7A39B] max-w-sm leading-relaxed">
                An original AI-native story studio. We do not use AI to imitate legacy studios more cheaply; we redesign how stories are created, tested, and localized across global audiences.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#8e9587]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d8ff44]" />
                <span>Zero model training on customer likeness by default.</span>
              </div>
            </div>

            {/* Path 1: For You */}
            <div className="space-y-3">
              <span className="film-credit block text-[#d8ff44]">MYTHRA YOU</span>
              <ul className="space-y-2 text-xs text-[#A7A39B]">
                <li><a href="/you" className="hover:text-[#d8ff44] transition-colors">Personalized Cinema</a></li>
                <li><a href="/you/start?tier=you-trailer" className="hover:text-[#d8ff44] transition-colors">Create Movie Trailer ($299)</a></li>
                <li><a href="/you/start?tier=you-moment" className="hover:text-[#d8ff44] transition-colors">Mythra Moment ($79)</a></li>
                <li><a href="/you/start?tier=you-story" className="hover:text-[#d8ff44] transition-colors">Bespoke Short Film</a></li>
                <li><a href="/legal/likeness-consent" className="hover:text-[#d8ff44] transition-colors">Likeness Consent Policy</a></li>
              </ul>
            </div>

            {/* Path 2: Filmmaker */}
            <div className="space-y-3">
              <span className="film-credit block text-[#d8ff44]">MYTHRA FILMMAKER</span>
              <ul className="space-y-2 text-xs text-[#A7A39B]">
                <li><a href="/filmmaker" className="hover:text-[#d8ff44] transition-colors">One-Person Studio System</a></li>
                <li><a href="/filmmaker/start?tier=film-cohort" className="hover:text-[#d8ff44] transition-colors">6-Week Live Cohort ($749)</a></li>
                <li><a href="/filmmaker/start?tier=film-blueprint" className="hover:text-[#d8ff44] transition-colors">Free Studio Blueprint</a></li>
                <li><a href="/filmmaker/start?tier=film-starter" className="hover:text-[#d8ff44] transition-colors">Self-Paced Starter ($149)</a></li>
                <li><a href="/method" className="hover:text-[#d8ff44] transition-colors">The 12-Step Drama Method</a></li>
              </ul>
            </div>

            {/* Path 3: Studios & Governance */}
            <div className="space-y-3">
              <span className="film-credit block text-[#d8ff44]">STUDIOS & GOVERNANCE</span>
              <ul className="space-y-2 text-xs text-[#A7A39B]">
                <li><a href="/studios" className="hover:text-[#d8ff44] transition-colors">Branded Drama & Original IP</a></li>
                <li><a href="/genesis" className="hover:text-[#d8ff44] transition-colors">Genesis Case Study</a></li>
                <li><a href="/stories" className="hover:text-[#d8ff44] transition-colors">Portfolio & Originals</a></li>
                <li><a href="/legal/privacy" className="hover:text-[#d8ff44] transition-colors">Privacy & Data Retention</a></li>
                <li><a href="/legal/terms" className="hover:text-[#d8ff44] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright & admin portal trigger */}
          <div className="max-w-7xl mx-auto border-t border-[#ffffff15] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#8e9587]">
            <div>
              &copy; {new Date().getFullYear()} MYTHRA Studio Inc. All rights reserved. Registered AI-Native Cinema Network.
            </div>
            <div className="flex items-center gap-6">
              <a href="/legal/privacy" className="hover:text-[#d8ff44] transition-colors">Privacy Policy</a>
              <a href="/legal/terms" className="hover:text-[#d8ff44] transition-colors">Terms of Service</a>
              <a href="/admin/funnel-test" className="text-[#A7A39B] hover:text-[#d8ff44] flex items-center gap-1 transition-colors">
                <ShieldCheck className="w-3 h-3 text-[#d8ff44]" /> Admin Suite
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
