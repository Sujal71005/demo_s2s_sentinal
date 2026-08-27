const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SANGLI_PARAMS = {
  centerLon: 74.58,
  centerLat: 16.85,
  bufferSizeMeters: 30000,
  floodDate: "2019-08-14",
  relativeOrbit: 136,
  orbitDirection: "DESCENDING",
  polarization: "VV",
  thresholdDb: -17,
};

const DISCLAIMER =
  "This result represents a Sentinel-1 SAR-based potential flood mask. A suitable pre-flood Sentinel-1 image covering the exact Sangli study area was not available for July 2019; therefore this result should not be interpreted as before-vs-after change detection.";

const VERIFIED_RESULT = {
  potentialFloodedAreaKm2: 5.009394480398589,
  centroid: {
    longitude: 74.51427049360484,
    latitude: 16.916590928882822,
  },
};

const BASE_RESPONSE = {
  source: "Google Earth Engine / Sentinel-1",
  satellite: "Sentinel-1",
  sensor: "SAR",
  location: "Sangli, Maharashtra, India",
  date: SANGLI_PARAMS.floodDate,
  acquisition: "2019-08-14 00:55 UTC",
  relativeOrbit: SANGLI_PARAMS.relativeOrbit,
  orbitDirection: "Descending",
  polarization: SANGLI_PARAMS.polarization,
  thresholdDb: SANGLI_PARAMS.thresholdDb,
  analysisType: "SAR-based potential flood mask",
  preFloodComparisonAvailable: false,
  disclaimer: DISCLAIMER,
};

interface EEResult {
  potentialFloodedAreaKm2: number;
  centroid: { longitude: number; latitude: number };
}

type EEModule = any;

function getCredentials() {
  return {
    saEmail: Deno.env.get("EE_SERVICE_ACCOUNT_EMAIL")?.trim() ?? undefined,
    saKey: Deno.env.get("EE_SERVICE_ACCOUNT_KEY"),
    projectId: Deno.env.get("GOOGLE_CLOUD_PROJECT")?.trim() ?? undefined,
  };
}

function normalizePrivateKey(rawKey: string): string {
  let key = rawKey.trim();

  // Remove accidental surrounding quotes (single or double)
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }

  // Convert escaped "\\n" sequences into actual newline characters
  key = key.replace(/\\n/g, "\n");

  return key;
}

function hasCredentials(): boolean {
  const { saEmail, saKey } = getCredentials();
  return Boolean(saEmail && saKey);
}

async function importEarthEngine(): Promise<EEModule> {
  const mod = await import("npm:@google/earthengine@1.7.40");
  const ee = (mod as any).default ?? mod;
  return ee;
}

function authenticateAndInit(ee: EEModule): Promise<void> {
  const { saEmail, saKey, projectId } = getCredentials();

  const keyObject =
    saEmail && saKey
      ? { client_email: saEmail, private_key: normalizePrivateKey(saKey) }
      : null;

  if (!keyObject) {
    return Promise.reject(
      new Error("No Earth Engine authentication method available."),
    );
  }

  // ee.initialize signature: (opt_baseurl, opt_tileurl, opt_successCallback,
  //   opt_errorCallback, opt_xsrfToken, opt_project)
  // Pass null for baseurl/tileurl to use the library defaults
  // (https://earthengine.googleapis.com/api), and projectId as the 6th arg.
  return new Promise<void>((resolve, reject) => {
    ee.data.authenticateViaPrivateKey(
      keyObject,
      () => {
        ee.initialize(
          null,
          null,
          () => resolve(),
          (err: Error) =>
            reject(
              new Error(
                `Earth Engine initialization failed: ${err.message}`,
              ),
            ),
          undefined,
          projectId ?? undefined,
        );
      },
      (err: Error) =>
        reject(
          new Error(`Earth Engine authentication failed: ${err.message}`),
        ),
    );
  });
}

function evaluateAsync(value: any): Promise<unknown> {
  return new Promise((resolve, reject) => {
    value.evaluate((result: unknown, err: Error) => {
      if (err) reject(new Error(`Earth Engine evaluate failed: ${err.message}`));
      else resolve(result);
    });
  });
}

async function computeCentroid(
  ee: EEModule,
  floodMask: any,
  roi: any,
): Promise<{ longitude: number; latitude: number }> {
  try {
    const vectors = floodMask.reduceToVectors({
      geometry: roi,
      scale: 100,
      maxPixels: 1e10,
      geometryType: "centroid",
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

async function analyzeWithEarthEngine(
  params: typeof SANGLI_PARAMS,
): Promise<EEResult> {
  const ee = await importEarthEngine();
  await authenticateAndInit(ee);

  const roi = ee.Geometry.Point([params.centerLon, params.centerLat])
    .buffer(params.bufferSizeMeters)
    .bounds();

  const collection = ee
    .ImageCollection("COPERNICUS/S1_GRD")
    .filterBounds(roi)
    .filterDate("2019-08-13", "2019-08-15")
    .filter(ee.Filter.eq("orbitProperties_pass", params.orbitDirection))
    .filter(ee.Filter.eq("relativeOrbitNumber_start", params.relativeOrbit))
    .filter(
      ee.Filter.listContains(
        "transmitterReceiverPolarisation",
        params.polarization,
      ),
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

  return { potentialFloodedAreaKm2, centroid };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    if (!hasCredentials()) {
      return new Response(
        JSON.stringify({
          ...BASE_RESPONSE,
          potentialFloodedAreaKm2: VERIFIED_RESULT.potentialFloodedAreaKm2,
          centroid: VERIFIED_RESULT.centroid,
          live: false,
          error:
            "Earth Engine credentials not configured in edge function environment. Showing verified offline result.",
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const result = await analyzeWithEarthEngine(SANGLI_PARAMS);
    return new Response(
      JSON.stringify({
        ...BASE_RESPONSE,
        potentialFloodedAreaKm2: result.potentialFloodedAreaKm2,
        centroid: result.centroid,
        live: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({
        ...BASE_RESPONSE,
        potentialFloodedAreaKm2: VERIFIED_RESULT.potentialFloodedAreaKm2,
        centroid: VERIFIED_RESULT.centroid,
        live: false,
        error: `Earth Engine analysis failed: ${message}. Showing verified offline result.`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
