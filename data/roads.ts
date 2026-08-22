import type { Road } from '@/types/road';
import { SATELLITE_FLOOD_CENTROID } from '@/data/satelliteAnalysis';

const [cx, cy] = SATELLITE_FLOOD_CENTROID;

export const roads: Road[] = [
  {
    id: 'R-102',
    name: 'Sangli-Kolhapur Highway',
    class: 'highway',
    riskLevel: 'critical',
    riskScore: 91,
    floodExposure: 82,
    populationExposure: 'high',
    criticalConnectivity: true,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx - 0.05, cy + 0.01],
        [cx - 0.02, cy],
        [cx + 0.01, cy - 0.01],
        [cx + 0.04, cy - 0.02],
        [cx + 0.07, cy - 0.03],
      ],
    },
  },
  {
    id: 'R-105',
    name: 'Haripur Road',
    class: 'major',
    riskLevel: 'high',
    riskScore: 74,
    floodExposure: 68,
    populationExposure: 'moderate',
    criticalConnectivity: true,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx - 0.03, cy + 0.03],
        [cx, cy + 0.02],
        [cx + 0.03, cy + 0.01],
      ],
    },
  },
  {
    id: 'R-108',
    name: 'Vishrambag-Sangli Road',
    class: 'major',
    riskLevel: 'high',
    riskScore: 69,
    floodExposure: 55,
    populationExposure: 'high',
    criticalConnectivity: false,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx - 0.01, cy + 0.01],
        [cx + 0.01, cy],
        [cx + 0.03, cy - 0.01],
      ],
    },
  },
  {
    id: 'R-112',
    name: 'Krishna River Bridge Road',
    class: 'secondary',
    riskLevel: 'critical',
    riskScore: 88,
    floodExposure: 90,
    populationExposure: 'moderate',
    criticalConnectivity: true,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx - 0.02, cy + 0.02],
        [cx, cy + 0.01],
        [cx + 0.02, cy],
      ],
    },
  },
  {
    id: 'R-115',
    name: 'Miraj Bypass',
    class: 'highway',
    riskLevel: 'moderate',
    riskScore: 48,
    floodExposure: 35,
    populationExposure: 'moderate',
    criticalConnectivity: false,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx + 0.02, cy + 0.03],
        [cx + 0.05, cy + 0.02],
        [cx + 0.08, cy + 0.01],
      ],
    },
  },
  {
    id: 'R-118',
    name: 'Kavalapur Village Road',
    class: 'local',
    riskLevel: 'low',
    riskScore: 22,
    floodExposure: 18,
    populationExposure: 'low',
    criticalConnectivity: false,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx + 0.03, cy - 0.05],
        [cx + 0.05, cy - 0.06],
        [cx + 0.07, cy - 0.07],
      ],
    },
  },
  {
    id: 'R-121',
    name: 'Industrial Estate Road',
    class: 'secondary',
    riskLevel: 'high',
    riskScore: 71,
    floodExposure: 60,
    populationExposure: 'high',
    criticalConnectivity: true,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx, cy - 0.01],
        [cx + 0.02, cy - 0.02],
        [cx + 0.04, cy - 0.03],
      ],
    },
  },
  {
    id: 'R-124',
    name: 'Ashta Connector',
    class: 'major',
    riskLevel: 'moderate',
    riskScore: 52,
    floodExposure: 40,
    populationExposure: 'moderate',
    criticalConnectivity: false,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx - 0.05, cy - 0.02],
        [cx - 0.03, cy - 0.03],
        [cx - 0.01, cy - 0.04],
      ],
    },
  },
];
