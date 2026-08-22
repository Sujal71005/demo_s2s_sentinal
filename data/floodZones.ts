import type { FloodZone } from '@/types/flood';
import { SATELLITE_FLOOD_CENTROID } from '@/data/satelliteAnalysis';

const [cx, cy] = SATELLITE_FLOOD_CENTROID;

export const floodZones: FloodZone[] = [
  {
    id: 'FZ-A',
    name: 'Krishna River Overflow — Zone A',
    riskLevel: 'critical',
    areaKm2: 1.8,
    confidence: 92,
    dataSource: 'demo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [cx - 0.04, cy + 0.02],
          [cx - 0.01, cy + 0.03],
          [cx + 0.01, cy + 0.01],
          [cx, cy - 0.02],
          [cx - 0.03, cy - 0.03],
          [cx - 0.05, cy - 0.01],
          [cx - 0.04, cy + 0.02],
        ],
      ],
    },
  },
  {
    id: 'FZ-B',
    name: 'Warna Confluence — Zone B',
    riskLevel: 'high',
    areaKm2: 1.2,
    confidence: 88,
    dataSource: 'demo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [cx + 0.02, cy - 0.03],
          [cx + 0.05, cy - 0.02],
          [cx + 0.06, cy - 0.05],
          [cx + 0.04, cy - 0.07],
          [cx + 0.01, cy - 0.06],
          [cx + 0.02, cy - 0.03],
        ],
      ],
    },
  },
  {
    id: 'FZ-C',
    name: 'Agricultural Plain — Zone C',
    riskLevel: 'moderate',
    areaKm2: 1.0,
    confidence: 81,
    dataSource: 'demo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [cx - 0.02, cy - 0.05],
          [cx + 0.01, cy - 0.04],
          [cx + 0.02, cy - 0.07],
          [cx, cy - 0.09],
          [cx - 0.03, cy - 0.08],
          [cx - 0.02, cy - 0.05],
        ],
      ],
    },
  },
  {
    id: 'FZ-D',
    name: 'Urban Drainage — Zone D',
    riskLevel: 'high',
    areaKm2: 1.0,
    confidence: 85,
    dataSource: 'demo',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [cx - 0.01, cy],
          [cx + 0.01, cy + 0.01],
          [cx + 0.02, cy - 0.01],
          [cx, cy - 0.02],
          [cx - 0.02, cy - 0.01],
          [cx - 0.01, cy],
        ],
      ],
    },
  },
];
