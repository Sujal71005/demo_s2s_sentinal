import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const EDGE_FUNCTION_URL = SUPABASE_URL
  ? `${SUPABASE_URL}/functions/v1/earth-engine-flood`
  : null;

const OFFLINE_RESULT = {
  source: 'Google Earth Engine / Sentinel-1',
  satellite: 'Sentinel-1',
  sensor: 'SAR',
  location: 'Sangli, Maharashtra, India',
  date: '2019-08-14',
  acquisition: '2019-08-14 00:55 UTC',
  relativeOrbit: 136,
  orbitDirection: 'Descending',
  polarization: 'VV',
  thresholdDb: -17,
  potentialFloodedAreaKm2: 5.009394480398589,
  centroid: {
    longitude: 74.51427049360484,
    latitude: 16.916590928882822,
  },
  analysisType: 'SAR-based potential flood mask',
  preFloodComparisonAvailable: false,
  live: false,
  disclaimer:
    'This result represents a Sentinel-1 SAR-based potential flood mask. A suitable pre-flood Sentinel-1 image covering the exact Sangli study area was not available for July 2019; therefore this result should not be interpreted as before-vs-after change detection.',
  error: 'Edge Function unreachable — showing verified offline result.',
};

export async function GET() {
  if (!EDGE_FUNCTION_URL || !SUPABASE_ANON_KEY) {
    return NextResponse.json(
      {
        ...OFFLINE_RESULT,
        error:
          'Supabase URL or anon key not configured. Cannot reach Earth Engine Edge Function.',
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const res = await fetch(EDGE_FUNCTION_URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json(
        {
          ...OFFLINE_RESULT,
          error: `Edge Function returned HTTP ${res.status}${text ? `: ${text.slice(0, 200)}` : ''}. Showing verified offline result.`,
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    const data = await res.json();

    if (
      typeof data !== 'object' ||
      data === null ||
      typeof data.potentialFloodedAreaKm2 !== 'number'
    ) {
      return NextResponse.json(
        {
          ...OFFLINE_RESULT,
          error:
            'Edge Function returned unexpected data shape. Showing verified offline result.',
        },
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      );
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown proxy error';
    return NextResponse.json(
      {
        ...OFFLINE_RESULT,
        error: `Edge Function unreachable: ${message}. Showing verified offline result.`,
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}
