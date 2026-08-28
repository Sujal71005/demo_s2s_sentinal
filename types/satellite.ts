export interface SatelliteAnalysis {
  satellite: string;
  sensor: string;
  date: string;
  acquisition: string;
  relativeOrbit: number;
  orbitDirection: string;
  polarization: string;
  vvThresholdDb: number;
  potentialFloodedAreaKm2: number;
  centroid: {
    longitude: number;
    latitude: number;
  };
  source: string;
  disclaimer: string;
}

export interface SatelliteAnalysisResult {
  location: string;
  region: string;
  analysis: SatelliteAnalysis;
  hasRealFloodGeometry: boolean;
}

// ---------------------------------------------------------------------------
// Real Sentinel-1 bi-temporal change-detection response (Phase 1)
// ---------------------------------------------------------------------------

export interface GeoJSONGeometry {
  type: string;
  coordinates: unknown;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: GeoJSONGeometry | null;
  properties: Record<string, unknown>;
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export interface RealFloodDetectionResponse {
  success: boolean;
  live: boolean;
  sensor: 'Sentinel-1';
  collection: 'COPERNICUS/S1_GRD';
  polarization: string;
  preEventDate: string;          // actual first acquired date of pre composite
  postEventDate: string;         // actual first acquired date of post composite
  preEventCount: number;         // number of pre-event scenes used
  postEventCount: number;        // number of post-event scenes used
  floodAreaKm2: number;
  floodPercentage: number;
  studyAreaKm2: number;
  threshold: number;             // dB change threshold applied
  changeDetectionMethod: string; // e.g. "log-ratio VV dB difference"
  permanentWaterDataset: string; // e.g. "JRC/GSW1_4/GlobalSurfaceWater"
  geometry: GeoJSONGeometry | null;    // study area geometry
  floodGeoJSON: GeoJSONFeatureCollection | null; // actual flood polygons
  metadata: {
    preStartDate: string;
    preEndDate: string;
    postStartDate: string;
    postEndDate: string;
    minAreaM2: number;
    processingNotes: string;
  };
  error?: string;
}

