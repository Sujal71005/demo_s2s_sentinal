<<<<<<< HEAD
import { NextResponse } from 'next/server';
=======
﻿/**
 * app/api/earth-engine/flood/route.ts
 *
 * GET  /api/earth-engine/flood?area=<id>
 *   Legacy endpoint — used by the Dashboard. Returns the existing single-image
 *   thresholding result for backwards compatibility.
 *
 * POST /api/earth-engine/flood
 *   New real bi-temporal change-detection endpoint — used by the Flood Analysis page.
 *   Body: FloodDetectionParams (JSON)
 *   Returns: RealFloodDetectionResponse
 *
 * Authentication is handled inside each lib function.
 * Neither endpoint falls back to fake/demo values on error.
 */

import { NextRequest, NextResponse } from 'next/server';
import { runFloodAnalysis } from '@/lib/earthengine/sangliFloodAnalysis';
import { getStudyArea } from '@/lib/earthengine/studyAreas';
import { runRealFloodDetection } from '@/lib/earthengine/realFloodDetection';
import type { FloodDetectionParams } from '@/lib/earthengine/realFloodDetection';
>>>>>>> fab0acf (adding SAR)

export const dynamic = 'force-dynamic';
export const revalidate = 0;
// Allow up to 120 seconds for EE processing
export const maxDuration = 120;

<<<<<<< HEAD
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
=======
// ---------------------------------------------------------------------------
// GET — Legacy / Dashboard endpoint
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const areaId = searchParams.get('area') || searchParams.get('id') || 'sangli';
  const studyArea = getStudyArea(areaId);

  try {
    const result = await runFloodAnalysis(studyArea.id);
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      {
        areaId: studyArea.id,
        source: 'Google Earth Engine / Sentinel-1',
        satellite: 'Sentinel-1',
        sensor: 'SAR',
        location: studyArea.name,
        region: studyArea.region,
        date: studyArea.floodDate,
        acquisition: `${studyArea.floodDate} 00:55 UTC`,
        relativeOrbit: studyArea.relativeOrbit,
        orbitDirection: studyArea.orbitDirection === 'DESCENDING' ? 'Descending' : 'Ascending',
        polarization: studyArea.polarization,
        thresholdDb: studyArea.thresholdDb,
        potentialFloodedAreaKm2: studyArea.estimatedAreaKm2,
        centroid: { longitude: studyArea.centerLon, latitude: studyArea.centerLat },
        analysisType: 'SAR-based potential flood mask',
        preFloodComparisonAvailable: false,
        live: false,
        disclaimer: 'Server error occurred. Showing area metadata only.',
        error: `Server error: ${message}`,
>>>>>>> fab0acf (adding SAR)
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }
}

// ---------------------------------------------------------------------------
// POST — Real bi-temporal change-detection endpoint
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  let body: Partial<FloodDetectionParams>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body.' },
      { status: 400 }
    );
  }

  // Validate required fields
  const { areaId, preStartDate, preEndDate, postStartDate, postEndDate } = body;

  if (!areaId) {
    return NextResponse.json(
      { success: false, error: 'Missing required field: areaId' },
      { status: 400 }
    );
  }
  if (!preStartDate || !preEndDate || !postStartDate || !postEndDate) {
    return NextResponse.json(
      {
        success: false,
        error: 'Missing required date fields: preStartDate, preEndDate, postStartDate, postEndDate',
      },
      { status: 400 }
    );
  }

  try {
    const result = await runRealFloodDetection({
      areaId,
      preStartDate,
      preEndDate,
      postStartDate,
      postEndDate,
      polarization: body.polarization ?? 'VV',
      threshold: typeof body.threshold === 'number' ? body.threshold : -1.5,
      minAreaM2: typeof body.minAreaM2 === 'number' ? body.minAreaM2 : 100000,
    });

    // Return 200 even for application-level errors so the client can read the error field
    return NextResponse.json(result, {
      status: 200,
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return NextResponse.json(
      { success: false, live: false, error: `Unexpected server error: ${message}` },
      { status: 500 }
    );
  }
}
