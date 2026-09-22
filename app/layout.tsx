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
      <body className="min-h-screen flex flex-col justify-between bg-[#090909] text-[#F4F0E8] antialiased">
        {/* Subtle Film Grain Texture Overlay */}
        <div className="film-grain" />

        {/* Global Navigation Bar */}
        <GlobalNav />

        {/* Page Content */}
        <main className="flex-1">{children}</main>

        {/* Cinematic Master Footer */}
        <footer className="border-t border-[#1C1B19] bg-[#090909] pt-16 pb-12 px-6 sm:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2 space-y-4">
              <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#F4F0E8] hover:text-[#C8965B] transition-colors">
                MYTHRA
              </Link>
              <p className="text-xs text-[#A7A39B] max-w-sm leading-relaxed">
                An original AI-native story studio. We do not use AI to imitate legacy studios more cheaply; we redesign how stories are created, tested, and localized across global audiences.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-[#727b66]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C8965B]" />
                <span>Zero model training on customer likeness by default.</span>
              </div>
            </div>

            {/* Path 1: For You */}
            <div className="space-y-3">
              <span className="film-credit block text-[#C8965B]">MYTHRA YOU</span>
              <ul className="space-y-2 text-xs text-[#A7A39B]">
                <li><Link href="/you" className="hover:text-white transition-colors">Personalized Cinema</Link></li>
                <li><Link href="/you/start?tier=you-trailer" className="hover:text-white transition-colors">Create Movie Trailer ($299)</Link></li>
                <li><Link href="/you/start?tier=you-moment" className="hover:text-white transition-colors">Mythra Moment ($79)</Link></li>
                <li><Link href="/you/start?tier=you-story" className="hover:text-white transition-colors">Bespoke Short Film</Link></li>
                <li><Link href="/legal/likeness-consent" className="hover:text-white transition-colors">Likeness Consent Policy</Link></li>
              </ul>
            </div>

            {/* Path 2: Filmmaker */}
            <div className="space-y-3">
              <span className="film-credit block text-[#C8965B]">MYTHRA FILMMAKER</span>
              <ul className="space-y-2 text-xs text-[#A7A39B]">
                <li><Link href="/filmmaker" className="hover:text-white transition-colors">One-Person Studio System</Link></li>
                <li><Link href="/filmmaker/start?tier=film-cohort" className="hover:text-white transition-colors">6-Week Live Cohort ($749)</Link></li>
                <li><Link href="/filmmaker/start?tier=film-blueprint" className="hover:text-white transition-colors">Free Studio Blueprint</Link></li>
                <li><Link href="/filmmaker/start?tier=film-starter" className="hover:text-white transition-colors">Self-Paced Starter ($149)</Link></li>
                <li><Link href="/method" className="hover:text-white transition-colors">The 12-Step Drama Method</Link></li>
              </ul>
            </div>

            {/* Path 3: Studios & Legal */}
            <div className="space-y-3">
              <span className="film-credit block text-[#C8965B]">STUDIOS & GOVERNANCE</span>
              <ul className="space-y-2 text-xs text-[#A7A39B]">
                <li><Link href="/studios" className="hover:text-white transition-colors">Branded Drama & Original IP</Link></li>
                <li><Link href="/genesis" className="hover:text-white transition-colors">Genesis Case Study</Link></li>
                <li><Link href="/stories" className="hover:text-white transition-colors">Portfolio & Originals</Link></li>
                <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy & Data Retention</Link></li>
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright & admin portal trigger */}
          <div className="max-w-7xl mx-auto border-t border-[#1C1B19] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#727b66]">
            <div>
              &copy; {new Date().getFullYear()} MYTHRA Studio Inc. All rights reserved. Registered AI-Native Cinema Network.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/legal/privacy" className="hover:underline">Privacy Policy</Link>
              <Link href="/legal/terms" className="hover:underline">Terms of Service</Link>
              <Link href="/admin/funnel-test" className="text-[#A7A39B] hover:text-[#C8965B] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Admin Suite
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
