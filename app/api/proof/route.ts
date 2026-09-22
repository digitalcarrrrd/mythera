import { NextRequest, NextResponse } from 'next/server';
import { mythraProof, getPublicProofMetrics } from '../../../lib/proof';

export async function GET(req: NextRequest) {
  const showAll = req.nextUrl.searchParams.get('admin') === 'true';
  const metrics = getPublicProofMetrics(!showAll);

  return NextResponse.json({
    metrics,
    fullConfig: showAll ? mythraProof : undefined,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, any>;
    const { key, verified, evidenceUrl, evidenceRef } = body;

    if (!key || !(key in mythraProof)) {
      return NextResponse.json({ error: 'Invalid proof metric key' }, { status: 400 });
    }

    // Update in-memory proof configuration
    const metric = mythraProof[key as keyof typeof mythraProof];
    if (metric) {
      if (typeof verified === 'boolean') metric.verified = verified;
      if (evidenceUrl) metric.evidenceUrl = evidenceUrl;
      if (evidenceRef) metric.evidenceRef = evidenceRef;
      metric.lastAudited = new Date().toISOString().split('T')[0];
    }

    return NextResponse.json({
      success: true,
      updatedMetric: metric,
    });
  } catch (error: any) {
    console.error('Proof update error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to update proof' }, { status: 500 });
  }
}
