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
