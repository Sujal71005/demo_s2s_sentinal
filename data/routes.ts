import type { Route } from '@/types/response';
import { SATELLITE_FLOOD_CENTROID } from '@/data/satelliteAnalysis';

const [cx, cy] = SATELLITE_FLOOD_CENTROID;

export const routes: Route[] = [
  {
    id: 'ROUTE-SAFE-001',
    name: 'Safer Route: Miraj Bypass',
    fromName: 'Sangli',
    toName: 'Kolhapur',
    riskLevel: 'low',
    estimatedTimeMin: 42,
    distanceKm: 28,
    geometry: {
      type: 'LineString',
      coordinates: [
        [cx, cy],
        [cx + 0.03, cy + 0.03],
        [cx + 0.06, cy + 0.02],
        [cx + 0.09, cy + 0.01],
        [cx + 0.11, cy - 0.01],
        [cx + 0.08, cy - 0.03],
      ],
    },
  },
];
