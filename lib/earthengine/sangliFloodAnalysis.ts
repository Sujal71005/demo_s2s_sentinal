import type { SatelliteAnalysis } from '@/types/satellite';

export interface EarthEngineFloodResponse {
  source: string;
  satellite: string;
  sensor: string;
  location: string;
  date: string;
  acquisition: string;
  relativeOrbit: number;
  orbitDirection: string;
  polarization: string;
  thresholdDb: number;
  potentialFloodedAreaKm2: number;
  centroid: {
    longitude: number;
    latitude: number;
  };
  analysisType: string;
  preFloodComparisonAvailable: boolean;
  live: boolean;
  disclaimer: string;
  error?: string;
}

export interface SangliStudyParams {
  centerLon: number;
  centerLat: number;
  bufferSizeMeters: number;
  floodDate: string;
  relativeOrbit: number;
  orbitDirection: string;
  polarization: string;
  thresholdDb: number;
}

export const SANGLI_PARAMS: SangliStudyParams = {
  centerLon: 74.58,
  centerLat: 16.85,
  bufferSizeMeters: 30000,
  floodDate: '2019-08-14',
  relativeOrbit: 136,
  orbitDirection: 'DESCENDING',
  polarization: 'VV',
  thresholdDb: -17,
};

const DISCLAIMER =
  'This result represents a Sentinel-1 SAR-based potential flood mask. A suitable pre-flood Sentinel-1 image covering the exact Sangli study area was not available for July 2019; therefore this result should not be interpreted as before-vs-after change detection.';

const VERIFIED_RESULT = {
  potentialFloodedAreaKm2: 5.009394480398589,
  centroid: {
    longitude: 74.51427049360484,
    latitude: 16.916590928882822,
  },
};

function getCredentials() {
  return {
    saEmail: process.env.EE_SERVICE_ACCOUNT_EMAIL,
    saKey: process.env.EE_SERVICE_ACCOUNT_KEY,
    projectId: process.env.GOOGLE_CLOUD_PROJECT,
    keyPath: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  };
}

function hasEarthEngineCredentials(): boolean {
  const { saEmail, saKey, keyPath } = getCredentials();
  return Boolean(keyPath || (saEmail && saKey));
}

export async function runSangliFloodAnalysis(): Promise<EarthEngineFloodResponse> {
  const params = SANGLI_PARAMS;

  if (!hasEarthEngineCredentials()) {
    return {
      source: 'Google Earth Engine / Sentinel-1',
      satellite: 'Sentinel-1',
      sensor: 'SAR',
      location: 'Sangli, Maharashtra, India',
      date: params.floodDate,
      acquisition: '2019-08-14 00:55 UTC',
      relativeOrbit: params.relativeOrbit,
      orbitDirection: 'Descending',
      polarization: params.polarization,
      thresholdDb: params.thresholdDb,
      potentialFloodedAreaKm2: VERIFIED_RESULT.potentialFloodedAreaKm2,
      centroid: VERIFIED_RESULT.centroid,
      analysisType: 'SAR-based potential flood mask',
      preFloodComparisonAvailable: false,
      live: false,
      disclaimer: DISCLAIMER,
      error:
        'Earth Engine credentials not configured. Showing verified offline result. Set EE_SERVICE_ACCOUNT_EMAIL, EE_SERVICE_ACCOUNT_KEY, and GOOGLE_CLOUD_PROJECT to enable live analysis.',
    };
  }

  try {
    const result = await analyzeWithEarthEngine(params);
    return {
      source: 'Google Earth Engine / Sentinel-1',
      satellite: 'Sentinel-1',
      sensor: 'SAR',
      location: 'Sangli, Maharashtra, India',
      date: params.floodDate,
      acquisition: '2019-08-14 00:55 UTC',
      relativeOrbit: params.relativeOrbit,
      orbitDirection: 'Descending',
      polarization: params.polarization,
      thresholdDb: params.thresholdDb,
      potentialFloodedAreaKm2: result.potentialFloodedAreaKm2,
      centroid: result.centroid,
      analysisType: 'SAR-based potential flood mask',
      preFloodComparisonAvailable: false,
      live: true,
      disclaimer: DISCLAIMER,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown Earth Engine error';
    return {
      source: 'Google Earth Engine / Sentinel-1',
      satellite: 'Sentinel-1',
      sensor: 'SAR',
      location: 'Sangli, Maharashtra, India',
      date: params.floodDate,
      acquisition: '2019-08-14 00:55 UTC',
      relativeOrbit: params.relativeOrbit,
      orbitDirection: 'Descending',
      polarization: params.polarization,
      thresholdDb: params.thresholdDb,
      potentialFloodedAreaKm2: VERIFIED_RESULT.potentialFloodedAreaKm2,
      centroid: VERIFIED_RESULT.centroid,
      analysisType: 'SAR-based potential flood mask',
      preFloodComparisonAvailable: false,
      live: false,
      disclaimer: DISCLAIMER,
      error: `Earth Engine analysis failed: ${message}. Showing verified offline result.`,
    };
  }
}

interface EEResult {
  potentialFloodedAreaKm2: number;
  centroid: { longitude: number; latitude: number };
}

type EEModule = any;

async function analyzeWithEarthEngine(params: SangliStudyParams): Promise<EEResult> {
  const ee: EEModule = await importEarthEngine();
  await authenticateAndInit(ee);

  const roi = ee.Geometry.Point([params.centerLon, params.centerLat])
    .buffer(params.bufferSizeMeters)
    .bounds();

  const collection = ee
    .ImageCollection('COPERNICUS/S1_GRD')
    .filterBounds(roi)
    .filterDate('2019-08-13', '2019-08-15')
    .filter(ee.Filter.eq('orbitProperties_pass', params.orbitDirection))
    .filter(ee.Filter.eq('relativeOrbitNumber_start', params.relativeOrbit))
    .filter(
      ee.Filter.listContains('transmitterReceiverPolarisation', params.polarization)
    )
    .select(params.polarization);

  const image = ee.Image(collection.first());
  const threshold = params.thresholdDb;

  const floodMask = image.lt(threshold).selfMask();

  const areaImage = floodMask.multiply(ee.Image.pixelArea());
  const areaStats = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e13,
  });

  const areaM2 = await evaluateAsync(areaStats);
  const potentialFloodedAreaKm2 = (areaM2 as number) / 1e6;

  const centroid = await computeCentroid(ee, floodMask, roi);

  return {
    potentialFloodedAreaKm2,
    centroid,
  };
}

async function computeCentroid(
  ee: EEModule,
  floodMask: any,
  roi: any
): Promise<{ longitude: number; latitude: number }> {
  try {
    const vectors = floodMask.reduceToVectors({
      geometry: roi,
      scale: 100,
      maxPixels: 1e10,
      geometryType: 'centroid',
    });
    const centroidFeature = ee.Feature(vectors.first());
    const centroidGeom = centroidFeature.geometry();
    const coords = await evaluateAsync(centroidGeom.coordinates().get(0));

    if (Array.isArray(coords) && coords.length === 2) {
      return {
        longitude: coords[0] as number,
        latitude: coords[1] as number,
      };
    }
  } catch {
    // fall through to fallback
  }

  return VERIFIED_RESULT.centroid;
}

async function importEarthEngine(): Promise<EEModule> {
  try {
    const mod = await import('@google/earthengine' as any);
    const ee = mod.default ?? mod;
    return ee;
  } catch {
    throw new Error(
      'The "@google/earthengine" npm package is not installed. Earth Engine live analysis requires this server-side package.'
    );
  }
}

async function authenticateAndInit(ee: EEModule): Promise<void> {
  const { saEmail, saKey, projectId, keyPath } = getCredentials();

  const keyObject = keyPath ? keyPath : saEmail && saKey ? { client_email: saEmail, private_key: saKey } : null;

  if (!keyObject) {
    throw new Error('No Earth Engine authentication method available.');
  }

  await new Promise<void>((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      keyObject,
      () => {
        ee.initialize(
          projectId ?? null,
          null,
          () => resolve(),
          (err: Error) =>
            reject(new Error(`Earth Engine initialization failed: ${err.message}`))
        );
      },
      (err: Error) =>
        reject(new Error(`Earth Engine authentication failed: ${err.message}`))
    );
  });
}

async function evaluateAsync(value: any): Promise<unknown> {
  return new Promise((resolve, reject) => {
    value.evaluate((result: unknown, err: Error) => {
      if (err) reject(new Error(`Earth Engine evaluate failed: ${err.message}`));
      else resolve(result);
    });
  });
}

export function buildAnalysisResult(
  response: EarthEngineFloodResponse
): SatelliteAnalysis {
  return {
    satellite: response.satellite,
    sensor: response.sensor,
    date: response.date,
    acquisition: response.acquisition,
    relativeOrbit: response.relativeOrbit,
    orbitDirection: response.orbitDirection,
    polarization: response.polarization,
    vvThresholdDb: response.thresholdDb,
    potentialFloodedAreaKm2: response.potentialFloodedAreaKm2,
    centroid: response.centroid,
    source: response.source,
    disclaimer: response.disclaimer,
  };
}
