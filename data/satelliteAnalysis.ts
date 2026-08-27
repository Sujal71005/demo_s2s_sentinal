import type { SatelliteAnalysisResult } from '@/types/satellite';

export const sangliSentinel1Analysis: SatelliteAnalysisResult = {
  location: 'Sangli, Maharashtra, India',
  region: 'Sangli District, Maharashtra',
  analysis: {
    satellite: 'Sentinel-1',
    sensor: 'SAR',
    date: '2019-08-14',
    acquisition: '2019-08-14 00:55 UTC',
    relativeOrbit: 136,
    orbitDirection: 'Descending',
    polarization: 'VV',
    vvThresholdDb: -17,
    potentialFloodedAreaKm2: 5.009394480398589,
    centroid: {
      longitude: 74.51427049360484,
      latitude: 16.916590928882822,
    },
    source: 'Google Earth Engine / Sentinel-1',
    disclaimer:
      'This result represents a Sentinel-1 SAR-based potential flood mask. A suitable pre-flood Sentinel-1 image covering the exact Sangli study area was not available for July 2019; therefore this result should not be interpreted as before-vs-after change detection.',
  },
  hasRealFloodGeometry: false,
};

export const SATELLITE_FLOOD_AREA_DISPLAY = '5.01';
export const SATELLITE_FLOOD_CENTROID: [number, number] = [
  sangliSentinel1Analysis.analysis.centroid.longitude,
  sangliSentinel1Analysis.analysis.centroid.latitude,
];
export const SATELLITE_MAP_CENTER: [number, number] = SATELLITE_FLOOD_CENTROID;
export const SATELLITE_MAP_ZOOM = 12;
