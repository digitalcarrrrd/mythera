import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getPublicProofMetrics, mythraProof } from '../../lib/proof';

describe('Proof Gating & Truth Controls', () => {
  it('should only return verified metrics when requireVerified is true', () => {
    const publicMetrics = getPublicProofMetrics(true);
    publicMetrics.forEach((metric) => {
      assert.equal(metric.verified, true);
      assert.ok(metric.evidenceRef || metric.evidenceUrl);
    });
  });

  it('should separate official owned channels from observed ecosystem reach', () => {
    const ecosystem = mythraProof.ecosystemTranslatedViews;
    assert.equal(ecosystem.category, 'observed_ecosystem');
    assert.ok(ecosystem.methodologyNote?.includes('Observed public video view counts'));
  });
});
