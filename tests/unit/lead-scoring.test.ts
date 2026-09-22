import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateLead } from '../../lib/lead-scoring';

describe('Lead Scoring Engine', () => {
  it('should score high-budget enterprise studios as priority leads (50+ pts)', () => {
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

  it('should score standard trailer personal leads accurately', () => {
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

  it('should route beginner filmmakers to Starter or Cohort', () => {
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
});
