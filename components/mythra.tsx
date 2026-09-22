'use client';

import React from 'react';
import GlobalNav from './GlobalNav';

export { default as CinematicHero } from './CinematicHero';
export { default as GlobalNav } from './GlobalNav';
export { default as PathSelector } from './PathSelector';
export { default as ProofMetric } from './ProofMetric';
export { default as FilmGallery } from './FilmGallery';
export { default as OfferCard } from './OfferCard';
export { default as TrustPanel } from './TrustPanel';
export { default as FAQAccordion } from './FAQAccordion';
export { default as StickyMobileCTA } from './StickyMobileCTA';

export function Header() {
  return <GlobalNav />;
}

export function Funnel() {
  return null;
}

export function Result() {
  return null;
}

export function TestDashboard() {
  return null;
}
