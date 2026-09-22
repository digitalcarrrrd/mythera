import { evaluateLead } from '../lib/lead-scoring.ts';
import { getPublicProofMetrics, mythraProof } from '../lib/proof.ts';
import { validateUploadFile } from '../lib/adapters/storage.ts';
import assert from 'node:assert/strict';

console.log('🧪 RUNNING MYTHRA TEST SUITE...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
    failed++;
  }
}

// 1. Lead Scoring Engine Tests
console.log('--- 1. LEAD SCORING & CRM TAG GENERATION ---');
test('Scores enterprise studio leads as priority (50+ pts) with correct tags', () => {
  const result = evaluateLead(
    'STUDIOS',
    {
      branch: 'brand',
      budget: '$75K+',
      timeline: 'Within 60 days',
      isDecisionMaker: true,
      audienceSize: '10M+',
      stage: 'Script ready',
    },
    {
      firstName: 'Marcus',
      lastName: 'Sterling',
      email: 'marcus@solisglobal.com',
      organization: 'Solis Global Automotive',
      role: 'VP Brand Marketing',
      message: 'Looking to produce a comprehensive branded short film campaign with international distribution.',
    }
  );

  assert.ok(result.score >= 50, `Expected score >= 50, got ${result.score}`);
  assert.equal(result.category, 'priority');
  assert.ok(result.tags.includes('MYTHRA_STUDIOS'));
  assert.ok(result.tags.includes('MYTHRA_STUDIOS_BRAND'));
  assert.ok(result.tags.includes('MYTHRA_PRIORITY'));
  assert.equal(result.recommendedOffer.persona, 'STUDIOS');
});

test('Correctly tags and recommends YOU Trailer tier', () => {
  const result = evaluateLead(
    'YOU',
    {
      format: 'Trailer',
      star: 'Me',
      genre: 'Sci-fi',
    },
    {
      firstName: 'Elena',
      lastName: 'Vance',
      email: 'elena@gmail.com',
    }
  );

  assert.ok(result.tags.includes('MYTHRA_YOU'));
  assert.ok(result.tags.includes('MYTHRA_YOU_TRAILER'));
  assert.equal(result.recommendedOffer.code, 'MYTHRA_TRAILER');
});

test('Correctly tags beginner filmmaker leads', () => {
  const result = evaluateLead(
    'FILMMAKER',
    {
      currentStage: 'Beginner',
      timeCommitment: '5–10 hrs/week',
      biggestBlock: 'Character consistency',
    },
    {
      firstName: 'Alex',
      lastName: 'Rivers',
      email: 'alex@creator.org',
    }
  );

  assert.ok(result.tags.includes('MYTHRA_FILMMAKER'));
  assert.ok(result.tags.includes('MYTHRA_FILMMAKER_BEGINNER'));
});

// 2. Truth Controls & Proof Gating Tests
console.log('\n--- 2. PROOF GATING & TRUTH CONTROLS ---');
test('Only returns verified metrics for public rendering by default', () => {
  const publicMetrics = getPublicProofMetrics(true);
  publicMetrics.forEach((metric) => {
    assert.equal(metric.verified, true);
    assert.ok(metric.evidenceRef || metric.evidenceUrl);
  });
});

test('Separates official owned channels from observed ecosystem reach', () => {
  const ecosystem = mythraProof.ecosystemTranslatedViews;
  assert.equal(ecosystem.category, 'observed_ecosystem');
  assert.ok(ecosystem.methodologyNote.includes('Observed public video view counts'));
});

// 3. Biometric Validation Tests
console.log('\n--- 3. LIKENESS & BIOMETRIC MEDIA VALIDATION ---');
test('Accepts valid JPEG/PNG photos under 15MB', () => {
  const mockFile = {
    name: 'portrait.jpg',
    type: 'image/jpeg',
    size: 5 * 1024 * 1024,
  };
  const res = validateUploadFile(mockFile, 'likeness_photo');
  assert.equal(res.valid, true);
});

test('Rejects non-image files for likeness photo', () => {
  const mockFile = {
    name: 'document.pdf',
    type: 'application/pdf',
    size: 1 * 1024 * 1024,
  };
  const res = validateUploadFile(mockFile, 'likeness_photo');
  assert.equal(res.valid, false);
});

test('Accepts clean audio for voice samples under 30MB', () => {
  const mockFile = {
    name: 'voice.wav',
    type: 'audio/wav',
    size: 10 * 1024 * 1024,
  };
  const res = validateUploadFile(mockFile, 'voice_sample');
  assert.equal(res.valid, true);
});

console.log(`\n========================================`);
console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
