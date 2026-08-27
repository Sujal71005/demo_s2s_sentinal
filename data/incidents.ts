import type { Incident } from '@/types/incident';
import {
  SATELLITE_FLOOD_CENTROID,
  SATELLITE_FLOOD_AREA_DISPLAY,
} from '@/data/satelliteAnalysis';

export const SANGLI_INCIDENT_ID = 'INC-SANGLI-2019';

export const incidents: Incident[] = [
  {
    id: SANGLI_INCIDENT_ID,
    name: 'Sangli Flood — Sentinel-1 Analysis',
    region: 'Sangli District, Maharashtra, India',
    status: 'active',
    startDate: '2019-08-14',
    description:
      'Sentinel-1 SAR-based potential flood detection for Sangli, Maharashtra. Acquired 14 August 2019 via Google Earth Engine. VV threshold of -17 dB applied to descending pass on relative orbit 136.',
    center: SATELLITE_FLOOD_CENTROID,
    zoom: 12,
    dataSource: 'satellite',
    affectedAreaKm2: parseFloat(SATELLITE_FLOOD_AREA_DISPLAY),
    affectedRoads: 17,
    populationExposed: 5284,
    criticalFacilities: 4,
  },
];
